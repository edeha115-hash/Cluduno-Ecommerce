import { cart } from "../data/cart.js";
import { products } from "../data/products.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import { formatCurrency } from "./utilis/money.js";
import { addOrder, orders } from "../data/orders.js";

export function renderPaymentSummary() {
    let totalPriceCents = 0;

    cart.cartItem.forEach(item => {
        const matchingItem = products.getProductInfo(item.productId);

        totalPriceCents += matchingItem.priceCents * item.quantity;
    });

    let shippingPriceCents = 0;

    cart.cartItem.forEach(item => {
        let matchingOption;

        deliveryOptions.forEach(option => {
            if (option.id === item.deliveryOptionId) {
                matchingOption = option;
            }
        });

        shippingPriceCents += matchingOption.priceCents;
    })

    const totalBeforeTax = totalPriceCents + shippingPriceCents;
    const estimatedTax = totalBeforeTax * 0.1;
    const orderTotal = totalBeforeTax + estimatedTax;

    let paymentSummaryHTML = `
        <div class="payment-summary-title">
            Payment Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (<span class="js-cart-quantity">${cart.calculateCartQuantity()}</span>):</div>
            <div class="payment-summary-money">$${formatCurrency(totalPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(estimatedTax)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(orderTotal)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order-btn">
            Place your order
          </button>
    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

    document.querySelector('.js-place-order-btn').addEventListener('click', async () => {
        try {
            const response = await fetch('https://supersimplebackend.dev/orders', {
                method: 'POST',
                headers: { // gives the backend more information about our request
                    'Content-Type': 'application/json' // type of data sending to our request
                },
                body: JSON.stringify({
                    cart: cart.cartItem
                })
            });

            const order = await response.json();
            addOrder(order);
            localStorage.removeItem('cart');
            // console.log(orders)
        } catch (error) {
            alert(error);
        }

        // window.location.href = '../orders.html';
    })
}