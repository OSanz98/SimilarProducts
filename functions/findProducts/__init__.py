import azure.functions as func
# import logging
from pymongo import MongoClient, errors
import requests
from bs4 import BeautifulSoup
from collections import Counter
from config.db import get_product_info, store_similar_product
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure_functions_auth import (
    AzureFunctionsAuthentication,
    JWTValidationOptions,
    AllowedCallersList,
    requires_aad
)
import os

app = func.FunctionApp()

# logging.basicConfig(level=logging.DEBUG)

CONNECTION_STRING = None
client = None
cosmos_db = None

def get_vault_conn_string():
    global CONNECTION_STRING
    if CONNECTION_STRING is None:
        # logging.info('Grabbing connection string')
        keyVaultName = os.environ["KEY_VAULT_NAME"]
        key_vault_url = f"https://{keyVaultName}.vault.azure.net"
        secret_name = os.environ["SECRET_NAME"]
        credential = DefaultAzureCredential()
        vaultClient = SecretClient(vault_url=key_vault_url, credential=credential)
        CONNECTION_STRING = vaultClient.get_secret(secret_name).value 
    return CONNECTION_STRING

def get_cosmos_client():
    global client
    if client is not None:
        # logging.debug('Using existing connection pool')
        return client
    
    # logging.debug('Creating new connection pool')
    try:
        cosmos_conn = get_vault_conn_string()
        cosmos_client = MongoClient(cosmos_conn)
        client = cosmos_client
        return client
    except errors.ConnectionFailure:
        # logging.error('Failed to connect to cosmos database')
        raise

def get_cosmos_db():
    global cosmos_db
    if cosmos_db is None:
        cosmos_client = get_cosmos_client()
        cosmos_db = cosmos_client['similar-product']
        # logging.info('Cosmos DB initialised')
    return cosmos_db

def scrape_amazon(search_term):
    # logging.info('Carrying out scraper function')
    # Construct the search URL for Amazon UK
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"}
    url = f'https://www.amazon.co.uk/s?k={search_term}&ref=nb_sb_noss_1'
    page = requests.get(url, headers=headers)
    
    # Parse the HTML content of the search results page
    soup = BeautifulSoup(page.content, "html.parser")
    
    # Find all the product links on the search results page
    product_links = soup.find_all("a", {"class": "a-link-normal s-no-outline"})

    # Extract the URLs and titles of the products
    products = []
    for link in product_links:
        
        url = "https://www.amazon.co.uk" + link.get("href")
        # send requests and retrieve response for the product's page
        response = requests.get(url, headers=headers)

        # parse the page
        soup = BeautifulSoup(response.content, 'html.parser')

        # extract title from page
        product_title = soup.find('span', {'id': 'productTitle'})
        if product_title is not None:
            title = product_title.get_text().strip()
        else:
            title = "Not found"
        
        # extract image from page
        product_image = soup.find('img', {'id': 'landingImage'})
        if product_image is not None:
            image = product_image['data-old-hires']

        # extract price from page
        product_price = soup.find('span', {'class': 'a-price-whole'})
        if product_price is not None:
            pound = product_price.get_text().strip()

        price_symbol = soup.find('span', {'class': 'a-price-symbol'})
        if price_symbol is not None:
            symbol = price_symbol.get_text().strip()

        price_fraction = soup.find('span', {'class': 'a-price-fraction'})
        if price_fraction is not None:
            fraction = price_fraction.get_text().strip()
        
        price = symbol + pound + fraction
        print(f'operating on product: {title}')
        if cosine_similarity_score(search_term, title) > 0.4:
            product_dict = {
                "title": title,
                "url": url,
                "image": image,
                "price": price
            }
                
            products.append(product_dict)
    return products

def cosine_similarity_score(search_term, product_name):
    # logging.info('Similarity score being calculated')
    try:
        search_vec = Counter(search_term.lower().split())
        product_vec = Counter(product_name.lower().split())
        # get the common tokens in both Counters
        common_tokens = set(search_vec.keys()) & set(product_vec.keys())
        # dot product
        dot_product = sum(search_vec[token] * product_vec[token] for token in common_tokens)
        # calculate the magnitude of the vectors
        search_mag = sum(search_vec[token]**2 for token in search_vec.keys())
        product_mag = sum(product_vec[token]**2 for token in product_vec.keys())

        # calculate the cosine similarity
        if search_mag == 0 or product_mag == 0:
            return 0
        else:
            return dot_product / ((search_mag * product_mag) ** 0.5)
    except Exception as e:
        return f"Couldn't calculate cosine similarity score: {e}"

@requires_aad
@app.route('/api/find-products', methods=["POST"])
def find_similar_products(req: func.HttpRequest) -> func.HttpResponse:
    # logging.info('Find Similar Products HTTP trigger function processed a request')
    
    try:
        req_body = req.get_json()
    except ValueError:
        pass
    else:
        productTitle = req_body.get('productTitle')

    if productTitle:
        try:
            db = get_cosmos_db()
            productCollection = db['products']
            product = get_product_info(productCollection, productTitle)
            if product is not None:
                similarCollection = db['similar_products']
                linkCollection = db['product_to_similar']
                products = scrape_amazon(productTitle)
                result = store_similar_product(similarCollection, linkCollection, products, productTitle)
                return func.HttpResponse(result)
            else:
                return func.HttpResponse(f"Can't find product: {productTitle}")

        except Exception as e:
            return func.HttpResponse(f"Error occured: {e}")
    else:
        return func.HttpResponse("Please pass the productTitle in the request body to carry out its action.", status_code=400)
    


