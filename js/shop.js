// productos para inicializar el localStorage
let productos = [
    {
        id: "polea",
        titulo: "Polea",
        imagen: "../media/shop/polea_alt.png",
        categoria: {
            nombre: "Alternadores",
            id: "alternadores"
        },
        precio: 47252
    },
    {
        id: "rotor",
        titulo: "Rotor",
        imagen: "../media/shop/rotor_alt.png",
        categoria: {
            nombre: "Alternadores",
            id: "alternadores"
        },
        precio: 89558
    },
    {
        id: "estator",
        titulo: "Estator",
        imagen: "../media/shop/estator_alt.png",
        categoria: {
            nombre: "Alternadores",
            id: "alternadores"
        },
        precio: 47944
    },
    {
        id: "arranque-nuevo",
        titulo: "Arranque Nuevo",
        imagen: "../media/img/productos_arranque.png",
        categoria: {
            nombre: "Arranques",
            id: "arranques"
        },
        precio: 168750
    },
    {
        id: "impulsor",
        titulo: "Impulsor",
        imagen: "../media/shop/impulsor_arr.png",
        categoria: {
            nombre: "Arranques",
            id: "arranques"
        },
        precio: 23031
    },
    {
        id: "solenoide",
        titulo: "Solenoide",
        imagen: "../media/shop/solenoide_arr.png",
        categoria: {
            nombre: "Arranques",
            id: "arranques"
        },
        precio: 36995
    },
    {
        id: "campos",
        titulo: "Campos",
        imagen: "../media/shop/campos_arr.png",
        categoria: {
            nombre: "Arranques",
            id: "arranques"
        },
        precio: 44765
    },
];

// Se actualiza el localStorage con los productos
if(!localStorage.getItem("productos")){
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Se comprueba si existen productos en el localStorage, de lo contrario se inicializa con un array vacío
productos = JSON.parse(localStorage.getItem("productos")) || [];

const carritoItems = document.querySelectorAll('.itemProducto');

// Aquí defines tu media query
const mediaQuery = window.matchMedia('(max-width: 768px)');

// Función para cambiar la imagen por background-image
function cambiarImagenBackground() {
    carritoItems.forEach(item => {
        item.classList.add('disabled');
        const imagenSrc = item.querySelector('.imagen img').src;
        item.style.backgroundImage = `url(${imagenSrc})`;
    });
}

// Verifica si la media query se cumple inicialmente
if (mediaQuery.matches) {
    cambiarImagenBackground();
}

// Agrega un listener para cambiar la imagen cuando la media query se active
mediaQuery.addListener((event) => {
    if (event.matches) {
        cambiarImagenBackground();
    }
});

// Se seleccionan los elementos del DOM
const contenedorProductos = document.querySelector("#productos");
const filtros = document.querySelector("#filtros");
const tituloPrincipal = document.querySelector("#tituloPrincipal");
const tituloFiltros = document.querySelector("#tituloFiltros");
const carritoLS = localStorage.getItem("productosEnCarrito");
const productosBajadoLS = JSON.parse(localStorage.getItem("productos")) || [];
const botonFiltro = document.querySelector("#botonFiltro");
const botonCerrar = document.querySelector("#botonCerrar");
const aside = document.querySelector(".filtros");
let agregarCarrito = document.querySelectorAll(".agregarProducto");
let carrito;
let ids = [];
let nombres = [];

productos.forEach(producto => {
    if (!ids.includes(producto.categoria.id)) {
        ids.push(producto.categoria.id);
    }
    if (!nombres.includes(producto.categoria.nombre)) {
        nombres.push(producto.categoria.nombre);
    }
});

for(let i = 0; i < ids.length; i++){
    const li = document.createElement("li");
    li.innerHTML = `
    <button aria-valuetext="${nombres[i]}" id="${ids[i]}" class="btnShop botonCategoria">${nombres[i]}</button>
    `
    filtros.appendChild(li);
}

const categorias = document.querySelectorAll(".botonCategoria");
const liCarrito = document.createElement("li");

const numerito = document.querySelector("#contCarrito");

if(carritoLS){
    carrito = JSON.parse(carritoLS);
    actualizarNumerito();
} else {
    carrito = [];
}

//muestra los productos segun la categoria
function cargarProductos(select){
    productos = JSON.parse(localStorage.getItem("productos")) || [];
    responsive();
    contenedorProductos.innerHTML = "";
    select.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("item")
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}">
            <div class="itemDetalles">
                <h3 class="itemTitulo"> ${producto.titulo} </h3>
                <p class="itemPrecio"> $${producto.precio.toLocaleString('es-AR')} </p>
                <button class="agregarProducto" id="${producto.id}">agregar</button>
            </div>
        `
        contenedorProductos.append(div);
    })
    actualizarAgregarCarrito()
};

cargarProductos(productos);

categorias.forEach( boton => {
    boton.addEventListener("click", (e) => {

        categorias.forEach( boton => boton.classList.remove("current"));
        
        e.currentTarget.classList.add("current");
        aside.classList.remove("filtroMobile");
        botonFiltro.classList.remove("disabled");

        if(e.currentTarget.id != "todos"){
            const findProductos = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = boton.ariaValueText;
            tituloFiltros.innerText = boton.ariaValueText;

            const filtroProductos = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(filtroProductos);
            
        } else {
            tituloFiltros.innerText = "Todos los Productos";
            tituloPrincipal.innerText = "Todos los Productos";
            cargarProductos(productos);
        }
    })
});

function actualizarAgregarCarrito(){
    agregarCarrito = document.querySelectorAll(".agregarProducto");
    
    agregarCarrito.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito)
    })
}

function agregarAlCarrito(e){
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);
    if(carrito.some(producto => producto.id === idBoton)){
        const index = carrito.findIndex(producto => producto.id === idBoton)
        carrito[index].cantidad ++;
    } else {
        productoAgregado.cantidad = 1;
        carrito.push(productoAgregado);
    }
    actualizarNumerito();
    localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
};

function actualizarNumerito(){
    let nuevoNumerito = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
};

function obtenerIds(){
    const id = [];
    // Iteramos sobre el array de objetos
    productos.forEach(producto => {
        if (!id.includes(producto.id)) {
            id.push(producto.id);
        }
    });
    return id;
}

function responsive(){
    botonFiltro.addEventListener("click", () => {
        aside.classList.add("filtroMobile");
        botonFiltro.classList.add("disabled");
    })
    botonCerrar.addEventListener("click", () => {
        aside.classList.remove("filtroMobile");
        botonFiltro.classList.remove("disabled");
    })
}