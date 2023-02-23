const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/prod/products');

const app = express();
const port = process.env.PORT || '3000';
const root = './';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(root, 'public')));
app.use('/api', routes);

app.listen(port, function(){
    console.log(`server started on port ${port}`);
});
