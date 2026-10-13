# 🛍️ Full Stack E-Commerce Shopping Website

> **College Full Stack Development Mini Project**  
> Built strictly using: **HTML5, CSS3, Vanilla JavaScript, and Express.js**  
> **Persistence Architecture:** Server In-Memory JavaScript Arrays & Objects (Zero Database Dependencies)

---

## 📌 Project Overview

This project is a complete, beginner-friendly, and modern Full Stack E-Commerce Shopping Website created for a college mini-project demonstration. It demonstrates how client-server communication, RESTful APIs, session management, inventory control, and cart management work without the complexity of heavy frameworks or external databases.

### 🛑 Architectural Note on Data Storage
In accordance with project restrictions, this application **does not use MongoDB, MySQL, SQLite, or any database**. All application entities (users, products, orders, sessions) are stored in server-side JavaScript arrays in memory while Express.js is running. 
> ⚠️ **Notice**: All records will reset back to initial seed data whenever the server process restarts. Shopping cart state is additionally cached in the browser's `localStorage` for client convenience.

---

## 🔑 Demonstration Accounts

Two pre-configured accounts are initialized by the server on startup:

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Store Administrator** | `admin@eshop.com` | `AdminPassword123` | Product CRUD, Order Status updates, Store Metrics |
| **Registered Customer** | `customer@eshop.com` | `CustomerPass123` | Browsing, Cart, Order Checkout, Order History |

*Tip: On the Login page (`login.html`), click the **"🔑 Fill Admin"** or **"👤 Fill Customer"** button to instantly load credentials with one click during viva evaluation!*

---

## 🚀 How to Run the Project

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 16.x or higher installed on Windows/Mac/Linux)
- [Visual Studio Code](https://code.visualstudio.com/) (or any code editor)

### Step-by-Step Setup:

1. **Open the Project Folder** in VS Code:
   ```bash
   cd c:\Users\vishnu\Desktop\nikhil
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   *(Only installs minimal standard Express.js and cookie-parser)*

3. **Start the Application Server**:
   ```bash
   npm start
   ```

4. **Launch the Website in Your Browser**:
   Open:
   ```
   http://localhost:3000
   ```

---

## 📂 Project Structure

```
ecommerce-mini-project/
├── public/                     # Static frontend files served by Express
│   ├── index.html              # Homepage with hero banner & featured items
│   ├── products.html           # Product catalog with search, filter & sort
│   ├── product-details.html    # Detailed product view & quantity selector
│   ├── cart.html               # Shopping cart with server stock verification
│   ├── checkout.html           # Shipping address form & Cash on Delivery (COD)
│   ├── login.html              # Customer & Admin login with 1-click fillers
│   ├── register.html           # New customer registration form
│   ├── orders.html             # Customer order history & tracking
│   ├── admin.html              # Administrator dashboard & management console
│   ├── css/
│   │   ├── style.css           # Modern design system & UI stylesheet
│   │   └── responsive.css      # Responsive breakpoints for mobile/tablet/desktop
│   └── js/
│       ├── main.js             # Shared utilities, CartManager, Toast & Auth check
│       ├── products.js         # Catalog listing, search debounce & category filters
│       ├── product-details.js  # Single product loader & related recommendations
│       ├── cart.js             # Cart items sync, recalculation & deletion
│       ├── checkout.js         # Address validation & order placement API call
│       ├── auth.js             # Form handling & session management
│       ├── orders.js           # Order history rendering
│       └── admin.js            # Admin metrics, product CRUD & order status updates
├── server.js                   # Express.js REST API server & in-memory data store
├── package.json                # Project dependencies & startup scripts
├── test_suite.js               # Automated 23-test API and business logic suite
├── PROJECT_DOCUMENTATION.md    # Comprehensive college project report & Viva Q&A
└── README.md                   # Quick start documentation
```

---

## 🌟 Key Features

### 🛒 Customer Features
1. **Promotional Homepage**: Modern hero banner with animated preview card, category shortcuts, and top featured products.
2. **Dynamic Catalogue**: Filter products by category, search by keywords in real-time, sort by price (Low to High / High to Low), and view stock indicators.
3. **Product Details**: Complete specifications, customer ratings, live stock counter, and quantity increment/decrement controls.
4. **Persistent Shopping Cart**: Saved in browser `localStorage` and automatically verified against server stock and authoritative prices.
5. **Checkout & COD**: Clean delivery form (10-digit phone, 6-digit PIN code), Cash on Delivery payment option, and atomic stock reduction.
6. **Unique Order IDs**: Generates order tracking codes formatted as `ORD-YYYYMMDD-XXXX`.
7. **Order History**: Customers can view past orders with color-coded status pills (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).

### ⚙️ Administrator Features
1. **Executive Metrics**: Live counts of Total Products, Total Orders, Out-of-Stock warnings, and Total Revenue in INR (₹).
2. **Product Management**:
   - Add new products with categories, custom image URLs, price, and stock.
   - Edit existing product pricing, specifications, and inventory levels.
   - Delete products from the active catalog.
3. **Order Fulfillment**:
   - Search orders by customer name, order ID, or phone number.
   - Filter by status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
   - Change order delivery statuses with instant server-side updates.
   - Full order inspection modal.
4. **Security Enforcement**: Backend role verification ensures non-admin users cannot access administrative endpoints (returns `403 Forbidden`).

---

## 🧪 Testing the Project

An automated verification script is included:
```bash
node test_suite.js
```
This tests:
- Product retrieval, search, category filtering, and sorting
- Customer & Admin authentication and invalid credential rejections
- Duplicate email prevention
- Server-side cart validation and price calculation
- Atomic stock decrements upon checkout
- Protection against insufficient stock
- User-level order history data isolation
- Admin role authorization barriers (401 & 403 HTTP codes)
- Product creation, updating, and deletion (CRUD)
- Order status state transitions
