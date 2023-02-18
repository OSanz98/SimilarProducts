# import nltk
# from nltk.tokenize import word_tokenize
# from nltk.corpus import stopwords
# from nltk.stem import PorterStemmer

import requests
from bs4 import BeautifulSoup
import time
import multiprocessing
import sys
from config.db import get_collection, get_product_info, store_similar_product, printAllIds
# import pymongo

def show_loading_indicator(stop_event):
    while not stop_event.is_set():
        for c in '|/-\\':
            # writes directly to console without buffering output - carriage return overwrites previous frame
            sys.stdout.write('\rLoading ' + c)
            sys.stdout.flush()
            time.sleep(0.1)

def scrape_amazon(search_term):
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
        
        product_dict = {
            "title": title,
            "url": url,
            "image": image,
            "price": price
        }

        products.append(product_dict)
    return products
        

def get_product_details(product_id, stop_event):
    time.sleep(2)
    print(get_product_info(get_collection('products'), '63efc0c7d8a95b0c056f8ea2'))
    stop_event.set()
    # try:
    #     product_collection = get_collection('products')
    #     product_info = get_product_info(collection=product_collection, product_id=product_id)
    #     if product_info is not None:
    #         result_collection = get_collection('similar_products')
    #         link_collection = get_collection('product_to_similar')
    #         products = scrape_amazon(product_info["title"])
    #         # upload products to mongo db as json
    #         result = store_similar_product(result_collection, products, product_id, link_collection)
    #         stop_event.set()
    #         return result
    #     else:
    #         stop_event.set()
    #         return "Can't find product in collection"
    # except Exception as e:
    #     print(f"Error occured: {e}")

    



if __name__ == '__main__':

    stop_event = multiprocessing.Event()

    loading_process = multiprocessing.Process(target=show_loading_indicator, args=(stop_event,))
    loading_process.start()

    products = get_product_details('63efbe437e9985688441cfdd', stop_event)
    print(products)

    loading_process.join()

