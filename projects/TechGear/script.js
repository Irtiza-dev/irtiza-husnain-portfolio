/* TechGear — storefront interactions and customer account persistence. */
(function () {
  'use strict';

  const CART_KEY = 'techgearCart';
  const USER_KEY = 'techgearUser';

  const readJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  const saveJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const getCart = () => readJSON(CART_KEY, []);
  const saveCart = cart => saveJSON(CART_KEY, cart);

  function showToast(message, type = 'default') {
    let toast = document.querySelector('#toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast'; toast.className = 'toast'; toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.className = 'toast ' + type;
    toast.textContent = message;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(window.techGearToastTimer);
    window.techGearToastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function updateProfileUI() {
    const user = readJSON(USER_KEY, null);
    document.querySelectorAll('[data-profile-label]').forEach(el => el.textContent = user?.name ? user.name.split(' ')[0] : 'Account');
    document.querySelectorAll('[data-account-name]').forEach(el => el.textContent = user?.name || 'Guest User');
    document.querySelectorAll('[data-account-email]').forEach(el => el.textContent = user?.email || 'Not signed in');
    document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = getCart().reduce((sum, item) => sum + item.qty, 0));
  }

  function initNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(open));
      });
      navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));
    }
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const target = link.getAttribute('href');
      if (target === current) { link.classList.add('active'); link.setAttribute('aria-current', 'page'); }
    });
  }

  function initReveal() {
    const items = document.querySelectorAll('.reveal:not(.visible)');
    if (!items.length) return;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      }), { threshold: 0.08 });
      items.forEach(item => observer.observe(item));
    } else items.forEach(item => item.classList.add('visible'));
  }

  function initSearch() {
    const search = document.querySelector('#search');
    const grid = document.querySelector('#productGrid');
    if (!search || !grid) return;

    const cards = [...grid.querySelectorAll('.product-card[data-search]')];
    const empty = document.querySelector('#emptyState');

    const normalize = value => value.toLowerCase().replace(/[-_/]+/g, ' ').replace(/\s+/g, ' ').trim();

    const filter = () => {
      const query = normalize(search.value);
      let visibleCount = 0;

      cards.forEach(card => {
        const haystack = normalize(`${card.dataset.search || ''} ${card.textContent || ''}`);
        const compactHaystack = haystack.replace(/\s/g, '');
        const compactQuery = query.replace(/\s/g, '');
        const matches = !query || haystack.includes(query) || compactHaystack.includes(compactQuery);

        // Use an explicit display value so the site's card layout cannot override filtering.
        card.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
      });

      if (empty) empty.style.display = visibleCount === 0 && query ? '' : 'none';
    };

    search.addEventListener('input', filter);
    search.addEventListener('search', filter);
    filter();
  }

  function addToCart(button) {
    const name = button.dataset.productName || button.closest('.detail-info')?.querySelector('h1')?.textContent.trim() || 'TechGear Product';
    const price = Number(button.dataset.productPrice || (button.closest('.detail-info')?.querySelector('.detail-price')?.textContent.replace(/[^0-9.]/g, '') || 0));
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty += 1; else cart.push({ name, price, qty: 1 });
    saveCart(cart); updateProfileUI(); showToast(`${name} added to your cart.`);
  }

  function initCartButtons() {
    document.querySelectorAll('[data-add-cart]').forEach(button => button.addEventListener('click', () => addToCart(button)));
  }

  function initContactForm() {
    const form = document.querySelector('#contactForm');
    const msg = document.querySelector('#formMessage');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (msg) msg.textContent = 'Message sent successfully. Thank you for contacting TechGear.';
      showToast('Message sent successfully.');
      form.reset();
    });
  }

  function initLogin() {
    const form = document.querySelector('#loginForm');
    const msg = document.querySelector('#loginMessage');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.querySelector('#loginName').value.trim();
      const email = document.querySelector('#loginEmail').value.trim();
      saveJSON(USER_KEY, { name, email });
      if (msg) msg.textContent = 'Sign-in successful. Your account is ready to use.';
      updateProfileUI();
      showToast(`Welcome back, ${name.split(' ')[0]}!`);
      setTimeout(() => window.location.href = 'account.html', 650);
    });
  }

  function initAccount() {
    const logout = document.querySelector('#logoutButton');
    const user = readJSON(USER_KEY, null);
    if (logout && user) {
      logout.hidden = false;
      logout.addEventListener('click', () => { localStorage.removeItem(USER_KEY); updateProfileUI(); showToast('You have been signed out of your account.'); setTimeout(() => location.reload(), 450); });
    }
    const loginAction = document.querySelector('[data-login-action]');
    if (loginAction && user) { loginAction.textContent = 'Account Dashboard'; loginAction.href = 'account.html'; }
  }

  function renderCheckout() {
    const list = document.querySelector('#cartItems');
    const empty = document.querySelector('#cartEmpty');
    const totalEl = document.querySelector('#cartTotal');
    const button = document.querySelector('#placeOrderButton');
    if (!list || !empty || !totalEl) return;
    const cart = getCart();
    list.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.qty;
      const row = document.createElement('div'); row.className = 'cart-row';
      row.innerHTML = `<div><strong>${item.name}</strong><span>$${item.price.toFixed(2)} each</span></div><div class="cart-row-actions"><button type="button" data-minus="${index}" aria-label="Decrease quantity">−</button><b>${item.qty}</b><button type="button" data-plus="${index}" aria-label="Increase quantity">+</button><strong>$${(item.price * item.qty).toFixed(2)}</strong><button class="remove-cart" type="button" data-remove="${index}">Remove</button></div>`;
      list.appendChild(row);
    });
    empty.hidden = cart.length !== 0; list.hidden = cart.length === 0; totalEl.textContent = `$${total.toFixed(2)}`;
    if (button) button.disabled = cart.length === 0;
    list.querySelectorAll('[data-plus]').forEach(b => b.addEventListener('click', () => { const c=getCart(); c[+b.dataset.plus].qty++; saveCart(c); renderCheckout(); updateProfileUI(); }));
    list.querySelectorAll('[data-minus]').forEach(b => b.addEventListener('click', () => { const c=getCart(), i=+b.dataset.minus; c[i].qty--; if(c[i].qty<=0)c.splice(i,1); saveCart(c); renderCheckout(); updateProfileUI(); }));
    list.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => { const c=getCart(); c.splice(+b.dataset.remove,1); saveCart(c); renderCheckout(); updateProfileUI(); showToast('Item removed from your cart.'); }));
  }

  function initCheckout() {
    renderCheckout();
    const form = document.querySelector('#checkoutForm');
    const msg = document.querySelector('#checkoutMessage');
    if (!form) return;
    const user = readJSON(USER_KEY, null);
    if (user) { document.querySelector('#checkoutName').value = user.name || ''; document.querySelector('#checkoutEmail').value = user.email || ''; }
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!getCart().length) { if(msg) msg.textContent='Your cart is empty. Please add a product first.'; return; }
      const reference = 'TG-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      sessionStorage.setItem('techgearOrderReference', reference);
      saveCart([]); updateProfileUI();
      window.location.href = 'order-success.html';
    });
  }

  function initSuccess() {
    const ref = sessionStorage.getItem('techgearOrderReference');
    document.querySelectorAll('[data-order-reference]').forEach(el => el.textContent = ref || 'TG-ORDER');
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav(); initReveal(); initSearch(); initCartButtons(); initContactForm(); initLogin(); initAccount(); initCheckout(); initSuccess(); updateProfileUI();
  });
})();
