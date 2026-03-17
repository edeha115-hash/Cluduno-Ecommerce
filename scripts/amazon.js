import { cart } from "../data/cart.js";
import { orders } from "../data/orders.js";
import { loadProductsFetch, products } from "../data/products.js";
import { formatCurrency } from "./utilis/money.js";

async function loadPage() {
    try {
        await loadProductsFetch();
    } catch (error) {
        alert('Unable to completed this page (check network connection)');
    }

    renderProducts();
}

loadPage();

function renderProducts() {
    let productsHTML = ``;
    products.stuffs.forEach(s => {
        productsHTML += `
            <div class="product-container">
            <div class="product-image-container">
                <img class="product-image"
                src="${s.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
                ${s.name}
            </div>

            <div class="product-price">
                $${formatCurrency(s.priceCents)}
            </div>

            <div class="product-quantity-container">
                <select class="js-product-quantity-${s.id}">
                    <option selected value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>

            <div class="product-spacer"></div>

            <div class="added-to-cart">
                <img src="images/icons/checkmark.png">
                Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart-btn" data-product-id="${s.id}">
                Add to Cart
            </button>
            </div>
        `;

        document.querySelector('.js-products-container')
            .innerHTML = productsHTML;
    })

    document.querySelector('.js-order-Link').onclick = () => {
        if (orders.length === 0) {
            alert('No Order Placed Recently')
        } else {
            window.location.href = '../orders.html';
        }
    }

    document.querySelectorAll('.js-add-to-cart-btn').forEach(btn => {
        btn.onclick = () => {
            const productId = btn.dataset.productId;
            const quantity = 
            document.querySelector(`.js-product-quantity-${productId}`).value;

            cart.addToCart(productId, Number(quantity));
            document.querySelector(`.js-product-quantity-${productId}`).value = 1;
            cart.renderCartQuantity();
        }
    })

    cart.renderCartQuantity();
}
