const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Reference to User model - creates one-to-many relationship (one user can have many orders)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // Array of products - creates many-to-many relationship (many products in many orders)
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'credit_card'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  }
}, { timestamps: true });

// Pre-save middleware to update related collections
orderSchema.pre('save', async function(next) {
  // This could be used to update inventory, user order history, etc.
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;