const cart = [];
let data;
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("./data.json");
    data = await response.json();

    populateGrid(data);
    createbuttons();
    createClearButton();
  } catch (error) {
    console.error("Error loading data:", error);
  }
});

function populateGrid(products) {
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";

  products.forEach((product) => {
    const item = document.createElement("div");
    item.className = "grid-item";
    item.id = product.name;
    item.innerHTML = `
      <div class="image-container">
        <img src="${product.image.desktop}" alt="${product.name}" class="product-image" />
        <button class="add-to-cart">
          <i class="fa-solid fa-cart-shopping"></i>
          Add to Cart
        </button>
        <div id="${product.name}-control" class="control-count hidden">
            <button id="${product.name}-decrease" class="inc-dec-button  dec"><i class="fa-solid fa-minus"></i></button>
            <span class="inner-number" id="${product.name}-count-grid">1</span>
            <button id="${product.name}-increase" class="inc-dec-button  inc"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
      <div>
        <div class="category">${product.category}</div>
        <div class="name">${product.name}</div>
        <div class="price">$${product.price}</div>
      </div>
    `;
    gridContainer.appendChild(item);
  });
}

function addToCart(name, price, image) {
  const cartItems = document.querySelector(".cart-items");
  const item = document.createElement("div");
  item.className = "cart-item";
  item.id = `${name}-cart-item`;
  item.innerHTML = `
        <div class="cart-item-left-side"><span class="cart-item-name">${name}</span>
            <div class="cart-item-details">
                <div class="cart-item-quantity"><span id="${name}-count-cart">1</span>x</div>
                <div class="cart-item-price">@ $<span id="${name}-price">${price}</span></div>
                <div class="cart-item-total-price">$<span id="${name}-total">${price}</span></div>
            </div>
        </div>
        <button class="cart-item-right-side"><i class="fa-regular fa-circle-xmark"></i></button>
        
        `;

  const divider = document.createElement("hr");
  divider.className = "cart-item-divider";
  cart.push({
    name: name,
    price: price,
    count: 1,
    image,
  });
  document.querySelector(".count").innerHTML = cart.reduce(
    (acc, item) => acc + item.count,
    0
  );
  cartItems.appendChild(item);
  cartItems.appendChild(divider);

  document.querySelector(".empty-cart").classList.add("hidden");
  document.querySelector(".optional-cart").classList.remove("hidden");

  updateTotal();
}

function increaseCount(name) {
  const item = cart.find((item) => item.name === name);
  if (item) {
    console.log(item);
    item.count += 1;
    const countElement1 = document.getElementById(`${name}-count-grid`);
    const countElement2 = document.getElementById(`${name}-count-cart`);
    countElement1.textContent = item.count;
    countElement2.textContent = item.count;
    const totalPriceElement = document.getElementById(`${name}-total`);
    const newTotalPrice = (item.price * item.count).toFixed(2);
    totalPriceElement.textContent = newTotalPrice;
    document.querySelector(".count").innerHTML = cart.reduce(
      (acc, item) => acc + item.count,
      0
    );
  }

  updateTotal();
}

function decreaseCount(name) {
  const item = cart.find((item) => item.name === name);
  if (item && item.count > 1) {
    item.count -= 1;
    const countElement1 = document.getElementById(`${name}-count-grid`);
    const countElement2 = document.getElementById(`${name}-count-cart`);
    countElement1.textContent = item.count;
    countElement2.textContent = item.count;
    const totalPriceElement = document.getElementById(`${name}-total`);
    const newTotalPrice = (item.price * item.count).toFixed(2);
    totalPriceElement.textContent = newTotalPrice;
    document.querySelector(".count").innerHTML = cart.reduce(
      (acc, item) => acc + item.count,
      0
    );
  } else if (item && item.count === 1) {
    removeFromCart(name, document.getElementById(`${name}-cart-item`));
    document.querySelector(".count").innerHTML = cart.reduce(
      (acc, item) => acc + item.count,
      0
    );
  }

  updateTotal();
}

function createbuttons() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productName = event.target
        .closest(".grid-item")
        .querySelector(".name").textContent;
      const productPrice = event.target
        .closest(".grid-item")
        .querySelector(".price")
        .textContent.replace("$", "");

      const image = event.target
        .closest(".grid-item")
        .querySelector(".product-image");

      image.classList.add("selected-image");
      addToCart(productName, parseFloat(productPrice), image.src);

      button.classList.add("hidden");
      const controlCount = document.getElementById(`${productName}-control`);
      controlCount.classList.remove("hidden");
    });
  });

  document.querySelectorAll(".inc").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productName = event.target
        .closest(".grid-item")
        .querySelector(".name").textContent;

      increaseCount(productName);
    });
  });

  document.querySelectorAll(".dec").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productName = event.target
        .closest(".grid-item")
        .querySelector(".name").textContent;

      decreaseCount(productName);
    });
  });

  document.querySelector(".checkout-button").addEventListener("click", () => {
    document.querySelector(".module").classList.remove("hidden");
    confirmOder();
  });

  document.querySelector(".start-new-order").addEventListener("click", () => {
    continueShopping();
  });
}

function createClearButton() {
  document.querySelector(".right-side").addEventListener("click", (e) => {
    if (e.target.closest(".cart-item-right-side")) {
      const button = e.target.closest(".cart-item-right-side");
      const cartItem = button.closest(".cart-item");
      const itemName = cartItem.querySelector(".cart-item-name").textContent;

      removeFromCart(itemName, cartItem);
    }
  });
}

function removeFromCart(name, cartItemElement) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    cart.splice(index, 1);
  }

  document.querySelectorAll(".grid-item").forEach((gridItem) => {
    const productName = gridItem.querySelector(".name").textContent;
    if (productName === name) {
      gridItem
        .querySelector(".product-image")
        .classList.remove("selected-image");
      gridItem.querySelector(".add-to-cart").classList.remove("active");
    }
  });

  const divider = cartItemElement.nextElementSibling;
  if (divider && divider.classList.contains("cart-item-divider")) {
    divider.remove();
  }

  document.querySelector(".count").innerHTML = cart.reduce(
    (acc, item) => acc + item.count,
    0
  );

  document.querySelectorAll(".grid-item").forEach((gridItem) => {
    const productName = gridItem.querySelector(".name").textContent;
    if (productName === name) {
      gridItem.querySelector(".add-to-cart").classList.remove("hidden");
      document.getElementById(`${productName}-control`).classList.add("hidden");
    }
  });

  const countElement = document.getElementById(`${name}-count-grid`);
  if (countElement) {
    countElement.textContent = "1";
  }
  cartItemElement.remove();

  if (cart.length === 0) {
    document.querySelector(".empty-cart").classList.remove("hidden");
    document.querySelector(".optional-cart").classList.add("hidden");
  }
  updateTotal();
}

function updateTotal() {
  const total = cart.reduce((acc, item) => acc + item.price * item.count, 0);
  const totalElements = document.querySelectorAll(".total");
  totalElements.forEach((totalElement) => {
    totalElement.textContent = `${total.toFixed(2)}`;
  });
  return total.toFixed(2);
}

function confirmOder() {
  const flexContainer = document.querySelector(".order-details");
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const itemElement = document.createElement("div");
    itemElement.className = "order-item";
    itemElement.innerHTML = `
            <img src="${item.image}"  class="order-item-image" />
            <div class="order-item-details">
                <div class="order-item-details-inner">
                    <span class="order-item-name">${item.name}</span>
                    <div class="order-item-details-name-quantity">
                        <span class="order-item-quantity cart-item-quantity">${
                          item.count
                        }x</span>
                        <span class="order-item-price cart-item-price">$${item.price.toFixed(
                          2
                        )}</span>
                    </div>
                </div>
                <span class="order-item-total cart-item-total-price">$${(
                  item.price * item.count
                ).toFixed(2)}</span>
            </div>
            
            
            
        `;

    flexContainer.prepend(itemElement);
  }

  const totalElement = document.createElement("div");
  totalElement.className = "order-total";
  totalElement.innerHTML = `
            <div class="total-label">Order Total</div>
            <div class="total-price">$<span class="total">${updateTotal()}</span></div>
        `;
  flexContainer.appendChild(totalElement);
}

function continueShopping() {
  document.querySelector(".module").classList.add("hidden");
  document.querySelector(".order-details").innerHTML = "";

  const cartCopy = [...cart];

  cartCopy.forEach((item) => {
    const cartItemElement = document.getElementById(`${item.name}-cart-item`);
    if (cartItemElement) {
      removeFromCart(item.name, cartItemElement);
    }
  });

  document.querySelector(".empty-cart").classList.remove("hidden");
  document.querySelector(".optional-cart").classList.add("hidden");
  document.querySelector(".count").innerHTML = "0";
  updateTotal();
}
