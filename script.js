// Static product catalog provided in assignment requirements.
const products = [
  { id: 1, name: "Tomatoes", category: "Vegetables", price: 30, unit: "500g", inStock: true, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80" },
  { id: 2, name: "Spinach", category: "Vegetables", price: 25, unit: "250g", inStock: true, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80" },
  { id: 3, name: "Bananas", category: "Fruits", price: 45, unit: "Dozen", inStock: true, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80" },
  { id: 4, name: "Apples", category: "Fruits", price: 120, unit: "1 kg", inStock: true, image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80" },
  { id: 5, name: "Whole Milk", category: "Dairy", price: 60, unit: "500 ml", inStock: true, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80" },
  { id: 6, name: "Paneer", category: "Dairy", price: 90, unit: "200g", inStock: false, image: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?auto=format&fit=crop&w=900&q=80" },
  { id: 7, name: "Brown Eggs", category: "Dairy", price: 80, unit: "6 pcs", inStock: true, image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=80" },
  { id: 8, name: "Coriander", category: "Herbs", price: 15, unit: "Bunch", inStock: true, image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=900&q=80" }
];

// Business constant for order total calculation.
const deliveryCharge = 40;
const cartStorageKey = "uh_cart";

// Cache DOM references once. Some elements exist only on specific pages.
const categoryFilter = document.getElementById("categoryFilter");
const productGrid = document.getElementById("productGrid");
const cartList = document.getElementById("cartList");
const summary = document.getElementById("summary");
const cartCount = document.getElementById("cartCount");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const message = document.getElementById("message");

// Fast lookup to avoid repeating product array searches.
function getProductById(productId) {
  return products.find((product) => product.id === Number(productId));
}

// Read cart from localStorage; fall back safely if parsing fails.
function getCart() {
  const stored = localStorage.getItem(cartStorageKey);

  try {
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

// Convert cart object into normalized lines with product details.
function getCartLines() {
  const cart = getCart();
  return Object.entries(cart)
    .map(([id, qty]) => {
      const item = getProductById(id);
      if (!item) return null;
      return { id: Number(id), item, qty: Number(qty) };
    })
    .filter(Boolean);
}

function addToCart(productId) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
  if (message) message.textContent = "";
  renderAll();
}

function updateQuantity(productId, delta) {
  const cart = getCart();
  const current = cart[productId] || 0;
  const next = current + delta;

  if (next <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = next;
  }

  saveCart(cart);
  renderAll();
}

function removeItem(productId) {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
  renderAll();
}

// Populate category dropdown only on home page.
function initCategories() {
  if (!categoryFilter) return;

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  categoryFilter.innerHTML = categories.map((c) => `<option value="${c}">${c}</option>`).join("");
  categoryFilter.addEventListener("change", renderProducts);
}

function renderProducts() {
  if (!productGrid) return;

  const selected = categoryFilter?.value || "All";
  const filtered = selected === "All" ? products : products.filter((p) => p.category === selected);

  productGrid.innerHTML = filtered
    .map(
      (p) => `
      <article class="product-card ${p.inStock ? "" : "out"}">
        <img class="product-image" src="${p.image}" alt="${p.name}" />
        <div class="product-content">
          <h3>${p.name}</h3>
          <p class="meta">${p.category} | ${p.unit}</p>
          <p class="meta">Price: ₹${p.price}</p>
          <p class="meta">${p.inStock ? "In stock" : "Out of stock"}</p>
          <button ${p.inStock ? "" : "disabled"} onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </article>
    `
    )
    .join("");
}

function renderCart() {
  if (!cartList) return;

  const lines = getCartLines();

  if (lines.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartList.innerHTML = lines
    .map(({ id, qty, item }) => {
      return `
        <div class="cart-item">
          <strong>${item.name}</strong>
          <p class="meta">₹${item.price} x ${qty} = ₹${item.price * qty}</p>
          <div class="qty-controls">
            <button onclick="updateQuantity(${id}, -1)">-</button>
            <button onclick="updateQuantity(${id}, 1)">+</button>
            <button class="remove-btn" onclick="removeItem(${id})">Remove</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderSummary() {
  if (!summary || !placeOrderBtn) return;

  const lines = getCartLines().map(({ item, qty }) => ({ name: item.name, qty, price: item.price }));

  const subtotal = lines.reduce((sum, line) => sum + line.qty * line.price, 0);
  const total = subtotal + (lines.length ? deliveryCharge : 0);

  if (!lines.length) {
    summary.innerHTML = "<p>No items in cart.</p>";
  } else {
    summary.innerHTML = `
      ${lines
        .map(
          (line) =>
            `<div class="summary-row"><span>${line.name} x ${line.qty}</span><span>₹${line.qty * line.price}</span></div>`
        )
        .join("")}
      <hr>
      <div class="summary-row"><span>Subtotal</span><span>₹${subtotal}</span></div>
      <div class="summary-row"><span>Delivery</span><span>₹${deliveryCharge}</span></div>
      <div class="summary-row"><strong>Total</strong><strong>₹${total}</strong></div>
    `;
  }

  placeOrderBtn.disabled = lines.length === 0;
}

function renderCount() {
  if (!cartCount) return;
  const cart = getCart();
  const count = Object.values(cart).reduce((sum, qty) => sum + Number(qty), 0);
  cartCount.textContent = count;
}

function renderAll() {
  renderProducts();
  renderCart();
  renderSummary();
  renderCount();
}

if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", () => {
    localStorage.removeItem(cartStorageKey);
    if (message) message.textContent = "Order placed successfully. Fresh groceries are on the way.";
    renderAll();
  });
}

// Initialize current page view and expose handlers used by inline onclick.
initCategories();
renderAll();

window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
