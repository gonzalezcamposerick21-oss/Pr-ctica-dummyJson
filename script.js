const API_URL = 'https://dummyjson.com/products';
const PRODUCTS_LIMIT = 12; 

let allProducts = [];
let currentProduct = null;

const mainPage = document.getElementById('main-page');
const detailPage = document.getElementById('detail-page');
const productsContainer = document.getElementById('products-container');
const loadingElement = document.getElementById('loading');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const backBtn = document.getElementById('back-btn');

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    backBtn.addEventListener('click', showMainPage);
}

async function loadProducts() {
    try {
        loadingElement.style.display = 'block';
        productsContainer.innerHTML = '';

        const response = await fetch(`${API_URL}?limit=${PRODUCTS_LIMIT}`);
        const data = await response.json();
        
        allProducts = data.products;
        displayProducts(allProducts);
        
        loadingElement.style.display = 'none';
    } catch (error) {
        console.error('Error al cargar productos:', error);
        loadingElement.textContent = 'Error al cargar los productos. Por favor, intenta de nuevo.';
    }
}

function displayProducts(products) {
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No se encontraron productos.</p>';
        return;
    }

    products.forEach(product => {
        const card = createProductCard(product);
        productsContainer.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => showProductDetail(product);

    card.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}" class="product-image" onerror="this.src='https://via.placeholder.com/280x200?text=Sin+Imagen'">
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-category">${product.category}</p>
            <p class="product-rating">Rating: ${product.rating}</p>
        </div>
    `;

    return card;
}

function showProductDetail(product) {
    currentProduct = product;

    document.getElementById('detail-img').src = product.images[0] || product.thumbnail;
    document.getElementById('detail-img').alt = product.title;
    document.getElementById('detail-title').textContent = product.title;
    document.getElementById('detail-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('detail-brand').textContent = product.brand || 'No especificada';
    document.getElementById('detail-category').textContent = product.category;
    document.getElementById('detail-rating').textContent = product.rating;
    document.getElementById('detail-description').textContent = product.description;

    displayReviews(product.reviews || []);

    mainPage.classList.add('hidden');
    detailPage.classList.remove('hidden');
    window.scrollTo(0, 0);
}

function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = '';

    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p style="color: #999;">No hay opiniones disponibles para este producto.</p>';
        return;
    }

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        reviewElement.innerHTML = `
            <div class="review-header">
                <span class="review-name">${review.reviewerName}</span>
                <span class="review-rating">${review.rating}</span>
            </div>
            <p class="review-comment">${review.comment}</p>
            <p style="font-size: 12px; color: #999; margin-top: 8px;">
                ${new Date(review.date).toLocaleDateString('es-ES')}
            </p>
        `;
        reviewsContainer.appendChild(reviewElement);
    });
}

function showMainPage() {
    detailPage.classList.add('hidden');
    mainPage.classList.remove('hidden');
    window.scrollTo(0, 0);
}

async function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === '') {
        displayProducts(allProducts);
        return;
    }

    try {
        loadingElement.style.display = 'block';
        productsContainer.innerHTML = '';

        const response = await fetch(`${API_URL}/search?q=${searchTerm}&limit=${PRODUCTS_LIMIT}`);
        const data = await response.json();
        
        displayProducts(data.products);
        loadingElement.style.display = 'none';
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        loadingElement.textContent = 'Error al buscar productos.';
    }
}