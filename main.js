// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');

// Check for saved user preference
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

// Toggle dark mode
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        themeToggle.textContent = '☀️';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        themeToggle.textContent = '🌙';
    }
});

// Search Functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
    performSearch();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // Here you can implement actual search functionality
        alert(`Searching for: ${searchTerm}`);
        // You can redirect to a search results page or filter products
    }
}

// User Profile Button
const userProfileBtn = document.getElementById('userProfileBtn');
if (userProfileBtn) {
    userProfileBtn.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
}

// Shopping Cart Functionality
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.querySelector('.cart-count');
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function updateCartCount() {
    cartCount.textContent = cartItems.length;
}

function addToCart(productName, price) {
    const item = {
        id: Date.now(),
        name: productName,
        price: price,
        quantity: 1
    };
    
    cartItems.push(item);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    
    // Show success message
    showNotification(`${productName} added to cart! ✅`);
}

cartBtn.addEventListener('click', () => {
    // Always redirect to cart page
    window.location.href = 'cart.html';
});

function calculateTotal() {
    return cartItems.reduce((total, item) => total + parseFloat(item.price.replace('$', '')), 0).toFixed(2);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add to cart functionality for product buttons
function initializeAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    
    console.log('Found', addToCartButtons.length, 'add to cart buttons');
    
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            console.log('Adding to cart:', productName, productPrice);
            
            addToCart(productName, productPrice);
            
            // Animation effect
            this.textContent = 'Added! ✓';
            this.style.backgroundColor = '#4CAF50';
            this.style.color = 'white';
            this.style.fontWeight = 'bold';
            
            // Re-enable button after 2 seconds
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '';
                this.style.color = '';
                this.style.fontWeight = '';
                this.disabled = false;
            }, 2000);
            
            // Don't redirect automatically - let user stay on current page
            // User can manually go to cart using the cart icon in header
        });
    });
}

// Cart Page Functions
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    
    if (!cartItemsContainer) return; // Not on cart page
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        return;
    }
    
    cartItemsContainer.style.display = 'block';
    emptyCartMessage.style.display = 'none';
    
    let cartHTML = '<div class="cart-items-container">';
    
    cartItems.forEach((item, index) => {
        const itemTotal = (parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2);
        
        cartHTML += `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-image">
                    <i class="fas fa-box"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-total">$${itemTotal}</div>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartHTML += '</div>';
    
    // Add cart summary
    const total = calculateTotal();
    cartHTML += `
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Items (${cartItems.length})</span>
                <span>$${total}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>Free</span>
            </div>
            <div class="summary-row">
                <span>Total</span>
                <span>$${total}</span>
            </div>
            <button class="checkout-btn" onclick="checkout()">
                <i class="fas fa-credit-card"></i> Proceed to Checkout
            </button>
        </div>
    `;
    
    cartItemsContainer.innerHTML = cartHTML;
}

function updateQuantity(itemId, change) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity += change;
        
        if (cartItems[itemIndex].quantity <= 0) {
            cartItems.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
        loadCartItems();
    }
}

function removeFromCart(itemId) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item.id !== itemId);
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    loadCartItems();
    
    showNotification('Item removed from cart!');
}

function checkout() {
    alert('Checkout functionality coming soon!');
    // Here you can implement actual checkout process
}

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
        });
    });
    
    // Initialize cart count
    updateCartCount();
    
    // Initialize add to cart buttons
    initializeAddToCartButtons();
    
    // Load cart items if on cart page
    loadCartItems();
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

document.head.appendChild(style);
