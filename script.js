// Main application state
let menuData = null;
let currentFilter = 'all';

/* ============================================
   Category Warning (Çölyak Uyarısı)
   ============================================ */

// Categories that trigger the celiac disease warning banner
const WARNING_CATEGORIES = ['glutensiz', 'vegan', 'glutensiz-vegan', 'gluten-free'];

// Delay (ms) before scrolling, allowing the slideDown animation to start first
const WARNING_SCROLL_DELAY = 100;

function checkAndShowWarning(categorySlug) {
    const warningBanner = document.getElementById('warning-banner');

    if (!warningBanner) return;

    if (WARNING_CATEGORIES.includes(categorySlug)) {
        warningBanner.style.display = 'block';
        // Smooth scroll to warning after animation begins
        setTimeout(() => {
            warningBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, WARNING_SCROLL_DELAY);
    } else {
        warningBanner.style.display = 'none';
    }
}

/* ============================================
   FIX: Desktop category scroll position
   ============================================ */

// Tarayıcı scroll restore kapat
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Desktop (768px+) için scroll fix
function fixDesktopCategoryScroll() {
    // Sadece desktop'ta çalış
    if (window.innerWidth < 768) return;
    
    const nav = document.querySelector('.category-nav');
    if (!nav) return;
    
    const firstBtn = nav.querySelector('.category-btn:first-child');
    if (!firstBtn) return;
    
    // 1. Scroll pozisyonunu sıfırla
    nav.scrollLeft = 0;
    
    // 2. İlk butonu görünür alana getir
    firstBtn.scrollIntoView({ 
        behavior: 'auto',
        inline: 'start',
        block: 'nearest'
    });
    
    // 3. Double-check: tekrar sıfırla
    requestAnimationFrame(() => {
        nav.scrollLeft = 0;
    });
    
    console.log('✅ Desktop scroll fixed:', {
        scrollLeft: nav.scrollLeft,
        firstButton: firstBtn.textContent.trim()
    });
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Hemen dene
    fixDesktopCategoryScroll();
    
    // Kategoriler render edildikten sonra tekrar
    setTimeout(fixDesktopCategoryScroll, 100);
    setTimeout(fixDesktopCategoryScroll, 300);
    setTimeout(fixDesktopCategoryScroll, 500);
    
    // MutationObserver: kategoriler eklendikçe
    const nav = document.querySelector('.category-nav');
    if (nav) {
        let attempts = 0;
        const observer = new MutationObserver(() => {
            fixDesktopCategoryScroll();
            if (++attempts >= 5) observer.disconnect();
        });
        observer.observe(nav, { childList: true });
        
        // 1 saniye sonra observer'ı durdur
        setTimeout(() => observer.disconnect(), 1000);
    }
});

// Window yüklendiğinde
window.addEventListener('load', fixDesktopCategoryScroll);

// Resize'da (mobil ↔ desktop geçişi)
let wasDesktop = window.innerWidth >= 768;
window.addEventListener('resize', () => {
    const isDesktop = window.innerWidth >= 768;
    if (!wasDesktop && isDesktop) {
        // Mobil → Desktop geçişinde fix
        fixDesktopCategoryScroll();
    }
    wasDesktop = isDesktop;
});

// Build menu data with auto-generated "En Sevilenler" category
function buildMenuData(data) {
    const menuData = JSON.parse(JSON.stringify(data)); // Deep copy

    // Collect all featured items
    const featuredItems = [];
    menuData.categories.forEach(category => {
        category.items.forEach(item => {
            if (item.featured === true) {
                featuredItems.push(JSON.parse(JSON.stringify(item)));
            }
        });
    });

    // If there are featured items, prepend the category
    if (featuredItems.length > 0) {
        const featuredCategory = {
            id: 'en-sevilenler',
            name: 'En Sevilenler',
            icon: '🌟',
            items: featuredItems
        };
        menuData.categories.unshift(featuredCategory);
    }

    return menuData;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadMenuData();
    setupScrollToTop();
});

// Load menu data from JSON file
async function loadMenuData() {
    try {
        const response = await fetch('menu-data.json');
        
        if (!response.ok) {
            throw new Error('Menü verisi yüklenemedi');
        }
        
        const rawData = await response.json();
        menuData = buildMenuData(rawData);
        initializeMenu();
    } catch (error) {
        console.error('Error loading menu data:', error);
        showError('Menü yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
    }
}

// Initialize menu after data is loaded
function initializeMenu() {
    if (!menuData) return;
    
    // Update cafe name in header
    const headerTitle = document.querySelector('.header h1');
    if (headerTitle) {
        headerTitle.textContent = `🌿 ${menuData.cafeName}`;
    }
    
    // Create category navigation
    createCategoryNav();
    
    // Render all menu items
    renderMenu();
    
    // Setup category filtering
    setupCategoryFiltering();
}

// Create category navigation buttons
function createCategoryNav() {
    const nav = document.getElementById('categoryNav');
    if (!nav) return;
    
    nav.innerHTML = '';
    
    const featuredCategory = menuData.categories.find(cat => cat.id === 'en-sevilenler');
    if (featuredCategory) {
        const btn = createCategoryButton(featuredCategory.id, featuredCategory.name, featuredCategory.icon);
        nav.appendChild(btn);
    }
    
    menuData.categories.forEach(category => {
        if (category.id !== 'en-sevilenler') {
            const btn = createCategoryButton(category.id, category.name, category.icon);
            nav.appendChild(btn);
        }
    });
}

// Create a single category button
function createCategoryButton(id, name, icon) {
    const button = document.createElement('button');
    button.className = 'category-btn';
    button.dataset.category = id;
    button.innerHTML = `<span class="category-icon">${icon}</span><span>${name}</span>`;
    
    if (id === 'all') {
        button.classList.add('active');
    }
    
    return button;
}

// Setup category filtering functionality
function setupCategoryFiltering() {
    const nav = document.getElementById('categoryNav');
    if (!nav) return;
    
    nav.addEventListener('click', (e) => {
        const button = e.target.closest('.category-btn');
        if (!button) return;
        
        const category = button.dataset.category;
        
        // Update active state
        nav.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Filter menu
        currentFilter = category;
        renderMenu();

        // Show/hide warning banner for gluten-free/vegan categories
        checkAndShowWarning(category);
        
        // Scroll to menu container
        const menuContainer = document.getElementById('menuContainer');
        if (menuContainer) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const navHeight = nav.offsetHeight;
            const offset = headerHeight + navHeight + 20;
            
            window.scrollTo({
                top: menuContainer.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    });
}

// Render the menu based on current filter
function renderMenu() {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    let categoriesToRender = menuData.categories;
    
    // Filter categories if needed
    if (currentFilter !== 'all') {
        categoriesToRender = menuData.categories.filter(cat => cat.id === currentFilter);
    }
    
    // Render each category
    categoriesToRender.forEach(category => {
        const categorySection = createCategorySection(category);
        container.appendChild(categorySection);
    });
}

// Create a category section with all its items
function createCategorySection(category) {
    const section = document.createElement('section');
    section.className = 'category-section';
    section.id = category.id;
    
    // Category title
    const title = document.createElement('h2');
    title.className = 'category-title';
    title.innerHTML = `<span class="category-icon">${category.icon}</span><span>${category.name}</span>`;
    section.appendChild(title);
    
    // Menu grid
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    
    // Add menu items
    category.items.forEach(item => {
        const itemCard = createMenuItem(item);
        grid.appendChild(itemCard);
    });
    
    section.appendChild(grid);
    return section;
}

// Create a single menu item card
function createMenuItem(item) {
    const card = document.createElement('div');
    card.className = item.featured ? 'menu-item is-featured' : 'menu-item';

    // Featured badge
    if (item.featured) {
        const badge = document.createElement('span');
        badge.className = 'featured-badge';
        badge.setAttribute('aria-label', 'En Sevilen Ürün');
        badge.textContent = 'En Sevilen';
        card.appendChild(badge);
    }

    // Create image
    const img = document.createElement('img');
    img.className = 'menu-item-image';
    img.alt = item.name;
    img.loading = 'lazy';
    
    // Auto-generate path from item ID: images/{id}.jpg
    const imagePath = `images/${item.id}.jpg`;

    // Handle image load errors (if image doesn't exist, show placeholder)
    img.onerror = function() {
        console.error('❌ Image not found:', imagePath);
        this.src = 'images/placeholder-food.svg';  // Food plate silhouette
        this.onerror = null; // Prevent infinite loop if placeholder also fails
    };

    // Log successful image loads
    img.onload = function() {
        console.log('✅ Image loaded:', imagePath);
    };

    // Set the auto-generated image path
    img.src = imagePath;

    // Make image clickable - open in modal
    img.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent card click if any
        openImageModal(this.src, item.name);
    });

    card.appendChild(img);
    
    // Create content section
    const content = document.createElement('div');
    content.className = 'menu-item-content';
    
    // Header with name and price
    const header = document.createElement('div');
    header.className = 'menu-item-header';
    
    const name = document.createElement('h3');
    name.className = 'menu-item-name';
    name.textContent = item.name;
    
    const price = document.createElement('div');
    price.className = 'menu-item-price';
    price.textContent = `₺${item.price}`;
    
    header.appendChild(name);
    header.appendChild(price);
    content.appendChild(header);
    
    // Description
    if (item.description) {
        const description = document.createElement('p');
        description.className = 'menu-item-description';
        description.textContent = item.description;
        content.appendChild(description);
    }

    // Badges
    if (item.badges && item.badges.length > 0) {
        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'badge-container';
        badgeContainer.innerHTML = renderBadges(item.badges);
        content.appendChild(badgeContainer);
    }

    card.appendChild(content);
    return card;
}

// Render badge HTML string for a list of badge keys
function renderBadges(badges) {
    if (!badges || badges.length === 0) return '';

    const badgeIcons = {
        'vegan': '🌱',
        'glutensiz': '🌾',
        'sekersiz': '🍯',
        'organik': '☘️'
    };

    return badges.map(badge =>
        `<span class="badge badge-${badge}">${badgeIcons[badge] || ''} ${badge}</span>`
    ).join('');
}

// Show error message
function showError(message) {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    
    container.innerHTML = `<div class="error">${message}</div>`;
}

// Show loading state
function showLoading() {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Menü yükleniyor</div>';
}

// Setup scroll-to-top button
function setupScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================
   CATEGORY NAVIGATION - HORIZONTAL SCROLL
   ============================================ */

// Enable mouse wheel horizontal scroll on desktop
function initCategoryScroll() {
    const categoryNav = document.querySelector('.category-nav');

    if (!categoryNav) return;

    // Check if categories overflow and set data-overflow attribute for CSS
    function checkOverflow() {
        const isOverflowing = categoryNav.scrollWidth > categoryNav.clientWidth;

        if (isOverflowing) {
            categoryNav.setAttribute('data-overflow', 'true');
            categoryNav.scrollLeft = 0;
        } else {
            categoryNav.removeAttribute('data-overflow');
        }
    }

    // Check overflow on initial load
    checkOverflow();

    // Recheck on window resize (responsive)
    window.addEventListener('resize', checkOverflow);

    // Desktop: Mouse wheel scrolls horizontally
    categoryNav.addEventListener('wheel', function(e) {
        // Only if content overflows (scrollable)
        if (this.scrollWidth > this.clientWidth) {
            e.preventDefault();
            // Convert vertical scroll (deltaY) to horizontal
            this.scrollLeft += e.deltaY;
        }
    }, { passive: false });
}

/* ============================================
   IMAGE MODAL FUNCTIONS
   ============================================ */

// Open image modal
function openImageModal(imageSrc, caption) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');

    if (!modal || !modalImg || !modalCaption) return;

    // Set content
    modalImg.src = imageSrc;
    modalImg.alt = caption;
    modalCaption.textContent = caption;

    // Show modal
    modal.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close image modal
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;

    // Hide modal
    modal.classList.remove('active');

    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Setup modal event listeners (run once on page load)
function initImageModal() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.getElementById('modalClose');

    if (!modal || !closeBtn) return;

    // Close button click
    closeBtn.addEventListener('click', closeImageModal);

    // Click outside image (on overlay)
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
}

// ESC key to close modal (attached once at document level)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('imageModal');
        if (modal && modal.classList.contains('active')) {
            closeImageModal();
        }
    }
});

// Initialize modal on page load
document.addEventListener('DOMContentLoaded', function() {
    initCategoryScroll();
    initImageModal();
});
