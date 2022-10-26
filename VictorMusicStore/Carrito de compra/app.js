// Selección de elementos
const productsEl = document.querySelector(".products");
const cartItemsEl = document.querySelector(".cart-items");
const subtotalEl = document.querySelector(".subtotal");
const totalItemsInCartEl = document.querySelector(".total-items-in-cart");

// Renderizar productos
function renderizarProductos() {
  productos.forEach((product) => {
    productsEl.innerHTML += `
            <div class="item">
                <div class="item-container">
                    <div class="item-img">
                        <img src="${product.imgSrc}" alt="${product.nombre}">
                    </div>
                    <div class="desc">
                        <h2>${product.nombre}</h2>
                        <h2><small>$</small>${product.precio}</h2>
                        <p>
                            ${product.descripcion}
                        </p>
                    </div>
                    <div class="add-to-wishlist">
                        <img src="https://res.cloudinary.com/dldvgt3pe/image/upload/v1666769869/heart_ydpi0l.png" alt="add to wish list">
                    </div>
                    <div class="add-to-cart" onclick="agregarAlCarrito(${product.id})">
                        <img src="https://res.cloudinary.com/dldvgt3pe/image/upload/v1666769851/bag-plus_podsbe.png" alt="add to cart">
                    </div>
                </div>
            </div>
        `;
  });
}
renderizarProductos();

// Arreglo carrito
let carrito = JSON.parse(localStorage.getItem("CARRITO")) || [];
actualizarCarrito();

// Agregar al carrito
function agregarAlCarrito(id) {
  // verificación de elementos ya existentes en el carrito
  if (carrito.some((item) => item.id === id)) {
    actualizarUnidades("mas", id);
  } else {
    const item = productos.find((product) => product.id === id);

    carrito.push({
      ...item,
      numeroDeUnidades: 1,
    });
  }

  actualizarCarrito();
}

// Actualizar carrito
function actualizarCarrito() {
  renderizarItemsCarrito();
  renderizarSubtotal();

  // Guardar en el local storage
  localStorage.setItem("CARRITO", JSON.stringify(carrito));
}

// Calcular y renderizar el subtotal
function renderizarSubtotal() {
  let totalPrice = 0,
    totalItems = 0;

    carrito.forEach((item) => {
    totalPrice += item.precio * item.numeroDeUnidades;
    totalItems += item.numeroDeUnidades;
  });

  subtotalEl.innerHTML = `Subtotal (${totalItems} items): $${totalPrice.toFixed(2)}`;
  totalItemsInCartEl.innerHTML = totalItems;
}

// Renderizar items del carrito
function renderizarItemsCarrito() {
  cartItemsEl.innerHTML = ""; // Eliminar algún elemento del carrito
  carrito.forEach((item) => {
    cartItemsEl.innerHTML += `
        <div class="cart-item">
            <div class="item-info" onclick="eliminarProductoDelCarrito(${item.id})">
                <img src="${item.imgSrc}" alt="${item.nombre}">
                <h4>${item.nombre}</h4>
            </div>
            <div class="unit-price">
                <small>$</small>${item.precio}
            </div>
            <div class="units">
                <div class="btn menos" onclick="actualizarUnidades('menos', ${item.id})">-</div>
                <div class="number">${item.numeroDeUnidades}</div>
                <div class="btn mas" onclick="actualizarUnidades('mas', ${item.id})">+</div>           
            </div>
        </div>
      `;
  });
}

// Eliminar elemento del carrito
function eliminarProductoDelCarrito(id) {
  carrito = carrito.filter((item) => item.id !== id);

  actualizarCarrito();
}

// Actualizar el numero de unidades en el
function actualizarUnidades(action, id) {
  carrito = carrito.map((item) => {
    let numeroDeUnidades = item.numeroDeUnidades;

    if (item.id === id) {
      if (action === "menos" && numeroDeUnidades > 1) {
        numeroDeUnidades--;
      } else if (action === "mas" && numeroDeUnidades < item.instock) {
        numeroDeUnidades++;
      }
    }

    return {
      ...item,
      numeroDeUnidades,
    };
  });

  actualizarCarrito();
}
