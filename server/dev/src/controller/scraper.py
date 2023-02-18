# import nltk
# from nltk.tokenize import word_tokenize
# from nltk.corpus import stopwords
# from nltk.stem import PorterStemmer

import requests
from bs4 import BeautifulSoup
import time
import multiprocessing
import sys

def show_loading_indicator(stop_event):
    while not stop_event.is_set():
        for c in '|/-\\':
            # writes directly to console without buffering output - carriage return overwrites previous frame
            sys.stdout.write('\rLoading ' + c)
            sys.stdout.flush()
            time.sleep(0.1)

def scrape_amazon(search_term, stop_event, max_results=10):
    time.sleep(2)
    # Construct the search URL for Amazon UK
    base_url = "https://www.amazon.co.uk/s"
    params = {"k": search_term}
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"}
    response = requests.get(base_url, params=params, headers=headers)
    
    # Parse the HTML content of the search results page
    soup = BeautifulSoup(response.content, "html.parser")
    
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
        
        products.append((title, url, image, price))

    stop_event.set()
    
    return products


if __name__ == '__main__':
    stop_event = multiprocessing.Event()

    loading_process = multiprocessing.Process(target=show_loading_indicator, args=(stop_event,))
    loading_process.start()

    text = "Oakywood Felt and Cork desk mat"
    products = scrape_amazon(text, stop_event)
    print(products)

    loading_process.join()

