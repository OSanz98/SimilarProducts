const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: { type: String, required: true, unique: true },
    url: String
});
const Product = mongoose.model("products", productSchema);

module.exports = Product;