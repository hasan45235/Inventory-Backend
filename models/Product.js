
// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, default: 0 },
  unitPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
