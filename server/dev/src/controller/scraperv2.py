import requests
import html5lib
from html5lib import treebuilders
from difflib import SequenceMatcher


def similarity(a, b):
    return SequenceMatcher(None, a, b).ratio()


def extract_attributes(text):
    return [attr.strip().lower() for attr in text.split('|')]


def get_product_data(url):
    response = requests.get(url)
    if response.status_code != 200:
        return {}
    parser = html5lib.HTMLParser(tree=treebuilders.getTreeBuilder("dom"))
    dom = parser.parse(response.text)
    title_element = dom.querySelector("#productTitle")
    if title_element is None:
        return {}
    title = title_element.get_text().strip()
    image_element = dom.querySelector("#landingImage")
    if image_element is None:
        return {}
    image_url = image_element.getAttribute("data-old-hires")
    price_element = dom.querySelector("#priceblock_ourprice")
    if price_element is None:
        price_element = dom.querySelector("#priceblock_dealprice")
        if price_element is None:
            return {}
    price_text = price_element.get_text().strip()
    price = float(price_text[1:])
    return {
        "title": title,
        "image_url": image_url,
        "price": price,
    }


def scrape_site(site, search_terms):
    products = []
    for term in search_terms:
        url = f"{site}/search?q={term}"
        response = requests.get(url)
        if response.status_code != 200:
            continue
        parser = html5lib.HTMLParser(tree=treebuilders.getTreeBuilder("dom"))
        dom = parser.parse(response.text)
        results = dom.getElementsByTagName("div")
        for result in results:
            if result.getAttribute("data-component-type") == "s-search-result":
                title_element = result.querySelector("h2")
                if title_element is None:
                    continue
                title = title_element.get_text().strip()
                url_element = result.querySelector("a")
                if url_element is None:
                    continue
                url = url_element.getAttribute("href")
                product = {
                    "title": title,
                    "url": url,
                }
                if site in url:
                    data = get_product_data(url)
                    if data:
                        product.update(data)
                else:
                    attrs = extract_attributes(title)
                    score = max(similarity(attr, term) for attr in attrs)
                    if score > 0.6:
                        products.append(product)
    return products
