const carrito = JSON.parse(localStorage.getItem("productosEnCarrito")) || [];

// #region localStorage y declaraciones
//! Se seleccionan los elementos del DOM y se crean variables o constantes
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
const carritoItems = document.querySelectorAll(".itemProducto");

comprar.addEventListener("click", comprarCarro);
vaciar.addEventListener("click", vaciarCarro);
cargarItems();

//* Muestra los items agregados al carrito
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
            const htmlItem = `  <div class="imagen">
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
                                </div>`;
            
            div.classList.add("itemProducto");
            div.innerHTML = htmlItem;
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
    if (mediaQuery.matches) {
        cambiarImagenBackground();
    } else {
        removeBackgroundImage();
    }
};

//* Lector de evento de los botones "Eliminar producto"
function botonesEliminar() {
    eliminar = document.querySelectorAll(".eliminarArticulo");
    eliminar.forEach(boton => { boton.addEventListener("click", eliminarItem) });
};

//* Disminuir la cantidad o eliminar articulo + Toastify
function eliminarItem(e) {
    const idBoton = e.currentTarget.id;
    const tituloItem = carrito.find(producto => producto.id === idBoton);
    const index = carrito.findIndex(producto => producto.id === idBoton);
    const toastTituloItem = `Se elimino el articulo ${tituloItem.titulo}`;

    carrito[index].cantidad > 1 ? carrito[index].cantidad-- : carrito.splice(index, 1);

    cargarItems();
    localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
    toastify(toastTituloItem);
};

//* Eliminar todos los items del carrito + Toastify
function vaciarCarro() {
    const toastCarritoVaciado = "Has vaciado tu carrito";
    Swal.fire({
        title: "Electricidad Pittana",
        text: "Quieres eliminar " + carrito.length + " articulos?",
        icon: "question",
        showCancelButton: "true",
        showCloseButton: "true",
        cancelButtonText: "Deshacer",
        confirmButtonText: "Confirmar",
        customClass: {
            popup: 'sweet',
            title: 'tituloG',
            confirmButton: 'btnSweet',
            cancelButton: 'btnSweet',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Electricidad Pittana",
                text: toastCarritoVaciado,
                showCloseButton: "true",
                icon: "success",
                customClass: {
                    popup: 'sweet',
                    title: 'tituloG',
                    confirmButton: 'btnSweet',
                    cancelButton: 'btnSweet',
                },
            });
            carrito.length = 0;
            localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
            toastify(toastCarritoVaciado);
            cargarItems();
        } else {
            cargarItems();
        }
    });
};

//* Muestra el total a pagar del carrito completo
function actualizarTotal() {
    const totalCalculado = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado.toLocaleString('es-AR')}`;
};

//* Comprar todos los items del carrito + Toastify
function comprarCarro() {
    const toastCarritoComprado = `🎉Felicidades por tu compra. 🛒🎉`;

    Swal.fire({
        title: "Electricidad Pittana",
        text: "Confirmar compra de " + carrito.length + " articulos?",
        icon: "question",
        showCancelButton: "true",
        showCloseButton: "true",
        cancelButtonText: "Deshacer",
        confirmButtonText: "Confirmar",
        customClass: {
            popup: 'sweet',
            title: 'tituloG',
            confirmButton: 'btnSweet',
            cancelButton: 'btnSweet',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Electricidad Pittana",
                text: toastCarritoComprado,
                showCloseButton: "true",
                icon: "success",
                customClass: {
                    popup: 'sweet',
                    title: 'tituloG',
                    confirmButton: 'btnSweet',
                    cancelButton: 'btnSweet',
                },
            });
            carritoEmpty.classList.add("disabled");
            carritoItem.classList.add("disabled");
            carritoAcciones.classList.add("disabled");
            comprado.classList.remove("disabled");
            carrito.length = 0;
            localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
            toastify(toastCarritoComprado);
        } else {
            cargarItems();
        }
    });
};

// #region Responsive y toastify
//* Agrega o quita segun el caso la clase "filtroMobile" para el responsive
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
};

//* Al visualizarlo desde mobile la imagen de cada item se pone como "background" de cada "div .detalles"
function cambiarImagenBackground() {
    if (carrito && carrito.length > 0){
        const hijosCarritoItem = carritoItem.children;
        for (let i = 0; i < hijosCarritoItem.length; i++) {
            const elementoHijo = hijosCarritoItem[i];
            const div = elementoHijo.querySelector(".detalles");
            const divImagen = elementoHijo.querySelector('.imagen');
            const imagen = elementoHijo.querySelector('.imagen img');
            imagen.classList.add('disabled');
            divImagen.classList.add('disabled');
            const idDiv = elementoHijo.querySelector(".eliminarArticulo")
            const idProducto = idDiv.id;
            const productoActual = carrito.find(producto => producto.id === idProducto);
            div.style.backgroundImage = `url(${productoActual.imagen})`;
        }
    }
}

//* Lector de evento de cando cambia el tamaño del viewPort
mediaQuery.addEventListener('change', (event) => {
    if (mediaQuery.matches) {
        cambiarImagenBackground();
    } else {
        removeBackgroundImage();
    }
});

//* Devuelve todo a su sitio al visualizarlo desde la vista de escritorio
function removeBackgroundImage() {
    if (carrito && carrito.length > 0){
        const hijosCarritoItem = carritoItem.children;
        for (let i = 0; i < hijosCarritoItem.length; i++) {
            const elementoHijo = hijosCarritoItem[i];
            const div = elementoHijo.querySelector(".detalles");
            const divImagen = elementoHijo.querySelector('.imagen');
            const imagen = elementoHijo.querySelector('.imagen img');
            imagen.classList.remove('disabled');
            divImagen.classList.remove('disabled');
            div.classList.remove("disabled");
            div.style.backgroundImage = "none";
            const idDiv = elementoHijo.querySelector(".eliminarArticulo")
            const idProducto = idDiv.id;
            const productoActual = carrito.find(producto => producto.id === idProducto);
            divImagen.innerHTML = `<img src="${productoActual.imagen}" alt="${productoActual.titulo}">`
        }
    }
};

//* Muestra toastify cuando llamas a la funcion dandole como parametro el mensaje
function toastify(titulo){
    Toastify({
        text: titulo,
        duration: 3000,
        gravity: "top",
        close: true,
        style: {
            background: "linear-gradient(to left, #333, #111",
            color: "white",
            borderRadius: "1rem",
            border: "solid, 2px, #f3f3f3",
        }
    }).showToast();
    return;
};