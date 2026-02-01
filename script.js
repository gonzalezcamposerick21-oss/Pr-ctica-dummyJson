// Configuración
const URL_API = 'https://dummyjson.com/products';
const LIMITE_PRODUCTOS = 12; // Límite de productos a mostrar

// Estado de la aplicación
let todosLosProductos = [];
let productoActual = null;

// Elementos del DOM
const paginaPrincipal = document.getElementById('main-page');
const paginaDetalle = document.getElementById('detail-page');
const contenedorProductos = document.getElementById('products-container');
const elementoCargando = document.getElementById('loading');
const inputBusqueda = document.getElementById('search-input');
const botonBuscar = document.getElementById('search-btn');
const botonVolver = document.getElementById('back-btn');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    configurarEventos();
});

// Configurar eventos
function configurarEventos() {
    botonBuscar.addEventListener('click', manejarBusqueda);
    inputBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            manejarBusqueda();
        }
    });
    botonVolver.addEventListener('click', mostrarPaginaPrincipal);
}

// Cargar productos desde la API
async function cargarProductos() {
    try {
        elementoCargando.style.display = 'block';
        contenedorProductos.innerHTML = '';

        const respuesta = await fetch(`${URL_API}?limit=${LIMITE_PRODUCTOS}`);
        const datos = await respuesta.json();
        
        todosLosProductos = datos.products;
        mostrarProductos(todosLosProductos);
        
        elementoCargando.style.display = 'none';
    } catch (error) {
        console.error('Error al cargar productos:', error);
        elementoCargando.textContent = 'Error al cargar los productos. Por favor, intenta de nuevo.';
    }
}

// Mostrar productos en tarjetas
function mostrarProductos(productos) {
    contenedorProductos.innerHTML = '';
    
    if (productos.length === 0) {
        contenedorProductos.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No se encontraron productos.</p>';
        return;
    }

    productos.forEach(producto => {
        const tarjeta = crearTarjetaProducto(producto);
        contenedorProductos.appendChild(tarjeta);
    });
}

// Crear tarjeta de producto
function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'product-card';
    tarjeta.onclick = () => mostrarDetalleProducto(producto);

    tarjeta.innerHTML = `
        <img src="${producto.thumbnail}" alt="${producto.title}" class="product-image" onerror="this.src='https://via.placeholder.com/280x200?text=Sin+Imagen'">
        <div class="product-info">
            <h3 class="product-title">${producto.title}</h3>
            <p class="product-price">$${producto.price.toFixed(2)}</p>
            <p class="product-category">${producto.category}</p>
            <p class="product-rating">Rating: ${producto.rating}</p>
        </div>
    `;

    return tarjeta;
}

// Mostrar detalle del producto
function mostrarDetalleProducto(producto) {
    productoActual = producto;

    // Actualizar información del producto
    document.getElementById('detail-img').src = producto.images[0] || producto.thumbnail;
    document.getElementById('detail-img').alt = producto.title;
    document.getElementById('detail-title').textContent = producto.title;
    document.getElementById('detail-price').textContent = `$${producto.price.toFixed(2)}`;
    document.getElementById('detail-brand').textContent = producto.brand || 'No especificada';
    document.getElementById('detail-category').textContent = producto.category;
    document.getElementById('detail-rating').textContent = producto.rating;
    document.getElementById('detail-description').textContent = producto.description;

    // Mostrar opiniones
    mostrarOpiniones(producto.reviews || []);

    // Cambiar de página
    paginaPrincipal.classList.add('hidden');
    paginaDetalle.classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Mostrar opiniones
function mostrarOpiniones(opiniones) {
    const contenedorOpiniones = document.getElementById('reviews-container');
    contenedorOpiniones.innerHTML = '';

    if (opiniones.length === 0) {
        contenedorOpiniones.innerHTML = '<p style="color: #999;">No hay opiniones disponibles para este producto.</p>';
        return;
    }

    opiniones.forEach(opinion => {
        const elementoOpinion = document.createElement('div');
        elementoOpinion.className = 'review-item';
        elementoOpinion.innerHTML = `
            <div class="review-header">
                <span class="review-name">${opinion.reviewerName}</span>
                <span class="review-rating">${opinion.rating} </span>
            </div>
            <p class="review-comment">${opinion.comment}</p>
            <p style="font-size: 12px; color: #999; margin-top: 8px;">
                ${new Date(opinion.date).toLocaleDateString('es-ES')}
            </p>
        `;
        contenedorOpiniones.appendChild(elementoOpinion);
    });
}

// Volver a la página principal
function mostrarPaginaPrincipal() {
    paginaDetalle.classList.add('hidden');
    paginaPrincipal.classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Manejar búsqueda
async function manejarBusqueda() {
    const terminoBusqueda = inputBusqueda.value.trim().toLowerCase();

    if (terminoBusqueda === '') {
        mostrarProductos(todosLosProductos);
        return;
    }

    try {
        elementoCargando.style.display = 'block';
        contenedorProductos.innerHTML = '';

        const respuesta = await fetch(`${URL_API}/search?q=${terminoBusqueda}&limit=${LIMITE_PRODUCTOS}`);
        const datos = await respuesta.json();
        
        mostrarProductos(datos.products);
        elementoCargando.style.display = 'none';
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        elementoCargando.textContent = 'Error al buscar productos.';
    }
}