import pymongo
# from pymongo.errors import PyMongoError

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['SimilarProducts']

def printAllIds(collection):
     cursor = collection.find({})
     for document in cursor:
         print(document['_id'])

def get_collection(collection_name):
    try:
        collection = db[collection_name]
        return collection
    except pymongo.errors.CollectionInvalid as e:
        raise Exception("Invalid collection name: %s" % e)
    except Exception as e:
        raise Exception("Error occurred while connecting to database: %s" % e)


def get_product_info(collection, product_id):
    try:
        result = collection.find_one({'_id': product_id})
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


def store_similar_product(collection, products, original_product_id, link_collection):
    try:
        newList = [product for product in products if check_exists_in_collection(collection, product["title"]) == False]
        for prod in newList:
            result = collection.insert_one(prod)
            link_collection.insert_one({"product_id": original_product_id, "similar_product_id": result.inserted_id})

        return "Successfully updated database"
    except Exception as e:
        return f"Error occured: {str(e)}"
    
        
