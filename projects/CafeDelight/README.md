# Café Delight

A modular, multi-page café website built with HTML, CSS and vanilla JavaScript.

## Project structure

- `index.html` — homepage
- `menu.html` — full menu, search, filters and order basket
- `about.html` — café story and values
- `gallery.html` — photo gallery
- `reservations.html` — reservation request form
- `contact.html` — contact form and visit details
- `css/style.css` — shared visual system and responsive styles
- `js/config.js` — café-wide settings such as name, contact details and currency
- `js/site.js` — shared navigation, forms and small site-wide behavior
- `js/home.js` — homepage-only content rendering
- `js/app.js` — menu filtering, search, cart and order behavior
- `data/menu.js` — menu items and reviews
- `assets/images/` — place for local image assets when you want to replace the remote images

## Where to edit

### Change café details
Edit `js/config.js`.

### Add or change food/drinks
Edit `data/menu.js`. Add an item to `MENU_ITEMS` and the menu page will render it automatically.

### Change navigation/pages
Edit the navigation block in the HTML files. Each page is intentionally separate so a developer can maintain sections independently.

### Change appearance
Edit `css/style.css`.

### Change interactions
Edit `js/site.js` for shared behavior, `js/home.js` for homepage behavior, or `js/app.js` for menu/order behavior.

## Why folders are used

Keeping CSS, JavaScript, data and assets in dedicated folders is the more maintainable approach for a growing website. It prevents the project root from becoming crowded and makes responsibilities obvious to another developer.

For a small one-page exercise, a flat structure is acceptable. For a portfolio/client project with multiple pages, the folder structure used here is more professional and scalable.

## Shared cart and gallery
- `js/cart.js` powers the same order drawer on every page.
- The floating cart button never navigates away; it opens the drawer on the current page.
- `js/gallery.js` powers the in-page full-size gallery lightbox.
- Gallery previews block normal drag/context-menu interactions. Web pages cannot guarantee that an image is technically impossible to save, but the gallery provides a view-only presentation without a download button or separate image page.
