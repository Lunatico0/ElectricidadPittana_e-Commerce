const productos = JSON.parse(localStorage.getItem("productos")) || [];

document.addEventListener("DOMContentLoaded", function () {
    const formAgregarProducto = document.getElementById("formularioAgregarProducto");
    const selectCategoria = document.getElementById("categoria");
    const inputNuevaCategoria = document.getElementById("nuevaCategoria");

    const categoriasArray = productos.map(producto => producto.categoria);
    const categorias = new Set(categoriasArray.map(categoria => categoria.nombre));
    categorias.add("Otra");

    // Llenar el select con las categorías
    categorias.forEach(categoria => {
        const option = document.createElement("option");
        option.textContent = categoria;
        selectCategoria.appendChild(option);
    });

    // Mostrar el input de nueva categoría si se selecciona "Otra"
    selectCategoria.addEventListener("change", function () {
        if (selectCategoria.value === "Otra") {
            inputNuevaCategoria.style.display = "block";
            inputNuevaCategoria.required = true;
        } else {
            inputNuevaCategoria.style.display = "none";
            inputNuevaCategoria.required = false;
        }
    });

    if (categorias.size === 1) {
        selectCategoria.value = "";
    }

    formAgregarProducto.addEventListener("submit", function (event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const titulo = formAgregarProducto.elements.titulo.value;
        const imagen = formAgregarProducto.elements.imagen.value;
        const categoria = inputNuevaCategoria.value || selectCategoria.value;
        const precio = parseFloat(formAgregarProducto.elements.precio.value);
        const id = categoria.toLowerCase();

        // Validar que los campos no estén vacíos
        if (!titulo || !imagen || !categoria || !precio) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // Crear el nuevo producto
        const nuevoProducto = new Producto(
            titulo.toLowerCase().replace(/\s/g, '_'), // ID del producto basado en el título
            titulo,
            imagen,
            {
                nombre: categoria,
                id: id.split(' ').join('_')
            },
            precio
        );

        productos.push(nuevoProducto);

        // Actualizar el localStorage con el nuevo array de productos
        localStorage.setItem("productos", JSON.stringify(productos));

        // Limpiar el formulario
        formAgregarProducto.reset();

        alert("Producto agregado exitosamente.");
    });

    const inputBusqueda = document.getElementById("inputBusqueda");
    const contenedorProductos = document.getElementById("contenedorProductos");

    inputBusqueda.addEventListener("input", function () {
        const valorBusqueda = inputBusqueda.value.trim().toLowerCase();
        const productosEncontrados = buscarProductoPorCoincidencia(valorBusqueda);

        if (productosEncontrados.length > 0) {
            // Si se encuentran productos, mostrar los detalles
            contenedorProductos.innerHTML = "";
            productosEncontrados.forEach(producto => {
                const div = document.createElement("div");
                div.classList.add("item");
                div.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.titulo}">
                    <div class="itemDetalles">
                        <h3 class="itemTitulo">${producto.titulo}</h3>
                        <p class="itemPrecio">$${producto.precio.toLocaleString('es-AR')}</p>
                        <button class="eliminarProducto" id="${producto.id}">Eliminar item</button>
                    </div>
                `;
                contenedorProductos.appendChild(div);

                // Agregar evento de eliminación para cada botón
                const botonEliminar = div.querySelector(".eliminarProducto");
                botonEliminar.addEventListener("click", function () {
                    eliminarProducto(producto.id);
                });
            });
        } else {
            // Si no se encuentran productos, mostrar un mensaje
            contenedorProductos.innerHTML = "<p>No se encontraron productos.</p>";
        }
    });
});

function buscarProductoPorCoincidencia(terminoBusqueda) {
    const terminoBusquedaLower = terminoBusqueda.toLowerCase();
    const productosEncontrados = productos.filter(producto => producto.titulo.toLowerCase().includes(terminoBusquedaLower));
    return productosEncontrados;
}

// Función para eliminar un producto por ID
function eliminarProducto(id) {
    const indice = productos.findIndex(producto => producto.id === id);
    if (indice !== -1) {
        // Eliminar el producto del arreglo
        const productoEliminado = productos.splice(indice, 1)[0];
        console.log(`Producto "${productoEliminado.titulo}" eliminado.`);
        // Actualizar el localStorage
        localStorage.setItem("productos", JSON.stringify(productos));
        // Volver a mostrar los productos después de la eliminación
        const inputBusqueda = document.getElementById("inputBusqueda");
        inputBusqueda.dispatchEvent(new Event("input"));
    } else {
        console.log(`No se encontró ningún producto con el ID "${id}".`);
    }
}

function Producto(id, titulo, imagen, categoria, precio) {
    this.id = id;
    this.titulo = titulo;
    this.imagen = imagen;
    this.categoria = categoria;
    this.precio = precio;
}
