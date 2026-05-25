import { loadHeaderFooter, alertMessage } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkout = new CheckoutProcess();
checkout.displayItemSubtotal();

document.querySelector('#zip').addEventListener('blur', () => {
  checkout.calculateOrderTotal();
});

document.querySelector('#checkout-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  try {
    await checkout.checkout(form);
  } catch (err) {
    const msg = err?.message?.message || err?.message || 'Order failed. Please try again.';
    alertMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
});
