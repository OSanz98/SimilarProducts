const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/products');
const logger = require('morgan');

const app = express();
const port = process.env.PORT || '8080';
const root = './';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.static(path.join(__dirname, 'build')));
app.use('/api', routes);

// app.get('*', (req,res) => {
//     res.sendFile('build/index.html', { root: root });
// })

app.listen(port, function(){
    console.log(`server started on port ${port}`);
});
