import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  let imgSrc = product.Image ? product.Image.replace(/^\.\.\//, '') : '';
  if (imgSrc && !imgSrc.startsWith('/') && !imgSrc.startsWith('http')) {
    imgSrc = '/' + imgSrc;
  }
  const brand = (product.Brand && product.Brand.Name) || '';
  const name = product.NameWithoutBrand || product.Name || '';
  const price = (product.FinalPrice ?? product.ListPrice ?? 0).toFixed(2);

  return `
    <li class="product-card">
      <a href="product_pages/index.html?id=${product.Id}">
        <img src="${imgSrc}" alt="${name}" />
        <h3 class="card__brand">${brand}</h3>
        <h2 class="card__name">${name}</h2>
        <p class="product-card__price">$${price}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    this.products = await this.dataSource.getData();
    this.renderList(this.products);
  }

  renderList(list, templateFn = productCardTemplate, position = 'afterbegin', clear = true) {
    renderListWithTemplate(templateFn, this.listElement, list, position, clear);
  }
}
