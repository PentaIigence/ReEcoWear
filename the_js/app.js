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
    let productElement = positionClick.closest('.m-item');  // Get closest div with class 'm-item'
    let product_id = productElement.dataset.id;  // Fetch product_id from data attribute

    if (product_id) {
      cartButton(product_id);  // Pass product_id to cartButton function
    } else {
      console.error("Product ID not found in dataset");
    }
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
  addCartToHTML();
  addCartToMemory();
}

const addCartToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
  listCartHTML.innerHTML = '';
  let totalQuantity = 0;
  
  if (carts.length > 0) {
    carts.forEach(cart => {
      totalQuantity = totalQuantity + cart.quantity;

      // Find the product in listProducts based on product_id
      let positionProduct = listProducts.findIndex((value) => value.id == parseInt(cart.product_id));

      
      if (positionProduct >= 0) {  // Ensure the product exists
        let info = listProducts[positionProduct];

        let newCart = document.createElement('div');
        newCart.classList.add('item');
        newCart.dataset.id = cart.product_id;

        let totalPrice = (info.price * cart.quantity).toFixed(2);

        // Update the cart HTML with product details
        newCart.innerHTML = `
          <div class="image">
            <img src="${info.image}" alt="">
          </div>
          <div class="name">
            ${info.name}
          </div>
          <div class="totalPrice">
            R${totalPrice}
          </div>
          <div class="quantity">
            <span class="minus"><</span>
            <span>${cart.quantity}</span>
            <span class="plus">></span>
          </div>`;
          
        listCartHTML.appendChild(newCart);
      } else {
        console.error(`Product with ID ${cart.product_id} not found in listProducts.`);
      }
    });
  }
  
  iconCartSpan.innerText = totalQuantity;
}
listCartHTML.addEventListener('click', (event) => {
  let positionClick = event.target;
  
  // Check if the clicked element is either a "minus" or "plus" button
  if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
    // Get the product ID from the closest parent element with class 'item'
    let product_id = positionClick.closest('.item').dataset.id;
    
    // Determine if the clicked button is 'plus' or 'minus'
    let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
    
    // Call the function to adjust quantity
    changeQuantity(product_id, type);
  }
});

const changeQuantity = (product_id, type) => {
  // Find the product in the cart by its ID
  let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
  
  // If product is found in the cart
  if (positionItemInCart >= 0) {
    switch (type) {
      case 'plus':
        // Increase the quantity by 1
        carts[positionItemInCart].quantity += 1;
        break;
        
      case 'minus':
        // Decrease the quantity, but do not allow it to go below 1
        let newQuantity = carts[positionItemInCart].quantity - 1;
        
        if (newQuantity > 0) {
          carts[positionItemInCart].quantity = newQuantity;
        } else {
          // Remove item from the cart if quantity reaches 0
          carts.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  
  // Update the cart in localStorage and refresh the cart display
  addCartToMemory();
  addCartToHTML();
}


const initApp = () => {
  fetch('../men-product.json')
  .then(response => response.json())
  .then(data => {
    listProducts = data;
    addDataToHTML();

    // getting cart from memory
    if (localStorage.getItem('cart')) {
      carts = JSON.parse(localStorage.getItem('cart'));
      addCartToHTML();
    }
  })
}

initApp();
