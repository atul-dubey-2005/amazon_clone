# Quick Start Guide

## 1️⃣ Database Setup (MySQL)

```bash
mysql -u root -p
source database/schema.sql
exit
```

## 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Edit .env with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=amazon_clone
# JWT_SECRET=your_secret_key

npm start
# ✅ Backend running on http://localhost:5000
```

## 3️⃣ Frontend Setup (New Terminal)

```bash
cd frontend
npm install
cp .env.example .env

# .env should have:
# REACT_APP_API_URL=http://localhost:5000/api

npm start
# ✅ Frontend running on http://localhost:3000
```

## 4️⃣ Login & Explore

### Admin Login
- Email: `admin@amazon.com`
- Password: `admin123`
- Access: Admin Dashboard (http://localhost:3000/admin)

### User Login
- Register a new account from the Register page
- Browse products, add to cart, checkout

## 5️⃣ Admin Features

1. Go to `/admin` after login as admin
2. **Products Tab:** Add/edit/delete products
3. **Orders Tab:** View and update order status

## Default Sample Products

10 products are already in the database:
- Wireless Headphones
- USB-C Cable
- Laptop Stand
- Mechanical Keyboard
- Wireless Mouse
- Phone Case
- Screen Protector
- Webcam HD
- Monitor Arm
- USB Hub

## API Testing

Use Postman or cURL:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456","confirmPassword":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get Products
curl http://localhost:5000/api/products

# Get Products with Filter
curl "http://localhost:5000/api/products?category=Electronics&sort=price-asc"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Change React port: `PORT=3001 npm start` |
| Port 5000 in use | Change backend port in .env: `PORT=5001` |
| MySQL not running | Start: `mysql.server start` (Mac) or MySQL service (Windows) |
| Module errors | Delete node_modules, run `npm install` again |
| Blank page | Check browser console (F12) and network tab |

## File Structure

```
amazon-clone/
├── backend/          ← Node.js API Server
├── frontend/         ← React App
├── database/         ← MySQL Schema
├── README.md         ← Full Documentation
└── QUICKSTART.md     ← This File
```

---

**You're all set! 🎉 Happy shopping!**
