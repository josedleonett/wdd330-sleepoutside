import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkout = new CheckoutProcess();
checkout.displayItemSubtotal();

document.querySelector('#zip').addEventListener('blur', () => {
  checkout.calculateOrderTotal();
});

document.querySelector('#checkout-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const result = await checkout.checkout(e.target);
    console.log('Order success:', result);
    alert('Order placed successfully!');
  } catch (err) {
    console.error('Order failed:', err);
    alert('Order failed. Please try again.');
  }
});
