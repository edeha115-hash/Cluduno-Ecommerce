import { cart } from "../data/cart.js";
import { loadProductsFetch } from "../data/products.js";
import { renderOrderSummary } from "./orderSummary.js";
import { renderPaymentSummary } from "./paymentSummary.js";

async function loadPage() {
    try {
        await loadProductsFetch();
    } catch (error) {
        alert(error);
    }

    cart.checkIfNoitem();
    renderPaymentSummary();
    renderOrderSummary();
}

loadPage();