const express = require('express');
const Product = require('../models/product.js');

const similarApp = express();

similarApp.route('/similar/:productTitle')
.get(function(req, res){
    Product.findOne({title: req.params.productTitle }, function(err, product){
        if(product) {
            // TODO look for other existing products like this one
            res.status(200).send(product.url);
        } else {
            res.status(400).send("Couldn't find product");
        }
    });
});

module.exports = similarApp;