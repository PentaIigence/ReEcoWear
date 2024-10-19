let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('.men-products');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

listProductHTML = document.querySelector('.men-shop');

let listProducts = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('men-products');
})

closeCart.addEventListener('click', () => {
  body.classList.toggle('men-products')
})


const addDataToHTML = () => {
  listProductHTML.innerHTML = '';
  if (listProducts.length > 0) {
      listProducts.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.classList.add('m-item');
        newProduct.dataset.id = product.id;
        newProduct.innerHTML = `
        <div class="m-pic">
          <img class="m-preview" src="${product.image}">
        </div>

        <div class="desc">
          <p class="clothing-item">${product.name}</p>
          <p class="men-price">${product.price}</p>
          <button class="cartButton">Add to Cart</button>
        </div>`;
        listProductHTML.appendChild(newProduct);
    });
  }
}

listProductHTML.addEventListener('click', (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains('cartButton')) {
    let productElement = positionClick.closest('.m-item');
    let product_id = productElement.dataset.id;
    cartButton(product_id);
  }
});

  const cartButton = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if (carts.length <= 0) {
      carts = [{
      product_id: product_id,
      quantity: 1
    }]
  }
  else if (positionThisProductInCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1
    });
  }
  else {
    carts[positionThisProductInCart].quantity += 1;
  }
  console.log(carts);
}

const initApp = () => {
  fetch('../men-product.json')
  .then(response => response.json())
  .then(data => {
    listProducts = data;
    addDataToHTML();
  })
}

initApp();
