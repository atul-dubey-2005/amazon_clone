-- Create Database
CREATE DATABASE IF NOT EXISTS amazon_clone;
USE amazon_clone;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  zipcode VARCHAR(10),
  country VARCHAR(100),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  category VARCHAR(100) NOT NULL,
  stock INT DEFAULT 0,
  rating FLOAT DEFAULT 0,
  reviews INT DEFAULT 0,
  image_url VARCHAR(500),
  seller VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_price (price),
  INDEX idx_stock (stock)
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id),
  INDEX idx_user_id (user_id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  shipping_address VARCHAR(500),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_zipcode VARCHAR(10),
  shipping_country VARCHAR(100),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_order_id (order_id)
);

-- Insert Admin User
INSERT INTO users (name, email, password, phone, role) VALUES 
('Admin', 'admin@amazon.com', '$2a$10$YourHashedPasswordHere', '1234567890', 'admin')
ON DUPLICATE KEY UPDATE id=id;

-- Insert Sample Products
INSERT INTO products (title, description, price, discount_price, category, stock, rating, reviews, image_url, seller) VALUES
('Wireless Headphones', 'Premium noise-cancelling wireless headphones', 79.99, 59.99, 'Electronics', 50, 4.5, 128, 'https://via.placeholder.com/300?text=Headphones', 'TechStore'),
('USB-C Cable', 'High-speed USB-C charging cable', 19.99, 14.99, 'Electronics', 200, 4.2, 85, 'https://via.placeholder.com/300?text=USB-C', 'TechStore'),
('Laptop Stand', 'Adjustable aluminum laptop stand', 39.99, 29.99, 'Accessories', 75, 4.6, 95, 'https://via.placeholder.com/300?text=Stand', 'OfficeSupply'),
('Mechanical Keyboard', 'RGB Mechanical Gaming Keyboard', 89.99, 69.99, 'Electronics', 40, 4.7, 156, 'https://via.placeholder.com/300?text=Keyboard', 'GamingGear'),
('Wireless Mouse', 'Ergonomic wireless mouse with precision', 49.99, 39.99, 'Electronics', 120, 4.4, 102, 'https://via.placeholder.com/300?text=Mouse', 'TechStore'),
('Phone Case', 'Protective phone case for iPhone 14', 24.99, 18.99, 'Accessories', 300, 4.3, 250, 'https://via.placeholder.com/300?text=Case', 'CaseShop'),
('Screen Protector', 'Tempered glass screen protector', 9.99, 7.99, 'Accessories', 500, 4.1, 180, 'https://via.placeholder.com/300?text=Protector', 'CaseShop'),
('Webcam HD', '1080P HD Webcam with microphone', 59.99, 44.99, 'Electronics', 35, 4.5, 98, 'https://via.placeholder.com/300?text=Webcam', 'TechStore'),
('Monitor Arm', 'Adjustable dual monitor arm', 69.99, 54.99, 'Accessories', 45, 4.6, 67, 'https://via.placeholder.com/300?text=Monitor+Arm', 'OfficeSupply'),
('USB Hub', 'Multi-port USB 3.0 hub', 29.99, 22.99, 'Electronics', 150, 4.2, 112, 'https://via.placeholder.com/300?text=USB+Hub', 'TechStore');

-- Sample Admin Password: 'admin123' (hashed with bcryptjs)
-- To generate hash: bcrypt.hashSync('admin123', 10)
