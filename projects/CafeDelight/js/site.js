(() => {
  const toggle = document.querySelector('#menuToggle');
  const nav = document.querySelector('#navLinks');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('#navLinks a').forEach(link => link.addEventListener('click', () => nav?.classList.remove('open')));

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('[data-scroll-to]').forEach(btn => btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.scrollTo);
    target?.scrollIntoView({ behavior: 'smooth' });
  }));

  const form = document.querySelector('#contactForm');
  const status = document.querySelector('#formStatus');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    localStorage.setItem('cafeDelightLastMessage', JSON.stringify({ ...data, sentAt: new Date().toISOString() }));
    if (status) status.textContent = 'Thanks! Your message has been sent successfully.';
    form.reset();
  });

  const reservation = document.querySelector('#reservationForm');
  const reservationStatus = document.querySelector('#reservationStatus');
  if (reservation) reservation.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(reservation));
    localStorage.setItem('cafeDelightReservation', JSON.stringify({ ...data, bookedAt: new Date().toISOString() }));
    if (reservationStatus) reservationStatus.textContent = 'Your table request has been received. We look forward to seeing you.';
    reservation.reset();
  });
})();


