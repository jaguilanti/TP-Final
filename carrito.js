function cargarCarritoDesdeLS() {
    const carritoLocalStorage = localStorage.getItem("carrito");
    if (carritoLocalStorage) {
        carrito = JSON.parse(carritoLocalStorage);
        mostrarCarrito()
    }
}
function calcularTotal() {
    let total = 0;
    for (const item of carrito) {
        const index = productos.findIndex(producto => producto.id === item.id);
        if (index !== -1) {
            total += productos[index].precio * item.cantidad;
        }
    }
    return total.toFixed(2);
}
function mostrarCarrito() {
    const carritoElement = document.getElementById("carrito-lista");
    const totalPagarElement = document.getElementById("total-pagar"); // Elemento donde mostrar el total

    if (carrito.length === 0) {
        carritoElement.innerHTML = `<p class="tituloVacio">El carrito está vacío</p>`;
        totalPagarElement.textContent = "0.00"; // Establece el total a pagar como 0 si el carrito está vacío
    } else {
        let totalPagar = 0; // Inicializa la variable para el total a pagar
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
            totalPagar += subtotal; // Suma el subtotal al total a pagar
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
        totalPagarElement.textContent = totalPagar.toFixed(2); // Establece el total a pagar en el elemento correspondiente
    }
    actualizarNumeroCarrito();
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

document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);
document.getElementById("comprar").addEventListener("click", comprar);
actualizarNumeroCarrito();

