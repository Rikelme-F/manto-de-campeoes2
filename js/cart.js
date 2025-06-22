document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    attachGlobalListeners();
});

let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

function addToCart(productId, productName, productPrice) {
    const existingItem = cartItems.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    openCartModal(); // Abre o modal ao adicionar um item
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, newQuantity) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}


function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalElement = document.getElementById('cart-subtotal');

    // Atualiza o contador no header
    if (cartCountElement) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Atualiza o conteúdo do modal
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = ''; // Limpa o conteúdo anterior
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        } else {
            cartItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Preço: R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div class="cart-item-actions">
                        <span>Qtd: ${item.quantity}</span>
                        <button class="remove-item-btn" data-product-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
    }
    
    // Atualiza o subtotal
    if(cartSubtotalElement) {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartSubtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }
}

function openCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.remove('hidden');
        updateCartUI(); // Garante que o conteúdo está atualizado ao abrir
    }
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function attachGlobalListeners() {
    document.body.addEventListener('click', (event) => {
        // Lógica para adicionar ao carrinho
        const addToCartBtn = event.target.closest('.add-to-cart-btn');
        if (addToCartBtn) {
            const card = addToCartBtn.closest('.product-card');
            const productId = addToCartBtn.dataset.productId;
            const productName = card.querySelector('h3').textContent;
            const productPriceText = card.querySelector('.product-price').textContent;
            const productPrice = parseFloat(productPriceText.replace('R$', '').replace(',', '.'));
            addToCart(productId, productName, productPrice);
            return;
        }

        // Lógica para remover do carrinho
        const removeItemBtn = event.target.closest('.remove-item-btn');
        if (removeItemBtn) {
            const productId = removeItemBtn.dataset.productId;
            removeFromCart(productId);
            return;
        }
    });

    // Listeners para o modal
    const cartIcon = document.getElementById('cart-icon');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('cart-modal');

    if (cartIcon) cartIcon.addEventListener('click', openCartModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeCartModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeCartModal();
            }
        });
    }
}

function initializeCart() {
    updateCartUI();
}