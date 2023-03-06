const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const similarProductSchema = new Schema({
    title: { type: String, required: true, unique: true },
    url: String,
    image: String,
    price: String
});
const SimilarProduct = mongoose.model("similar_products", similarProductSchema);

module.exports = SimilarProduct;