const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Add filtering options
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.isPaid) filter.isPaid = req.query.isPaid === 'true';
    
    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }
    
    const orders = await Order.find(filter)
      .populate('user', 'id username email')
      .populate('products.product', 'name price')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination info
    const total = await Order.countDocuments(filter);
    
    res.status(200).json({
      orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error('Error in getOrders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    
    const order = await Order.findById(req.params.id)
      .populate('user', 'id username email')
      .populate('products.product', 'name price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    // Admin can view any order, users can only view their own orders
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod } = req.body;
    
    // Validate required fields
    if (!products || products.length === 0 || !shippingAddress) {
      return res.status(400).json({ 
        message: 'Please provide products and shipping address' 
      });
    }
    
    // Validate products and calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    // Process each product in the order
    for (const item of products) {
      // Validate product exists
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ 
          message: `Product not found: ${item.product}` 
        });
      }
      
      // Check if product is in stock
      if (!product.inStock) {
        return res.status(400).json({ 
          message: `Product out of stock: ${product.name}` 
        });
      }
      
      // Add to order items with current price
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
      
      // Update total amount
      totalAmount += product.price * item.quantity;
    }
    
    // Round total to 2 decimal places
    totalAmount = Math.round(totalAmount * 100) / 100;
    
    // Create order
    const order = await Order.create({
      user: req.user._id,
      products: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'credit_card'
    });
    
    if (order) {
      // Update any related data (could be done with middleware)
      // e.g., update product inventory, user order history
      
      res.status(201).json({
        order,
        message: 'Order created successfully'
      });
    } else {
      res.status(400).json({ message: 'Invalid order data' });
    }
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    
    const { status, isPaid, paidAt } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Business logic: validate status transitions
    if (status) {
      const validTransitions = {
        'pending': ['processing', 'cancelled'],
        'processing': ['shipped', 'cancelled'],
        'shipped': ['delivered', 'cancelled'],
        'delivered': [],
        'cancelled': []
      };
      
      if (!validTransitions[order.status].includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status transition from ${order.status} to ${status}` 
        });
      }
      
      order.status = status;
    }
    
    // Update payment information
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid && !order.paidAt) {
        order.paidAt = paidAt || new Date();
      }
    }
    
    // Save updated order
    const updatedOrder = await order.save();
    
    res.status(200).json({
      order: updatedOrder,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Error in updateOrder:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Business logic: Only allow deletion of pending or cancelled orders
    if (!['pending', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ 
        message: `Cannot delete orders with status: ${order.status}. Only pending or cancelled orders can be deleted.` 
      });
    }
    
    await order.deleteOne();
    
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'name price')
      .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error in getMyOrders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders
};