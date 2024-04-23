// #region LocalStorage y declaraciones
const carritoLS = localStorage.getItem("productosEnCarrito");
const productosBajadoLS = JSON.parse(localStorage.getItem("productos")) || [];
const nuevosDatosJSON = JSON.stringify(productosBajadoLS);
const blob = new Blob([nuevosDatosJSON], { type: "application/json" });
const url = URL.createObjectURL(blob);
const enlaceDescarga = document.createElement("a");
enlaceDescarga.href = url;
enlaceDescarga.download = "productos_actualizados.json";
enlaceDescarga.innerHTML = `<i class="bi bi-cloud-arrow-down-fill"></i>Descargar listado Actualzado`;

// Agregar el enlace al DOM (por ejemplo, a un div con id "descargas")
document.getElementById("descargas").appendChild(enlaceDescarga);


//! Seleccionamos los elementos del DOM y se crean variables o constantes
const contenedorProductos = document.querySelector("#productos");
const filtros = document.querySelector("#filtros");
const tituloPrincipal = document.querySelector("#tituloPrincipal");
const tituloFiltros = document.querySelector("#tituloFiltros");
const botonFiltro = document.querySelector("#botonFiltro");
const botonCerrar = document.querySelector("#botonCerrar");
const aside = document.querySelector(".filtros");
const numerito = document.querySelector("#contCarrito");
let agregarCarrito = document.querySelectorAll(".agregarProducto");
let carrito;
let ids = [];
let nombres = [];

fetch("../data/productos.json")
    .then((res) => res.json())
    .then((data) => {
        // No reasignamos productos aquí
        !localStorage.getItem("productos") && localStorage.setItem("productos", JSON.stringify(data));
        cargarProductos(data); // Solo llamamos a cargarProductos con los datos obtenidos del fetch
        categoriaIds();
    })
    .then(() => {
        // Una vez que los elementos del DOM han sido creados dinámicamente, podemos acceder a ellos
        const categorias = document.querySelectorAll(".botonCategoria");
        categorias.forEach( boton => {
            boton.addEventListener("click", (e) => {
        
                categorias.forEach( boton => boton.classList.remove("current"));
                
                e.currentTarget.classList.add("current");
                aside.classList.remove("filtroMobile");
                botonFiltro.classList.remove("disabled");
        
                if(e.currentTarget.id != "todos"){
                    const findProductos = productos.find(producto => producto.categoria.id === e.currentTarget.id);
                    tituloPrincipal.innerText = boton.ariaValueText;
                    const filtroProductos = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
                    cargarProductos(filtroProductos);
                    
                } else {
                    tituloPrincipal.innerText = "Todos los Productos";
                    cargarProductos(productos);
                }
            })
        });
    });

// #region Categorias y Filtros
function categoriaIds(){
    productos.forEach(producto => {
        if (!ids.includes(producto.categoria.id)) {
            ids.push(producto.categoria.id);
        }
        if (!nombres.includes(producto.categoria.nombre)) {
            nombres.push(producto.categoria.nombre);
        }
    });

    // Crear elementos de categoría
    for(let i = 0; i < ids.length; i++){
        const li = document.createElement("li");
        const categoriaHTML = `<button aria-valuetext="${nombres[i]}" id="${ids[i]}" class="btnShop botonCategoria">${nombres[i]}</button>`;
        li.innerHTML = categoriaHTML;
        filtros.appendChild(li);
    }
}

//* Si hay informacion en el LocalStorae de carrito actualiza el numero o lo deja en 0
if(carritoLS){
    carrito = JSON.parse(carritoLS);
    actualizarNumerito();
} else {
    carrito = [];
}

//* Muestra los productos segun la categoria
function cargarProductos(select){
    productos = JSON.parse(localStorage.getItem("productos")) || [];
    responsive();
    contenedorProductos.innerHTML = "";
    select.forEach(producto => {
        const div = document.createElement("div");
        const itemHTML = `  <img src="${producto.imagen}" alt="${producto.titulo}">
                            <div class="itemDetalles">
                                <h3 class="itemTitulo"> ${producto.titulo} </h3>
                                <p class="itemPrecio"> $${producto.precio.toLocaleString('es-AR')} </p>
                                <button class="agregarProducto" id="${producto.id}">agregar</button>
                            </div>`;
        div.classList.add("item")
        div.innerHTML = itemHTML;
        contenedorProductos.append(div);
    })
    actualizarAgregarCarrito();
};

//* Lector de evento de los botones "agregar al carrito"
function actualizarAgregarCarrito(){
    agregarCarrito = document.querySelectorAll(".agregarProducto");
    agregarCarrito.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito)
    });
}

//* Actualiza el array y el LocalStorage de productos agreggados al carrito
function agregarAlCarrito(e){
    const idBoton = e.currentTarget.id;
    const item = productos.find(producto => producto.id === idBoton);
    const productoAgregado = productos.find(producto => producto.id === idBoton);
    Swal.fire({
        title: "Electricidad Pittana",
        text: `Quieres agregar ${item.titulo} al carrito`,
        icon: "question",
        showCancelButton: "true",
        showCloseButton: "true",
        cancelButtonText: "Deshacer",
        confirmButtonText: "Agregar y seguir comprando.",

        customClass: {
            popup: 'sweet',
            title: 'tituloG',
            confirmButton: 'btnSweet',
            cancelButton: 'btnSweet',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            if(carrito.some(producto => producto.id === idBoton)){
                const index = carrito.findIndex(producto => producto.id === idBoton);
                carrito[index].cantidad ++;
            } else {
                productoAgregado.cantidad = 1;
                carrito.push(productoAgregado);
            }
            actualizarNumerito();
            localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
            toastify(item);
        }
    });
};

//* Actualiza el contador visible de produsctos en el carrito
function actualizarNumerito(){
    let nuevoNumerito = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
};

//* Agrega o quita segun el caso la clase "filtroMobile" para el responsive
function responsive(){
    botonFiltro.addEventListener("click", () => {
        aside.classList.add("filtroMobile");
        botonFiltro.classList.add("disabled");
    })
    botonCerrar.addEventListener("click", () => {
        aside.classList.remove("filtroMobile");
        botonFiltro.classList.remove("disabled");
    })
};

//* Muestra toastify cuando agregas un producto al carrito
function toastify(item){
    Toastify({
        text: `Se agrego el articulo ${item.titulo} a tu carrito`,
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
}