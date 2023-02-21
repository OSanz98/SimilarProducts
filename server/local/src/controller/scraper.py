# import nltk
# from nltk.tokenize import word_tokenize
# from nltk.corpus import stopwords
# from nltk.stem import PorterStemmer

import requests
from bs4 import BeautifulSoup
import time
import multiprocessing
import sys
from config.db import get_collection, get_product_info, store_similar_product, get_database
from collections import Counter

def show_loading_indicator(stop_event):
    while not stop_event.is_set():
        for c in '|/-\\':
            # writes directly to console without buffering output - carriage return overwrites previous frame
            sys.stdout.write('\rLoading ' + c)
            sys.stdout.flush()
            time.sleep(0.1)

# measures similarity between two sets of elements by comparing their intersection and union
# J(A, B) = |A ∩ B| / |A ∪ B|
# |A ∩ B| is number of elements in both sets, and |A ∪ B| is number of elements in either sets
def jaccard_similarity_score_calc(search_term, product_name):
    try:
        search_split = set(search_term.lower().split())
        product_split = set(product_name.split())

        intersection = search_split.intersection(product_split)
        union = search_split.union(product_split)

        # Jaccard similarity score
        similarity = len(intersection) / len(union)

        return float(similarity)
    except Exception as e:
        return f"Couldn't calculate jaccard similarity score: {e}"

# measures the cosine of the angle between two vectors
# texts/documents are represented as vectors in a multidimensional space. Each dimension represents a unique word and value in the dimension represents the frequency of the word
# in the texts/documents. Then it calculates the dot product of the two vectors and divides it by the product of their magnitudes. 
# returns value between -1 and 1. 1 means they are identical, 0 means they are very dissimilar, and -1 means they are diametrically opposed.
# Dot product is: given two vectors (arrays) A and B, the dot product is A * B = a1 * b1 + a2 * b2 + ....
def cosine_similarity_score(search_term, product_name):
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
        
        if cosine_similarity_score(search_term, title) > 0.4:
            product_dict = {
                "title": title,
                "url": url,
                "image": image,
                "price": price
            }
                
            products.append(product_dict)
    return products
        

def get_product_details(product_name, stop_event, db):
    time.sleep(2)
    try:
        prodCollection = get_collection('products', db)
        product = get_product_info(prodCollection, product_name)
        if product is not None:
            # imageURL = 
            similarCollection = get_collection('similar_products', db)
            linkCollection = get_collection('product_to_similar', db)
            products = scrape_amazon(product["title"])
            result = store_similar_product(similarCollection, linkCollection, products, product["title"])
            stop_event.set()
            return result
        else:
            stop_event.set()
            return "Can't find product"
    except Exception as e:
        print(f"Error occured: {e}")
        stop_event.set()

if __name__ == '__main__':

    stop_event = multiprocessing.Event()

    loading_process = multiprocessing.Process(target=show_loading_indicator, args=(stop_event,))
    loading_process.start()
    database = get_database()
    result = get_product_details('Oakywood Felt and Cork Desk Mat', stop_event, database)
    print(result)
    loading_process.join()

