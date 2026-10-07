(() => {
  const navToggle = document.querySelector('#navToggle');
  const navLinks = document.querySelector('#navLinks');
  navToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open menu');
  }));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  const filterButtons = [...document.querySelectorAll('.filter-btn')];
  const projects = [...document.querySelectorAll('.project')];
  const filterEmpty = document.querySelector('#filterEmpty');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
    const filter = button.dataset.filter;
    let visible = 0;
    projects.forEach(project => {
      const match = filter === 'all' || project.dataset.category === filter;
      project.hidden = !match;
      if (match) visible++;
    });
    if (filterEmpty) filterEmpty.hidden = visible !== 0;
  }));

  const projectData = {
    techgear: {
      title: 'TechGear',
      description: 'A complete technology storefront focused on a clean product experience and useful customer flows.',
      items: ['Responsive product catalogue with keyword search', 'Product detail pages for featured hardware', 'Client-side cart, quantity controls, checkout and order confirmation', 'Login and account UI with browser persistence', 'Contact and interface interactions built with vanilla JavaScript'],
      link: 'projects/techgear.html'
    },
    cafe: {
      title: 'Café Delight',
      description: 'A warm, multi-page café website designed around discovery, ordering, reservations, and atmosphere.',
      items: ['Dedicated Home, Menu, Story, Gallery, Reservations and Contact pages', 'Shared order basket with a right-side cart drawer', 'Featured menu items and menu search/filter behavior', 'Gallery lightbox for in-page image viewing', 'Reservation and contact interactions with browser persistence'],
      link: 'projects/cafe-delight.html'
    }
  };

  const modal = document.querySelector('#projectModal');
  const modalTitle = document.querySelector('#modalTitle');
  const modalDescription = document.querySelector('#modalDescription');
  const modalList = document.querySelector('#modalList');
  const modalLink = document.querySelector('#modalLink');
  const closeModal = () => { modal?.classList.remove('open'); modal?.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); };
  document.querySelectorAll('.details-btn').forEach(button => button.addEventListener('click', () => {
    const data = projectData[button.dataset.project];
    if (!data || !modal) return;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    modalList.innerHTML = data.items.map(item => `<div>${item}</div>`).join('');
    modalLink.href = data.link;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }));
  document.querySelectorAll('[data-modal-close]').forEach(element => element.addEventListener('click', closeModal));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

  const form = document.querySelector('#contactForm');
  const status = document.querySelector('#formStatus');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const subject = `Portfolio enquiry from ${data.name}`;
    const body = `Name: ${data.name}\nEmail: ${data.email}\n\nProject details:\n${data.message}`;
    const mailto = `mailto:irtizahusnain0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app with the message ready to send.';
    window.location.href = mailto;
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
