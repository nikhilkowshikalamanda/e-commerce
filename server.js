/**
 * Full Stack E-Commerce Shopping Website - Server
 * Technology Stack: Node.js, Express.js (In-Memory Data Store)
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * In accordance with college project requirements, this application uses in-memory 
 * JavaScript arrays and objects for data persistence. No database (MongoDB, MySQL, etc.)
 * is utilized. All data will be initialized and stored in memory during server runtime 
 * and will reset whenever the server process restarts.
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static frontend assets from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Request logger for development & debugging
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// IN-MEMORY DATA STORES
// ==========================================

// Helper: Generate short UUID/ID
let nextProductId = 100;
let nextOrderId = 1000;

/**
 * Products In-Memory Collection
 * realistic products across Electronics, Clothing, Footwear, Accessories, Home and Lifestyle
 */
let products = [
  {
    id: 1,
    name: "Apple MacBook Air M2 (13.6-inch, 256GB SSD)",
    description: "Supercharged by the next-generation M2 chip, the redesigned MacBook Air combines incredible performance and up to 18 hours of battery life into its strikingly thin aluminum enclosure.",
    price: 94990,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    stock: 12,
    rating: 4.8,
    reviewsCount: 142
  },
  {
    id: 2,
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description: "Industry-leading noise cancellation optimized with two processors and eight microphones. Crystal clear hands-free calling and up to 30 hours battery life with quick charge.",
    price: 26990,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    stock: 20,
    rating: 4.7,
    reviewsCount: 98
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 5G (128GB, Onyx Black)",
    description: "Equipped with Galaxy AI, dazzling 6.2-inch FHD+ Dynamic AMOLED 2X display, pro-grade 50MP triple camera system, and ultra-durable Armor Aluminum frame.",
    price: 74999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
    stock: 15,
    rating: 4.6,
    reviewsCount: 85
  },
  {
    id: 4,
    name: "Men's Premium Slim Fit Casual Denim Shirt",
    description: "Crafted from 100% breathable pure cotton indigo denim fabric. Features dual chest patch pockets, curved hemline, and durable resin buttons.",
    price: 1499,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    stock: 35,
    rating: 4.4,
    reviewsCount: 64
  },
  {
    id: 5,
    name: "Women's Floral Embroidered Pure Cotton Kurti",
    description: "Elegant A-line designer kurti featuring intricate thread embroidery, 3/4 sleeves, and Mandarin collar. Perfect for festive celebrations and everyday comfort.",
    price: 1199,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
    stock: 28,
    rating: 4.5,
    reviewsCount: 52
  },
  {
    id: 6,
    name: "Classic Organic Cotton Crew Neck T-Shirt (Olive)",
    description: "Heavyweight 220 GSM combed organic cotton t-shirt with ribbed collar and pre-shrunk finish. Minimalist everyday essential that lasts.",
    price: 699,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    stock: 50,
    rating: 4.3,
    reviewsCount: 110
  },
  {
    id: 7,
    name: "Nike Air Max 270 Responsive Running Shoes",
    description: "Features Nike's biggest heel Air unit yet for a super-soft ride that feels as impossible as it looks. Engineered mesh upper breathes easy and conforms to feet.",
    price: 8495,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    stock: 18,
    rating: 4.9,
    reviewsCount: 204
  },
  {
    id: 8,
    name: "Puma Smash V2 Minimalist White Casual Sneakers",
    description: "Tennis-inspired classic sneakers with clean synthetic leather upper, padded collar, and durable textured rubber outsole for superior street grip.",
    price: 3299,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
    stock: 25,
    rating: 4.5,
    reviewsCount: 76
  },
  {
    id: 9,
    name: "Fossil Gen 6 Display Smartwatch with Heart Rate & SpO2",
    description: "Qualcomm Snapdragon Wear 4100+ platform, fast charging to 80% in 30 minutes, customizable dials, contactless payments, and sleek stainless steel bracelet.",
    price: 14995,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    stock: 10,
    rating: 4.4,
    reviewsCount: 43
  },
  {
    id: 10,
    name: "Wildcraft 35L Water Resistant Travel & College Backpack",
    description: "Multi-compartment ergonomic backpack with padded laptop sleeve for up to 15.6-inch laptops, rain cover pocket, and contoured back airflow system.",
    price: 2199,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    stock: 30,
    rating: 4.6,
    reviewsCount: 88
  },
  {
    id: 11,
    name: "Nordic Minimalist Ceramic Bedside Table Lamp",
    description: "Handcrafted matte ceramic base with warm beige linen shade. Includes warm 3000K LED bulb with three-step touch dimming for cozy ambient glow.",
    price: 1850,
    category: "Home and Lifestyle",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    stock: 14,
    rating: 4.7,
    reviewsCount: 39
  },
  {
    id: 12,
    name: "Ultrasonic Aroma Diffuser with 6 Pure Essential Oils",
    description: "500ml capacity ultrasonic cool mist humidifier with 7 color ambient LED lights, whisper quiet operation, and 4 timer setting modes.",
    price: 1299,
    category: "Home and Lifestyle",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
    stock: 22,
    rating: 4.6,
    reviewsCount: 57
  },
  {
    id: 13,
    name: "Stainless Steel Double Wall Insulated Bottle (1000ml)",
    description: "Vacuum insulated food-grade 18/8 stainless steel flask. Keeps beverages piping hot for 18 hours or icy cold for 24 hours with zero sweat condensation.",
    price: 899,
    category: "Home and Lifestyle",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    stock: 40,
    rating: 4.5,
    reviewsCount: 92
  },
  {
    id: 14,
    name: "Ray-Ban Polarized Classic Aviator Sunglasses",
    description: "Gold metal frame with iconic green classic G-15 crystal lenses. 100% UV400 protection with glare reduction for superior visual clarity.",
    price: 8590,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
    stock: 8,
    rating: 4.8,
    reviewsCount: 115
  }
];

/**
 * Users In-Memory Collection
 * Includes initial Demonstration Administrator and Customer accounts
 * 
 * NOTE: For demonstration purposes in this college mini-project, passwords 
 * are stored in memory with standard hashing helper.
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

let users = [
  {
    id: 1,
    name: "Store Administrator",
    email: "admin@eshop.com",
    passwordHash: hashPassword("AdminPassword123"),
    role: "admin",
    createdAt: new Date("2026-01-01T00:00:00Z").toISOString()
  },
  {
    id: 2,
    name: "Rahul Sharma",
    email: "customer@eshop.com",
    passwordHash: hashPassword("CustomerPass123"),
    role: "customer",
    createdAt: new Date("2026-01-02T00:00:00Z").toISOString()
  }
];

/**
 * Active In-Memory Sessions
 * sessionId -> { userId, role, email, name, createdAt }
 */
const sessions = {};

/**
 * Orders In-Memory Collection
 */
let orders = [
  {
    id: "ORD-20260301-1001",
    userId: 2,
    customerName: "Rahul Sharma",
    customerEmail: "customer@eshop.com",
    shippingAddress: {
      fullName: "Rahul Sharma",
      phone: "9876543210",
      street: "Flat 402, Green Meadows Apartment, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001"
    },
    items: [
      {
        productId: 2,
        name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        price: 26990,
        quantity: 1,
        subtotal: 26990,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
      },
      {
        productId: 6,
        name: "Classic Organic Cotton Crew Neck T-Shirt (Olive)",
        price: 699,
        quantity: 2,
        subtotal: 1398,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
      }
    ],
    itemsCount: 3,
    subtotal: 28388,
    shippingFee: 0,
    tax: 0,
    total: 28388,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    orderStatus: "Delivered",
    createdAt: new Date("2026-03-01T11:30:00Z").toISOString()
  }
];

// ==========================================
// AUTHENTICATION & AUTHORIZATION HELPERS
// ==========================================

function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions[token] = {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    createdAt: Date.now()
  };
  return token;
}

// Session validation middleware
function authenticateUser(req, res, next) {
  // Support both HttpOnly cookie and Bearer/x-session-token header
  let token = req.cookies.session_token;
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }
  if (!token && req.headers['x-session-token']) {
    token = req.headers['x-session-token'];
  }

  if (token && sessions[token]) {
    req.user = sessions[token];
    req.sessionToken = token;
  } else {
    req.user = null;
    req.sessionToken = null;
  }
  next();
}

app.use(authenticateUser);

// Route guards
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in to proceed."
    });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in."
    });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Administrator privileges required."
    });
  }
  next();
}

// ==========================================
// API ROUTES: AUTHENTICATION
// ==========================================

/**
 * POST /api/auth/register
 * Register a new customer
 */
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required." });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ success: false, message: "A valid email address is required." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email address already exists." });
    }

    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      role: "customer",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Auto log in after registration
    const token = createSession(newUser);
    res.cookie('session_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to E-Shop.",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: "An error occurred during registration." });
  }
});

/**
 * POST /api/auth/login
 * Customer or Administrator Login
 */
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = createSession(user);
    res.cookie('session_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "An error occurred during login." });
  }
});

/**
 * POST /api/auth/logout
 * Destroy current session
 */
app.post('/api/auth/logout', (req, res) => {
  if (req.sessionToken && sessions[req.sessionToken]) {
    delete sessions[req.sessionToken];
  }
  res.clearCookie('session_token');
  return res.status(200).json({
    success: true,
    message: "Logged out successfully."
  });
});

/**
 * GET /api/auth/me
 * Return currently authenticated user data
 */
app.get('/api/auth/me', (req, res) => {
  if (!req.user) {
    return res.status(200).json({
      success: false,
      authenticated: false,
      user: null
    });
  }
  return res.status(200).json({
    success: true,
    authenticated: true,
    user: {
      id: req.user.userId,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// ==========================================
// API ROUTES: PRODUCTS
// ==========================================

/**
 * GET /api/products
 * Retrieve products with optional search, category, and sorting
 */
app.get('/api/products', (req, res) => {
  try {
    let result = [...products];
    const { search, category, sort, limit } = req.query;

    // Filter by Search Query
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (category && category !== 'All' && category.trim()) {
      const cat = category.trim().toLowerCase();
      result = result.filter(p => p.category.toLowerCase() === cat);
    }

    // Sort by Price or Rating
    if (sort === 'low-to-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'high-to-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      result.sort((a, b) => b.id - a.id);
    }

    // Limit results if requested
    if (limit && !isNaN(parseInt(limit))) {
      result = result.slice(0, parseInt(limit));
    }

    // Extract categories list for easy filter building
    const categories = Array.from(new Set(products.map(p => p.category)));

    return res.status(200).json({
      success: true,
      count: result.length,
      totalCount: products.length,
      categories,
      products: result
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch products." });
  }
});

/**
 * GET /api/products/:id
 * Retrieve single product by numeric ID
 */
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  if (isNaN(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID format." });
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  // Related products from same category
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return res.status(200).json({
    success: true,
    product,
    related
  });
});

/**
 * POST /api/products/validate-cart
 * Validate cart items against live product catalog (prices, stock availability)
 */
app.post('/api/products/validate-cart', (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Cart items must be an array." });
    }

    const validatedItems = [];
    let warnings = [];
    let subtotal = 0;

    for (const item of items) {
      const product = products.find(p => p.id === parseInt(item.productId));
      if (!product) {
        warnings.push(`Item ID #${item.productId} is no longer available and was removed.`);
        continue;
      }

      let requestedQty = Math.max(1, parseInt(item.quantity) || 1);
      if (product.stock === 0) {
        warnings.push(`"${product.name}" is currently out of stock.`);
        continue;
      }

      if (requestedQty > product.stock) {
        warnings.push(`Only ${product.stock} units of "${product.name}" are in stock. Adjusted quantity.`);
        requestedQty = product.stock;
      }

      const itemSubtotal = product.price * requestedQty;
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        quantity: requestedQty,
        subtotal: itemSubtotal
      });
    }

    return res.status(200).json({
      success: true,
      items: validatedItems,
      subtotal,
      warnings
    });
  } catch (error) {
    console.error("Cart Validation Error:", error);
    return res.status(500).json({ success: false, message: "Failed to validate cart." });
  }
});

/**
 * POST /api/products (Admin Only)
 * Add a new product to catalogue
 */
app.post('/api/products', requireAdmin, (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Product name is required." });
    }
    if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return res.status(400).json({ success: false, message: "Valid positive price is required." });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: "Category is required." });
    }
    if (stock === undefined || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      return res.status(400).json({ success: false, message: "Valid stock quantity is required (0 or greater)." });
    }

    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name: name.trim(),
      description: (description || "").trim(),
      price: Math.round(parseFloat(price)),
      category: category.trim(),
      image: (image && image.trim()) ? image.trim() : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      stock: parseInt(stock),
      rating: 5.0,
      reviewsCount: 1
    };

    products.unshift(newProduct);

    return res.status(201).json({
      success: true,
      message: "Product added successfully to inventory.",
      product: newProduct
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    return res.status(500).json({ success: false, message: "Failed to add product." });
  }
});

/**
 * PUT /api/products/:id (Admin Only)
 * Update existing product details
 */
app.put('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const { name, description, price, category, image, stock } = req.body;

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ success: false, message: "Product name cannot be empty." });
      products[index].name = name.trim();
    }
    if (description !== undefined) {
      products[index].description = description.trim();
    }
    if (price !== undefined) {
      const p = parseFloat(price);
      if (isNaN(p) || p <= 0) return res.status(400).json({ success: false, message: "Valid positive price required." });
      products[index].price = Math.round(p);
    }
    if (category !== undefined) {
      if (!category.trim()) return res.status(400).json({ success: false, message: "Category cannot be empty." });
      products[index].category = category.trim();
    }
    if (image !== undefined && image.trim()) {
      products[index].image = image.trim();
    }
    if (stock !== undefined) {
      const s = parseInt(stock);
      if (isNaN(s) || s < 0) return res.status(400).json({ success: false, message: "Valid non-negative stock required." });
      products[index].stock = s;
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: products[index]
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update product." });
  }
});

/**
 * DELETE /api/products/:id (Admin Only)
 * Delete product from catalogue
 */
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const deletedProduct = products.splice(index, 1)[0];
    return res.status(200).json({
      success: true,
      message: `Product "${deletedProduct.name}" removed from inventory.`,
      product: deletedProduct
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete product." });
  }
});

// ==========================================
// API ROUTES: ORDERS
// ==========================================

/**
 * POST /api/orders
 * Create an order (Logged in customers)
 */
app.post('/api/orders', requireAuth, (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item." });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: "All shipping address fields are required." });
    }

    // Phone validation (10 digits)
    const phoneClean = shippingAddress.phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      return res.status(400).json({ success: false, message: "Please provide a valid 10-digit mobile number." });
    }

    // Recalculate and strictly verify each item from the server's authoritative in-memory array
    const verifiedOrderItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const prodId = parseInt(item.productId);
      const product = products.find(p => p.id === prodId);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID #${item.productId} was not found in catalog.`
        });
      }

      const qty = parseInt(item.quantity);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product "${product.name}".`
        });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${qty}.`
        });
      }

      const itemSubtotal = product.price * qty;
      calculatedSubtotal += itemSubtotal;

      verifiedOrderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price, // Live server authoritative price
        quantity: qty,
        subtotal: itemSubtotal,
        image: product.image
      });
    }

    // Deduct stock in memory atomically
    for (const item of verifiedOrderItems) {
      const targetProduct = products.find(p => p.id === item.productId);
      if (targetProduct) {
        targetProduct.stock -= item.quantity;
      }
    }

    // Generate unique order ID
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    nextOrderId++;
    const orderId = `ORD-${today}-${nextOrderId}`;

    const newOrder = {
      id: orderId,
      userId: req.user.userId,
      customerName: shippingAddress.fullName.trim(),
      customerEmail: req.user.email,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: phoneClean,
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: (shippingAddress.state || "").trim(),
        pincode: shippingAddress.pincode.trim()
      },
      items: verifiedOrderItems,
      itemsCount: verifiedOrderItems.reduce((acc, it) => acc + it.quantity, 0),
      subtotal: calculatedSubtotal,
      shippingFee: 0, // Free shipping
      tax: 0,
      total: calculatedSubtotal,
      paymentMethod: paymentMethod === 'cod' ? "Cash on Delivery" : "Cash on Delivery",
      paymentStatus: "Pending (Pay on Delivery)",
      orderStatus: "Processing",
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: newOrder.id,
      order: newOrder
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    return res.status(500).json({ success: false, message: "Failed to place order." });
  }
});

/**
 * GET /api/orders/my-orders
 * Retrieve current user's past orders
 */
app.get('/api/orders/my-orders', requireAuth, (req, res) => {
  try {
    const userOrders = orders
      .filter(o => o.userId === req.user.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: userOrders.length,
      orders: userOrders
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch orders." });
  }
});

/**
 * GET /api/orders/:id
 * Retrieve order details if owner or admin
 */
app.get('/api/orders/:id', requireAuth, (req, res) => {
  try {
    const orderId = req.params.id;
    const order = orders.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // Authorization check: owner or admin
    if (order.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access forbidden. You do not have permission to view this order."
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Get Order Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch order details." });
  }
});

// ==========================================
// API ROUTES: ADMIN DASHBOARD
// ==========================================

/**
 * GET /api/admin/dashboard
 * Aggregated statistics for admin panel
 */
app.get('/api/admin/dashboard', requireAdmin, (req, res) => {
  try {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => {
      // Calculate revenue for non-cancelled orders
      return o.orderStatus !== 'Cancelled' ? sum + o.total : sum;
    }, 0);

    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;

    // Status breakdown
    const orderStatusCounts = {
      Pending: orders.filter(o => o.orderStatus === 'Pending').length,
      Processing: orders.filter(o => o.orderStatus === 'Processing').length,
      Shipped: orders.filter(o => o.orderStatus === 'Shipped').length,
      Delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
      Cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length
    };

    // Category breakdown
    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    const recentOrders = orders.slice(0, 5);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        outOfStock,
        lowStock,
        orderStatusCounts,
        categoryCounts,
        totalCustomers: users.filter(u => u.role === 'customer').length
      },
      recentOrders
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return res.status(500).json({ success: false, message: "Failed to load dashboard metrics." });
  }
});

/**
 * GET /api/admin/orders
 * Retrieve all orders with filtering and search
 */
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  try {
    let result = [...orders];
    const { status, search } = req.query;

    if (status && status !== 'All') {
      result = result.filter(o => o.orderStatus.toLowerCase() === status.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.shippingAddress.phone.includes(q)
      );
    }

    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: result.length,
      orders: result
    });
  } catch (error) {
    console.error("Admin Orders Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch orders." });
  }
});

/**
 * PATCH /api/admin/orders/:id/status
 * Update an order's status
 */
app.patch('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = status;

    // If order was cancelled and was not already cancelled, restore stock
    if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
      for (const item of order.items) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          prod.stock += item.quantity;
        }
      }
    }
    // If order was cancelled and now changed back to active, deduct stock if available
    else if (oldStatus === 'Cancelled' && status !== 'Cancelled') {
      for (const item of order.items) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Order ${orderId} status updated to "${status}".`,
      order
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update order status." });
  }
});

// ==========================================
// 404 & FALLBACK HANDLER
// ==========================================

// Handle unknown API calls
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: "Requested API endpoint not found."
  });
});

// Catch-all for HTML routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 E-Commerce Store Server is running on port ${PORT}`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`-------------------------------------------------------`);
    console.log(`🔑 Demo Admin Credentials:`);
    console.log(`   Email:    admin@eshop.com`);
    console.log(`   Password: AdminPassword123`);
    console.log(`-------------------------------------------------------`);
    console.log(`👤 Demo Customer Credentials:`);
    console.log(`   Email:    customer@eshop.com`);
    console.log(`   Password: CustomerPass123`);
    console.log(`-------------------------------------------------------`);
    console.log(`💾 Architecture: In-Memory Storage (Resets on restart)`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
