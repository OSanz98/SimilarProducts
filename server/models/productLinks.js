const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linksSchema = new Schema({
    product_title: String,
    similar_product_title: String
});

const Links = mongoose.model("product_to_similar", linksSchema);

module.exports = Links;