class Products {
  stuffs;

  getProductInfo(id) {
    let matchingItem;

    this.stuffs.forEach(s => {
      if (id === s.id) {
        matchingItem = s;
      }
    });

    return matchingItem;
  }
}

export const products = new Products();

export function loadProductsFetch() {
  const promise = fetch(
    'https://supersimplebackend.dev/products'
  ).then((response) => {
    return response.json(); // return the promise to next step
  }).then((productData /* it JSON.parse for us*/) => {
    products.stuffs = productData;

    console.log('Products was sucessfully loaded');
  })

  return promise;
}