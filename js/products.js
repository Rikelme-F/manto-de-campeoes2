document.addEventListener('DOMContentLoaded', () => {
    loadAllProducts();
});

async function loadAllProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        const productList = document.getElementById('product-list');
        
        if (!productList) return;

        products.forEach(product => {
            const card = createProductCard(product);
            productList.appendChild(card);
        });

    } catch (error) {
        console.error("Não foi possível carregar os produtos:", error);
    }
}


function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
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