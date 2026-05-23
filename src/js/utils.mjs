// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export function updateCartCount() {
  const cart = getLocalStorage('so-cart');
  const count = Array.isArray(cart) ? cart.length : 0;
  const cartIcon = document.querySelector('.cart a');
  if (!cartIcon) return;
  let badge = cartIcon.querySelector('.cart-count');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'cart-count';
    cartIcon.appendChild(badge);
  }
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-block' : 'none';
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false
) {
  if (clear) parentElement.innerHTML = '';
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}
