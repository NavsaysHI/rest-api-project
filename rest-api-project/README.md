# REST API Project

## API Endpoints

### Users
- GET /api/users - Get all users (Admin)
- GET /api/users/:id - Get user by ID (Admin)
- POST /api/users - Create a new user (Public)
- PUT /api/users/:id - Update a user (Admin)
- DELETE /api/users/:id - Delete a user (Admin)

### Products
- GET /api/products - Get all products (Public)
- GET /api/products/:id - Get product by ID (Public)
- POST /api/products - Create a new product (Admin)
- PUT /api/products/:id - Update a product (Admin)
- DELETE /api/products/:id - Delete a product (Admin)

### Orders
- GET /api/orders - Get all orders (Admin)
- GET /api/orders/:id - Get order by ID (User/Admin)
- POST /api/orders - Create a new order (User)
- PUT /api/orders/:id - Update an order (Admin)
- DELETE /api/orders/:id - Delete an order (Admin)

## Authentication
This API uses JWT for authentication. Include a Bearer token in the Authorization header for protected endpoints.

## Usage
- Public endpoints: No authentication required
- User endpoints: Requires a valid JWT token
- Admin endpoints: Requires a valid JWT token with admin role