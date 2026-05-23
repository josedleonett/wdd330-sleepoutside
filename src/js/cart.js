import { getLocalStorage, setLocalStorage, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const htmlItems = cartItems.map((item, i) => cartItemTemplate(item, i));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
  updateCartTotal(cartItems);
}

function cartItemTemplate(item, index) {
  const imgSrc = item.Images?.PrimaryMedium || item.Image || '';
  const qty = item.Quantity || 1;
  const price = ((item.FinalPrice || 0) * qty).toFixed(2);
  return `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img src="${imgSrc}" alt="${item.Name}" />
  </a>
  <a href="#"><h2 class="card__name">${item.Name}</h2></a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ''}</p>
  <div class="cart-card__quantity">
    <button class="cart-qty-btn" data-index="${index}" data-action="dec" aria-label="Decrease quantity">-</button>
    <span class="cart-qty-display">${qty}</span>
    <button class="cart-qty-btn" data-index="${index}" data-action="inc" aria-label="Increase quantity">+</button>
  </div>
  <p class="cart-card__price">$${price}</p>
  <button class="cart-remove" data-index="${index}" aria-label="Remove item">&#x2715;</button>
</li>`;
}

function updateCartTotal(cartItems) {
  const total = cartItems.reduce(
    (sum, item) => sum + (item.FinalPrice || 0) * (item.Quantity || 1),
    0
  );
  let totalEl = document.querySelector('.cart-total');
  if (!totalEl) {
    totalEl = document.createElement('p');
    totalEl.className = 'cart-total';
    document.querySelector('.products').appendChild(totalEl);
  }
  totalEl.textContent = cartItems.length
    ? `Total: $${total.toFixed(2)}`
    : 'Your cart is empty.';
}

document.querySelector('.product-list').addEventListener('click', (e) => {
  const btn = e.target.closest('.cart-remove');
  if (!btn) return;
  const index = Number(btn.dataset.index);
  const cart = getLocalStorage('so-cart') || [];
  cart.splice(index, 1);
  setLocalStorage('so-cart', cart);
  renderCartContents();
});

document.querySelector('.product-list').addEventListener('click', (e) => {
  const btn = e.target.closest('.cart-qty-btn');
  if (!btn) return;
  const index = Number(btn.dataset.index);
  const cart = getLocalStorage('so-cart') || [];
  if (!cart[index]) return;
  const current = cart[index].Quantity || 1;
  const next = btn.dataset.action === 'inc' ? current + 1 : Math.max(1, current - 1);
  cart[index].Quantity = next;
  setLocalStorage('so-cart', cart);
  renderCartContents();
});

renderCartContents();
