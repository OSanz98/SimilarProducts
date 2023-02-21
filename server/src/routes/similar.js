const express = require('express');
const Product = require('../models/product.js');
// const {PythonShell} = require('python-shell');
const { exec } = require('child_process');

const similarApp = express();

similarApp.route('/find-similar')
.post(function(req, res){
    const productTitle = req.body.productTitle;

    const cmdActivate = 'conda activate SimilarProduct';
    const cmdInstall = 'pip install -r ../controller/requirements.txt';
    const cmdRun = `python ../controller/scraper.py find_similar_products ${productTitle}`;

    // Activate the virtual environment and install required packages
    exec(`${cmdActivate} && ${cmdInstall}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(400).send({ error: 'Bad Request' });
        }

        // Run the Python script
        exec(`${cmdActivate} && ${cmdRun}`, (error, stdout, stderr) => {
            if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send({ error: 'Internal Server Error' });
            }
            if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(400).send({ error: 'Bad Request' });
            }
            const result = stdout.trim();
            res.status(200).send({ message: result });
        });
    });
})

.get(function(req, res){
    Product.findOne({title: req.params.productTitle }, function(err, product){
        if(product) {
            res.status(200).send("Product found");
        } else {
            res.status(400).send("Couldn't find product");
        }
    });
});

module.exports = similarApp;