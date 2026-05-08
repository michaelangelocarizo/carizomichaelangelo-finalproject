const products = [
  { id: 1, name: "Wireless Headphones", price: 2499, emoji: "🎧" },
  { id: 2, name: "Mechanical Keyboard", price: 3200, emoji: "⌨️" },
  { id: 3, name: "Desk Lamp",           price: 850,  emoji: "💡" },
  { id: 4, name: "Coffee Tumbler",      price: 650,  emoji: "☕" },
  { id: 5, name: "Notebook Set",        price: 420,  emoji: "📓" },
  { id: 6, name: "USB-C Hub",           price: 1750, emoji: "🔌" },
];

let cart = {};

function fmt(n) {
  return "₱" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = products.map(p => {
    const inCart = !!cart[p.id];
    return `
      <div class="product-card">
        <div class="product-emoji">${p.emoji}</div>
        <div class="product-info">
          <p class="product-name">${p.name}</p>
          <p class="product-price">${fmt(p.price)}</p>
          <button
            class="add-btn ${inCart ? "in-cart" : "available"}"
            ${inCart ? "disabled" : `onclick="addToCart(${p.id})"`}
          >${inCart ? "Already in cart" : "Add to Cart"}</button>
        </div>
      </div>`;
  }).join("");
}

function renderCart() {
  const items     = Object.values(cart);
  const container = document.getElementById("cartItems");
  const footer    = document.getElementById("cartFooter");
  const badge     = document.getElementById("cartBadge");
  const totalEl   = document.getElementById("cartTotal");

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  badge.textContent = totalQty;
  badge.classList.add("pop");
  setTimeout(() => badge.classList.remove("pop"), 200);

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-msg">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty.<br>Add some items!</p>
      </div>`;
    footer.style.display = "none";
    return;
  }

  footer.style.display = "block";
  let total = 0;

  container.innerHTML = items.map(item => {
    const sub = item.price * item.qty;
    total += sub;
    return `
      <div class="cart-item">
        <div class="item-top">
          <span class="item-name">${item.emoji} ${item.name}</span>
          <button class="remove-btn" title="Remove item" onclick="removeItem(${item.id})">×</button>
        </div>
        <div class="item-bottom">
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
          <span class="item-subtotal">${fmt(sub)}</span>
        </div>
      </div>`;
  }).join("");

  totalEl.textContent = fmt(total);
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p || cart[id]) return;
  cart[id] = { ...p, qty: 1 };
  renderProducts();
  renderCart();
}

function removeItem(id) {
  delete cart[id];
  renderProducts();
  renderCart();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty < 1) { removeItem(id); return; }
  renderCart();
}

document.getElementById("clearCart").onclick = () => {
  cart = {};
  renderProducts();
  renderCart();
};

renderProducts();
renderCart();
