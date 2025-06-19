document.addEventListener('DOMContentLoaded', () => {
    // Lógica para o menu mobile, modal de carrinho, etc. pode ser adicionada aqui.
    console.log('Site carregado e pronto.');

    // Exemplo de como carregar produtos na página inicial
    if (document.getElementById('featured-grid')) {
        loadFeaturedProducts();
    }
});

async function loadFeaturedProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        const featuredGrid = document.getElementById('featured-grid');

        // Pega os primeiros 4 produtos como destaque
        products.slice(0, 4).forEach(product => {
            const card = createProductCard(product); // Reutiliza a função de card
            featuredGrid.appendChild(card);
        });

    } catch (error) {
        console.error("Não foi possível carregar os produtos em destaque:", error);
    }
}

// Esta função precisa estar disponível para o main.js também
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  // Note: Para um projeto real, evite usar .innerHTML com dados dinâmicos por segurança (XSS).
  // A criação de elementos via document.createElement é mais segura.
  card.innerHTML = `
    <div class="product-image">
      <a href="produto.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}">
      </a>
    </div>
    <div class="product-info">
      <div class="product-category">${product.category}</div>
      <h3><a href="produto.html?id=${product.id}">${product.name}</a></h3>
      <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
    </div>
    <div class="product-footer">
      <button class="add-to-cart-btn" data-product-id="${product.id}">
        <i class="fas fa-shopping-cart"></i>
        Adicionar
      </button>
    </div>
  `;
  return card;
}