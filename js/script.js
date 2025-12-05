/**
 * Miami Store - Advanced E-Commerce Landing Page
 * Modern JavaScript with ES6+ Features
 * @version 3.0.0 - Mobile-First Creative Design
 * @author Miami Store Dev Team
 */

'use strict';

// ====================================
// CONFIGURATION & CONSTANTS
// ====================================

const CONFIG = {
    GOOGLE_SHEET_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    SHEET_ID: '19YCMn8husrkytIdVJpZsiGGSTNM5HplLNjBr25IXwBg',
    ANIMATION_DURATION: 300,
    STATS_UPDATE_INTERVAL: 3000,
    COUNTDOWN_UPDATE_INTERVAL: 1000,
    TOAST_DURATION: 3000,
    SNOWFLAKES_COUNT: 80,
    PARALLAX_INTENSITY: 0.5,
    LOCAL_STORAGE_KEY: 'miamiStore',
};

// Products Database
const PRODUCTS_DATABASE = [
    {
        id: 'santa-1',
        name: 'بابا نويل المتسلق',
        slug: 'climbing-santa',
        description: 'لعبة وديكور رأس السنة المثالية للأطفال والعائلات - يتسلق السلم بحركة سحرية',
        shortDesc: 'لعبة مسلية - ديكور رائع - آمن للأطفال - بطارية عادية',
        currentPrice: 699,
        oldPrice: 1399,
        image: 'assets/product-1/image-1.jpg',
        images: [
            'assets/product-1/image-1.jpg',
            'assets/product-1/image-2.jpg',
            'assets/product-1/image-3.jpg',
            'assets/product-1/image-4.jpg',
            'assets/product-1/image-5.jpg',
            'assets/product-1/image-6.jpg'
        ],
        category: 'christmas',
        isNew: true,
        isFeatured: true, // Special flag for auto-scrolling
        rating: 4.9,
        reviewCount: 843,
        productPage: 'product-santa.html' // Custom product page
    },

    // ====================================
    // PRODUCT 2: Clown Santa (NEW - UPDATED)
    // ====================================
    {
        id: 'santa-2',
        name: 'بابا نويل المهرج 🎅🤡',
        slug: 'clown-santa',
        description: 'بابا نويل المهرج هيخلي العيد مليان ضحك وهدايا - متعة الأطفال وضحكتهم أجمل هدية',
        shortDesc: 'مرح للأطفال - صوت وحركة - آمن للأطفال - وزن خفيف 480 جرام',
        currentPrice: 699,
        oldPrice: 1399,
        image: 'assets/product-2/image-1.jpg',
        images: [
            'assets/product-2/image-1.jpg',
            'assets/product-2/image-2.png',
            'assets/product-2/image-3.png',
            'assets/product-2/image-4.png'
        ],
        category: 'christmas',
        isNew: true,
        isFeatured: true, // ✅ Auto-scrolling images
        rating: 4.9,
        reviewCount: 756,
        productPage: 'product-2.html'
    },

    // ====================================
    // PRODUCT 3: Dancing & Singing Santa (NEW - UPDATED)
    // ====================================
    {
        id: 'santa-3',
        name: 'بابا نويل الراقص والمغني 🎅🎶',
        slug: 'dancing-singing-santa',
        description: 'احتفالات رأس السنة مش بتكمل الا بديكور و زينة البيت - بابا نويل بيغني ويرقص',
        shortDesc: 'يغني ويرقص - بطارية AAA - ديكور مميز - أبعاد 28×14 سم',
        currentPrice: 699,
        oldPrice: 1399,
        image: 'assets/product-3/image-2jpg',
        images: [
            'assets/product-3/image-1.jpg',
            'assets/product-3/image-2.jpg',
            'assets/product-3/image-3.jpg',
            'assets/product-3/image-4.jpg',
            'assets/product-3/image-5.jpg'
        ],
        category: 'christmas',
        isNew: true,
        isFeatured: true, // ✅ Auto-scrolling images
        rating: 4.8,
        reviewCount: 892,
        productPage: 'product-3.html'
    },
    {
        id: 'christmas-bundle-5',
        name: 'بلورة بابا نويل + سلسلة كور الكريسماس',
        slug: 'christmas-snow-globe-lights-bundle',
        description: 'لو بتدور علي هديه لرأس السنه او سيكرت سانتا وفرنالك بلورة بابا نويل وسلسلة كور الكريسماس بسعر محصلش الحقوا اطلبوا قبل نفاذ الكمية',
        shortDesc: 'بلورة مضيئة بمروحة تلج + سلسلة 10 كور LED - ديكور فاخر - هدية مثالية',
        currentPrice: 899,
        oldPrice: 1799,
        image: 'assets/product-5/image-1.jpg',
        images: [
            'assets/product-5/image-1.jpg',
            'assets/product-5/image-2.jpg',
            'assets/product-5/image-3.jpg',
            'assets/product-5/image-4.jpg',
            'assets/product-5/image-5.jpg',
            'assets/product-5/image-6.jpg',
            'assets/product-5/image-7.png'
        ],
        category: 'christmas',
        isNew: true,
        isFeatured: true, // ✅ Auto-scrolling images
        rating: 4.8,
        reviewCount: 892,
        productPage: 'christmas-bundle.html'
    }
    // ,
    // {
    //     id: 5,
    //     name: 'شاحن لاسلكي سريع 3 في 1',
    //     slug: 'wireless-charger-3in1',
    //     description: 'شاحن لاسلكي متعدد الأجهزة بتقنية الشحن السريع',
    //     shortDesc: 'شحن 3 أجهزة - شحن سريع 15W - حماية متقدمة',
    //     currentPrice: 449,
    //     oldPrice: 900,
    //     image: 'https://images.unsplash.com/photo-1591290619762-c588f5b1a2d9?w=800',
    //     images: [
    //         'https://images.unsplash.com/photo-1591290619762-c588f5b1a2d9?w=800',
    //         'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800',
    //         'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800',
    //         'https://images.unsplash.com/photo-1609592986777-6d0b1c5f855f?w=800'
    //     ],
    //     category: 'electronics',
    //     isNew: false,
    //     rating: 4.6,
    //     reviewCount: 1567
    // },
    // {
    //     id: 6,
    //     name: 'مكبر صوت بلوتوث محمول',
    //     slug: 'portable-bluetooth-speaker',
    //     description: 'مكبر صوت قوي 360 درجة مع إضاءة LED RGB',
    //     shortDesc: 'صوت 360° - مقاوم للماء IPX7 - بطارية 12 ساعة',
    //     currentPrice: 699,
    //     oldPrice: 1400,
    //     image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
    //     images: [
    //         'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
    //         'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
    //         'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800',
    //         'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=800'
    //     ],
    //     category: 'electronics',
    //     isNew: false,
    //     rating: 4.7,
    //     reviewCount: 2089
    // },
    // {
    //     id: 7,
    //     name: 'حامل هاتف مغناطيسي للسيارة',
    //     slug: 'magnetic-car-holder',
    //     description: 'حامل مغناطيسي قوي وآمن بتصميم عصري',
    //     shortDesc: 'مغناطيس قوي - دوران 360° - متوافق عالمياً',
    //     currentPrice: 199,
    //     oldPrice: 450,
    //     image: 'https://images.unsplash.com/photo-1574535882747-ef0be6f21e19?w=800',
    //     images: [
    //         'https://images.unsplash.com/photo-1574535882747-ef0be6f21e19?w=800',
    //         'https://images.unsplash.com/photo-1591290619762-c588f5b1a2d9?w=800',
    //         'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
    //         'https://images.unsplash.com/photo-1609592985064-c4b9c7d6c84e?w=800'
    //     ],
    //     category: 'accessories',
    //     isNew: false,
    //     rating: 4.5,
    //     reviewCount: 1234
    // },
    // {
    //     id: 8,
    //     name: 'لمبة LED ذكية متعددة الألوان',
    //     slug: 'smart-led-bulb',
    //     description: 'لمبة ذكية قابلة للتحكم عبر الهاتف مع 16 مليون لون',
    //     shortDesc: '16 مليون لون - تحكم صوتي - توفير طاقة 90%',
    //     currentPrice: 299,
    //     oldPrice: 600,
    //     image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800',
    //     images: [
    //         'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800',
    //         'https://images.unsplash.com/photo-1582575705821-e0aa96aaad3f?w=800',
    //         'https://images.unsplash.com/photo-1600592190098-25fe0e620e9b?w=800',
    //         'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800'
    //     ],
    //     category: 'smart-home',
    //     isNew: true,
    //     rating: 4.6,
    //     reviewCount: 1678
    // }
];

// ====================================
// UTILITY FUNCTIONS
// ====================================

const Utils = {
    // Format currency
    formatPrice: (price) => {
        return new Intl.NumberFormat('ar-EG', {
            style: 'decimal',
            minimumFractionDigits: 0
        }).format(price);
    },

    // Calculate discount percentage
    calculateDiscount: (oldPrice, newPrice) => {
        return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Generate random number in range
    randomInRange: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Animate number
    animateNumber: (element, start, end, duration) => {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    },

    // Validate phone number (Egyptian)
    validatePhone: (phone) => {
        const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
        return phoneRegex.test(phone);
    },

    // Sanitize input
    sanitizeInput: (input) => {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },

    // Get from localStorage
    getLocalStorage: (key) => {
        try {
            const item = localStorage.getItem(`${CONFIG.LOCAL_STORAGE_KEY}_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },

    // Set to localStorage
    setLocalStorage: (key, value) => {
        try {
            localStorage.setItem(`${CONFIG.LOCAL_STORAGE_KEY}_${key}`, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to localStorage:', e);
            return false;
        }
    },

    // Format date time for Egypt
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
    }
};

// ====================================
// TOAST NOTIFICATION SYSTEM
// ====================================

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
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };

        toast.style.cssText = `
            background: ${colors[type]};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1rem;
            font-weight: 600;
            pointer-events: auto;
            animation: slideInDown 0.3s ease, slideOutUp 0.3s ease ${duration - 300}ms;
            max-width: 90vw;
        `;

        toast.innerHTML = `
            <span style="font-size: 1.5rem;">${icons[type]}</span>
            <span>${message}</span>
        `;

        document.getElementById('toastContainer').appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, duration);
    }
}

const Toast = new ToastNotification();

// ====================================
// LOADING OVERLAY
// ====================================

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
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

        this.overlay.innerHTML = `
            <div style="text-align: center;">
                <div class="loader-spinner"></div>
                <p style="color: white; margin-top: 20px; font-size: 1.2rem; font-weight: 600;">
                    جاري المعالجة...
                </p>
            </div>
        `;

        document.body.appendChild(this.overlay);

        // Add spinner styles
        const style = document.createElement('style');
        style.textContent = `
            .loader-spinner {
                width: 60px;
                height: 60px;
                border: 6px solid rgba(255, 255, 255, 0.3);
                border-top-color: #fff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            }
            @keyframes spin {
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

// ====================================
// DYNAMIC SNOW CANVAS ANIMATION
// ====================================

class SnowCanvas {
    constructor() {
        this.canvas = document.getElementById('snowCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.snowflakes = [];
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createSnowflakes();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createSnowflakes() {
        for (let i = 0; i < CONFIG.SNOWFLAKES_COUNT; i++) {
            this.snowflakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 4 + 1,
                speed: Math.random() * 1 + 0.5,
                drift: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.snowflakes.forEach(flake => {
            // Draw snowflake
            this.ctx.beginPath();
            this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            this.ctx.fill();

            // Update position
            flake.y += flake.speed;
            flake.x += flake.drift;

            // Random fade in/out for vanish effect
            if (Math.random() > 0.99) {
                flake.opacity = Math.random() * 0.5 + 0.3;
            }

            // Reset if out of bounds
            if (flake.y > this.canvas.height) {
                flake.y = -10;
                flake.x = Math.random() * this.canvas.width;
            }

            if (flake.x > this.canvas.width) {
                flake.x = 0;
            } else if (flake.x < 0) {
                flake.x = this.canvas.width;
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ====================================
// PARALLAX SCROLL EFFECT
// ====================================

class ParallaxScroll {
    constructor() {
        this.layers = document.querySelectorAll('.parallax-layer');
        if (this.layers.length === 0) return;

        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.update(), { passive: true });
        this.update();
    }

    update() {
        const scrolled = window.pageYOffset;

        this.layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.5;
            const yPos = -(scrolled * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ====================================
// SCROLL ANIMATIONS (Intersection Observer)
// ====================================

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    // Add staggered delay for children
                    if (entry.target.classList.contains('product-item')) {
                        const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.1}s`;
                    }

                    if (entry.target.classList.contains('trust-card')) {
                        const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.15}s`;
                    }
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.product-item, .trust-card').forEach(el => {
            observer.observe(el);
        });
    }
}

// ====================================
// PRODUCTS RENDERER (Updated for new design)
// ====================================

class ProductsRenderer {
    constructor() {
        this.container = document.getElementById('productsGrid'); // ✅ CORRECT

        if (!this.container) {
            console.error('❌ Products container not found! Looking for: productsGrid');
            return;
        }

        console.log('✅ Products container found, rendering products...');
        this.render();
    }

    render() {
        this.container.innerHTML = PRODUCTS_DATABASE.map(product => this.createProductHTML(product)).join('');
    }

    createProductHTML(product) {
        const discount = Utils.calculateDiscount(product.oldPrice, product.currentPrice);
        const savings = product.oldPrice - product.currentPrice;
        const initialViewers = Utils.randomInRange(20, 70);
        const initialOrders = Utils.randomInRange(15, 50);

        // Check if it's the featured product with auto-scroll
        const isFeatured = product.isFeatured || false;
        const productPageLink = product.productPage || `product-${product.id}.html`;

        // Build image section
        let imageSection = '';
        if (isFeatured && product.images && product.images.length > 1) {
            // Featured product with auto-scrolling images
            imageSection = `
            <div class="product-image-slideshow">
                ${product.images.map((img, index) =>
                `<img src="${img}" 
                         alt="${product.name} - صورة ${index + 1}" 
                         class="slideshow-image ${index === 0 ? 'active' : ''}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x500/D92E2E/FFFFFF?text=🎅'">`
            ).join('')}
            </div>
            <div class="auto-scroll-indicator">
                <span class="indicator-dot"></span>
                <span>تشغيل تلقائي</span>
            </div>
            <div class="slideshow-progress">
                <div class="slideshow-progress-bar"></div>
            </div>
        `;
        } else {
            // Regular product with single image
            imageSection = `
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
        `;
        }

        return `
        <div class="product-item ${isFeatured ? 'featured-product' : ''}" data-product-id="${product.id}">
            <div class="product-image-wrapper">
                ${imageSection}
                <div class="product-badge">خصم ${discount}% 🔥</div>
                ${product.isNew ? '<div class="product-new-badge">جديد ✨</div>' : ''}
                <div class="product-stats-overlay">
                    <div class="stat-overlay-item">
                        <div class="stat-overlay-number" id="viewers-${product.id}">${initialViewers}</div>
                        <div class="stat-overlay-label">يشاهدون</div>
                    </div>
                    <div class="stat-overlay-item">
                        <div class="stat-overlay-number" id="orders-${product.id}">${initialOrders}</div>
                        <div class="stat-overlay-label">طلب اليوم</div>
                    </div>
                </div>
            </div>
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.shortDesc}</p>
                <div class="product-rating">
                    <div class="stars">${'⭐'.repeat(Math.floor(product.rating))}</div>
                    <span class="rating-count">(${product.reviewCount.toLocaleString('ar-EG')})</span>
                </div>
                <div class="product-pricing">
                    <span class="current-price">${Utils.formatPrice(product.currentPrice)} جنيه</span>
                    <span class="old-price">${Utils.formatPrice(product.oldPrice)} جنيه</span>
                    <div class="savings-text">💰 وفر ${Utils.formatPrice(savings)} جنيه</div>
                </div>
                <a href="${productPageLink}" class="product-cta">
                    🛒 اطلب الآن
                </a>
            </div>
        </div>
    `;
    }
}

// ====================================
// FEATURED PRODUCT AUTO-SCROLL
// ====================================

class FeaturedProductSlideshow {
    constructor() {
        this.featuredProducts = document.querySelectorAll('.product-item.featured-product');
        this.slideshows = [];
        this.init();
    }

    init() {
        this.featuredProducts.forEach(product => {
            const images = product.querySelectorAll('.slideshow-image');
            if (images.length > 1) {
                this.setupSlideshow(product, images);
            }
        });
    }

    setupSlideshow(productElement, images) {
        let currentIndex = 0;
        const totalImages = images.length;
        const interval = 3000; // 3 seconds per image

        const slideshow = setInterval(() => {
            // Remove active class from current image
            images[currentIndex].classList.remove('active');

            // Move to next image
            currentIndex = (currentIndex + 1) % totalImages;

            // Add active class to new image
            images[currentIndex].classList.add('active');
        }, interval);

        this.slideshows.push(slideshow);

        // Pause on hover
        productElement.addEventListener('mouseenter', () => {
            clearInterval(slideshow);
        });

        // Resume on mouse leave
        productElement.addEventListener('mouseleave', () => {
            const newSlideshow = setInterval(() => {
                images[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % totalImages;
                images[currentIndex].classList.add('active');
            }, interval);
            this.slideshows.push(newSlideshow);
        });
    }

    destroy() {
        this.slideshows.forEach(slideshow => clearInterval(slideshow));
    }
}

// Initialize after products are rendered
let featuredSlideshow = null;

// ====================================
// LIVE STATS MANAGER (Enhanced - English Numbers)
// ====================================

class LiveStatsManager {
    constructor() {
        this.visitors = Utils.randomInRange(3000, 8000); // ✅ Higher range
        this.orders = Utils.randomInRange(200, 400);
        this.visitorsHistory = []; // Track history for realistic patterns
        this.init();
    }

    init() {
        this.updateStats();
        // ✅ Update every 2 seconds instead of 3
        setInterval(() => this.updateStats(), 2000);
    }

    updateStats() {
        // ====================================
        // UPDATE GLOBAL VISITORS (Realistic)
        // ====================================
        const visitorsEl = document.getElementById('liveVisitors');
        if (visitorsEl) {
            const currentVisitors = this.visitors;

            // Calculate realistic change (0.5% to 2.5% of current value)
            const changePercentage = (Math.random() * 0.02) + 0.005; // 0.5% to 2.5%
            let change = Math.floor(currentVisitors * changePercentage);

            // Occasional bigger spikes (10% chance)
            if (Math.random() < 0.1) {
                change = Math.floor(currentVisitors * (Math.random() * 0.04 + 0.03)); // 3% to 7%
            }

            // Weighted towards growth (60% increase, 40% decrease)
            if (Math.random() > 0.4) {
                this.visitors += change;
            } else {
                this.visitors -= change;
            }

            // Keep within bounds
            this.visitors = Math.max(3000, Math.min(8000, this.visitors));

            // Add smooth transition effect
            this.animateNumber(visitorsEl, parseInt(visitorsEl.textContent.replace(/,/g, '')) || this.visitors, this.visitors);
        }

        // ====================================
        // UPDATE GLOBAL ORDERS (Slow increase)
        // ====================================
        const ordersEl = document.getElementById('todayOrders');
        if (ordersEl && Math.random() > 0.6) {
            this.orders++;
            ordersEl.textContent = this.orders;
        }

        // ====================================
        // UPDATE PRODUCT-SPECIFIC STATS
        // ====================================
        PRODUCTS_DATABASE.forEach(product => {
            const viewersEl = document.getElementById(`viewers-${product.id}`);
            const ordersEl = document.getElementById(`orders-${product.id}`);

            if (viewersEl) {
                const currentViewers = parseInt(viewersEl.textContent) || 0;
                const change = Utils.randomInRange(-5, 8);
                const newViewers = Math.max(10, Math.min(100, currentViewers + change));
                viewersEl.textContent = newViewers;
            }

            if (ordersEl && Math.random() > 0.7) {
                const currentOrders = parseInt(ordersEl.textContent) || 0;
                ordersEl.textContent = currentOrders + 1;
            }
        });

        // ====================================
        // UPDATE PRODUCT PAGE STATS
        // ====================================
        const productViewersEl = document.getElementById('productViewers');
        if (productViewersEl) {
            const change = Utils.randomInRange(-5, 10);
            const currentViewers = parseInt(productViewersEl.textContent);
            const newViewers = Math.max(15, Math.min(80, currentViewers + change));
            productViewersEl.textContent = newViewers;
        }

        const productOrdersEl = document.getElementById('productOrders');
        if (productOrdersEl && Math.random() > 0.6) {
            const currentOrders = parseInt(productOrdersEl.textContent);
            productOrdersEl.textContent = currentOrders + 1;
        }
    }

    // ====================================
    // SMOOTH NUMBER ANIMATION (English Format)
    // ====================================
    animateNumber(element, start, end) {
        const duration = 1500; // 1.5 seconds animation
        const steps = 20;
        const stepDuration = duration / steps;
        const difference = end - start;
        const stepValue = difference / steps;
        let currentStep = 0;

        const animate = () => {
            if (currentStep < steps) {
                currentStep++;
                const newValue = Math.round(start + (stepValue * currentStep));
                // ✅ Using English number formatting
                element.textContent = newValue.toLocaleString('en-US');
                setTimeout(animate, stepDuration);
            } else {
                // ✅ Using English number formatting
                element.textContent = end.toLocaleString('en-US');
            }
        };

        animate();
    }
}
// ====================================
// COUNTDOWN TIMER
// ====================================

class CountdownTimer {
    constructor(endTime) {
        this.endTime = endTime || this.getEndTime();
        this.init();
    }

    getEndTime() {
        // Set countdown to end at 11:59 PM today
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return end.getTime();
    }

    init() {
        this.update();
        this.interval = setInterval(() => this.update(), CONFIG.COUNTDOWN_UPDATE_INTERVAL);
    }

    update() {
        const now = new Date().getTime();
        const distance = this.endTime - now;

        if (distance < 0) {
            this.endTime = this.getEndTime();
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
    }

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// ====================================
// PRODUCT PAGE MANAGER
// ====================================

class ProductPageManager {
    constructor(productData) {
        if (!productData) return;

        this.product = productData;
        this.currentImageIndex = 0;
        this.quantity = 1;
        this.init();
    }

    init() {
        this.setupImageGallery();
        this.setupQuantitySelector();
        this.setupOrderForm();
        new CountdownTimer();
    }

    setupImageGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                thumbnails.forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    }

    setupQuantitySelector() {
        const qtyInput = document.getElementById('quantity');
        const summaryQty = document.getElementById('summaryQuantity');
        const totalPrice = document.getElementById('totalPrice');

        if (qtyInput) {
            qtyInput.addEventListener('change', () => {
                this.quantity = parseInt(qtyInput.value) || 1;
                if (summaryQty) summaryQty.textContent = this.quantity;
                if (totalPrice) {
                    const total = this.product.price * this.quantity;
                    totalPrice.textContent = `${Utils.formatPrice(total)} جنيه`;
                }
            });
        }
    }

    setupOrderForm() {
        const form = document.getElementById('orderForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleOrderSubmit();
        });

        // Real-time phone validation
        const phoneInput = document.getElementById('clientPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', Utils.debounce((e) => {
                const value = e.target.value;
                if (value.length >= 11) {
                    if (!Utils.validatePhone(value)) {
                        phoneInput.style.borderColor = 'var(--danger-color)';
                        Toast.show('رقم الهاتف غير صحيح. يجب أن يبدأ بـ 010, 011, 012, أو 015', 'warning', 2000);
                    } else {
                        phoneInput.style.borderColor = 'var(--success-color)';
                    }
                }
            }, 500));
        }
    }

    async handleOrderSubmit() {
        // Get form data
        const formData = {
            productName: this.product.name,
            productPrice: this.product.price,
            quantity: parseInt(document.getElementById('quantity').value),
            clientName: Utils.sanitizeInput(document.getElementById('clientName').value.trim()),
            clientPhone: document.getElementById('clientPhone').value.trim(),
            clientGovernment: document.getElementById('clientGovernment').value,
            clientAddress: Utils.sanitizeInput(document.getElementById('clientAddress').value.trim()),
            notes: Utils.sanitizeInput(document.getElementById('notes').value.trim()),
            dateTime: Utils.formatDateTime()
        };

        // Validate
        if (!this.validateForm(formData)) {
            return;
        }

        // Show loading
        Loading.show();

        try {
            // Submit to Google Sheets
            await this.submitToGoogleSheets(formData);

            // Hide loading
            Loading.hide();

            // Show success
            document.getElementById('orderForm').style.display = 'none';
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';
            successMessage.classList.add('show');

            // Save to analytics
            this.trackOrder(formData);

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            Loading.hide();
            console.error('Order submission error:', error);
            Toast.show('حدث خطأ أثناء إرسال الطلب. برجاء المحاولة مرة أخرى', 'error');
        }
    }

    validateForm(formData) {
        if (!formData.clientName || formData.clientName.length < 3) {
            Toast.show('برجاء إدخال الاسم بالكامل', 'warning');
            document.getElementById('clientName').focus();
            return false;
        }

        if (!Utils.validatePhone(formData.clientPhone)) {
            Toast.show('رقم الهاتف غير صحيح. يجب أن يبدأ بـ 010, 011, 012, أو 015 ويتكون من 11 رقم', 'warning');
            document.getElementById('clientPhone').focus();
            return false;
        }

        if (!formData.clientGovernment) {
            Toast.show('برجاء اختيار المحافظة', 'warning');
            document.getElementById('clientGovernment').focus();
            return false;
        }

        if (!formData.clientAddress || formData.clientAddress.length < 10) {
            Toast.show('برجاء إدخال العنوان بالتفصيل', 'warning');
            document.getElementById('clientAddress').focus();
            return false;
        }

        return true;
    }

    async submitToGoogleSheets(formData) {
        // Use Google Apps Script Web App URL
        const url = CONFIG.GOOGLE_SHEET_URL;

        const payload = new URLSearchParams({
            productName: formData.productName,
            productPrice: formData.productPrice,
            quantity: formData.quantity,
            clientName: formData.clientName,
            clientPhone: formData.clientPhone,
            clientGovernment: formData.clientGovernment,
            clientAddress: formData.clientAddress,
            notes: formData.notes,
            dateTime: formData.dateTime
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: payload
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.text();
    }

    trackOrder(formData) {
        // Save order to localStorage for analytics
        const orders = Utils.getLocalStorage('orders') || [];
        orders.push({
            ...formData,
            timestamp: Date.now()
        });
        Utils.setLocalStorage('orders', orders);

        // Track conversion (you can integrate with Google Analytics here)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: Date.now(),
                value: formData.productPrice * formData.quantity,
                currency: 'EGP',
                items: [{
                    item_id: this.product.id,
                    item_name: formData.productName,
                    price: formData.productPrice,
                    quantity: formData.quantity
                }]
            });
        }
    }
}

// ====================================
// IMAGE FUNCTIONS
// ====================================

function changeMainImage(thumbnail, imageUrl) {
    const mainImage = document.getElementById('mainProductImage');
    const allThumbnails = document.querySelectorAll('.thumbnail');

    allThumbnails.forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');

    mainImage.style.opacity = '0';
    setTimeout(() => {
        mainImage.src = imageUrl;
        mainImage.style.opacity = '1';
    }, 200);
}

function toggleImageZoom() {
    const mainImage = document.getElementById('mainProductImage');
    mainImage.classList.toggle('zoomed');

    if (!mainImage.style.transform) {
        mainImage.style.transform = 'scale(1.5)';
        mainImage.style.cursor = 'zoom-out';
    } else {
        mainImage.style.transform = '';
        mainImage.style.cursor = 'zoom-in';
    }
}

// ====================================
// QUANTITY FUNCTIONS
// ====================================

function increaseQuantity() {
    const qtyInput = document.getElementById('quantity');
    let value = parseInt(qtyInput.value) || 1;
    if (value < 10) {
        value++;
        qtyInput.value = value;
        qtyInput.dispatchEvent(new Event('change'));
    }
}

function decreaseQuantity() {
    const qtyInput = document.getElementById('quantity');
    let value = parseInt(qtyInput.value) || 1;
    if (value > 1) {
        value--;
        qtyInput.value = value;
        qtyInput.dispatchEvent(new Event('change'));
    }
}

// ====================================
// SMOOTH SCROLL FUNCTION
// ====================================

function smoothScrollToProducts() {
    const productsSection = document.getElementById('productsSection');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ====================================
// INITIALIZATION
// ====================================

function initProductPage(productData) {
    new ProductPageManager(productData);
}

// ====================================
// DOM CONTENT LOADED
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas snow animation
    new SnowCanvas();

    // Initialize parallax scrolling
    new ParallaxScroll();

    // Initialize live stats
    new LiveStatsManager();

    // ✅ RENDER PRODUCTS FIRST
    new ProductsRenderer();

    // ✅ Initialize featured product slideshow
    setTimeout(() => {
        featuredSlideshow = new FeaturedProductSlideshow();
    }, 200);

    // ✅ THEN initialize scroll animations (AFTER products exist)
    setTimeout(() => {
        new ScrollAnimations();
    }, 100);

    // Add smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Console welcome message
    console.log('%c🎄 Miami Store', 'font-size: 30px; font-weight: bold; color: #667eea;');
    console.log('%c✨ Mobile-First Creative Design', 'font-size: 14px; color: #764ba2;');
    console.log('%c🚀 Powered by Modern JavaScript ES6+', 'font-size: 12px; color: #f5576c;');
});

// ====================================
// EXPORT FOR MODULES (if needed)
// ====================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Utils,
        Toast,
        Loading,
        ProductsRenderer,
        ProductPageManager,
        initProductPage,
        smoothScrollToProducts
    };
}