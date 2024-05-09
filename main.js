document.addEventListener("DOMContentLoaded", () => {
    // Estando solo en el index.html se ejecutaran las funciones que contiene, para no tener errores en carrito.html!!!
    if (window.location.pathname.includes("index.html")) {
        fetch('./productos.json')
            .then(response => response.json())
            .then(datos => {
                productos = datos; // obtiene y guarda los datos en la variable
                cargarCarritoDesdeLS(); 
                mostrarProductos();            
                actualizarNumeroCarrito();
                const categorias = document.querySelectorAll(".boton-categoria");
                categorias.forEach(categoria => {
                    categoria.addEventListener("click", (event) => {
                        event.preventDefault();
                        const categoriaSeleccionada = event.target.id;
                        filtrarProductos(categoriaSeleccionada);
                    });
                });
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
            });
    }
});

//VARIABLES
let carrito = [];
let productos = [];

function mostrarProductos() {
    const main = document.getElementById("productos");
    main.innerHTML = "";
    productos.forEach(producto => { 
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

function agregarAlCarrito(productId) {
    const productoExistente = carrito.find(item => item.id === productId);
    const producto = productos.find(item => item.id === productId); 
    if (productoExistente) {
        if (productoExistente.cantidad < producto.stock) {
            productoExistente.cantidad++;
            actualizarNumeroCarrito();
            guardarLocalS();
            calcularTotal();
            Swal.fire({
                position: "center",
                icon: "success",
                title: ` ${producto.nombre} se añadió al carrito`,
                showConfirmButton: false,
                timer: 1000
            });
        } else {
            mostrarMensaje("No hay suficiente stock disponible para este producto.");
        }
    } else {
        if (producto.stock > 0) {
            carrito.push({ id: productId, cantidad: 1 });
            actualizarNumeroCarrito();
            guardarLocalS();
            calcularTotal();
            Swal.fire({
                position: "center",
                icon: "success",
                title: ` ${producto.nombre} se añadió al carrito`,
                showConfirmButton: false,
                timer: 1000
            });
        } else {
            mostrarMensaje("Este producto está agotado.");
        }
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

function filtrarProductos(categoria) {
    const main = document.getElementById("productos");
    main.innerHTML = "";
    if (categoria === "Inicio") {
        mostrarProductos(productos);
        document.getElementById("titulo-principal").textContent = `Todos los productos`;
    } else {
        const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
        if (productosFiltrados.length > 0) {
            productosFiltrados.forEach(producto => {
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
            document.getElementById("titulo-principal").textContent = `Productos de la categoría ${categoria}`;
        } else {
            main.innerHTML = "<p>No hay productos en esta categoría.</p>";
            document.getElementById("titulo-principal").textContent = `Productos de la categoría ${categoria}`;
        }
    }
}

function mostrarMensaje(mensaje) {
    const mensajeDeAviso = document.getElementById("mensaje");
    mensajeDeAviso.textContent = mensaje;
    mensajeDeAviso.classList.remove("hidden");
    setTimeout(() => {
        mensajeDeAviso.classList.add("hidden");
    }, 3000); // Oculta el mensaje después de 3s
}

function actualizarNumeroCarrito() {
    const numeroCarritoElement = document.getElementById("numero-carrito");
    const cantidadProductosEnCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
    numeroCarritoElement.textContent = cantidadProductosEnCarrito;
}

// LOCAL STORAGE
function guardarLocalS() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeLS() {
    const carritoLocalStorage = localStorage.getItem("carrito");
    if (carritoLocalStorage) {
        carrito = JSON.parse(carritoLocalStorage);
    }
}
