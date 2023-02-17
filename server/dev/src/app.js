const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');


const app = express();

app.set('view engine', 'ejs');

// used to parse requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/SimilarProducts', {useNewUrlParser: true});

const productSchema = {
    title: String,
    url: String
}
const Product = mongoose.model("products", productSchema);


app.route('/products')

.get(function(req, res) {
    Product.find(function(err, products){
        if(!err) {
            res.status(200).send(products);
        } else {
            res.status(400).send(err);
        }
    });
})

.post(function(req, res) {
    const newProduct = new Product({
        title: req.body.title,
        url: req.body.url
    }); 

    
    Product.findOne(function(error, product){
        if(product){
            res.send(`Product ${product.title} already exists`);
        } else {
            newProduct.save(function(err){
                if(!err){
                    res.status(200).send("Successfully created a new product");
                }else {
                    res.status(400).send(err);
                }
            });
        }
    });
    
})

.delete(function(req,res) {
    Product.deleteMany(function(err){
        if(!err){
            res.status(200).send("Successfully deleted all articles");
        }else{
            res.status(400).send(err);
        }
    })
});


app.route('/products/:productTitle')

.get(function(req, res) {
    Product.findOne({title: req.params.productTitle },function(err, product){
        if(!err) {
            res.status(200).send(product);
        } else {
            res.status(400).send(err);
        }
    });
})

.put(function(req,res){
    Product.updateOne(
        {title: req.params.productTitle}, 
        {$set: {title: req.body.title, url: req.body.url}},
        {overwrite: true},
        function(err){
            if(!err){
                res.status(200).send("Successfully updated product");
            } else {
                res.status(400).send(err);
            }
    })
})

.patch(function(req, res){
    Product.updateOne(
        {title: req.params.productTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.status(200).send("Successfully updated product");
            }else{
                res.status(400).send(err);
            }
        }
    )
})

.delete(function(req,res){
    Product.deleteOne(
        {title: req.params.productTitle},
        function(err){
          if (!err){
            res.status(200).send("Successfully deleted the corresponding product.");
          } else {
            res.status(400).send(err);
          }
        }
    );
})

app.route('/similar/:productTitle')
.get(function(req, res){
    Product.findOne()
});


app.listen(3000, function() {
    console.log('listening to port 3000')
})
