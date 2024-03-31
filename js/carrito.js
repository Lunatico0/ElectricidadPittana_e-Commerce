const carrito = JSON.parse(localStorage.getItem("productosEnCarrito")) || [];

let eliminar = document.querySelectorAll(".eliminarArticulo");
const carritoEmpty = document.querySelector("#carritoEmpty");
const carritoItem = document.querySelector("#carritoItem");
const carritoAcciones = document.querySelector("#carritoAcciones");
const comprado = document.querySelector("#comprado");
const comprar = document.querySelector("#comprar");
const vaciar = document.querySelector("#carritoAccionesVaciar");
const total = document.querySelector("#total");
const botonFiltro = document.querySelector("#botonFiltro");
const botonCerrar = document.querySelector("#botonCerrar");
const mediaQuery = window.matchMedia('(max-width: 845px)');
comprar.addEventListener("click", comprarCarro);
vaciar.addEventListener("click", vaciarCarro);
cargarItems();
const carritoItems = document.querySelectorAll(".itemProducto");

function cargarItems() {
    responsive();
    if (carrito && carrito.length > 0) {

        carritoEmpty.classList.add("disabled");
        carritoItem.classList.remove("disabled");
        carritoAcciones.classList.remove("disabled");
        comprado.classList.add("disabled");

        carritoItem.innerHTML = "";

        carrito.forEach(producto => {
            const div = document.createElement("div");
            const subtotal = producto.precio * producto.cantidad;
            div.classList.add("itemProducto");
            div.innerHTML = `
                <div class="imagen">
                    <img src="${producto.imagen}" alt="${producto.titulo}">
                </div>
                <div class="detalles">
                    <div class="carritoProductoTitulo">
                        <h4>Titulo</h4>
                        <h3>${producto.titulo}</h3>
                    </div>
                    <div class="carritoProductoCantidad">
                        <h4>Cantidad</h4>
                        <h3>${producto.cantidad}</h3>
                    </div>
                    <div class="carritoProductoPrecio">
                        <h4>Precio</h4>
                        <h3>$${producto.precio.toLocaleString('es-AR')}</h3>
                    </div>
                    <div class="carritoProductoSubtotal">
                        <h4>Subtotal</h4>
                        <h3>$${subtotal.toLocaleString('es-AR')}</h3>
                    </div>
                    <button class="eliminarArticulo" id="${producto.id}" ><i class="bi bi-trash3"></i></button>
                </div>
            `;
            carritoItem.append(div);
        });

    } else {
        carritoEmpty.classList.remove("disabled");
        carritoItem.classList.add("disabled");
        carritoAcciones.classList.add("disabled");
        comprado.classList.add("disabled");
    }
    botonesEliminar();
    actualizarTotal();
}

function botonesEliminar() {
    eliminar = document.querySelectorAll(".eliminarArticulo");
    eliminar.forEach(boton => {
        boton.addEventListener("click", eliminarItem)
    });
}

function eliminarItem(e) {
    const idBoton = e.currentTarget.id;
    const index = carrito.findIndex(producto => producto.id === idBoton);
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    cargarItems();
    localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
}

function vaciarCarro() {
    carrito.length = 0;
    localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
    cargarItems();
}

function actualizarTotal() {
    const totalCalculado = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado.toLocaleString('es-AR')}`;
}

function comprarCarro() {
    carrito.length = 0;
    localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));

    carritoEmpty.classList.add("disabled");
    carritoItem.classList.add("disabled");
    carritoAcciones.classList.add("disabled");
    comprado.classList.remove("disabled");
}

function responsive() {
    botonFiltro.addEventListener("click", () => {
        const aside = document.querySelector(".filtros");
        aside.classList.add("filtroMobile");
        botonFiltro.classList.add("disabled");
    })
    botonCerrar.addEventListener("click", () => {
        const aside = document.querySelector(".filtros");
        aside.classList.remove("filtroMobile");
        botonFiltro.classList.remove("disabled");
    })
}

function cambiarImagenBackground() {
    carritoItems.forEach((item, index) => {
        const productoActual = carrito[index];
        const div = item.querySelector(".detalles")
        const divImagen = item.querySelector('.imagen');
        const imagen = item.querySelector('.imagen img');
        imagen.classList.add('disabled');
        divImagen.classList.add('disabled');
        div.style.backgroundImage = `url(${productoActual.imagen})`;
    });
};


mediaQuery.addEventListener('change', (event) => {
    if (mediaQuery.matches) {
        cambiarImagenBackground();
    }else if (!mediaQuery.matches){
        carritoItems.forEach((item, index) => {
            const productoActual = carrito[index];
            const div = item.querySelector(".detalles")
            const imagen = item.querySelector(".imagen img");
            const divImagen = item.querySelector('.imagen');
            divImagen.classList.remove('disabled');
            imagen.classList.remove("disabled");
            div.classList.remove("disabled");
            div.style.backgroundImage = "none";
        });
    }
});

if (mediaQuery.matches) {
    cambiarImagenBackground();
} else if (!mediaQuery.matches){
    carritoItems.forEach((item, index) => {
        const productoActual = carrito[index];
        const div = item.querySelector(".detalles")
        const imagen = item.querySelector(".imagen img");
        const divImagen = item.querySelector('.imagen');
        divImagen.classList.remove('disabled');
        imagen.classList.remove("disabled");
        div.classList.remove("disabled");
        div.style.backgroundImage = "none";
    });
}