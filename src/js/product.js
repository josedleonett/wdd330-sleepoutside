import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function getIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function populateProductDetail(id) {
  const product = await dataSource.findProductById(id);
  if (!product) return;

  const brandEl = document.querySelector('.product-detail h3');
  const nameEl = document.querySelector('.product-detail h2');
  const imgEl = document.querySelector('.product-detail img');
  const priceEl = document.querySelector('.product-card__price');
  const colorEl = document.querySelector('.product__color');
  const descEl = document.querySelector('.product__description');

  if (brandEl) brandEl.textContent = product.Brand?.Name || "";
  if (nameEl) nameEl.textContent = product.NameWithoutBrand || product.Name || "";
  if (imgEl) {
    let src = (product.Image || "").replace(/^\.\.\//, "");
    if (src && !src.startsWith("/") && !src.startsWith("http")) src = "/" + src;
    imgEl.src = src;
  }
  if (priceEl)
    priceEl.textContent = `$${(product.FinalPrice ?? product.ListPrice ?? 0).toFixed(2)}`;
  if (colorEl) colorEl.textContent = product.Colors?.[0]?.ColorName || "";
  if (descEl) descEl.innerHTML = product.DescriptionHtmlSimple || "";

  const addBtn = document.getElementById("addToCart");
  if (addBtn) addBtn.dataset.id = product.Id;
}

function addProductToCart(product) {
  setLocalStorage("so-cart", product);
}

async function addToCartHandler(e) {
  const id = e.target.dataset.id;
  if (!id) return;
  const product = await dataSource.findProductById(id);
  addProductToCart(product);
}

document.addEventListener("DOMContentLoaded", async () => {
  const id = getIdFromQuery();
  if (id) {
    await populateProductDetail(id);
  }
  const addBtn = document.getElementById("addToCart");
  if (addBtn) addBtn.addEventListener("click", addToCartHandler);
});
