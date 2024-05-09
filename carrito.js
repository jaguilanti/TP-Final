document.addEventListener("DOMContentLoaded", () => {
    cargarCarritoDesdeLS();
    fetch('./productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
            mostrarCarrito();
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});

//Para poder llamar a la funcion correspondiente, escuchamos si el usuario hace click  
document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);
document.getElementById("comprar").addEventListener("click", comprar);

function mostrarCarrito() {
    const carritoElement = document.getElementById("carrito-lista");
    const totalPagarElement = document.getElementById("total-pagar");

    if (carrito.length === 0) {
        carritoElement.innerHTML = `<p class="tituloVacio">El carrito está vacío</p>`;
        totalPagarElement.textContent = "0.00";
    } else {
        let totalPagar = 0;
        carritoElement.innerHTML = `
            <li class="carrito-header">
                <span class="prod">Producto</span>
                <span class="nom">Nombre</span>
                <span class="pre">Precio</span>
                <span class="cant">Cantidad</span>
                <span class="sub">Subtotal</span>
                <span class="titulo-boton-eliminar"></span>
            </li>
        `;
        carrito.forEach(item => {
            const productoEnCarrito = productos.find(producto => producto.id === item.id);
            const subtotal = productoEnCarrito.precio * item.cantidad;
            totalPagar += subtotal; // Suma el subtotal al total a pagar, NO EL TOTAL!!
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
        totalPagarElement.textContent = totalPagar.toFixed(2); //AQUI SE SUMA EL TOTAL!!
    }
    actualizarNumeroCarrito();
}

// Cambiamos la cantidad en el imput 
function cambiarCantidad(productId, nuevaCantidad) {
    const productoExistente = carrito.find(item => item.id === productId);
    const producto = productos.find(item => item.id === productId);
    if (productoExistente && nuevaCantidad > 0 && nuevaCantidad <= producto.stock) {
        productoExistente.cantidad = parseInt(nuevaCantidad);
        mostrarCarrito();
        actualizarNumeroCarrito();
        guardarLocalS();
        calcularTotal();
    } else {
        mostrarMensaje("La cantidad ingresada no es válida.");
    }
}

// Eliminamos un producto del carrito
function eliminarProducto(productId) {
    carrito = carrito.filter(item => item.id !== productId);
    const producto = productos.find(item => item.id === productId);
    mostrarCarrito();
    actualizarNumeroCarrito();
    guardarLocalS();
    Swal.fire({
        position: "top-right",
        title: `${producto.nombre} se eliminó del carrito`,
        showConfirmButton: false,
        timer: 800
    });
}

function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
    actualizarNumeroCarrito();
    guardarLocalS();
    mostrarMensaje("¡El carrito ha sido vaciado!");
}

function comprar() {
    const totalPagar = calcularTotal();
    if (totalPagar > 0) {
        vaciarCarrito();

        Swal.fire({
            position: "center",
            icon: "success",
            title: `Compra realizada con éxito. Total a pagar: $${totalPagar}. Gracias por su compra.`,
            showConfirmButton: false,
            timer: 3000
        });
    } else {
        mostrarMensaje("¡Agrega algo a tu carrito para realizar una compra!");
    }
}

