import { cart } from "../data/cart.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import { products } from "../data/products.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { formatCurrency } from "./utilis/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export function renderOrderSummary() {
    let orderSummaryHTML = ``;

    cart.cartItem.forEach(item => {
        const matchingItem = products.getProductInfo(item.productId);

        orderSummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
                <div class="delivery-date">
                    Delivery date: <span class="item-delivery-date-${matchingItem.id}">
                    ${renderItemDeliveryDate(item.deliveryOptionId)}
                    </span>
                </div>

                <div class="cart-item-details-grid">
                    <img class="product-image"
                        src="${matchingItem.image}">
                    <div class="cart-item-details">
                        <div class="product-name">
                            ${matchingItem.name}
                        </div>
                        <div class="product-price">
                            $${formatCurrency(matchingItem.priceCents)}
                        </div>
                        <div class="product-quantity">
                            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingItem.id}" data-operator="-">
                                -
                            </span>
                            <span>
                                Quantity: <span class="quantity-label js-quantity-${matchingItem.id}">${item.quantity}</span>
                            </span>
                            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingItem.id}" data-operator="+">
                                +
                            </span>
                            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingItem.id}">
                                Delete
                            </span>
                        </div>
                    </div>
                </div>
                <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOption(matchingItem, item)}
                </div>
            </div>
        `;

        document.querySelector('.js-cart-product-container').innerHTML = orderSummaryHTML;
    })

    cart.renderCartQuantity();

    document.querySelectorAll('.js-delete-link').forEach(link => {
        link.onclick = () => {
            const productId = link.dataset.productId;

            cart.removeFromCart(productId);
            document.querySelector(`.js-cart-item-container-${productId}`).remove();
            cart.renderCartQuantity();
            cart.checkIfNoitem();
            renderPaymentSummary();
        }
    })

    document.querySelectorAll('.js-update-link').forEach(link => {
        link.onclick = () => {
            const {productId, operator} = link.dataset;
            let quantity;

            if (operator === '+') {
                quantity = prompt('How many to add');
            } else if (operator === '-') {
                quantity = prompt('How many to take away');
            }

            cart.updateItemQuantity(productId, Number(quantity), operator);
            cart.renderCartQuantity();
            renderOrderSummary();
            renderPaymentSummary();
        }
    })

    document.querySelectorAll('.js-delivery-option').forEach(option => {
        option.onclick = () => {
            const {productId, deliveryOptionId, deliveryDate} = option.dataset;
            
            cart.updateItemDeliveryId(productId, deliveryOptionId);
            renderOrderSummary();
            document.querySelector(`.item-delivery-date-${productId}`)
                .innerHTML = deliveryDate;
            renderPaymentSummary();
        }
    })
}

function renderItemDeliveryDate(deliveryOptionId) {
    let matchingOption;

    deliveryOptions.forEach(option => {
        if (option.id === deliveryOptionId) {
            matchingOption = option;
        }
    });

    const today = dayjs();
    const dateString = today.add(matchingOption.deliveryDays, 'days').format('dddd, MMMM d');

    return dateString;
}

function deliveryOption(matchingItem, item) {
    let deliveryOptionHTML = ``;

    deliveryOptions.forEach(option => {
        const today = dayjs();
        const date = today.add(option.deliveryDays, 'days');
        const dateString = date.format('dddd, MMMM d');

        deliveryOptionHTML += `
            <div class="delivery-option js-delivery-option" data-delivery-option-id="${option.id}" 
            data-product-id="${matchingItem.id}"
            data-delivery-date="${dateString}">
                <input type="radio" ${item.deliveryOptionId === option.id ? 'checked' : ''}
                class="delivery-option-input"
                name="delivery-option-${matchingItem.id}">
                <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        ${option.priceCents === 0 ? 'FREE' : `$${formatCurrency(option.priceCents)}`} - Shipping
                    </div>
                </div>
            </div>
        `;
    })

    return deliveryOptionHTML;
}