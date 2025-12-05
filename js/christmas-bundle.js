/**
 * CHRISTMAS BUNDLE - PRODUCT PAGE JAVASCRIPT
 * Snow Globe + Christmas Lights Bundle
 * Connected to Miami Store Main System
 * @version 2.0.0 - Full Gallery Support
 */
'use strict';

// ✅ BLOCK ALL AUTOMATIC SCROLLING
(function() {
    const originalScrollTo = window.scrollTo;
    const originalScrollBy = window.scrollBy;
    const originalScrollIntoView = Element.prototype.scrollIntoView;

    let allowScroll = false;

    window.scrollTo = function(...args) {
        if (allowScroll) {
            originalScrollTo.apply(window, args);
        }
    };

    window.scrollBy = function(...args) {
        if (allowScroll) {
            originalScrollBy.apply(window, args);
        }
    };

    Element.prototype.scrollIntoView = function(...args) {
        if (allowScroll) {
            originalScrollIntoView.apply(this, args);
        }
    };

    window.allowProgrammaticScroll = function(callback) {
        allowScroll = true;
        callback();
        setTimeout(() => {
            allowScroll = false;
        }, 100);
    };
})();

// ========================================
// CONFIGURATION (Synced with Main Store)
// ========================================

const CONFIG = {
    GOOGLE_SHEET_URL: 'https://script.google.com/macros/s/AKfycbwQVGSShWTVLYDMTgzyG5PoDM9eSQUuJwOyJWPnrOn6PCYkV5H0crQWNkbImyOMGEaT/exec',
    SHEET_ID: '19YCMn8husrkytIdVJpZsiGGSTNM5HplLNjBr25IXwBg',
    ANIMATION_DURATION: 1500,
    STATS_UPDATE_INTERVAL: 2000,
    COUNTDOWN_UPDATE_INTERVAL: 1000,
    TOAST_DURATION: 3000,
    LOCAL_STORAGE_KEY: 'miamiStoreChristmasBundle',

    // Christmas Bundle Product Specific
    VIEWERS_MIN: 35,
    VIEWERS_MAX: 85,
    ORDERS_START: 87,
    ORDERS_INCREMENT_CHANCE: 0.28,
    STOCK_REMAINING: 18,

    // Gallery Settings
    GALLERY_AUTO_PLAY_INTERVAL: 4000, // 4 seconds for 7 images
    GALLERY_TRANSITION_SPEED: 500
};

// Product Data - Christmas Bundle
const christmasBundleProduct = {
    id: 'christmas-bundle-005',
    name: 'بلورة بابا نويل + سلسلة كور الكريسماس',
    price: 899,
    oldPrice: 1799,
    discount: 50
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

const Utils = {
    formatPrice: (price) => {
        return new Intl.NumberFormat('ar-EG', {
            style: 'decimal',
            minimumFractionDigits: 0
        }).format(price);
    },

    randomInRange: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    sanitizeInput: (input) => {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },

    validatePhone: (phone) => {
        const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
        return phoneRegex.test(phone);
    },

    formatDateTime: () => {
        const now = new Date();
        return new Intl.DateTimeFormat('ar-EG', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(now);
    },

    getLocalStorage: (key) => {
        try {
            const item = localStorage.getItem(`${CONFIG.LOCAL_STORAGE_KEY}_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading localStorage:', e);
            return null;
        }
    },

    setLocalStorage: (key, value) => {
        try {
            localStorage.setItem(`${CONFIG.LOCAL_STORAGE_KEY}_${key}`, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing localStorage:', e);
            return false;
        }
    }
};

// ========================================
// TOAST NOTIFICATION SYSTEM
// ========================================

class ToastNotification {
    constructor() {
        this.createContainer();
    }

    createContainer() {
        if (!document.getElementById('toastContainer')) {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    }

    show(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
        const toast = document.createElement('div');
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        const colors = {
            success: '#2A9D8F',
            error: '#E63946',
            warning: '#FFD700',
            info: '#A9D6E5'
        };

        toast.style.cssText = `
            background: ${colors[type]};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1rem;
            font-weight: 600;
            pointer-events: auto;
            animation: slideInDown 0.4s ease, slideOutUp 0.4s ease ${duration - 400}ms;
            max-width: 90vw;
            z-index: 10001;
        `;

        toast.innerHTML = `
            <span style="font-size: 1.5rem;">${icons[type]}</span>
            <span>${message}</span>
        `;

        document.getElementById('toastContainer').appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }
}

const Toast = new ToastNotification();

// ========================================
// LOADING OVERLAY
// ========================================

class LoadingOverlay {
    constructor() {
        this.overlay = null;
        this.create();
    }

    create() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'loadingOverlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

        this.overlay.innerHTML = `
            <div style="text-align: center;">
                <div class="christmas-loader"></div>
                <p style="color: white; margin-top: 24px; font-size: 1.3rem; font-weight: 700;">
                    🎄❄️ جاري إرسال طلبك...
                </p>
                <p style="color: #FFD700; margin-top: 8px; font-size: 1rem;">
                    من فضلك انتظر قليلاً
                </p>
            </div>
        `;

        document.body.appendChild(this.overlay);

        const style = document.createElement('style');
        style.textContent = `
            .christmas-loader {
                width: 70px;
                height: 70px;
                border: 8px solid rgba(255, 255, 255, 0.2);
                border-top-color: #E63946;
                border-right-color: #2A9D8F;
                border-radius: 50%;
                animation: christmasSpin 1.2s linear infinite;
                margin: 0 auto;
            }
            @keyframes christmasSpin {
                to { transform: rotate(360deg); }
            }
            @keyframes slideInDown {
                from {
                    transform: translateY(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutUp {
                from {
                    transform: translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateY(-100px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    show() {
        this.overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

const Loading = new LoadingOverlay();

// ========================================
// SNOWFLAKES ANIMATION
// ========================================

function initializeSnowflakes() {
    const snowflakesContainer = document.getElementById('snowflakesContainer');
    if (!snowflakesContainer) return;

    const snowflakeSymbols = ['❄', '❅', '❆', '✻', '✼', '❉'];
    const numberOfSnowflakes = 60;

    for (let i = 0; i < numberOfSnowflakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];

        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.fontSize = (Math.random() * 1.5 + 0.5) + 'em';
        snowflake.style.animationDuration = (Math.random() * 10 + 10) + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';

        snowflakesContainer.appendChild(snowflake);
    }
}

// ========================================
// PRODUCT GALLERY WITH 7 IMAGES
// ========================================

class ProductGallery {
    constructor() {
        // 7 images for Christmas Bundle
        this.images = [
            'assets/product-5/image-1.jpg',
            'assets/product-5/image-2.jpg',
            'assets/product-5/image-3.jpg',
            'assets/product-5/image-4.jpg',
            'assets/product-5/image-5.jpg',
            'assets/product-5/image-6.jpg',
            'assets/product-5/image-7.png'
        ];

        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayEnabled = true;
        this.isUserScrolling = false;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.loadThumbnails();
        this.updateCounter();
        this.setupTouchEvents();
        this.preventScrollInterference();
        this.startAutoPlay();
        this.setupImageClick();
    }

    preventScrollInterference() {
        let scrollTimer = null;

        window.addEventListener('scroll', () => {
            this.isUserScrolling = true;

            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }

            scrollTimer = setTimeout(() => {
                this.isUserScrolling = false;
            }, 150);
        }, { passive: true });
    }

    loadThumbnails() {
        const container = document.getElementById('galleryThumbnails');
        if (!container) return;

        container.innerHTML = '';

        this.images.forEach((imagePath, index) => {
            const thumb = document.createElement('div');
            thumb.className = `gallery-thumbnail ${index === 0 ? 'active' : ''}`;
            thumb.onclick = () => this.showImage(index);

            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = `بلورة بابا نويل وكور الكريسماس - صورة ${index + 1}`;
            img.loading = index === 0 ? 'eager' : 'lazy';
            img.onerror = function() {
                this.src = `https://via.placeholder.com/400x500/E63946/FFFFFF?text=🎄❄️+صورة+${index + 1}`;
            };

            thumb.appendChild(img);
            container.appendChild(thumb);
        });
    }

    showImage(index, transition = true) {
        const mainImg = document.getElementById('mainGalleryImage');
        if (!mainImg) return;

        if (index < 0) index = this.images.length - 1;
        if (index >= this.images.length) index = 0;

        if (transition) {
            mainImg.classList.add('fade-out');

            setTimeout(() => {
                mainImg.src = this.images[index];
                this.currentIndex = index;
                this.updateThumbnails();
                this.updateCounter();

                mainImg.classList.remove('fade-out');
                mainImg.classList.add('fade-in');

                setTimeout(() => {
                    mainImg.classList.remove('fade-in');
                }, CONFIG.GALLERY_TRANSITION_SPEED);
            }, 250);
        } else {
            mainImg.src = this.images[index];
            this.currentIndex = index;
            this.updateThumbnails();
            this.updateCounter();
        }
    }

    updateThumbnails() {
        const thumbnails = document.querySelectorAll('.gallery-thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === this.currentIndex) {
                thumb.classList.add('active');
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    updateCounter() {
        const currentEl = document.getElementById('currentImageIndex');
        const totalEl = document.getElementById('totalImages');

        if (currentEl) currentEl.textContent = this.currentIndex + 1;
        if (totalEl) totalEl.textContent = this.images.length;
    }

    navigateGallery(direction) {
        this.showImage(this.currentIndex + direction);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        if (!this.autoPlayEnabled) return;

        this.autoPlayInterval = setInterval(() => {
            if (!this.isUserScrolling) {
                this.navigateGallery(1);
            }
        }, CONFIG.GALLERY_AUTO_PLAY_INTERVAL);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        if (this.autoPlayEnabled) {
            this.startAutoPlay();
        }
    }

    toggleAutoPlay() {
        this.autoPlayEnabled = !this.autoPlayEnabled;

        const icon = document.getElementById('autoPlayIcon');
        const text = document.getElementById('autoPlayText');

        if (this.autoPlayEnabled) {
            this.startAutoPlay();
            if (icon) icon.textContent = '⏸';
            if (text) text.textContent = 'إيقاف التشغيل التلقائي';
        } else {
            this.stopAutoPlay();
            if (icon) icon.textContent = '▶️';
            if (text) text.textContent = 'تشغيل تلقائي';
        }
    }

    setupTouchEvents() {
        const mainView = document.querySelector('.main-gallery-view');
        if (!mainView) return;

        // Touch events for mobile
        mainView.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        mainView.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        // Mouse drag events for desktop
        let isDragging = false;
        let startX = 0;

        mainView.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            mainView.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            mainView.style.cursor = 'pointer';

            const diffX = e.clientX - startX;
            if (Math.abs(diffX) > 50) {
                this.navigateGallery(diffX > 0 ? -1 : 1);
            }
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.navigateGallery(1); // Swipe left - next image
            } else {
                this.navigateGallery(-1); // Swipe right - previous image
            }
        }
    }

    setupImageClick() {
        const mainImg = document.getElementById('mainGalleryImage');
        if (mainImg) {
            mainImg.addEventListener('click', () => {
                this.openModal(this.currentIndex);
            });
        }
    }

    openModal(index) {
        const modal = document.getElementById('galleryModal');
        const modalImg = document.getElementById('modalImage');

        if (modal && modalImg) {
            modalImg.src = this.images[index];
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            this.stopAutoPlay();
        }
    }

    closeModal() {
        const modal = document.getElementById('galleryModal');

        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            this.resetAutoPlay();
        }
    }

    navigateModal(direction) {
        let newIndex = this.currentIndex + direction;
        if (newIndex < 0) newIndex = this.images.length - 1;
        if (newIndex >= this.images.length) newIndex = 0;

        this.showImage(newIndex, false);

        const modalImg = document.getElementById('modalImage');
        if (modalImg) {
            modalImg.style.opacity = '0';
            setTimeout(() => {
                modalImg.src = this.images[newIndex];
                modalImg.style.opacity = '1';
            }, 150);
        }
    }
}

// Global gallery instance
let productGallery = null;

// Global gallery functions
function navigateGallery(direction) {
    if (productGallery) {
        productGallery.navigateGallery(direction);
    }
}

function toggleAutoPlay() {
    if (productGallery) {
        productGallery.toggleAutoPlay();
    }
}

function closeGalleryModal() {
    if (productGallery) {
        productGallery.closeModal();
    }
}

function navigateModal(direction) {
    if (productGallery) {
        productGallery.navigateModal(direction);
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productGallery) {
        productGallery.closeModal();
    }

    const modal = document.getElementById('galleryModal');
    if (modal && modal.classList.contains('show')) {
        if (e.key === 'ArrowLeft') {
            navigateModal(-1);
        } else if (e.key === 'ArrowRight') {
            navigateModal(1);
        }
    }
});

// Close modal by clicking background
document.addEventListener('click', (e) => {
    const modal = document.getElementById('galleryModal');
    if (e.target === modal && productGallery) {
        productGallery.closeModal();
    }
});

// ========================================
// LIVE STATS MANAGER
// ========================================

class LiveStatsManager {
    constructor() {
        const stored = Utils.getLocalStorage('christmasBundleStats');

        if (stored && (Date.now() - stored.timestamp < 3600000)) {
            this.viewers = stored.viewers;
            this.orders = stored.orders;
            this.stock = stored.stock;
        } else {
            this.viewers = Utils.randomInRange(CONFIG.VIEWERS_MIN, CONFIG.VIEWERS_MAX);
            this.orders = CONFIG.ORDERS_START;
            this.stock = CONFIG.STOCK_REMAINING;
            this.saveStats();
        }

        this.init();
    }

    init() {
        this.updateStats();
        setInterval(() => this.updateStats(), CONFIG.STATS_UPDATE_INTERVAL);
    }

    updateStats() {
        // Update Viewers
        const liveViewersEl = document.getElementById('liveViewers');
        if (liveViewersEl) {
            const currentViewers = this.viewers;
            const changePercentage = (Math.random() * 0.025) + 0.005;
            let change = Math.floor(currentViewers * changePercentage);

            if (Math.random() < 0.15) {
                change = Math.floor(currentViewers * (Math.random() * 0.05 + 0.03));
            }

            if (Math.random() > 0.35) {
                this.viewers += change;
            } else {
                this.viewers -= change;
            }

            this.viewers = Math.max(CONFIG.VIEWERS_MIN, Math.min(CONFIG.VIEWERS_MAX, this.viewers));
            this.animateNumber(liveViewersEl, parseInt(liveViewersEl.textContent.replace(/,/g, '')) || this.viewers, this.viewers);
            this.saveStats();
        }

        // Update Orders
        const todayOrdersEl = document.getElementById('todayOrders');
        if (todayOrdersEl) {
            if (Math.random() < CONFIG.ORDERS_INCREMENT_CHANCE) {
                const increment = Math.random() < 0.85 ? 1 : 2;
                this.orders += increment;

                if (this.stock > 3) {
                    this.stock -= increment;
                }

                this.animateNumber(todayOrdersEl, this.orders - increment, this.orders);
                this.updateStockDisplay();
                this.saveStats();

                if (Math.random() < 0.3) {
                    this.showOrderPulse(todayOrdersEl);
                }
            }
        }
    }

    updateStockDisplay() {
        const stockElements = document.querySelectorAll('.stat-number');
        stockElements.forEach(el => {
            const label = el.nextElementSibling;
            if (label && label.textContent.includes('متبقية')) {
                this.animateNumber(el, parseInt(el.textContent) || this.stock, this.stock);
            }
        });

        const urgencyEl = document.querySelector('.urgency-message');
        if (urgencyEl) {
            urgencyEl.innerHTML = `⚠️ <strong>متبقي فقط ${this.stock} عبوة</strong> - سارع بالحجز!`;

            if (this.stock <= 10) {
                urgencyEl.style.animation = 'blink 1s ease-in-out infinite';
            }
        }

        const countdownWarning = document.querySelector('.countdown-warning');
        if (countdownWarning) {
            countdownWarning.textContent = `🔥 سارع بالطلب - متبقي ${this.stock} عبوة فقط!`;
        }
    }

    animateNumber(element, start, end) {
        const duration = 1500;
        const steps = 20;
        const stepDuration = duration / steps;
        const difference = end - start;
        const stepValue = difference / steps;
        let currentStep = 0;

        const animate = () => {
            if (currentStep < steps) {
                currentStep++;
                const newValue = Math.round(start + (stepValue * currentStep));
                element.textContent = newValue.toLocaleString('en-US');
                setTimeout(animate, stepDuration);
            } else {
                element.textContent = end.toLocaleString('en-US');
            }
        };

        animate();
    }

    showOrderPulse(element) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#2A9D8F';

        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 300);
    }

    saveStats() {
        Utils.setLocalStorage('christmasBundleStats', {
            viewers: this.viewers,
            orders: this.orders,
            stock: this.stock,
            timestamp: Date.now()
        });
    }
}

// ========================================
// COUNTDOWN TIMER
// ========================================

function initializeCountdown() {
    const getEndTime = () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return end.getTime();
    };

    let countdownEndTime = getEndTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownEndTime - now;

        if (distance < 0) {
            countdownEndTime = getEndTime();
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, CONFIG.COUNTDOWN_UPDATE_INTERVAL);
}

// ========================================
// QUANTITY MANAGEMENT
// ========================================

function updateQty(change) {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;

    let currentQuantity = parseInt(quantityInput.value);
    let newQuantity = currentQuantity + change;

    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;

    quantityInput.value = newQuantity;
    updateOrderSummary(newQuantity);
}

function updateOrderSummary(quantity) {
    const summaryQty = document.getElementById('summaryQty');
    const subtotal = document.getElementById('subtotal');
    const discountRow = document.getElementById('discountRow');
    const discountAmount = document.getElementById('discountAmount');
    const totalPrice = document.getElementById('totalPrice');

    if (summaryQty) summaryQty.textContent = quantity;

    const itemPrice = christmasBundleProduct.price;
    const subtotalAmount = itemPrice * quantity;

    if (subtotal) subtotal.textContent = `${Utils.formatPrice(subtotalAmount)} جنيه`;

    let discount = 0;
    if (quantity >= 2) {
        discount = Math.floor(subtotalAmount * 0.1);
        if (discountRow) discountRow.style.display = 'flex';
        if (discountAmount) discountAmount.textContent = `- ${Utils.formatPrice(discount)} جنيه`;
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }

    const finalTotal = subtotalAmount - discount;
    if (totalPrice) totalPrice.textContent = `${Utils.formatPrice(finalTotal)} جنيه`;
}

// ========================================
// FORM HANDLING & GOOGLE SHEETS
// ========================================

function initializeForm() {
    const form = document.getElementById('orderForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleFormSubmission();
    });

    const phoneInput = document.getElementById('customerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }

            if (this.value.length === 11) {
                if (Utils.validatePhone(this.value)) {
                    this.style.borderColor = '#2A9D8F';
                } else {
                    this.style.borderColor = '#E63946';
                }
            }
        });
    }
}

async function handleFormSubmission() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const itemPrice = christmasBundleProduct.price;
    const subtotalAmount = itemPrice * quantity;
    const discount = quantity >= 2 ? Math.floor(subtotalAmount * 0.1) : 0;
    const totalAmount = subtotalAmount - discount;

    const formData = {
        productName: christmasBundleProduct.name,
        productType: 'Bundle',
        productPrice: christmasBundleProduct.price,
        quantity: quantity,
        subtotal: subtotalAmount,
        discount: discount,
        totalAmount: totalAmount,
        customerName: Utils.sanitizeInput(document.getElementById('customerName').value.trim()),
        customerPhone: document.getElementById('customerPhone').value.trim(),
        governorate: document.getElementById('governorate').value,
        address: Utils.sanitizeInput(document.getElementById('address').value.trim()),
        notes: Utils.sanitizeInput(document.getElementById('notes').value.trim()),
        dateTime: Utils.formatDateTime(),
        source: 'Christmas Bundle Product Page'
    };

    if (!validateForm(formData)) {
        return;
    }

    Loading.show();

    try {
        await submitToGoogleSheets(formData);
        Loading.hide();
        showSuccessMessage(formData);
        trackOrder(formData);
        document.getElementById('orderForm').reset();
        updateQty(0);
    } catch (error) {
        Loading.hide();
        console.error('Order submission error:', error);
        Toast.show('حدث خطأ أثناء إرسال الطلب. برجاء المحاولة مرة أخرى', 'error', 4000);
    }
}

function validateForm(formData) {
    if (!formData.customerName || formData.customerName.length < 3) {
        Toast.show('⚠️ من فضلك أدخل الاسم بالكامل (3 أحرف على الأقل)', 'warning');
        document.getElementById('customerName').focus();
        return false;
    }

    if (!Utils.validatePhone(formData.customerPhone)) {
        Toast.show('⚠️ رقم الموبايل يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقم', 'warning');
        document.getElementById('customerPhone').focus();
        return false;
    }

    if (!formData.governorate) {
        Toast.show('⚠️ من فضلك اختر المحافظة', 'warning');
        document.getElementById('governorate').focus();
        return false;
    }

    if (!formData.address || formData.address.length < 10) {
        Toast.show('⚠️ من فضلك أدخل العنوان بالتفصيل (10 أحرف على الأقل)', 'warning');
        document.getElementById('address').focus();
        return false;
    }

    return true;
}

function scrollToForm(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const form = document.getElementById('orderForm');
    if (form) {
        const headerOffset = 100;
        const elementPosition = form.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.allowProgrammaticScroll(() => {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    }
}

async function submitToGoogleSheets(formData, retries = 3) {
    const url = CONFIG.GOOGLE_SHEET_URL;

    const payload = new URLSearchParams({
        productName: formData.productName,
        productType: formData.productType,
        productPrice: formData.productPrice,
        quantity: formData.quantity,
        subtotal: formData.subtotal,
        discount: formData.discount,
        totalAmount: formData.totalAmount,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        governorate: formData.governorate,
        address: formData.address,
        notes: formData.notes || 'لا توجد ملاحظات',
        dateTime: formData.dateTime,
        source: formData.source,
        timestamp: Date.now()
    });

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: payload,
                mode: 'no-cors'
            });

            return true;

        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

function showSuccessMessage(data) {
    const successPopup = document.getElementById('successPopup');
    if (!successPopup) return;

    const orderNumber = 'CB' + Date.now().toString().slice(-6);

    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('confirmName').textContent = data.customerName;
    document.getElementById('confirmQty').textContent = data.quantity;
    document.getElementById('confirmTotal').textContent = `${Utils.formatPrice(data.totalAmount)} جنيه`;

    successPopup.classList.add('show');
    createConfetti();
}

function trackOrder(formData) {
    const orders = Utils.getLocalStorage('christmasBundleOrders') || [];
    orders.push({
        ...formData,
        timestamp: Date.now()
    });
    Utils.setLocalStorage('christmasBundleOrders', orders);

    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            transaction_id: 'CB' + Date.now(),
            value: formData.totalAmount,
            currency: 'EGP',
            items: [{
                item_id: christmasBundleProduct.id,
                item_name: formData.productName,
                item_category: 'Bundle',
                price: formData.productPrice,
                quantity: formData.quantity
            }]
        });
    }

    if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', {
            value: formData.totalAmount,
            currency: 'EGP',
            content_name: formData.productName,
            content_ids: [christmasBundleProduct.id],
            content_type: 'product_group',
            num_items: formData.quantity
        });
    }
}

function createConfetti() {
    const colors = ['#E63946', '#2A9D8F', '#FFD700', '#A9D6E5', '#FFFFFF'];
    const confettiCount = 60;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            opacity: 1;
            z-index: 10002;
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
        `;
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }

    if (!document.getElementById('confettiStyle')) {
        const style = document.createElement('style');
        style.id = 'confettiStyle';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🎄❄️ بلورة بابا نويل + كور الكريسماس', 'font-size: 24px; font-weight: bold; color: #E63946;');
    console.log('%c🎁 Miami Store - Christmas Bundle Edition (7 Images)', 'font-size: 14px; color: #2A9D8F;');

    // ✅ Force scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Initialize all components
    initializeSnowflakes();
    productGallery = new ProductGallery(); // ✅ Initialize gallery with 7 images
    initializeCountdown();
    new LiveStatsManager();
    initializeForm();
    updateQty(0);

    // Disable scroll behaviors
    document.body.style.scrollBehavior = 'auto';
    document.documentElement.style.scrollBehavior = 'auto';

    // Prevent programmatic scrolling
    let isUserScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isUserScrolling) {
            isUserScrolling = true;
            setTimeout(() => {
                isUserScrolling = false;
            }, 100);
        }
    }, { passive: true });

    // Add animation styles
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.05);
                opacity: 0.9;
            }
        }
        @keyframes blink {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.7;
            }
        }
    `;
    document.head.appendChild(animationStyle);
});

// Prevent browser scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Prevent auto-scroll on load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// ========================================
// GLOBAL EXPORTS
// ========================================

window.ChristmasBundleProductPage = {
    config: CONFIG,
    utils: Utils,
    product: christmasBundleProduct,
    gallery: productGallery,
    updateQty,
    scrollToForm,
    navigateGallery,
    toggleAutoPlay,
    closeGalleryModal,
    navigateModal
};

console.log('🎄❄️ Christmas Bundle Product Page with 7-Image Gallery Loaded Successfully!');