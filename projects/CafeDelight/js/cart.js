(() => {
  // Shared site-wide cart. This script intentionally uses the global lexical
  // bindings created by config.js and menu.js (CAFE_CONFIG / MENU_ITEMS).
  if (typeof MENU_ITEMS === 'undefined' || typeof CAFE_CONFIG === 'undefined') return;

  let cart = [];
  try {
    const stored = JSON.parse(localStorage.getItem('cafeDelightCart') || '[]');
    cart = Array.isArray(stored) ? stored : [];
  } catch {
    cart = [];
  }

  const money = value => `${CAFE_CONFIG.currency}${Number(value).toFixed(2)}`;
  const itemById = id => MENU_ITEMS.find(item => item.id === id);

  const drawer = document.createElement('div');
  drawer.className = 'cart-drawer';
  drawer.id = 'siteCartDrawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML = `
    <div class="cart-backdrop" data-cart-close></div>
    <aside class="cart-panel" aria-label="Your order" role="dialog" aria-modal="true">
      <div class="cart-head">
        <div><p class="eyebrow">Your order</p><h3>Order basket</h3></div>
        <button type="button" data-cart-close aria-label="Close order basket">×</button>
      </div>
      <div class="cart-items" id="siteCartItems"></div>
      <div class="cart-foot">
        <div><span>Subtotal</span><strong id="siteCartTotal">${money(0)}</strong></div>
        <button class="btn btn-primary" type="button" id="siteCheckoutBtn">Place Order</button>
      </div>
    </aside>`;
  document.body.appendChild(drawer);

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.id = 'siteToast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);

  const button = document.querySelector('#cartButton');
  const itemsEl = drawer.querySelector('#siteCartItems');
  const totalEl = drawer.querySelector('#siteCartTotal');
  const checkout = drawer.querySelector('#siteCheckoutBtn');
  const countEl = button ? button.querySelector('#cartCount, span') : null;

  function save() {
    localStorage.setItem('cafeDelightCart', JSON.stringify(cart));
  }

  function count() {
    return cart.reduce((sum, row) => sum + Number(row.qty || 0), 0);
  }

  function cleanCart() {
    cart = cart
      .map(row => ({ id: row.id, qty: Math.max(0, Number(row.qty) || 0) }))
      .filter(row => itemById(row.id) && row.qty > 0);
  }

  function render() {
    cleanCart();
    save();

    const detailed = cart.map(row => ({ ...row, item: itemById(row.id) }));
    const total = detailed.reduce((sum, row) => sum + row.qty * row.item.price, 0);

    if (countEl) countEl.textContent = count();
    totalEl.textContent = money(total);
    checkout.disabled = detailed.length === 0;

    itemsEl.innerHTML = detailed.length
      ? detailed.map(row => `
        <div class="cart-row">
          <img src="${row.item.image}" alt="${row.item.name}">
          <div>
            <strong>${row.item.name}</strong>
            <small>${money(row.item.price)} each</small>
            <div class="qty">
              <button type="button" data-qty="${row.id}" data-delta="-1" aria-label="Decrease ${row.item.name}">−</button>
              <span>${row.qty}</span>
              <button type="button" data-qty="${row.id}" data-delta="1" aria-label="Increase ${row.item.name}">+</button>
            </div>
          </div>
          <b>${money(row.item.price * row.qty)}</b>
        </div>`).join('')
      : '<div class="cart-empty">Your order basket is empty.<br><span>Choose something delicious from the menu.</span></div>';
  }

  function open() {
    render();
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
  }

  function close() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function add(id) {
    const item = itemById(id);
    if (!item) return;

    const row = cart.find(entry => entry.id === id);
    if (row) row.qty += 1;
    else cart.push({ id, qty: 1 });

    save();
    render();
    open();
    showToast(`${item.name} added to your order`);
  }

  window.CafeCart = { add, open, close, render };

  if (button) {
    button.addEventListener('click', event => {
      event.preventDefault();
      open();
    });
  }

  drawer.addEventListener('click', event => {
    if (event.target.closest('[data-cart-close]')) {
      close();
      return;
    }

    const qtyButton = event.target.closest('[data-qty]');
    if (!qtyButton) return;

    const row = cart.find(entry => entry.id === qtyButton.dataset.qty);
    if (!row) return;

    row.qty += Number(qtyButton.dataset.delta);
    if (row.qty <= 0) cart = cart.filter(entry => entry !== row);
    save();
    render();
  });

  checkout.addEventListener('click', () => {
    if (!cart.length) return;

    localStorage.setItem('cafeDelightLastOrder', JSON.stringify({
      items: cart,
      placedAt: new Date().toISOString()
    }));

    cart = [];
    save();
    render();
    close();
    showToast('Order received — we’ll have it ready shortly.');
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drawer.classList.contains('open')) close();
  });

  render();
})();
