
(function () {
    'use strict';
  
    const STORAGE_KEY = 'ngvv-cart';
  
    /* ===============================
     * Utilidades
     * =============================== */
  
    function slugify(str) {
      return String(str)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
  
    function moneyToNumber(str) {
      if (typeof str !== 'string') return Number(str) || 0;
      let cleaned = str.replace(/[^0-9.,-]/g, '');
      const comma = cleaned.lastIndexOf(',');
      const dot = cleaned.lastIndexOf('.');
      if (comma > dot) {
        // formato 1.234,56
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        // formato 1,234.56
        cleaned = cleaned.replace(/,/g, '');
      }
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
  
    function numberToMoney(num, currency = 'MXN') {
      return Number(num).toLocaleString('es-MX', { style: 'currency', currency });
    }
  
    /* ===============================
     * Carrito (localStorage)
     * =============================== */
  
    function loadCart() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { items: [] };
        const data = JSON.parse(raw);
        if (!Array.isArray(data.items)) data.items = [];
        return data;
      } catch {
        return { items: [] };
      }
    }
  
    function saveCart(cart) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      updateCartCountUI();
    }
  
    function findItemIndex(cart, id) {
      return cart.items.findIndex(it => it.id === id);
    }
  
    function addItem(product) {
      const cart = loadCart();
      const idx = findItemIndex(cart, product.id);
      if (idx >= 0) {
        cart.items[idx].qty += product.qty || 1;
      } else {
        cart.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          qty: product.qty || 1,
          imgSrc: product.imgSrc || ''
        });
      }
      saveCart(cart);
    }
  
    function removeItem(id) {
      const cart = loadCart();
      const idx = findItemIndex(cart, id);
      if (idx >= 0) {
        cart.items.splice(idx, 1);
        saveCart(cart);
      }
    }
  
    function updateQty(id, qty) {
      const q = Math.max(1, qty | 0);
      const cart = loadCart();
      const idx = findItemIndex(cart, id);
      if (idx >= 0) {
        cart.items[idx].qty = q;
        saveCart(cart);
      }
    }
  
    function clearCart() {
      saveCart({ items: [] });
    }
  
    function getCartTotals() {
      const cart = loadCart();
      let count = 0, total = 0;
      cart.items.forEach(it => {
        count += it.qty;
        total += it.price * it.qty;
      });
      return { count, total };
    }
  
    /* ===============================
     * UI: contador en navbar
     * =============================== */
    function updateCartCountUI() {
      const { count } = getCartTotals();
      document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
      });
    }
  
    /* ===============================
     * Generar productos según página
     * =============================== */
    function loadProducts() {
      const productGrid = document.querySelector('.product-grid');
      if (!productGrid) return;
  
      const path = window.location.pathname.toLowerCase();
      const isIndex = /(?:^|\/)index\.html?$/.test(path) || path === '/' || path === '';
      const isHombre = /hombre\.html$/.test(path);
      const isMujer = /mujer\.html$/.test(path);
      const isNovedades = /novedades\.html$/.test(path);
  
      let products = [];
  
      if (isMujer) {
        products = [
          { name: 'Sheath Off The Shoulder Black Dress', price: '$2,650.00', image: 'images/black_dress.jpeg' },
          { name: 'Beige Long Coat', price: '$1,350.00', image: 'images/beige_coat.jpeg' },
          { name: 'White Pleated Trousers', price: '$659.00', image: 'images/pleated_trousers.jpeg' },
        ];
      } else if (isHombre) {
        products = [
          { name: 'Blue Navy Jacket', price: '$670.00', image: 'images/blue-jacket.jpeg' },
          { name: 'Dark Brown Long Coat', price: '$1,129.00', image: 'images/brown-man-coat.jpeg' },
          { name: 'Beige Vest', price: '$320.00', image: 'images/beige-vest.jpeg' },
        ];
      } else if (isNovedades) {
        products = [
          { name: 'Black Cropped Top', price: '$229.00', image: 'images/novedad1.jpeg' },
          { name: 'Green Linen Shirt', price: '$279.00', image: 'images/novedad2.jpeg' },
        ];
      } else if (isIndex) {
        products = [
          { name: 'Elegant Blazer Set', price: '$769.00', image: 'images/featured.jpeg' },

        ];
      }
  
      productGrid.innerHTML = '';
      products.forEach(prod => {
        const id = slugify(prod.name);
        const priceNum = moneyToNumber(prod.price);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = id;
        card.dataset.name = prod.name;
        card.dataset.price = priceNum;
        card.innerHTML = `
          <img src="${prod.image}" alt="${prod.name}">
          <h3>${prod.name}</h3>
          <p class="price">${prod.price}</p>
          <button class="btn-add-to-cart" data-id="${id}">Añadir al Carrito</button>
        `;
        productGrid.appendChild(card);
      });
    }
  
    /* ===============================
     * Cart Page renderer
     * =============================== */
    function isCartPage() {
      return document.body.classList.contains('cart-page') ||
        /cart\.html?$/i.test(window.location.pathname);
    }
  
    function renderCartPage() {
      const container = document.getElementById('cart-container');
      if (!container) return;
  
      const cart = loadCart();
      if (!cart.items.length) {
        container.innerHTML = '<p>Tu carrito está vacío.</p>';
        updateCartCountUI();
        return;
      }
  
      // Construir filas
      let rowsHtml = '';
      cart.items.forEach(it => {
        rowsHtml += `
          <tr data-id="${it.id}">
            <td class="cart-prod">
              ${it.imgSrc ? `<img src="${it.imgSrc}" alt="${it.name}" class="cart-thumb">` : ''}
              ${it.name}
            </td>
            <td>${numberToMoney(it.price)}</td>
            <td><input type="number" min="1" value="${it.qty}" class="cart-qty-input"></td>
            <td class="cart-subtotal">${numberToMoney(it.price * it.qty)}</td>
            <td><button class="cart-remove-btn" aria-label="Eliminar">&times;</button></td>
          </tr>`;
      });
  
      const { total } = getCartTotals();
  
      container.innerHTML = `
        <table class="cart-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="cart-total-label">Total:</td>
              <td colspan="2" class="cart-total-value">${numberToMoney(total)}</td>
            </tr>
          </tfoot>
        </table>
      `;
  
      /* Eventos dentro del carrito */
  
      // Cambiar cantidad
      container.querySelectorAll('.cart-qty-input').forEach(inp => {
        inp.addEventListener('change', e => {
          const tr = e.target.closest('tr');
          const id = tr.dataset.id;
          const qty = parseInt(e.target.value, 10) || 1;
          updateQty(id, qty);
          const cart = loadCart();
          const item = cart.items.find(i => i.id === id);
          if (item) {
            tr.querySelector('.cart-subtotal').textContent = numberToMoney(item.price * item.qty);
          }
          container.querySelector('.cart-total-value').textContent = numberToMoney(getCartTotals().total);
        });
      });
  
      // Eliminar
      container.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const tr = e.target.closest('tr');
          const id = tr.dataset.id;
          removeItem(id);
          tr.remove();
          const { count, total } = getCartTotals();
          const totalEl = container.querySelector('.cart-total-value');
          if (totalEl) totalEl.textContent = numberToMoney(total);
          if (!count) container.innerHTML = '<p>Tu carrito está vacío.</p>';
        });
      });
    }
  
    /* ===============================
     * Navegación activa
     * =============================== */
    function highlightNav() {
      const navLinks = document.querySelectorAll('.nav-links a, nav a[href]');
      if (!navLinks.length) return;
      const currentPath = window.location.pathname.toLowerCase();
  
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = (link.getAttribute('href') || '').toLowerCase();
        if (!href || href.startsWith('#') || href.startsWith('http')) return;
  
        if (/index\.html?$/.test(href)) {
          if (/index\.html?$/.test(currentPath) || currentPath === '/' || currentPath === '') {
            link.classList.add('active');
          }
        } else if (currentPath.endsWith(href)) {
          link.classList.add('active');
        }
      });
    }
  
    /* ===============================
     * Delegación: clic en "Añadir al Carrito"
     * =============================== */
    function handleAddToCartClick(e) {
      const btn = e.target.closest('.btn-add-to-cart');
      if (!btn) return;
  
      const card = btn.closest('.product-card');
      if (!card) return;
  
      const id = card.dataset.id || slugify(card.querySelector('h3')?.textContent || 'prod');
      const name = card.dataset.name || card.querySelector('h3')?.textContent?.trim() || id;
      const price = Number(card.dataset.price) || moneyToNumber(card.querySelector('.price')?.textContent || '0');
      const imgSrc = card.querySelector('img')?.getAttribute('src') || '';
  
      addItem({ id, name, price, imgSrc });
      flashAdded(btn);
    }
  
    function flashAdded(btn) {
      const prev = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Añadido!';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = prev;
      }, 800);
    }
  
    /* ===============================
     * Init
     * =============================== */
    document.addEventListener('DOMContentLoaded', () => {
      // Generar productos si corresponde
      loadProducts();
      // Resaltar navegación actual
      highlightNav();
      // Contador inicial
      updateCartCountUI();
      // Render carrito si estamos en cart.html
      if (isCartPage()) {
        renderCartPage();
      }
  
      // Limpia handlers viejos tipo onclick="printALog()"
      document.querySelectorAll('[onclick]').forEach(el => {
        const attr = el.getAttribute('onclick');
        if (attr && /printALog/i.test(attr)) {
          el.removeAttribute('onclick');
        }
      });
    });
  
    // Delegación global para clicks
    document.addEventListener('click', handleAddToCartClick, false);
  
    /* ===============================
     * API global para depuración
     * =============================== */
    window.NGVVCart = {
      loadCart,
      saveCart,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      getCartTotals,
      renderCartPage
    };
  
    console.log('NGVV main.js v3 cargado');
  })();