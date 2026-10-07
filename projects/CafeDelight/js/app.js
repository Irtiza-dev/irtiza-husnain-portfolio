(() => {
  const menuGrid = document.querySelector('#menuGrid');
  if (!menuGrid) return;

  const state = { category: 'All', query: '' };
  const $ = s => document.querySelector(s);
  const filterTabs = $('#filterTabs');
  const menuSearch = $('#menuSearch');
  const menuEmpty = $('#menuEmpty');
  const categories = ['All', ...new Set(MENU_ITEMS.map(item => item.category))];
  const normalize = value => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, ' ');

  function renderFilters() {
    filterTabs.innerHTML = categories.map(category =>
      `<button type="button" class="filter-tab ${state.category === category ? 'active' : ''}" data-category="${category}">${category}</button>`
    ).join('');
  }

  function renderMenu() {
    const terms = normalize(state.query).split(/\s+/).filter(Boolean);
    const items = MENU_ITEMS.filter(item => {
      const searchable = normalize(`${item.name} ${item.category} ${item.description} ${item.ingredients}`);
      return (state.category === 'All' || item.category === state.category) && terms.every(term => searchable.includes(term));
    });

    menuGrid.innerHTML = items.map(item => `
      <article class="menu-card">
        <div class="menu-image-wrap">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          <span class="category-pill">${item.category}</span>
          ${item.featured ? '<span class="featured-pill">Popular</span>' : ''}
        </div>
        <div class="menu-card-body">
          <div class="menu-title"><h3>${item.name}</h3><strong>${CAFE_CONFIG.currency}${item.price.toFixed(2)}</strong></div>
          <p>${item.description}</p>
          <small>${item.ingredients}</small>
          <button class="add-btn" type="button" data-add="${item.id}">Add to order <span>+</span></button>
        </div>
      </article>`).join('');

    menuEmpty.hidden = items.length > 0;
  }

  filterTabs.addEventListener('click', e => {
    const button = e.target.closest('[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    renderFilters();
    renderMenu();
  });

  menuSearch.addEventListener('input', e => {
    state.query = e.target.value;
    renderMenu();
  });

  menuGrid.addEventListener('click', e => {
    const button = e.target.closest('[data-add]');
    if (!button || !window.CafeCart) return;
    window.CafeCart.add(button.dataset.add);
  });

  renderFilters();
  renderMenu();
})();
