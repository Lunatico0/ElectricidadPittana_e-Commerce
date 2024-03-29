let carrito = localStorage.getItem("productosEnCarrito");
carrito = JSON.parse(carrito)

let eliminar = document.querySelectorAll(".eliminarArticulo");
const carritoEmpty = document.querySelector("#carritoEmpty");
const carritoItem = document.querySelector("#carritoItem");
const carritoAcciones = document.querySelector("#carritoAcciones");
const comprado = document.querySelector("#comprado");
const comprar = document.querySelector("#comprar");
const vaciar = document.querySelector("#carritoAccionesVaciar")
const total = document.querySelector("#total")
comprar.addEventListener("click", comprarCarro);
vaciar.addEventListener("click", vaciarCarro);
cargarItems();

function cargarItems(){
    if(carrito && carrito.length > 0){

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
                <img src="${producto.imagen}" alt="${producto.titulo}">
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
            `;
            carritoItem.append(div);
        })
    
    } else{
        carritoEmpty.classList.remove("disabled");
        carritoItem.classList.add("disabled");
        carritoAcciones.classList.add("disabled");
        comprado.classList.add("disabled");
    }
    botonesEliminar();
    actualizarTotal();
}

function botonesEliminar(){
    eliminar = document.querySelectorAll(".eliminarArticulo");

    eliminar.forEach(boton => {
        boton.addEventListener("click", eliminarItem)
    });
}

function eliminarItem(e){
    const idBoton = e.currentTarget.id;
    const index = carrito.findIndex( producto => producto.id === idBoton);
    if(carrito[index].cantidad > 1){
        carrito[index].cantidad --;
    } else {
        carrito.splice(index, 1);
    }
    cargarItems();
    localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
}

function vaciarCarro(){
    carrito.length = 0;
    localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
    cargarItems();
}

function actualizarTotal(){
    const totalCalculado = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0 );
    total.innerText = `$${totalCalculado.toLocaleString('es-AR')}`;
}

function comprarCarro(){
    carrito.length = 0;
    localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
    
    carritoEmpty.classList.add("disabled");
    carritoItem.classList.add("disabled");
    carritoAcciones.classList.add("disabled");
    comprado.classList.remove("disabled");
}