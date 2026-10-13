/**
 * Comprehensive Automated Test Suite for E-Commerce Mini Project
 * Validates all backend APIs, security guards, stock deductions, and business rules
 */

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log("==================================================");
  console.log("🧪 STARTING E-COMMERCE MINI PROJECT TEST SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. GET /api/products
    console.log("--- 1. Testing Products APIs ---");
    let res = await fetch(`${BASE_URL}/api/products`);
    let data = await res.json();
    assert(res.status === 200 && data.success && data.products.length >= 12, "Retrieve all products (minimum 12 items)");

    // Search
    res = await fetch(`${BASE_URL}/api/products?search=MacBook`);
    data = await res.json();
    assert(data.products.length >= 1 && data.products[0].name.includes("MacBook"), "Product search by name ('MacBook')");

    // Category filter
    res = await fetch(`${BASE_URL}/api/products?category=Electronics`);
    data = await res.json();
    const allElectronics = data.products.every(p => p.category === 'Electronics');
    assert(allElectronics && data.products.length >= 3, "Category filtering ('Electronics')");

    // Price Sort Low to High
    res = await fetch(`${BASE_URL}/api/products?sort=low-to-high`);
    data = await res.json();
    let isSortedAsc = true;
    for (let i = 0; i < data.products.length - 1; i++) {
      if (data.products[i].price > data.products[i + 1].price) isSortedAsc = false;
    }
    assert(isSortedAsc, "Price sorting (low-to-high)");

    // Single Product
    res = await fetch(`${BASE_URL}/api/products/1`);
    data = await res.json();
    assert(res.status === 200 && data.product.id === 1, "Retrieve single product details (ID: 1)");

    // 2. Authentication Testing
    console.log("\n--- 2. Testing Authentication & Session APIs ---");
    
    // Invalid Login
    res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'fake@eshop.com', password: 'WrongPassword' })
    });
    data = await res.json();
    assert(res.status === 401 && !data.success, "Invalid credentials rejection (401)");

    // Customer Login
    res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@eshop.com', password: 'CustomerPass123' })
    });
    data = await res.json();
    const customerToken = data.token;
    assert(res.status === 200 && data.success && customerToken, "Customer Login success and session token generation");

    // Register New User
    const testEmail = `test_${Date.now()}@example.com`;
    res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Student', email: testEmail, password: 'SecurePassword123' })
    });
    data = await res.json();
    const newStudentToken = data.token;
    assert(res.status === 201 && data.success, "New customer registration (201 Created)");

    // Duplicate Registration Prevention
    res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Duplicate User', email: testEmail, password: 'SecurePassword123' })
    });
    data = await res.json();
    assert(res.status === 409, "Duplicate email registration prevention (409 Conflict)");

    // Admin Login
    res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@eshop.com', password: 'AdminPassword123' })
    });
    data = await res.json();
    const adminToken = data.token;
    assert(res.status === 200 && data.user.role === 'admin' && adminToken, "Admin Login success with 'admin' role");

    // 3. Cart & Orders Testing
    console.log("\n--- 3. Testing Cart Validation & Order Processing ---");
    
    // Validate Cart
    res = await fetch(`${BASE_URL}/api/products/validate-cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { productId: 2, quantity: 2 },
          { productId: 6, quantity: 1 }
        ]
      })
    });
    data = await res.json();
    assert(data.success && data.items.length === 2 && data.subtotal > 0, "Server-side cart validation and subtotal recalculation");

    // Check stock of Product 2 before order
    let p2Res = await fetch(`${BASE_URL}/api/products/2`);
    let p2Data = await p2Res.json();
    const initialP2Stock = p2Data.product.stock;

    // Create Order with Customer Token
    res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        items: [{ productId: 2, quantity: 1 }],
        shippingAddress: {
          fullName: "Rahul Sharma",
          phone: "9876543210",
          street: "123 College Road",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560001"
        },
        paymentMethod: "cod"
      })
    });
    data = await res.json();
    const createdOrderId = data.orderId;
    assert(res.status === 201 && data.success && createdOrderId, `Order placed successfully (Order ID: ${createdOrderId})`);

    // Verify stock deduction
    p2Res = await fetch(`${BASE_URL}/api/products/2`);
    p2Data = await p2Res.json();
    assert(p2Data.product.stock === initialP2Stock - 1, `Inventory stock reduced atomically from ${initialP2Stock} to ${p2Data.product.stock}`);

    // Insufficient Stock Prevention
    res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        items: [{ productId: 2, quantity: 9999 }], // Exceeds available stock
        shippingAddress: {
          fullName: "Rahul Sharma",
          phone: "9876543210",
          street: "123 College Road",
          city: "Bengaluru",
          pincode: "560001"
        },
        paymentMethod: "cod"
      })
    });
    data = await res.json();
    assert(res.status === 400 && !data.success, "Insufficient stock rejection during checkout (400 Bad Request)");

    // Customer My Orders
    res = await fetch(`${BASE_URL}/api/orders/my-orders`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    data = await res.json();
    assert(res.status === 200 && data.orders.some(o => o.id === createdOrderId), "Customer can view their own orders");

    // Customer Isolation Check (New student should have 0 orders)
    res = await fetch(`${BASE_URL}/api/orders/my-orders`, {
      headers: { 'Authorization': `Bearer ${newStudentToken}` }
    });
    data = await res.json();
    assert(res.status === 200 && data.orders.length === 0, "Order history is securely isolated per user account");

    // 4. Admin Protection & Management
    console.log("\n--- 4. Testing Admin Dashboard & Security Guards ---");

    // Customer attempting to call Admin Dashboard -> 403 Forbidden
    res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(res.status === 403, "Customer token blocked from Admin Dashboard (403 Forbidden)");

    // Unauthenticated request to Admin Dashboard -> 401 Unauthorized
    res = await fetch(`${BASE_URL}/api/admin/dashboard`);
    assert(res.status === 401, "Unauthenticated request blocked from Admin Dashboard (401 Unauthorized)");

    // Admin Dashboard with Admin Token
    res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    data = await res.json();
    assert(res.status === 200 && data.stats.totalProducts >= 12 && data.stats.totalOrders >= 2, "Admin Dashboard statistics loaded with Admin Token");

    // Admin Add Product (POST)
    res = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: "Mechanical Gaming Keyboard RGB",
        description: "Hot-swappable switches with customizable per-key RGB backlighting.",
        price: 4999,
        category: "Electronics",
        stock: 30,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600"
      })
    });
    data = await res.json();
    const createdProduct = data.product;
    assert(res.status === 201 && createdProduct && createdProduct.id, `Admin successfully created new product (ID #${createdProduct.id})`);

    // Admin Update Product (PUT)
    res = await fetch(`${BASE_URL}/api/products/${createdProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        price: 4499,
        stock: 25
      })
    });
    data = await res.json();
    assert(res.status === 200 && data.product.price === 4499 && data.product.stock === 25, "Admin successfully updated product price and stock");

    // Admin Update Order Status (PATCH)
    res = await fetch(`${BASE_URL}/api/admin/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: "Shipped" })
    });
    data = await res.json();
    assert(res.status === 200 && data.order.orderStatus === "Shipped", `Admin updated order status to 'Shipped'`);

    // Admin Delete Product (DELETE)
    res = await fetch(`${BASE_URL}/api/products/${createdProduct.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    data = await res.json();
    assert(res.status === 200 && data.success, "Admin successfully deleted product from inventory");

    // Summary
    console.log("\n==================================================");
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");

  } catch (err) {
    console.error("Test execution encountered an error:", err);
  }
}

runTests();
