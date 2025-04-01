const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  // Adding relationship to track which orders contain this product
  // This creates a many-to-many relationship between products and orders
  orderedIn: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for getting orders containing this product
productSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'products.product'
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;