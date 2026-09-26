# Amazon Clone E-Commerce Platform

A fully functional Amazon clone with user authentication, product management, shopping cart, checkout, and admin dashboard. Built with React, Node.js, and MySQL.

## Features

✅ **User Authentication** - Register, login, profile management
✅ **Product Catalog** - Browse, search, filter, sort products
✅ **Shopping Cart** - Add/remove items, update quantities
✅ **Checkout** - Mock payment processing
✅ **Order Management** - View order history and status
✅ **Admin Panel** - Add/edit/delete products, manage orders
✅ **Responsive Design** - Works on desktop and mobile

## Tech Stack

**Backend:**
- Node.js + Express
- MySQL Database
- JWT Authentication
- Bcryptjs Password Hashing

**Frontend:**
- React 18
- React Router v6
- Axios for API calls
- React Icons

## Project Structure

```
amazon-clone/
├── backend/
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── server.js        # Express server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql       # Database schema
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL Server
- Git

### 1. Database Setup

```bash
# Open MySQL
mysql -u root -p

# Run the schema file
source amazon-clone/database/schema.sql
```

### 2. Backend Setup

```bash
cd amazon-clone/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure .env with your database credentials
# Edit .env:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=amazon_clone
# JWT_SECRET=your_secret_key

# Start the server
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd amazon-clone/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# The default API URL should work if backend is running on :5000
# REACT_APP_API_URL=http://localhost:5000/api

# Start React app
npm start
# App opens on http://localhost:3000
```

## Demo Credentials

### Admin Account
- **Email:** admin@amazon.com
- **Password:** admin123

### Test User
- Create your own account through the Register page

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products (with search/filter)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update/:product_id` - Update quantity
- `DELETE /api/cart/:product_id` - Remove item

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders/checkout` - Create order
- `GET /api/orders/:orderId` - Get order details
- `PUT /api/orders/:orderId/status` - Update order status (Admin)

## Features Breakdown

### 1. User Features
- Register and login
- Update profile information
- Browse products with search and filters
- Add products to cart
- Checkout with shipping details
- View order history

### 2. Admin Features
- Add new products
- Edit/delete existing products
- View all orders
- Update order status (Processing, Shipped, Delivered, etc.)
- User management

### 3. Product Filtering
- By category
- By price range
- By ratings
- Search functionality
- Sort by price and rating

## Database Schema

### Users Table
- id, name, email, password, phone, address, city, state, zipcode, country, role

### Products Table
- id, title, description, price, discount_price, category, stock, rating, reviews, image_url, seller

### Cart Table
- id, user_id, product_id, quantity, added_at

### Orders Table
- id, user_id, total_amount, status, payment_status, shipping_address, transaction_id

### Order Items Table
- id, order_id, product_id, quantity, price

## Mock Payment

The checkout process uses mock payment processing. When placing an order:
1. Enter any 16-digit number for card number
2. Select payment method
3. Order is processed automatically
4. Transaction ID is generated

## Error Handling

The application includes:
- Form validation on frontend and backend
- Error messages for failed operations
- Authentication token validation
- Stock availability checks
- Email uniqueness validation

## Security Features

✓ JWT Token-based authentication
✓ Password hashing with bcryptjs
✓ Role-based access control (Admin only)
✓ Input validation and sanitization
✓ Protected routes for authenticated users

## Troubleshooting

### Port Already in Use
```bash
# For port 3000 (React)
sudo lsof -i :3000
sudo kill -9 <PID>

# For port 5000 (Backend)
sudo lsof -i :5000
sudo kill -9 <PID>
```

### Database Connection Error
- Verify MySQL is running
- Check credentials in .env
- Ensure database exists

### CORS Issues
- Verify backend URL in frontend .env
- Check CORS configuration in backend

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps for Production

1. **Authentication:** Implement 2FA, OAuth
2. **Payment:** Integrate real payment gateway (Stripe, PayPal)
3. **Email:** Setup email notifications
4. **CDN:** Serve images from CDN
5. **Caching:** Implement Redis for caching
6. **Testing:** Add unit and integration tests
7. **Deployment:** Deploy on AWS/Heroku/DigitalOcean

## Support

For issues or questions, check the console logs and network tab in browser DevTools.

---

**Happy Coding! 🚀**
