(() => {
  const images = [...document.querySelectorAll('.gallery-page img')];
  if (!images.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <div class="gallery-lightbox-backdrop" data-gallery-close></div>
    <div class="gallery-lightbox-content" role="dialog" aria-modal="true" aria-label="Expanded gallery image">
      <button class="gallery-close" type="button" data-gallery-close aria-label="Close image">×</button>
      <img id="galleryLightboxImage" alt="">
    </div>`;
  document.body.appendChild(lightbox);

  const preview = lightbox.querySelector('#galleryLightboxImage');

  function open(image) {
    preview.src = image.currentSrc || image.src;
    preview.alt = image.alt || 'Café Delight gallery image';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    preview.removeAttribute('src');
  }

  images.forEach(image => {
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.addEventListener('click', () => open(image));
    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(image);
      }
    });
    image.addEventListener('contextmenu', event => event.preventDefault());
    image.addEventListener('dragstart', event => event.preventDefault());
  });

  lightbox.addEventListener('click', event => {
    if (event.target.closest('[data-gallery-close]')) close();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) close();
  });
})();
