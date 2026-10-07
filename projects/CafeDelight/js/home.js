(() => {
  const grid = document.querySelector('#featuredMenu');
  const reviews = document.querySelector('#reviewsGrid');
  if (grid) grid.innerHTML = MENU_ITEMS.filter(x => x.featured).slice(0, 3).map(item => `<article class="mini-card"><img src="${item.image}" alt="${item.name}"><div><span>${item.category}</span><h3>${item.name}</h3><p>${item.description}</p><strong>${CAFE_CONFIG.currency}${item.price.toFixed(2)}</strong><button class="add-btn" type="button" data-home-add="${item.id}">Add to order <span>+</span></button></div></article>`).join('');
  if (grid) grid.addEventListener('click', e => { const button = e.target.closest('[data-home-add]'); if (button && window.CafeCart) window.CafeCart.add(button.dataset.homeAdd); });
  if (reviews) reviews.innerHTML = REVIEWS.map(r => `<article class="review-card"><div class="stars">★★★★★</div><p>“${r.quote}”</p><strong>${r.name}</strong><small>${r.detail}</small></article>`).join('');
})();
