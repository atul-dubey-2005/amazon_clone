# Amazon Clone - Full Stack E-Commerce Platform

A complete Amazon-like e-commerce platform built with React (Frontend) and Node.js/Express (Backend) using PostgreSQL (Supabase).

## Features

✅ User Authentication (JWT)
✅ Product Catalog with Filters
✅ Shopping Cart
✅ Order Management
✅ Reviews & Ratings
✅ Wishlist
✅ Coupons & Discounts
✅ Admin Dashboard
✅ Returns Management
✅ Notifications

## Project Structure

```
amazon-clone-complete/
├── backend/                  
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── vercel.json            # Vercel config
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   └── routes/
│       ├── auth.js
│       ├── products.js
│       ├── cart.js
│       ├── orders.js
│       ├── users.js
│       ├── reviews.js
│       ├── wishlist.js
│       ├── coupons.js
│       ├── returns.js
│       └── notifications.js
├── frontend/                   # React Frontend
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── components/
│       │   └── Navbar.js
│       └── pages/
│           ├── Home.js
│           ├── ProductDetails.js
│           ├── Cart.js
│           ├── Checkout.js
│           ├── Login.js
│           ├── Register.js
│           ├── Orders.js
│           ├── Profile.js
│           └── AdminDashboard.js
└── database-schema.sql        # PostgreSQL Schema
```

## Tech Stack

**Backend:**
- Node.js & Express.js
- PostgreSQL (Supabase)
- JWT Authentication
- bcryptjs Password Hashing

**Frontend:**
- React 18
- React Router
- Axios
- CSS3

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   npm install
   ```

2. Add environment variables in Vercel/Railway dashboard:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET`
   - `PORT`

3. Deploy to Vercel/Railway

### Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   npm install
   ```

2. Create `.env` file (or add in Vercel):
   ```
   REACT_APP_API_URL=https://your-backend-url/api
   ```

3. Deploy to Vercel

### Database Setup

1. Go to Supabase (https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Run `database-schema.sql`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get cart (protected)
- `POST /api/cart` - Add to cart (protected)
- `PUT /api/cart/:id` - Update quantity (protected)
- `DELETE /api/cart/:id` - Remove item (protected)

### Orders
- `POST /api/orders/checkout` - Place order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/admin/all` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update status (admin)

### Reviews
- `POST /api/reviews` - Add review (protected)
- `GET /api/reviews/product/:id` - Get reviews

### Wishlist
- `POST /api/wishlist` - Add to wishlist (protected)
- `GET /api/wishlist` - Get wishlist (protected)
- `DELETE /api/wishlist/:id` - Remove from wishlist (protected)

### Other Routes
- `/api/coupons/validate` - Validate coupon
- `/api/returns` - Returns management
- `/api/notifications` - Get notifications
- `/api/users` - User management

## Default Credentials

- **Email:** admin@amazon.com
- **Password:** admin123

## Deployment

### Backend (Vercel)
```bash
cd backend
npm install
vercel
```

### Frontend (Vercel)
```bash
cd frontend
npm install
npm run build
vercel
```

### Database (Supabase)
1. Create project on Supabase
2. Run `database-schema.sql` in SQL Editor
3. Copy connection details to Vercel env vars

## Environment Variables

### Backend
```
DB_HOST=your-project.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=postgres
JWT_SECRET=your_secret_key
PORT=5000
```

### Frontend
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

## File Sizes

- **Backend:** ~50KB
- **Frontend:** ~100KB  
- **Database:** ~5KB (schema)

## Support

For issues, check:
- Supabase docs: https://supabase.com/docs
- Express docs: https://expressjs.com
- React docs: https://react.dev
- Vercel docs: https://vercel.com/docs

## License

MIT

## Author

Atul Dubey
