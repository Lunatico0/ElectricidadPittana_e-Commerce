const productos = JSON.parse(localStorage.getItem("productos")) || [];

document.addEventListener("DOMContentLoaded", () => {

    //! Se seleccionan los elementos del DOM y se crean variables o constantes
    const agregarProducto = document.querySelector("#formularioAgregarProducto");
    const categoriaSelect = document.querySelector("#categoria");
    const newCategoria = document.querySelector("#nuevaCategoria");
    const buscar = document.querySelector("#inputBusqueda");
    const contenedor = document.querySelector("#contenedorProductos");
    const categoriasArr = productos.map(producto => producto.categoria);
    const categorias = new Set (categoriasArr.map(categoria => categoria.nombre));
    const otraCategoria = "Otra";
    
    categorias.add(otraCategoria);
    
    //* Rellena las categorias
    categorias.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1) ;
        categoriaSelect.appendChild(opcion);
    });
    
    //* Mostrar el input para agregar una nueva categoría si no hay productos
    if (productos.length === 0) {
        newCategoria.classList.remove("disabled");
        newCategoria.required = true;
        categoriaSelect.value = otraCategoria;
    }
    
    //* Selector de categorias
    categoriaSelect.addEventListener("change", () => {
        if(categoriaSelect.value === otraCategoria){
            newCategoria.classList.remove("disabled");
            categoriaSelect.style.width = "70px";
            newCategoria.required = true;
        } else {
            newCategoria.classList.add("disabled");
            categoriaSelect.style = "";
            newCategoria.required = false;
        }
    });
    
    //!Escuchador de eventos de categorias
    agregarProducto.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Obtiene los valores del formulario
        const titulo = agregarProducto.elements.titulo.value.trim();
        const imagen = agregarProducto.elements.imagen.value.trim();
        const categoria = (newCategoria.value || categoriaSelect.value).trim();
        const precio = parseFloat(agregarProducto.elements.precio.value.trim().replace(',', '.')); // Reemplaza comas por puntos para decimales
        const idCat = categoria.toLowerCase().replace(/\s/g, '_');
        const id = titulo.toLowerCase().replace(/\s/g, '_');
        const toastSucces = "Producto agregado exitosamente";
        
        // Verifica que todos los campos estén completos
        if (!titulo || !imagen || !categoria || !precio || isNaN(precio) || !id) {
            const toastComplete = "Por favor, complete todos los campos.";
            toastify(toastCompleteomplete);
        }
        
        //* Verifica si el producto ya existe
        if (productos.some(producto => producto.id === id)) {
            const toastExistente = "El producto ya existe";
            toastify(toastExistente);
        }
        
        //* Crea el nuevo item
        const nuevoItem = new Producto(
            id, //!guarda en la clave "ID" el nombre del producto en minusculas y reemplazando los espacios con "_"
            titulo,
            imagen,
            {
                nombre: (categoria.charAt(0).toUpperCase() + categoria.slice(1)) ,
                id: idCat  //!guarda en la clave "ID" el nombre de la categoria del producto en minusculas y reemplazando los espacios con "_"
            },
            precio
        );
        
        // Agrega el nuevo item al array de productos
        productos.push(nuevoItem);
        
        // Actualiza el LocalStorage
        localStorage.setItem("productos", JSON.stringify(productos));
        
        // Limpia el formulario
        agregarProducto.reset();
        
        // Muestra un mensaje de éxito
        toastify(toastSucces);
    });    

    //* Escuchador de eventos para el input del form
    buscar.addEventListener("input", () => {
        const buscado = buscar.value.trim().toLowerCase();
        const encontrado = buscarProducto(buscado);
        
        //Si se encuentra algun producto muestra los detalles
        if(encontrado.length > 0){
            //* Limpia el contenedor
            contenedor.innerHTML = "";

            //* Muestra cada elemento del array de productos coincidentes
            encontrado.forEach(producto => {
                const htmlItem = `  <img src="${producto.imagen}" alt="${producto.titulo}">
                                    <div class="itemDetalles">
                                        <h3 class="itemTitulo">${producto.titulo}</h3>
                                        <p class="itemPrecio">$${producto.precio.toLocaleString('es-AR')}</p>
                                        <button class="eliminarProducto" id="${producto.id}">Eliminar item</button>
                                    </div>`;
                const div = document.createElement("div");
                div.classList.add("item");
                div.innerHTML = htmlItem;
                contenedor.append(div);

                //?Agrega evento para eliminar con un boton
                const btnEliminar = div.querySelector(".eliminarProducto");
                btnEliminar.addEventListener("click", () => {
                    eliminarProducto(producto.id);
                });
            });
        } else {
            //! Si no encuentra coincidencias muestra el siguient mensaje
            contenedor.innerHTML = "<p>✖️No se encontraron coincidencias✖️.<p/>";
        }
    });
});

//* Funcion busca por coincidencia
function buscarProducto(item) {
    const productosEncontrados = productos.filter(producto => producto.titulo.toLowerCase().includes(item.toLowerCase()));
    return productosEncontrados;
}

//* Funcion para Eliminar Productos
function eliminarProducto(id){
    const indice = productos.findIndex(producto => producto.id === id);

    //? Consulta en caso de no haber ningun elemento con ese ID devuelve el error
    if (indice !== -1) {

        // Eliminar el producto del array
        const productoEliminado = productos.splice(indice, 1)[0];
        const toastProdDelete = `Producto "${productoEliminado.titulo}" eliminado.`

        toastify(toastProdDelete);

        //* Actualiza el localStorage
        localStorage.setItem("productos", JSON.stringify(productos));

        // Vuelve a mostrar los productos despues de la eliminacion
        const buscar = document.querySelector("#inputBusqueda");
        buscar.dispatchEvent(new Event("input"));
    } else {
        const toastProdNull = "Producto Inexistente";
        toastify(toastProdNull);
    };
};

//! Constructor de Objetos para los Items
class Producto {
    constructor(id, titulo, imagen, categoria, precio) {
        this.id = id;
        this.titulo = titulo;
        this.imagen = imagen;
        this.categoria = categoria;
        this.precio = precio;
    }
}

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
}