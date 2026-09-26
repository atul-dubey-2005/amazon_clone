-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(10),
  role VARCHAR(50) DEFAULT 'user',
  profile_image VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  stock INT DEFAULT 0,
  brand VARCHAR(100),
  seller_id INT,
  sku VARCHAR(100) UNIQUE,
  thumbnail_images JSON,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  image VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(50),
  color VARCHAR(50),
  sku VARCHAR(100),
  stock INT,
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  helpful_count INT DEFAULT 0,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  size VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  order_number VARCHAR(100) UNIQUE,
  subtotal DECIMAL(10,2),
  tax DECIMAL(10,2),
  shipping_cost DECIMAL(10,2) DEFAULT 50,
  discount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2),
  shipping_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(10),
  coupon_code VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  tracking_number VARCHAR(100),
  estimated_delivery DATE,
  is_returned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10,2),
  size VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Returns Table
CREATE TABLE IF NOT EXISTS returns (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id),
  user_id INT NOT NULL REFERENCES users(id),
  reason VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'initiated',
  refund_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(50),
  discount_value DECIMAL(10,2),
  min_purchase DECIMAL(10,2) DEFAULT 0,
  applicable_category VARCHAR(100),
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Admin User
INSERT INTO users (name, email, password, role, is_verified) 
VALUES ('Admin User', 'admin@amazon.com', '$2a$10$YXJlIHRoaXMgaXMgYW4gZW5jb2RlZCBwYXNzd29yZGZvcnRlc3Q=', 'admin', TRUE)
ON CONFLICT DO NOTHING;

-- Insert Sample Products
INSERT INTO products (name, description, price, category, stock, brand, image) VALUES
('iPhone 15 Pro', 'Latest Apple iPhone with A17 Pro chip', 79999, 'Electronics', 50, 'Apple', 'iphone15.jpg'),
('Samsung Galaxy S24', '6.2 AMOLED Display, Snapdragon 8 Gen 3', 69999, 'Electronics', 40, 'Samsung', 'galaxy.jpg'),
('AirPods Pro 2', 'Wireless earbuds with noise cancellation', 24999, 'Accessories', 100, 'Apple', 'airpods.jpg'),
('MacBook Air M3', '13-inch laptop with M3 chip', 119999, 'Electronics', 20, 'Apple', 'macbook.jpg'),
('Sony WH-1000XM5', 'Premium noise cancelling headphones', 29999, 'Accessories', 35, 'Sony', 'sony.jpg'),
('iPad Pro 12.9', 'Latest iPad with M2 chip', 89999, 'Electronics', 25, 'Apple', 'ipad.jpg')
ON CONFLICT DO NOTHING;

-- Insert Coupons
INSERT INTO coupons (code, discount_type, discount_value, valid_until) VALUES
('SUMMER50', 'percentage', 50, '2025-09-30'),
('SAVE20', 'fixed', 20, '2025-12-31'),
('ACCESSORIES15', 'percentage', 15, '2025-12-31'),
('WELCOME10', 'percentage', 10, '2025-12-31')
ON CONFLICT DO NOTHING;
