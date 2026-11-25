/**
 * Cardápio Digital: renderização do cardápio e navegação.
 * Os dados vêm de menu-data.js (STORE, CATEGORIES, PRODUCTS).
 */

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const formatPrice = (value) => currency.format(value);

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/* ---------- Informações da loja ---------- */

function fillStoreInfo() {
  $$('[data-store]').forEach((el) => {
    const value = STORE[el.dataset.store];
    if (value) el.textContent = value;
  });
}

/* ---------- Cardápio ---------- */

function productCard(product) {
  const tag = product.tag ? `<p class="product__tag">${product.tag}</p>` : '';
  return `
    <article class="product" data-id="${product.id}">
      <div class="product__media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" width="640" height="480">
      </div>
      <div class="product__body">
        ${tag}
        <h3 class="product__name">${product.name}</h3>
        <p class="product__desc">${product.description}</p>
        <div class="product__footer">
          <span class="product__price">${formatPrice(product.price)}</span>
          <button class="add-button" type="button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao pedido">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </article>`;
}

function renderMenu() {
  const menu = $('#cardapio');
  const nav = $('#category-nav');
  const visibleCategories = CATEGORIES.filter((c) => PRODUCTS.some((p) => p.category === c.id));

  menu.innerHTML = visibleCategories.map((category) => {
    const items = PRODUCTS.filter((p) => p.category === category.id);
    return `
      <section class="menu-section" id="${category.id}" aria-labelledby="${category.id}-title">
        <header class="menu-section__header">
          <h2 class="menu-section__title" id="${category.id}-title">${category.label}</h2>
          <p class="menu-section__desc">${category.description}</p>
        </header>
        <div class="product-grid">${items.map(productCard).join('')}</div>
      </section>`;
  }).join('');

  nav.innerHTML = visibleCategories
    .map((c) => `<li><a class="category-nav__link" href="#${c.id}">${c.label}</a></li>`)
    .join('');

  // Se uma imagem falhar, mostra um fundo neutro em vez do ícone quebrado.
  $$('.product__media img', menu).forEach((image) => {
    image.addEventListener('error', () => image.closest('.product__media').classList.add('is-broken'), { once: true });
  });
}

/* ---------- Destaque da categoria visível ---------- */

function setupScrollSpy() {
  const links = $$('.category-nav__link');
  const byId = new Map(links.map((link) => [link.hash.slice(1), link]));
  const navList = $('#category-nav');

  const activate = (id) => {
    const link = byId.get(id);
    if (!link || link.hasAttribute('aria-current')) return;
    links.forEach((l) => l.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'true');
    // Mantém a aba ativa visível na barra rolável (celular) sem mexer na rolagem da página.
    const left = link.offsetLeft - (navList.clientWidth - link.offsetWidth) / 2;
    navList.scrollTo({ left, behavior: 'smooth' });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e) => activate(e.target.id));
  }, { rootMargin: '-40% 0px -55% 0px' });

  $$('.menu-section').forEach((section) => observer.observe(section));
}

/* ---------- Status aberto/fechado (horário de exemplo: 11h às 23h, fechado às segundas) ---------- */

function updateStoreStatus() {
  const now = new Date();
  const open = now.getDay() !== 1 && now.getHours() >= 11 && now.getHours() < 23;
  const status = $('#store-status');
  status.classList.toggle('is-open', open);
  $('#store-status-text').textContent = open ? 'Aberto agora' : 'Fechado agora';
}

/* ---------- Carrinho ---------- */

const CART_KEY = 'cardapio-digital:carrinho';
const productsById = new Map(PRODUCTS.map((p) => [p.id, p]));

/** Itens do carrinho: { [idDoProduto]: quantidade } */
let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY)) || {};
    // Ignora produtos que saíram do cardápio desde a última visita.
    return Object.fromEntries(Object.entries(saved).filter(([id, qty]) => productsById.has(id) && qty > 0));
  } catch {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* navegação privada ou armazenamento bloqueado: o carrinho só não persiste */
  }
}

const cartEntries = () => Object.entries(cart).map(([id, qty]) => ({ product: productsById.get(id), qty }));
const cartCount = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
const cartTotal = () => cartEntries().reduce((sum, { product, qty }) => sum + product.price * qty, 0);

function setQuantity(id, qty) {
  if (qty > 0) cart[id] = qty;
  else delete cart[id];
  saveCart();
  renderCart();
}

function addToCart(id) {
  setQuantity(id, (cart[id] || 0) + 1);
  const product = productsById.get(id);
  showToast(`+1 ${product.name} no pedido`);

  const count = $('#cart-count');
  count.classList.remove('is-bumped');
  void count.offsetWidth; // reinicia a animação
  count.classList.add('is-bumped');
}

function renderCart() {
  const entries = cartEntries();
  const count = cartCount();
  const total = formatPrice(cartTotal());
  const isEmpty = entries.length === 0;

  $('#cart-items').innerHTML = entries.map(({ product, qty }) => `
    <li class="cart-item">
      <img src="${product.image}" alt="" width="56" height="56" loading="lazy">
      <div>
        <p class="cart-item__name">${product.name}</p>
        <p class="cart-item__price">${formatPrice(product.price * qty)}</p>
      </div>
      <div class="stepper" role="group" aria-label="Quantidade de ${product.name}">
        <button type="button" data-step="-1" data-id="${product.id}" aria-label="${qty === 1 ? 'Remover' : 'Diminuir'} ${product.name}">${qty === 1 ? '×' : '−'}</button>
        <output aria-live="polite">${qty}</output>
        <button type="button" data-step="1" data-id="${product.id}" aria-label="Aumentar ${product.name}">+</button>
      </div>
    </li>`).join('');

  $('#cart-empty').hidden = !isEmpty;
  $('#cart-notes-wrap').hidden = isEmpty;
  $('#cart-clear').hidden = isEmpty;
  $('#cart-checkout').disabled = isEmpty;
  $('#cart-total').textContent = total;
  $('#cart-count').textContent = count;

  $('#cart-bar').classList.toggle('is-visible', !isEmpty);
  $('#cart-bar-count').textContent = `${count} ${count === 1 ? 'item' : 'itens'}`;
  $('#cart-bar-total').textContent = total;
}

/* Abrir e fechar a gaveta */
let lastFocus = null;

function openCart() {
  lastFocus = document.activeElement;
  $('#toast').classList.remove('is-visible');
  const overlay = $('#cart-overlay');
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('is-visible'));
  $('#cart').classList.add('is-open');
  $('#cart').setAttribute('aria-hidden', 'false');
  $('#cart-open').setAttribute('aria-expanded', 'true');
  document.body.classList.add('no-scroll');
  $('#cart-close').focus();
}

function closeCart() {
  const overlay = $('#cart-overlay');
  overlay.classList.remove('is-visible');
  setTimeout(() => { overlay.hidden = true; }, 250);
  $('#cart').classList.remove('is-open');
  $('#cart').setAttribute('aria-hidden', 'true');
  $('#cart-open').setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
  // Devolve o foco para onde o usuário estava (acessibilidade por teclado).
  const target = lastFocus && lastFocus !== document.body && lastFocus.isConnected ? lastFocus : $('#cart-open');
  target.focus({ preventScroll: true });
}

/* Pedido pelo WhatsApp (substitui o antigo link para cadastro.html, que não existia) */
function buildOrderMessage() {
  const lines = cartEntries().map(({ product, qty }) => `• ${qty}x ${product.name} — ${formatPrice(product.price * qty)}`);
  const notes = $('#cart-notes').value.trim();
  return [
    `Olá, ${STORE.name}! Quero fazer um pedido:`,
    '',
    ...lines,
    '',
    `*Total: ${formatPrice(cartTotal())}*`,
    notes ? `\nObservações: ${notes}` : '',
  ].join('\n').trim();
}

function checkout() {
  if (!cartCount()) return;
  const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(buildOrderMessage())}`;
  window.open(url, '_blank', 'noopener');
}

function setupCart() {
  // Delegação de eventos: funciona para cards gerados dinamicamente.
  $('#cardapio').addEventListener('click', (event) => {
    const button = event.target.closest('[data-add]');
    if (!button) return;
    addToCart(button.dataset.add);
    button.classList.add('is-added');
    setTimeout(() => button.classList.remove('is-added'), 600);
  });

  $('#cart-items').addEventListener('click', (event) => {
    const button = event.target.closest('[data-step]');
    if (!button) return;
    const { id } = button.dataset;
    setQuantity(id, (cart[id] || 0) + Number(button.dataset.step));
  });

  $('#cart-open').addEventListener('click', openCart);
  $('#cart-bar').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  $('#cart-overlay').addEventListener('click', closeCart);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && $('#cart').classList.contains('is-open')) closeCart();
  });

  $('#cart-checkout').addEventListener('click', checkout);
  $('#cart-clear').addEventListener('click', () => {
    if (!confirm('Remover todos os itens do pedido?')) return;
    cart = {};
    $('#cart-notes').value = '';
    saveCart();
    renderCart();
  });

  renderCart();
}

/* ---------- Aviso rápido ---------- */

let toastTimer;
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
}

/* ---------- Inicialização ---------- */

document.addEventListener('DOMContentLoaded', () => {
  fillStoreInfo();
  renderMenu();
  setupScrollSpy();
  setupCart();
  updateStoreStatus();
});
