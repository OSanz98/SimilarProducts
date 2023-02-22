from pymongo import MongoClient, errors

def get_database():
    CONNECTION_STRING = 'mongodb://localhost:27017/'
    client = MongoClient(CONNECTION_STRING)
    db = client['SimilarProducts']
    return db

def get_collection(collection_name, db):
    try:
        collection = db[collection_name]
        return collection
    except errors.CollectionInvalid as e:
        raise Exception("Invalid collection name: %s" % e)
    except Exception as e:
        raise Exception("Error occurred while connecting to database: %s" % e)


def get_product_info(collection, product_name):
    try:
        result = collection.find_one({"title": product_name})
        if result is not None:
            return result
        else:
            return None
    except Exception as e:
        return f"Error occured: {str(e)}"
    
def check_exists_in_collection(collection, product_title):
    try:
        product = collection.find_one({"title": product_title})
        if product is not None:
            return True
        else:
            return False
    except Exception as e:
        raise Exception(f"Error occured while searching for product: {str(e)}")


def store_similar_product(similarCollection, link_collection, products, search_product_name):
    try:
        newList = [product for product in products if check_exists_in_collection(similarCollection, product["title"]) == False]
        # newList = [product for product in products if check_exists_in_collection(similarCollection, product["title"]) == False]
        if not newList:
            return "Already have found products in our database"
        else:
            for prod in newList:
                similarCollection.insert_one(prod)
                link_collection.insert_one({"product_title": search_product_name, "similar_product_title": prod["title"]})
            return "Successfully updated database"
    except Exception as e:
        return f"Error occured: {str(e)}"
    
        
