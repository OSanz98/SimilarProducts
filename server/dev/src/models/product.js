const mongoose = require('mongoose');

const productSchema = {
    title: String,
    url: String
}
const Product = mongoose.model("products", productSchema);

module.exports = Product;