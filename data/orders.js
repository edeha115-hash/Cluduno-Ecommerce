export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
    orders.unshift(order); // the add order on the front of the array
    saveToStorage();
}

export function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}