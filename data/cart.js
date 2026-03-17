class Cart {
    cartItem;
    localStorageKey;

    quantityHolders = document.querySelectorAll('.js-cart-quantity');

    constructor(localStorageKey) {
        this.localStorageKey = localStorageKey;
        this.loadFromStorage();
    }

    addToCart(productId, quantity) {
        const matchingItem = this.getCartItemInfo(productId);

        if (matchingItem) {
            matchingItem.quantity += quantity;
        } else {
            this.cartItem.push({ productId, quantity, deliveryOptionId: '1' });
        }

        this.setToStorage();
        console.log(this.cartItem);
    }

    removeFromCart(productId) {
        let newCart = [];

        this.cartItem.forEach(item => {
            if (productId !== item.productId) {
                newCart.push(item);
            }
        });

        this.cartItem = newCart;
        this.setToStorage();
    }

    setToStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItem));
    }

    loadFromStorage() {
        this.cartItem = JSON.parse(localStorage.getItem(this.localStorageKey)) || [];
    }

    getCartItemInfo(id) {
        let matchingItem;

        this.cartItem.forEach(i => {
            if (id === i.productId) {
                matchingItem = i;
            }
        });

        return matchingItem;
    }

    renderCartQuantity() {
        this.quantityHolders.forEach(h => {
            h.innerHTML = this.calculateCartQuantity();
        });
    }

    calculateCartQuantity() {
        let cartQuantity = 0;

        this.cartItem.forEach(i => {
            cartQuantity += i.quantity;
        });

        return cartQuantity;
    }

    checkIfNoitem() {
        if (this.cartItem.length === 0) {
            alert('No Product in Cart');

            window.location.href = '../amazon.html';
        }
    }

    updateItemQuantity(productId, quantity, operator) {
        const matchingItem = this.getCartItemInfo(productId);

        if (operator === '+') {
            matchingItem.quantity += quantity;
        } else if (operator === '-') {
            matchingItem.quantity -= quantity;
        }

        this.setToStorage();
    }

    updateItemDeliveryId(productId, newId) {
        const matchingItem = this.getCartItemInfo(productId);

        matchingItem.deliveryOptionId = newId;
        this.setToStorage();
    }
}

export let cart = new Cart('cart');