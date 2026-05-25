// =============================================
//  QR-MENU — script.js
//  Тағамдар, себет, тапсырыс, төлем логикасы
// =============================================

// -------- MENU DATA --------
const menuItems = [
  // САЛАТТАР
  { id: 1, name: "Цезарь салаты", desc: "Тауық еті, пармезан, крутон, цезарь соусы", price: 2800, category: "salad", emoji: "🥗", tags: [] },
  { id: 2, name: "Грек салаты", desc: "Қияр, помидор, зәйтүн, фета ірімшігі", price: 2200, category: "salad", emoji: "🫒", tags: ["veg"] },
  { id: 3, name: "Vinaigrette", desc: "Қызылша, картоп, сәбіз, тұздалған қияр", price: 1500, category: "salad", emoji: "🥙", tags: ["veg"] },

  // СОРПАЛАР
  { id: 4, name: "Қазақша сорпа", desc: "Мал еті, картоп, пияз, дәмдеуіштер", price: 2000, category: "soup", emoji: "🍲", tags: ["hot"] },
  { id: 5, name: "Борщ", desc: "Сиыр еті, қызылша, қырыққабат, бал қаймақ", price: 1800, category: "soup", emoji: "🥣", tags: ["hot"] },
  { id: 6, name: "Шорпа", desc: "Қой еті, жылқы еті, картоп, шөп", price: 2400, category: "soup", emoji: "🍜", tags: ["hot"] },

  // НЕГІЗГІ
  { id: 7, name: "Бешбармақ", desc: "Қой еті, жылқы еті, жуа пиязы, жалпақ кеспе", price: 5500, category: "main", emoji: "🍖", tags: ["hot"] },
  { id: 8, name: "Манты", desc: "Қой еті толтырылған бумен пісірілген тесте", price: 3200, category: "main", emoji: "🥟", tags: ["hot"] },
  { id: 9, name: "Стейк", desc: "Сиыр еті стейкі, картоп пюресі, гарнир", price: 8900, category: "main", emoji: "🥩", tags: ["hot"] },
  { id: 10, name: "Пилав", desc: "Қой еті, сәбіз, пияз, дәмдеуіштер", price: 3800, category: "main", emoji: "🍚", tags: [] },
  { id: 11, name: "Лагман", desc: "Тартылған ет, көкөніс, қол жасалған кеспе", price: 3000, category: "main", emoji: "🍝", tags: ["hot"] },

  // ДЕСЕРТ
  { id: 12, name: "Шақпақ баурсақ", desc: "Дәстүрлі қазақ тәтті нан, бал мен қаймақпен", price: 1200, category: "dessert", emoji: "🍩", tags: [] },
  { id: 13, name: "Чизкейк", desc: "Нью-Йорк стиліндегі чизкейк, жидек жамылғысымен", price: 2100, category: "dessert", emoji: "🍰", tags: ["veg"] },
  { id: 14, name: "Шоколад торт", desc: "Бельгия шоколады, креммен безендірілген", price: 2400, category: "dessert", emoji: "🎂", tags: ["veg"] },

  // СУСЫНДАР
  { id: 15, name: "Қымыз", desc: "Дәстүрлі биенің сүтінен дайындалған", price: 900, category: "drink", emoji: "🥛", tags: ["veg"] },
  { id: 16, name: "Шай (Қара/Жасыл)", desc: "Дәстүрлі шәйнекте, сүтпен немесе тазалай", price: 600, category: "drink", emoji: "🍵", tags: ["veg"] },
  { id: 17, name: "Лимонад", desc: "Лимон, нане, газдалған су, мұзды", price: 1100, category: "drink", emoji: "🍋", tags: ["veg"] },
  { id: 18, name: "Кофе (Капучино)", desc: "Эспрессо, бу сүті, сүт köбігі", price: 1400, category: "drink", emoji: "☕", tags: [] },
];

// -------- STATE --------
let cart = {};         // { itemId: quantity }
let currentCategory = 'all';

// -------- INIT --------
document.addEventListener('DOMContentLoaded', () => {
  renderMenu(menuItems);
});

// -------- RENDER MENU --------
function renderMenu(items) {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1;padding:40px">Тағам табылмады 😔</p>';
    return;
  }

  items.forEach((item, i) => {
    const qty = cart[item.id] || 0;
    const tagsHTML = item.tags.map(t =>
      `<span class="tag ${t}">${t === 'hot' ? '🌶 Ыстық' : '🌿 Вегетариандық'}</span>`
    ).join('');

    const card = document.createElement('div');
    card.className = 'food-card';
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div class="food-img">${item.emoji}</div>
      <div class="food-body">
        ${tagsHTML ? `<div class="food-tags">${tagsHTML}</div>` : ''}
        <div class="food-name">${item.name}</div>
        <div class="food-desc">${item.desc}</div>
        <div class="food-footer">
          <div class="food-price">${formatPrice(item.price)} ₸</div>
          <div id="ctrl-${item.id}">
            ${qty === 0
              ? `<button class="add-btn" onclick="addToCart(${item.id})">+ Қосу</button>`
              : `<div class="counter">
                   <button class="counter-btn" onclick="changeQty(${item.id}, -1)">−</button>
                   <span class="counter-num">${qty}</span>
                   <button class="counter-btn" onclick="changeQty(${item.id}, +1)">+</button>
                 </div>`
            }
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// -------- FILTER --------
function filterCategory(cat) {
  currentCategory = cat;

  // Update active button
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  const filtered = cat === 'all' ? menuItems : menuItems.filter(i => i.category === cat);
  renderMenu(filtered);
}

// -------- CART ACTIONS --------
function addToCart(id) {
  cart[id] = 1;
  updateCartUI();
  updateCardControl(id);
  animateCartBtn();
}

function changeQty(id, delta) {
  const newQty = (cart[id] || 0) + delta;
  if (newQty <= 0) {
    delete cart[id];
  } else {
    cart[id] = newQty;
  }
  updateCartUI();
  updateCardControl(id);
}

function updateCardControl(id) {
  const ctrl = document.getElementById(`ctrl-${id}`);
  if (!ctrl) return;
  const qty = cart[id] || 0;
  if (qty === 0) {
    ctrl.innerHTML = `<button class="add-btn" onclick="addToCart(${id})">+ Қосу</button>`;
  } else {
    ctrl.innerHTML = `
      <div class="counter">
        <button class="counter-btn" onclick="changeQty(${id}, -1)">−</button>
        <span class="counter-num">${qty}</span>
        <button class="counter-btn" onclick="changeQty(${id}, +1)">+</button>
      </div>`;
  }
}

function animateCartBtn() {
  const count = document.getElementById('cartCount');
  count.classList.remove('pop');
  void count.offsetWidth; // reflow
  count.classList.add('pop');
}

// -------- UPDATE CART UI --------
function updateCartUI() {
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById('cartCount').textContent = totalItems;

  const cartItemsEl = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');

  if (totalItems === 0) {
    cartItemsEl.innerHTML = `<div class="empty-cart"><span>🍽️</span><p>Себет бос</p></div>`;
    cartFooter.style.display = 'none';
    return;
  }

  cartFooter.style.display = 'flex';
  cartItemsEl.innerHTML = '';

  Object.entries(cart).forEach(([id, qty]) => {
    const item = menuItems.find(m => m.id === parseInt(id));
    if (!item) return;

    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">${formatPrice(item.price * qty)} ₸</div>
      </div>
      <div class="ci-controls">
        <button class="counter-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="counter-num">${qty}</span>
        <button class="counter-btn" onclick="changeQty(${item.id}, +1)">+</button>
      </div>
    `;
    cartItemsEl.appendChild(el);
  });

  document.getElementById('totalPrice').textContent = formatPrice(getTotal()) + ' ₸';
}

// -------- TOTAL --------
function getTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find(m => m.id === parseInt(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);
}

// -------- TOGGLE CART --------
function toggleCart() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  panel.classList.toggle('open');
  overlay.classList.toggle('active');
  document.body.style.overflow = panel.classList.contains('open') ? 'hidden' : '';
}

// -------- PLACE ORDER --------
function placeOrder() {
  if (Object.keys(cart).length === 0) return;

  // Close cart
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';

  // Generate order ID
  const orderId = 'QR-' + Math.floor(Math.random() * 9000 + 1000);
  document.getElementById('orderId').textContent = orderId;

  // Build summary
  const lines = Object.entries(cart).map(([id, qty]) => {
    const item = menuItems.find(m => m.id === parseInt(id));
    return `${item.emoji} ${item.name} × ${qty}`;
  });
  document.getElementById('modalMsg').textContent = lines.join(' | ');

  // Show modal
  document.getElementById('modalOverlay').classList.add('active');
}

// -------- SHOW PAYMENT --------
function showPayment() {
  document.getElementById('modalOverlay').classList.remove('active');
  
  const totalAmount = getTotal();
  document.getElementById('payAmount').textContent = formatPrice(totalAmount) + ' ₸';
  
  const qrImage = document.getElementById('kaspiQrImage');
  if (qrImage) {
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=KaspiPay_Amount_${totalAmount}_KZT`;
  }

  document.getElementById('paymentOverlay').classList.add('active');
}

// -------- SELECT PAY METHOD --------
function selectPayMethod(btn, method) {
  document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('cardForm').style.display  = method === 'card'  ? 'flex' : 'none';
  document.getElementById('kaspiForm').style.display = method === 'kaspi' ? 'flex' : 'none';
  document.getElementById('cashForm').style.display  = method === 'cash'  ? 'flex' : 'none';
}

// -------- FORMAT CARD NUMBER --------
function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

// -------- CONFIRM PAYMENT --------
function confirmPayment() {
  document.getElementById('paymentOverlay').classList.remove('active');
  document.getElementById('paidOverlay').classList.add('active');
}

function closePayment() {
  document.getElementById('paymentOverlay').classList.remove('active');
}

// -------- RESET ALL --------
function resetAll() {
  cart = {};
  document.getElementById('paidOverlay').classList.remove('active');
  document.getElementById('cartCount').textContent = '0';
  updateCartUI();
  // Re-render to reset all + buttons
  const filtered = currentCategory === 'all'
    ? menuItems
    : menuItems.filter(i => i.category === currentCategory);
  renderMenu(filtered);
}

// -------- HELPERS --------
function formatPrice(n) {
  return n.toLocaleString('kk-KZ');
}
