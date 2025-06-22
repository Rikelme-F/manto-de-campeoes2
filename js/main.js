document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle
  const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);

      if (currentTheme === 'dark') {
          toggleSwitch.checked = true;
      }
  }

  function switchTheme(e) {
      if (e.target.checked) {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
      } else {
          document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
      }
  }

  toggleSwitch.addEventListener('change', switchTheme, false);


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

      products.forEach(product => {
          const card = createProductCard(product);
          const swiperSlide = document.createElement('div');
          swiperSlide.classList.add('swiper-slide');
          swiperSlide.appendChild(card);
          featuredGrid.appendChild(swiperSlide);
      });

      const swiper = new Swiper('.swiper-container', {
          // Optional parameters
          slidesPerView: 1,
          spaceBetween: 10,
          // Responsive breakpoints
          breakpoints: {
              // when window width is >= 640px
              640: {
                  slidesPerView: 2,
                  spaceBetween: 20
              },
              // when window width is >= 768px
              768: {
                  slidesPerView: 3,
                  spaceBetween: 30
              },
              // when window width is >= 1024px
              1024: {
                  slidesPerView: 4,
                  spaceBetween: 40
              }
          },

          // If we need pagination
          pagination: {
              el: '.swiper-pagination',
              clickable: true,
          },

          // Navigation arrows
          navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
          },
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