/**
 * MUSICAL SANTA - PRODUCT PAGE JAVASCRIPT
 * Elegant Premium Holiday Decor System
 * @version 2.0.0
 */

'use strict';

// ========================================
// ✅ BLOCK ALL AUTOMATIC SCROLLING
// ========================================
(function() {
    const originalScrollTo = window.scrollTo;
    const originalScrollBy = window.scrollBy;
    const originalScrollIntoView = Element.prototype.scrollIntoView;

    let allowScroll = false;

    // Override window.scrollTo
    window.scrollTo = function(...args) {
        if (allowScroll) {
            originalScrollTo.apply(window, args);
        }
    };

    // Override window.scrollBy
    window.scrollBy = function(...args) {
        if (allowScroll) {
            originalScrollBy.apply(window, args);
        }
    };

    // Override scrollIntoView
    Element.prototype.scrollIntoView = function(...args) {
        if (allowScroll) {
            originalScrollIntoView.apply(this, args);
        }
    };

    // ✅ Function to allow scroll temporarily
    window.allowProgrammaticScroll = function(callback) {
        allowScroll = true;
        callback();
        setTimeout(() => {
            allowScroll = false;
        }, 100);
    };
})();

// ========================================
// CONFIGURATION
// ========================================

const CONFIG = {
    GOOGLE_SHEET_URL: 'https://script.google.com/macros/s/AKfycbwQVGSShWTVLYDMTgzyG5PoDM9eSQUuJwOyJWPnrOn6PCYkV5H0crQWNkbImyOMGEaT/exec',
    SHEET_ID: '19YCMn8husrkytIdVJpZsiGGSTNM5HplLNjBr25IXwBg',
    ANIMATION_DURATION: 1500,
    STATS_UPDATE_INTERVAL: 2000,
    COUNTDOWN_UPDATE_INTERVAL: 1000,
    TOAST_DURATION: 3000,
    LOCAL_STORAGE_KEY: 'miamiStoreMusicalSanta',

    // Musical Santa Specific
    VIEWERS_MIN: 800,
    VIEWERS_MAX: 3500,
    ORDERS_START: 156,
    ORDERS_INCREMENT_CHANCE: 0.25 // 25% chance per update
};

// Product Data
const musicalSantaProduct = {
    id: 'musical-santa-002',
    name: 'بابا نويل الموسيقي',
    nameEnglish: 'Musical Santa Claus',
    price: 699,
    oldPrice: 1399,
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
        if (!document.getElementById('elegantToastContainer')) {
            const container = document.createElement('div');
            container.id = 'elegantToastContainer';
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
            success: '#014421',
            error: '#800020',
            warning: '#D4AF37',
            info: '#333333'
        };

        toast.style.cssText = `
            background: ${colors[type]};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1rem;
            font-weight: 600;
            pointer-events: auto;
            animation: elegantSlideIn 0.4s ease, elegantSlideOut 0.4s ease ${duration - 400}ms;
            max-width: 90vw;
            z-index: 10001;
            border: 1px solid rgba(212, 175, 55, 0.3);
        `;

        toast.innerHTML = `
            <span style="font-size: 1.5rem;">${icons[type]}</span>
            <span>${message}</span>
        `;

        document.getElementById('elegantToastContainer').appendChild(toast);

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
        this.overlay.id = 'elegantLoadingOverlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(34, 34, 34, 0.95);
            backdrop-filter: blur(10px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

        this.overlay.innerHTML = `
            <div style="text-align: center;">
                <div class="elegant-loader"></div>
                <p style="color: #D4AF37; margin-top: 24px; font-size: 1.3rem; font-weight: 700;">
                    🎷 جاري إرسال طلبك...
                </p>
                <p style="color: #F5F5F0; margin-top: 8px; font-size: 1rem; opacity: 0.7;">
                    من فضلك انتظر قليلاً
                </p>
            </div>
        `;

        document.body.appendChild(this.overlay);

        // Add elegant spinner
        const style = document.createElement('style');
        style.textContent = `
            .elegant-loader {
                width: 70px;
                height: 70px;
                border: 8px solid rgba(212, 175, 55, 0.2);
                border-top-color: #D4AF37;
                border-right-color: #800020;
                border-radius: 50%;
                animation: elegantSpin 1.2s linear infinite;
                margin: 0 auto;
            }
            @keyframes elegantSpin {
                to { transform: rotate(360deg); }
            }
            @keyframes elegantSlideIn {
                from {
                    transform: translateY(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @keyframes elegantSlideOut {
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
// AMBIENT PARTICLES ANIMATION
// ========================================

function initializeAmbientParticles() {
    const particlesContainer = document.getElementById('particlesContainer');
    if (!particlesContainer) return;

    const numberOfParticles = 30;

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';

        particlesContainer.appendChild(particle);
    }
}

// ========================================
// GOLDEN SPARKLES ANIMATION
// ========================================

function initializeGoldenSparkles() {
    const sparklesContainer = document.getElementById('sparklesContainer');
    if (!sparklesContainer) return;

    const numberOfSparkles = 20;

    for (let i = 0; i < numberOfSparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';

        sparklesContainer.appendChild(sparkle);
    }
}

// ========================================
// LIVE STATS MANAGER
// ========================================

class LiveStatsManager {
    constructor() {
        // Initialize with stored values or defaults
        const stored = Utils.getLocalStorage('musicalSantaStats');

        if (stored && (Date.now() - stored.timestamp < 3600000)) {
            // Use stored values if less than 1 hour old
            this.viewers = stored.viewers;
            this.orders = stored.orders;
        } else {
            // Initialize new values
            this.viewers = Utils.randomInRange(CONFIG.VIEWERS_MIN, CONFIG.VIEWERS_MAX);
            this.orders = CONFIG.ORDERS_START;
            this.saveStats();
        }

        this.init();
    }

    init() {
        // Set initial values
        const liveViewersEl = document.getElementById('elegantViewers');
        const todayOrdersEl = document.getElementById('elegantOrders');

        if (liveViewersEl) {
            liveViewersEl.textContent = this.viewers.toLocaleString('en-US');
        }
        if (todayOrdersEl) {
            todayOrdersEl.textContent = this.orders.toLocaleString('en-US');
        }

        // Start updating
        this.updateStats();
        setInterval(() => this.updateStats(), CONFIG.STATS_UPDATE_INTERVAL);
    }

    updateStats() {
        // ====================================
        // REALISTIC VIEWERS ANIMATION (800-3500)
        // ====================================
        const liveViewersEl = document.getElementById('elegantViewers');

        if (liveViewersEl) {
            const currentViewers = this.viewers;

            // Calculate realistic change (0.5% to 3% of current value)
            const changePercentage = (Math.random() * 0.025) + 0.005;
            let change = Math.floor(currentViewers * changePercentage);

            // Occasional bigger spikes (12% chance)
            if (Math.random() < 0.12) {
                change = Math.floor(currentViewers * (Math.random() * 0.05 + 0.03));
            }

            // Weighted towards growth (60% increase, 40% decrease)
            if (Math.random() > 0.4) {
                this.viewers += change;
            } else {
                this.viewers -= change;
            }

            // Keep within bounds
            this.viewers = Math.max(CONFIG.VIEWERS_MIN, Math.min(CONFIG.VIEWERS_MAX, this.viewers));

            // Smooth animation
            this.animateNumber(liveViewersEl, parseInt(liveViewersEl.textContent.replace(/,/g, '')) || this.viewers, this.viewers);

            // Save stats
            this.saveStats();
        }

        // ====================================
        // REALISTIC ORDERS INCREASE (156+)
        // ====================================
        const todayOrdersEl = document.getElementById('elegantOrders');

        if (todayOrdersEl) {
            // Increase orders based on probability
            if (Math.random() < CONFIG.ORDERS_INCREMENT_CHANCE) {
                // Usually increase by 1, occasionally by 2
                const increment = Math.random() < 0.85 ? 1 : 2;
                this.orders += increment;

                // Smooth animation
                this.animateNumber(todayOrdersEl, this.orders - increment, this.orders);

                // Save stats
                this.saveStats();

                // Show mini celebration effect for order increase
                if (Math.random() < 0.3) {
                    this.showOrderPulse(todayOrdersEl);
                }
            }
        }
    }

    // ====================================
    // SMOOTH NUMBER ANIMATION
    // ====================================
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

    // ====================================
    // ORDER PULSE EFFECT
    // ====================================
    showOrderPulse(element) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#D4AF37';

        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 300);
    }

    // ====================================
    // SAVE STATS TO LOCAL STORAGE
    // ====================================
    saveStats() {
        Utils.setLocalStorage('musicalSantaStats', {
            viewers: this.viewers,
            orders: this.orders,
            timestamp: Date.now()
        });
    }
}

// ========================================
// ELEGANT PRODUCT GALLERY
// ========================================

class ElegantProductGallery {
    constructor() {
        this.images = [
            'assets/product-3/image-1.jpg',
            'assets/product-3/image-2.jpg',
            'assets/product-3/image-3.jpg',
            'assets/product-3/image-4.jpg',
            'assets/product-3/image-5.jpg'
        ];
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayEnabled = true;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.loadThumbnails();
        this.updateCounter();
        this.setupTouchEvents();
        this.setupImageClick();
        this.startAutoPlay();
    }

    loadThumbnails() {
        const container = document.getElementById('elegantThumbnails');
        if (!container) return;

        container.innerHTML = '';

        this.images.forEach((imagePath, index) => {
            const thumb = document.createElement('div');
            thumb.className = `thumbnail-elegant ${index === 0 ? 'active' : ''}`;
            thumb.onclick = () => this.showImage(index);

            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = `${musicalSantaProduct.name} - صورة ${index + 1}`;
            img.onerror = function() {
                this.src = `https://via.placeholder.com/400x500/800020/FFFFFF?text=صورة+${index + 1}`;
            };

            thumb.appendChild(img);
            container.appendChild(thumb);
        });
    }

    showImage(index, transition = true) {
        const mainImg = document.getElementById('mainElegantImage');
        if (!mainImg) return;

        // Validate index
        if (index < 0) index = this.images.length - 1;
        if (index >= this.images.length) index = 0;

        // Apply transition effect
        if (transition) {
            mainImg.style.opacity = '0';
            mainImg.style.transform = 'scale(0.95)';

            setTimeout(() => {
                mainImg.src = this.images[index];
                this.currentIndex = index;
                this.updateThumbnails();
                this.updateCounter();

                mainImg.style.opacity = '1';
                mainImg.style.transform = 'scale(1)';
            }, 300);
        } else {
            mainImg.src = this.images[index];
            this.currentIndex = index;
            this.updateThumbnails();
            this.updateCounter();
        }
    }

    updateThumbnails() {
        const thumbnails = document.querySelectorAll('.thumbnail-elegant');
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
        const currentEl = document.getElementById('elegantCurrentIndex');
        const totalEl = document.getElementById('elegantTotalImages');

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
            this.navigateGallery(1);
        }, 4000); // Change image every 4 seconds
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

    setupTouchEvents() {
        const mainView = document.querySelector('.main-display-elegant');
        if (!mainView) return;

        mainView.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        mainView.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        // Mouse drag for desktop
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
                // Swipe left - next image
                this.navigateGallery(1);
            } else {
                // Swipe right - previous image
                this.navigateGallery(-1);
            }
        }
    }

    setupImageClick() {
        const mainImg = document.getElementById('mainElegantImage');
        if (mainImg) {
            mainImg.addEventListener('click', () => {
                this.openModal(this.currentIndex);
            });
        }
    }

    openModal(index) {
        const modal = document.getElementById('elegantImageModal');
        const modalImg = document.getElementById('elegantModalImage');

        if (modal && modalImg) {
            modalImg.src = this.images[index];
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            this.stopAutoPlay();
        }
    }

    closeModal() {
        const modal = document.getElementById('elegantImageModal');

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

        const modalImg = document.getElementById('elegantModalImage');
        if (modalImg) {
            modalImg.style.opacity = '0';
            setTimeout(() => {
                modalImg.src = this.images[newIndex];
                modalImg.style.opacity = '1';
            }, 150);
        }
    }
}

// Global instance
let elegantGallery = null;

// Global functions for onclick handlers
function navigateElegantGallery(direction) {
    if (elegantGallery) {
        elegantGallery.navigateGallery(direction);
    }
}

function closeElegantImageModal() {
    if (elegantGallery) {
        elegantGallery.closeModal();
    }
}

function navigateElegantModal(direction) {
    if (elegantGallery) {
        elegantGallery.navigateModal(direction);
    }
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elegantGallery) {
        elegantGallery.closeModal();
    }
});

// Close modal on background click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('elegantImageModal');
    if (e.target === modal && elegantGallery) {
        elegantGallery.closeModal();
    }
});

// ========================================
// COUNTDOWN TIMER
// ========================================

function initializeElegantCountdown() {
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

        const hoursEl = document.getElementById('elegantHours');
        const minutesEl = document.getElementById('elegantMinutes');
        const secondsEl = document.getElementById('elegantSeconds');

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

function updateElegantQuantity(change) {
    const quantityInput = document.getElementById('elegantQuantity');
    if (!quantityInput) return;

    let currentQuantity = parseInt(quantityInput.value);
    let newQuantity = currentQuantity + change;

    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;

    quantityInput.value = newQuantity;
    updateElegantOrderSummary(newQuantity);
}

function updateElegantOrderSummary(quantity) {
    const summaryQty = document.getElementById('elegantSummaryQty');
    const subtotal = document.getElementById('elegantSubtotal');
    const discountRow = document.getElementById('elegantDiscountRow');
    const discountAmount = document.getElementById('elegantDiscountAmount');
    const totalPrice = document.getElementById('elegantTotalPrice');

    if (summaryQty) summaryQty.textContent = quantity;

    const itemPrice = musicalSantaProduct.price;
    const subtotalAmount = itemPrice * quantity;

    if (subtotal) subtotal.textContent = `${Utils.formatPrice(subtotalAmount)} جنيه`;

    // Apply 10% discount for 3+ items
    let discount = 0;
    if (quantity >= 3) {
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
// FORM HANDLING & GOOGLE SHEETS INTEGRATION
// ========================================

function initializeElegantForm() {
    const form = document.getElementById('elegantOrderForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleElegantFormSubmission();
    });

    // Real-time phone validation
    const phoneInput = document.getElementById('elegantCustomerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }

            if (this.value.length === 11) {
                if (Utils.validatePhone(this.value)) {
                    this.style.borderColor = '#014421';
                } else {
                    this.style.borderColor = '#800020';
                }
            }
        });
    }
}

async function handleElegantFormSubmission() {
    // Collect form data
    const quantity = parseInt(document.getElementById('elegantQuantity').value);
    const itemPrice = musicalSantaProduct.price;
    const subtotalAmount = itemPrice * quantity;
    const discount = quantity >= 3 ? Math.floor(subtotalAmount * 0.1) : 0;
    const totalAmount = subtotalAmount - discount;

    const formData = {
        productName: musicalSantaProduct.name,
        productPrice: musicalSantaProduct.price,
        quantity: quantity,
        subtotal: subtotalAmount,
        discount: discount,
        totalAmount: totalAmount,
        customerName: Utils.sanitizeInput(document.getElementById('elegantCustomerName').value.trim()),
        customerPhone: document.getElementById('elegantCustomerPhone').value.trim(),
        governorate: document.getElementById('elegantGovernorate').value,
        address: Utils.sanitizeInput(document.getElementById('elegantDetailedAddress').value.trim()),
        notes: Utils.sanitizeInput(document.getElementById('elegantNotes').value.trim()),
        dateTime: Utils.formatDateTime(),
        source: 'Musical Santa Product Page'
    };

    // Validate form
    if (!validateElegantForm(formData)) {
        return;
    }

    // Show loading
    Loading.show();

    try {
        // Submit to Google Sheets
        await submitToGoogleSheets(formData);

        // Hide loading
        Loading.hide();

        // Show success popup
        showElegantSuccessMessage(formData);

        // Track order
        trackElegantOrder(formData);

        // Reset form
        // document.getElementById('elegantOrderForm').reset();
        updateElegantQuantity(0); // Reset to 1

    } catch (error) {
        Loading.hide();
        console.error('Order submission error:', error);
        Toast.show('حدث خطأ أثناء إرسال الطلب. برجاء المحاولة مرة أخرى', 'error', 4000);
    }
}

function validateElegantForm(formData) {
    if (!formData.customerName || formData.customerName.length < 3) {
        Toast.show('⚠️ من فضلك أدخل الاسم بالكامل (3 أحرف على الأقل)', 'warning');
        document.getElementById('elegantCustomerName').focus();
        return false;
    }

    if (!Utils.validatePhone(formData.customerPhone)) {
        Toast.show('⚠️ رقم الموبايل يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقم', 'warning');
        document.getElementById('elegantCustomerPhone').focus();
        return false;
    }

    if (!formData.governorate) {
        Toast.show('⚠️ من فضلك اختر المحافظة', 'warning');
        document.getElementById('elegantGovernorate').focus();
        return false;
    }

    if (!formData.address || formData.address.length < 10) {
        Toast.show('⚠️ من فضلك أدخل العنوان بالتفصيل (10 أحرف على الأقل)', 'warning');
        document.getElementById('elegantDetailedAddress').focus();
        return false;
    }

    return true;
}

// ========================================
// GOOGLE SHEETS SUBMISSION
// ========================================

async function submitToGoogleSheets(formData) {
    const url = CONFIG.GOOGLE_SHEET_URL;

    const payload = new URLSearchParams({
        // Product Info
        productName: formData.productName,
        productPrice: formData.productPrice,
        quantity: formData.quantity,
        subtotal: formData.subtotal,
        discount: formData.discount,
        totalAmount: formData.totalAmount,

        // Customer Info
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        governorate: formData.governorate,
        address: formData.address,
        notes: formData.notes || 'لا توجد ملاحظات',

        // Meta Info
        dateTime: formData.dateTime,
        source: formData.source,
        timestamp: Date.now()
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload,
        mode: 'no-cors' // Important for Google Sheets
    });

    // Note: With mode: 'no-cors', we can't read the response
    // So we assume success if no error is thrown
    return true;
}

function showElegantSuccessMessage(data) {
    const successModal = document.getElementById('elegantSuccessModal');
    if (!successModal) return;

    const orderNumber = 'MUS' + Date.now().toString().slice(-6);

    document.getElementById('elegantOrderNumber').textContent = orderNumber;
    document.getElementById('elegantConfirmName').textContent = data.customerName;
    document.getElementById('elegantConfirmQty').textContent = data.quantity;
    document.getElementById('elegantConfirmTotal').textContent = `${Utils.formatPrice(data.totalAmount)} جنيه`;

    successModal.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Confetti effect
    createElegantConfetti();
}

function trackElegantOrder(formData) {
    const orders = Utils.getLocalStorage('musicalSantaOrders') || [];
    orders.push({
        ...formData,
        timestamp: Date.now()
    });
    Utils.setLocalStorage('musicalSantaOrders', orders);

    // Google Analytics (if available)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            transaction_id: 'MUS' + Date.now(),
            value: formData.totalAmount,
            currency: 'EGP',
            items: [{
                item_id: musicalSantaProduct.id,
                item_name: formData.productName,
                price: formData.productPrice,
                quantity: formData.quantity
            }]
        });
    }
}

// ========================================
// ELEGANT CONFETTI EFFECT
// ========================================

function createElegantConfetti() {
    const colors = ['#D4AF37', '#800020', '#014421', '#F5F5F0'];
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
            border-radius: 50%;
            animation: elegantConfettiFall ${2 + Math.random() * 2}s linear forwards;
        `;
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }

    // Add animation style if not exists
    if (!document.getElementById('elegantConfettiStyle')) {
        const style = document.createElement('style');
        style.id = 'elegantConfettiStyle';
        style.textContent = `
            @keyframes elegantConfettiFall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🎷 بابا نويل الموسيقي', 'font-size: 24px; font-weight: bold; color: #D4AF37;');
    console.log('%c✨ Miami Store - Premium Holiday Collection', 'font-size: 14px; color: #014421;');

    // Initialize all components
    initializeAmbientParticles();
    initializeGoldenSparkles();
    elegantGallery = new ElegantProductGallery();
    initializeElegantCountdown();
    new LiveStatsManager();
    initializeElegantForm();
    initializeSmoothScroll();

    // Initial summary update
    updateElegantQuantity(0);

    // Add fade-in animation to sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// ========================================
// EXPORT FOR DEBUGGING
// ========================================

window.MusicalSantaPage = {
    config: CONFIG,
    product: musicalSantaProduct,
    utils: Utils,
    updateQuantity: updateElegantQuantity,
    gallery: () => elegantGallery
};
