const express = require('express');
const productApp = express();
const Product = require('../models/product');
const ReadPreference = require('mongodb').ReadPreference;
require('../mongo').connect();


productApp.route('/products')
.get(function(req, res) {
    const docquery = Product.find({}).read(ReadPreference.NEAREST);
    docquery.exec().then(products => {
        res.json(products)
    })
    .catch(err => {
        res.status(500).send(err);
    })
})
.post(function(req, res){
    const { title, url } = req.body;
    const newProduct = new Product({
        title: title,
        url: url
    });

    newProduct.save().then(() => {
        res.json(newProduct);
    }).catch(err => {
        res.status(500).send(err);
    });
})
.put(function(req, res){
    const { title, newTitle, newUrl } = req.body;
    Product.updateOne({title: title}, {$set: {
        title: newTitle,
        url: newUrl
    }}).then(product => {
        res.json(product);
    }).catch(err => {
        res.status(500).send(err);
    })
})

productApp.route('/products/:productTitle')
.delete(function(req,res){
    const { productTitle } = req.params;

    Product.findOneAndDelete({productTitle}).then(product => {
        res.json(product);
    }).catch(err => {
        res.status(500).send(err);
    })
})

module.exports = productApp;