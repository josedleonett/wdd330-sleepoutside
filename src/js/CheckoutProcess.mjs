import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

const TAX_RATE = 0.06;
const BASE_SHIPPING = 10;
const PER_ITEM_SHIPPING = 2;

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.Quantity || 1,
  }));
}

export default class CheckoutProcess {
  constructor() {
    this.services = new ExternalServices();
    this.cartItems = getLocalStorage('so-cart') || [];
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  displayItemSubtotal() {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + (item.FinalPrice || 0) * (item.Quantity || 1),
      0
    );
    document.querySelector('#subtotal').textContent = `$${this.subtotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    const count = this.cartItems.reduce(
      (sum, item) => sum + (item.Quantity || 1),
      0
    );
    this.tax = this.subtotal * TAX_RATE;
    this.shipping =
      count > 0 ? BASE_SHIPPING + (count - 1) * PER_ITEM_SHIPPING : 0;
    this.orderTotal = this.subtotal + this.tax + this.shipping;
    document.querySelector('#tax').textContent = `$${this.tax.toFixed(2)}`;
    document.querySelector('#shipping').textContent = `$${this.shipping.toFixed(2)}`;
    document.querySelector('#order-total').textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const formData = new FormData(form);
    const order = Object.fromEntries(formData);
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping;
    order.items = packageItems(this.cartItems);
    return this.services.checkout(order);
  }
}
