
const productos = [
    {
        id: 1,
        nombre: "Camiseta",
        categoria: "Ropa",
        precio: 20,
        stock: 10,
        imagen: "./imagenes/outfits/7 ideas de outfits perfectos para ir a la playa en Semana Santa.png",
    },
    {
        id: 2,
        nombre: "Pantalón",
        categoria: "Ropa",
        precio: 30,
        stock: 5,
        imagen: "./imagenes/outfits/des.jpg",
    },
    {
        id: 3,
        nombre: "Zapatos",
        categoria: "Calzado",
        precio: 50,
        stock: 8,
        imagen: "./imagenes/zapatos/zapatos.png",
    },
    {
        id: 4,
        nombre: "Aros",
        categoria: "Accesorios",
        precio: 25,
        stock: 15,
        imagen: "./imagenes/accesorios.png",
    },
    {
        id: 5,
        nombre: "Camiseta",
        categoria: "Ropa",
        precio: 20,
        stock: 10,
        imagen: "./imagenes/outfits/7 ideas de outfits perfectos para ir a la playa en Semana Santa.png",
    },
    {
        id: 6,
        nombre: "Pantalón",
        categoria: "Ropa",
        precio: 30,
        stock: 5,
        imagen: "./imagenes/outfits/des.jpg",
    },
    {
        id: 7,
        nombre: "Zapatos",
        categoria: "Calzado",
        precio: 50,
        stock: 8,
        imagen: "./imagenes/zapatos/zapatos.png",
    },
    {
        id: 8,
        nombre: "Aros",
        categoria: "Accesorios",
        precio: 25,
        stock: 15,
        imagen: "./imagenes/accesorios.png",
    }
];

let carrito = [];

function actualizarNumeroCarrito() {
    const numeroCarritoElement = document.getElementById("numero-carrito");
    const cantidadProductosEnCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
    numeroCarritoElement.textContent = cantidadProductosEnCarrito;

}

function calcularTotal() {
    const total = carrito.reduce((acumulador, item) => {
        const producto = productos.find(producto => producto.id === item.id);
        return acumulador + (producto.precio * item.cantidad);
    }, 0);
    return total.toFixed(2);
}

function mostrarProductos() {
    const main = document.getElementById("productos");
    main.innerHTML = "";
    productos.forEach(producto => {
        /* const productoEnCarrito = carrito.find(item => item.id === producto.id);
        const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0; */
        const productoHTML = `
            <div class="producto">
                <div class="contenedor-img"><img class="img-producto" src="${producto.imagen}" alt="${producto.nombre}"></div>
                <h3>${producto.nombre}</h3>
                <p>Categoría: ${producto.categoria}</p>
                <p>Precio: $${producto.precio}</p>
                <p>Stock: ${producto.stock}</p>
                <button class="agregar-al-carrito" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            </div>
        `;
        main.innerHTML += productoHTML;
    });
}

function mostrarCarrito() {
    const carritoElement = document.getElementById("carrito-lista");
    carritoElement.innerHTML = `
        <li class="carrito-header">
            <span>Producto</span>
            <span>Nombre</span>
            <span>Precio</span>
            <span>Cantidad</span>
            <span>Subtotal</span>
            <span class="titulo-boton-eliminar"></span>
        </li>
    `;
    carrito.forEach(item => {
        const productoEnCarrito = productos.find(producto => producto.id === item.id);
        const subtotal = productoEnCarrito.precio * item.cantidad;
        const itemHTML = `
            <li>
                <img src="${productoEnCarrito.imagen}" alt="${productoEnCarrito.nombre}" class="carrito-imagen">
                <span>${productoEnCarrito.nombre}</span>
                <span>$${productoEnCarrito.precio.toFixed(2)}</span>
                <input type="number" value="${item.cantidad}" min="1" max="${productoEnCarrito.stock}" onchange="cambiarCantidad(${item.id}, this.value)">
                <span>$${subtotal.toFixed(2)}</span>
                <button class="carrito-prod-eliminar" onclick="eliminarProducto(${productoEnCarrito.id})"><i class="bi bi-trash-fill"></i></button>
            </li>
        `;

        carritoElement.innerHTML += itemHTML;
    });

    // Mostrar el total a pagar
    const totalPagarElement = document.getElementById("total-pagar");
    totalPagarElement.textContent = calcularTotal();
}

function mostrarMensaje(mensaje) {
    const mensajeDeAviso = document.getElementById("mensaje");
    mensajeDeAviso.textContent = mensaje;
    mensajeDeAviso.classList.remove("hidden");
    setTimeout(() => {
        mensajeDeAviso.classList.add("hidden");
    }, 3000); // Oculta el mensaje después de 3s
}

function agregarAlCarrito(productId) {
    const productoExistente = carrito.find(item => item.id === productId);
    const producto = productos.find(item => item.id === productId);
    if (productoExistente) {
        if (productoExistente.cantidad < producto.stock) {
            productoExistente.cantidad++;
            mostrarCarrito();
            actualizarNumeroCarrito();
        } else {
            mostrarMensaje("No hay suficiente stock disponible para este producto.");
        }
    } else {
        if (producto.stock > 0) {
            carrito.push({ id: productId, cantidad: 1 });
            mostrarCarrito();
            actualizarNumeroCarrito();
            guardarLocalS();
        } else {
            mostrarMensaje("Este producto está agotado.");
        }
    }

}

function cambiarCantidad(productId, nuevaCantidad) {
    const productoExistente = carrito.find(item => item.id === productId);
    const producto = productos.find(item => item.id === productId);
    if (productoExistente && nuevaCantidad > 0 && nuevaCantidad <= producto.stock) {
        productoExistente.cantidad = parseInt(nuevaCantidad);
        mostrarCarrito();
        actualizarNumeroCarrito();
        guardarLocalS();
    } else {
        mostrarMensaje("La cantidad ingresada no es válida.");
    }
}

function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
    actualizarNumeroCarrito();
    guardarLocalS();
}

function comprar() {
    // Debo agregar la lógica para finalizar la compra.
    const totalPagar = calcularTotal();
    if (totalPagar > 0) {
        vaciarCarrito();
        mostrarMensaje(`Compra realizada con éxito. Total pagado: $${totalPagar}. Gracias por su compra.`);
    } else {
        mostrarMensaje("Agrega algo a tu carrito para realizar la compra")
    }

}

document.addEventListener("DOMContentLoaded", () => {
    cargarCarritoDesdeLS();
    mostrarProductos();
    document.getElementById("carrito-link").addEventListener("click", () => {
        document.getElementById("carrito").classList.toggle("hidden");
    });
    document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);
    document.getElementById("comprar").addEventListener("click", comprar);
    document.getElementById("cerrar-carrito").addEventListener("click", () => {
        document.getElementById("carrito").classList.add("hidden");
    });
});


function eliminarProducto(productId) {
    carrito = carrito.filter(item => item.id !== productId);
    mostrarCarrito();
    actualizarNumeroCarrito();
    guardarLocalS();
}


//LOCAL STORAGE.
function guardarLocalS() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
function cargarCarritoDesdeLS() {
    const carritoLocalStorage = localStorage.getItem("carrito");
    if (carritoLocalStorage) {
        carrito = JSON.parse(carritoLocalStorage);
        mostrarCarrito();
        actualizarNumeroCarrito();
    }
}



