import { getLocalStorage, setLocalStorage, updateCartCount } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
    updateCartCount();
  }

  addProductToCart() {
    const cart = getLocalStorage('so-cart') || [];
    cart.push(this.product);
    setLocalStorage('so-cart', cart);
    updateCartCount();
  }

  renderProductDetails() {
    const brandEl = document.querySelector('.product-detail h3');
    const nameEl = document.querySelector('.product-detail h2');
    const imgEl = document.querySelector('.product-detail img');
    const priceEl = document.querySelector('.product-card__price');
    const colorEl = document.querySelector('.product__color');
    const descEl = document.querySelector('.product__description');

    if (brandEl) brandEl.textContent = this.product.Brand?.Name || '';
    if (nameEl)
      nameEl.textContent =
        this.product.NameWithoutBrand || this.product.Name || '';
    if (imgEl) {
      let src = (this.product.Image || '').replace(/^\.\.\//, '');
      if (src && !src.startsWith('/') && !src.startsWith('http'))
        src = '/' + src;
      imgEl.src = src;
    }
    if (priceEl)
      priceEl.textContent = `$${(this.product.FinalPrice ?? this.product.ListPrice ?? 0).toFixed(2)}`;
    if (colorEl)
      colorEl.textContent = this.product.Colors?.[0]?.ColorName || '';
    if (descEl) descEl.innerHTML = this.product.DescriptionHtmlSimple || '';
  }
}
