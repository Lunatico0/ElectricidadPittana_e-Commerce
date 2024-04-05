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

//* Se actualiza el localStorage con los productos
// // if(!localStorage.getItem("productos")){
// //     localStorage.setItem("productos", JSON.stringify(productos));
// // }

//? ☝️Cambie la funcion if de arriba por el operador logico AND👇

!localStorage.getItem("productos") && localStorage.setItem("productos", JSON.stringify(productos));

//* Se comprueba si existen productos en el localStorage, de lo contrario se inicializa con un array vacío
productos = JSON.parse(localStorage.getItem("productos")) || [];

//! Se seleccionan los elementos del DOM y se crean variables o constantes
const contenedorProductos = document.querySelector("#productos");
const filtros = document.querySelector("#filtros");
const tituloPrincipal = document.querySelector("#tituloPrincipal");
const tituloFiltros = document.querySelector("#tituloFiltros");
const carritoLS = localStorage.getItem("productosEnCarrito");
const productosBajadoLS = JSON.parse(localStorage.getItem("productos")) || [];
const botonFiltro = document.querySelector("#botonFiltro");
const botonCerrar = document.querySelector("#botonCerrar");
const aside = document.querySelector(".filtros");
const numerito = document.querySelector("#contCarrito");
let agregarCarrito = document.querySelectorAll(".agregarProducto");
let carrito;
let ids = [];
let nombres = [];

categoriaIds();
cargarProductos(productos);

//* Actualiza los Id´s del array
function categoriaIds(){
    productos.forEach(producto => {
        if (!ids.includes(producto.categoria.id)) {
            ids.push(producto.categoria.id);
        }
        if (!nombres.includes(producto.categoria.nombre)) {
            nombres.push(producto.categoria.nombre);
        }
    });
};

//* Agrega cada categoria en la seccion filtros
for(let i = 0; i < ids.length; i++){
    const li = document.createElement("li");
    const categoriaHTML = `<button aria-valuetext="${nombres[i]}" id="${ids[i]}" class="btnShop botonCategoria">${nombres[i]}</button>`;
    li.innerHTML = categoriaHTML;
    filtros.appendChild(li);
}

//! Se seleccionan los elementos del DOM que se crearon dinamicamente
const categorias = document.querySelectorAll(".botonCategoria");
const liCarrito = document.createElement("li");

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

//* Muestra los productos segun la categgoria seleccionada
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