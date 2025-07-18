document.addEventListener('DOMContentLoaded', () => {
    // Función para cargar productos dinámicamente (ejemplo para index.html)
    const loadProducts = () => {
        const productGrid = document.querySelector('.product-grid');
        // Solo carga productos si estamos en la página de inicio
        if (productGrid && window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            const products = [
                { name: 'Vestido Floral', price: '$49.99', image: 'images/product1.jpg' },
                { name: 'Camisa Casual Hombre', price: '$35.50', image: 'images/product2.jpg' },
                { name: 'Pantalón Vaquero Slim', price: '$59.00', image: 'images/product3.jpg' },
                { name: 'Zapatillas Urbanas', price: '$75.20', image: 'images/product4.jpg' },
                // Agrega más productos aquí
            ];

            productGrid.innerHTML = ''; // Limpiar cualquier contenido existente
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price}</p>
                    <button class="btn-add-to-cart">Añadir al Carrito</button>
                `;
                productGrid.appendChild(productCard);
            });
        }
    };

    loadProducts();

    // Lógica para simular el carrito de compras (muy básico)
    // Se aplica a todos los botones con esta clase en cualquier página
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            alert('Producto añadido al carrito (simulado).');
            // Aquí podrías añadir lógica para actualizar un contador de carrito, etc.
        });
    });

    // Lógica para resaltar el enlace de navegación de la página actual
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname; // Obtiene la ruta de la URL actual

    navLinks.forEach(link => {
        // Elimina la clase 'active' de todos los enlaces primero
        link.classList.remove('active');

        // Comprueba si el href del enlace coincide con la ruta actual
        // Manejo especial para la página de inicio (index.html o '/')
        if (link.getAttribute('href') === 'index.html' && (currentPath.endsWith('index.html') || currentPath === '/')) {
            link.classList.add('active');
        } else if (link.getAttribute('href') !== 'index.html' && currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });

    // Puedes añadir más interacciones aquí, como galerías de imágenes, filtros, etc.
});