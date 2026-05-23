import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { updateCartCount, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter(updateCartCount);

const listElement = document.querySelector('.product-list');
if (listElement) {
  const dataSource = new ProductData('tents');
  const productList = new ProductList('tents', dataSource, listElement);
  productList.init();
}
