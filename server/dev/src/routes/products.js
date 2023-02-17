const express = require('express');
const Product = require('../models/product.js');

const productApp = express();

productApp.route('/products')

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

    
    Product.findOne({title: req.body.title}, function(error, product){
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


productApp.route('/products/:productTitle')

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

module.exports = productApp;