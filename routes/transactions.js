
// routes/transactions.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.product) filter.productId = req.query.product;
    const transactions = await Transaction.find(filter).sort({ date: -1 }).populate('productId');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, type, quantity, note } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (type === 'out' && product.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock' });
    }

    const transaction = new Transaction({ productId, type, quantity, note });
    await transaction.save();

    product.quantity = type === 'in' ? Number(product.quantity) + Number(quantity) : Number(product.quantity) - Number(quantity);
    await product.save();

    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
