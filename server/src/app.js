const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const similarApp = require('./routes/similar');
const productApp = require('./routes/products');

const app = express();

// used to parse requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/SimilarProducts', {useNewUrlParser: true});

app.use(productApp);
app.use(similarApp);


app.listen(3000, function() {
    console.log('listening to port 3000')
})
