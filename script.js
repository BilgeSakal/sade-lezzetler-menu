// Main application state
let menuData = null;
let currentFilter = 'all';
let activeIngredients = [];
let activePriceRange = 'all';

/* ============================================
   SMART INGREDIENT FILTERS (19 filters, 41+ ingredients covered)
   ============================================ */

const SMART_INGREDIENTS = [
    // GRUP 1: Protein Kaynakları
    { id: 'tavuk', name: 'Tavuk', icon: '🍗', category: 'protein', description: 'Tavuk içeren tüm yemekler' },
    { id: 'kirmizi-et', name: 'Kırmızı Et', icon: '🥩', category: 'protein', description: 'Et, köfte, kuzu, tandır', includes: ['et', 'köfte', 'kuzu', 'tandır', 'dana', 'anne köftesi'] },
    { id: 'deniz-urunleri', name: 'Deniz Ürünleri', icon: '🐟', category: 'protein', description: 'Somon, ton balığı', includes: ['somon', 'ton balığı', 'balık'] },
    { id: 'yumurta', name: 'Yumurta', icon: '🥚', category: 'protein', description: 'Yumurta içeren yemekler' },

    // GRUP 2: Vejetaryen/Vegan Protein
    { id: 'baklagil', name: 'Baklagiller', icon: '🫘', category: 'protein', description: 'Falafel, humus, nohut, fasulye', includes: ['falafel', 'humus', 'nohut', 'çıtır nohut', 'meksika fasulyesi', 'fasulye'] },
    { id: 'tofu', name: 'Tofu', icon: '🟨', category: 'protein', description: 'Tofu içeren vegan yemekler' },
    { id: 'hellim', name: 'Hellim', icon: '🧀', category: 'protein', description: 'Izgara hellim' },

    // GRUP 3: Süt Ürünleri
    { id: 'peynir', name: 'Peynir', icon: '🧀', category: 'dairy', description: 'Kaşar, cheddar, ezine, parmesan', includes: ['kaşar', 'cheddar', 'ezine', 'eski kaşar', 'beyaz peynir', 'peynir', 'köy peyniri', 'parmesan'] },
    { id: 'sut-urunleri', name: 'Süt/Krema/Yoğurt', icon: '🥛', category: 'dairy', description: 'Krema, yoğurt, labne içeren', includes: ['krema', 'yoğurt', 'labne', 'süt', 'kuru cacık'] },

    // GRUP 4: Karbonhidrat
    { id: 'ekmek', name: 'Ekmek', icon: '🍞', category: 'carb', description: 'Tüm ekmek ürünleri', includes: ['ekmek', 'ekşi mayalı ekmek', 'wrap', 'tortilla', 'bun', 'brioche', 'foccacia'] },
    { id: 'pilav-tahil', name: 'Pilav/Tahıl', icon: '🍚', category: 'carb', description: 'Pilav, kinoa, bulgur, kuskus', includes: ['pilav', 'basmati', 'siyah pirinç', 'pirinç', 'kinoa', 'bulgur', 'kuskus', 'karabuğday', 'meyhane pilavı'] },
    { id: 'makarna', name: 'Makarna/Noodle', icon: '🍝', category: 'carb', description: 'Makarna, fettucini, penne, noodle', includes: ['makarna', 'fettucini', 'penne', 'noodle', 'pasta'] },

    // GRUP 5: Popüler Sebzeler
    { id: 'avokado', name: 'Avokado', icon: '🥑', category: 'veggie', description: 'Avokado içeren' },
    { id: 'mantar', name: 'Mantar', icon: '🍄', category: 'veggie', description: 'Mantar sote, ızgara mantar' },
    { id: 'patates', name: 'Patates', icon: '🥔', category: 'veggie', description: 'Patates, kibrit patates' },

    // GRUP 6: Sos Profilleri
    { id: 'acili', name: 'Acılı', icon: '🌶️', category: 'sauce', description: 'Cajun, thai, sweet chilli, jalapeno', includes: ['cajun', 'cajun sos', 'thai', 'thai sos', 'sweet chilli', 'jalapeno', 'acı'] },
    { id: 'kremali', name: 'Kremalı Soslar', icon: '🥛', category: 'sauce', description: 'Krema sos, peynir sos, cheddar sos', includes: ['krema sos', 'kremalı', 'peynir sos', 'cheddar sos', 'limon soslu kremalı'] },
    { id: 'asya-usulu', name: 'Asya Sosları', icon: '🥢', category: 'sauce', description: 'Teriyaki, soya sos', includes: ['teriyaki', 'teriyaki sos', 'soya', 'soya sos'] },
    { id: 'ozel-soslar', name: 'SADE Özel Soslar', icon: '⭐', category: 'sauce', description: 'SADE sos, pesto, guacamole, tahin', includes: ['SADE sos', 'pesto', 'pesto sos', 'guacamole', 'guacamole sos', 'tahin', 'tahin sos', 'burger sos', 'köz biber sos', 'ballı hardal'] },

    // GRUP 7: Şarküteri
    { id: 'sarkuteri', name: 'Şarküteri', icon: '🌭', category: 'special', description: 'Sucuk, pastırma, hindi füme', includes: ['sucuk', 'pastırma', 'hindi füme', 'hindi fümeli'] }
];

const PRICE_RANGES = [
    { id: 'all', name: 'Tümü', min: 0, max: Infinity, icon: '💰' },
    { id: '0-300', name: '0-300₺', min: 0, max: 300, icon: '💰' },
    { id: '300-450', name: '300-450₺', min: 300, max: 450, icon: '💰💰' },
    { id: '450-600', name: '450-600₺', min: 450, max: 600, icon: '💰💰💰' },
    { id: '600+', name: '600₺+', min: 600, max: Infinity, icon: '💎' }
];

/* ============================================
   Category Warning (Çölyak Uyarısı)
   ============================================ */

// Categories that trigger the celiac disease warning banner
const WARNING_CATEGORIES = ['glutensiz-vegan'];

function checkAndShowWarning(categorySlug) {
    const warningBanner = document.getElementById('warning-banner');

    if (!warningBanner) return;

    if (WARNING_CATEGORIES.includes(categorySlug)) {
       warningBanner.style.display = 'block';
    } else {
       warningBanner.style.display = 'none';
    }
}

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
    initCategoryScroll();
    initImageModal();
    initializeFilters();
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

    // STEP 1: Apply category filter (if selected and not 'all')
    if (currentFilter !== 'all') {
        categoriesToRender = categoriesToRender.filter(cat => cat.id === currentFilter);
    }

    // STEP 2: Apply ingredient and price filters to the selected categories
    if (activeIngredients.length > 0 || activePriceRange !== 'all') {
        categoriesToRender = categoriesToRender.map(category => {
            const filteredItems = category.items.filter(item => {
                return itemMatchesIngredients(item) && itemMatchesPrice(item);
            });
            return { ...category, items: filteredItems };
        }).filter(category => category.items.length > 0);
    }

    // Render each category
    categoriesToRender.forEach(category => {
        const categorySection = createCategorySection(category);
        container.appendChild(categorySection);
    });

    // Show "no results" message if needed
    if (container.children.length === 0) {
        const filterActive = activeIngredients.length > 0 || activePriceRange !== 'all';
        const categoryName = currentFilter === 'all' ? 'menüde' :
            (menuData.categories.find(c => c.id === currentFilter)?.name || 'kategoride');

        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>Sonuç Bulunamadı</h3>
                <p>${filterActive ?
                    `Bu ${categoryName} seçtiğiniz filtrelere uygun ürün bulunamadı.` :
                    'Bu kategoride ürün bulunamadı.'
                }</p>
                ${filterActive ? `
                    <button onclick="clearContentFilters()" class="filter-btn-secondary" style="margin: 1rem 0.5rem 0 0; padding: 0.75rem 1.5rem;">
                        🔄 Filtreleri Temizle
                    </button>
                ` : ''}
                ${currentFilter !== 'all' ? `
                    <button onclick="clearCategoryFilter()" class="filter-btn-primary" style="margin-top: 1rem; padding: 0.75rem 1.5rem;">
                        📋 Tüm Kategorileri Göster
                    </button>
                ` : ''}
            </div>`;
    }
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

        const drawer = document.getElementById('filterDrawer');
        if (drawer && drawer.classList.contains('open')) {
            closeFilterDrawer();
        }
    }
});

/* ============================================
   SMART FILTER SYSTEM
   ============================================ */

// Auto-detect ingredients from item name/description
function autoExtractIngredients(item) {
    const desc = (item.description || '').toLowerCase();
    const name = item.name.toLowerCase();
    const text = desc + ' ' + name;

    const foundIngredients = [];

    // Word-boundary check that handles Turkish characters
    function containsWord(haystack, needle) {
        const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp('(^|[\\s,;.()])' + escaped + '($|[\\s,;.()/])', 'i').test(haystack);
    }

    SMART_INGREDIENTS.forEach(ingredient => {
        if (ingredient.includes) {
            if (ingredient.includes.some(keyword => containsWord(text, keyword.toLowerCase()))) {
                foundIngredients.push(ingredient.id);
            }
        } else {
            if (containsWord(text, ingredient.name.toLowerCase())) {
                foundIngredients.push(ingredient.id);
            }
        }
    });

    return [...new Set(foundIngredients)];
}

// Check if item matches any selected ingredient filter (OR logic)
function itemMatchesIngredients(item) {
    if (activeIngredients.length === 0) return true;
    const itemIngredients = autoExtractIngredients(item);
    return activeIngredients.some(id => itemIngredients.includes(id));
}

// Check if item price falls within selected range
function itemMatchesPrice(item) {
    if (activePriceRange === 'all') return true;
    const range = PRICE_RANGES.find(r => r.id === activePriceRange);
    if (!range) return true;
    const price = Number(item.price) || 0;
    return price >= range.min && price < range.max;
}

// Update badge showing number of active filters
function updateFilterCount() {
    const badge = document.getElementById('filterCount');
    if (!badge) return;
    const count = activeIngredients.length + (activePriceRange !== 'all' ? 1 : 0);
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// Apply filters and re-render menu
function applyFilters() {
    // When filters are applied, reset category to "all" so it searches entire menu
    if (activeIngredients.length > 0 || activePriceRange !== 'all') {
        currentFilter = 'all';
        activateFirstCategoryButton();
    }

    updateFilterCount();
    renderMenu();
    closeFilterDrawer();
}

// Activate the first category button and deactivate all others
function activateFirstCategoryButton() {
    const categoryNav = document.getElementById('categoryNav');
    if (!categoryNav) return;
    categoryNav.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const firstBtn = categoryNav.querySelector('.category-btn:first-child');
    if (firstBtn) {
        firstBtn.classList.add('active');
    }
}

// Clear only content/price filters (keep category selection)
function clearContentFilters() {
    activeIngredients = [];
    activePriceRange = 'all';
    createIngredientFilters();
    createPriceFilters();
    updateFilterCount();
    renderMenu();
}

// Clear only category filter (keep content/price filters)
function clearCategoryFilter() {
    currentFilter = 'all';
    activateFirstCategoryButton();
    renderMenu();
}

// Clear ALL filters (category + content + price)
function clearAllFilters() {
    currentFilter = 'all';
    activateFirstCategoryButton();
    activeIngredients = [];
    activePriceRange = 'all';
    createIngredientFilters();
    createPriceFilters();
    updateFilterCount();
    renderMenu();
}

// Open filter drawer
function openFilterDrawer() {
    const drawer = document.getElementById('filterDrawer');
    if (drawer) {
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

// Close filter drawer
function closeFilterDrawer() {
    const drawer = document.getElementById('filterDrawer');
    if (drawer) {
        drawer.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

// Generate ingredient checkboxes grouped by category
function createIngredientFilters() {
    const categories = ['protein', 'dairy', 'carb', 'veggie', 'sauce', 'special'];
    categories.forEach(cat => {
        const container = document.querySelector(`.filter-group-items[data-group="${cat}"]`);
        if (!container) return;
        container.innerHTML = '';
        SMART_INGREDIENTS.filter(ing => ing.category === cat).forEach(ingredient => {
            const label = document.createElement('label');
            label.className = 'filter-item' + (activeIngredients.includes(ingredient.id) ? ' checked' : '');
            label.innerHTML = `
                <input type="checkbox" value="${ingredient.id}" ${activeIngredients.includes(ingredient.id) ? 'checked' : ''}>
                <span>${ingredient.icon} ${ingredient.name}</span>`;
            const checkbox = label.querySelector('input');
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    if (!activeIngredients.includes(ingredient.id)) {
                        activeIngredients.push(ingredient.id);
                    }
                    label.classList.add('checked');
                } else {
                    activeIngredients = activeIngredients.filter(id => id !== ingredient.id);
                    label.classList.remove('checked');
                }
                updateFilterCount();
            });
            container.appendChild(label);
        });
    });
}

// Generate price range radio buttons
function createPriceFilters() {
    const container = document.getElementById('priceFilters');
    if (!container) return;
    container.innerHTML = '';
    PRICE_RANGES.forEach(range => {
        const label = document.createElement('label');
        label.className = 'price-filter-item' + (activePriceRange === range.id ? ' checked' : '');
        label.innerHTML = `
            <input type="radio" name="priceRange" value="${range.id}" ${activePriceRange === range.id ? 'checked' : ''}>
            <span>${range.icon} ${range.name}</span>`;
        const radio = label.querySelector('input');
        radio.addEventListener('change', () => {
            activePriceRange = range.id;
            container.querySelectorAll('.price-filter-item').forEach(el => el.classList.remove('checked'));
            label.classList.add('checked');
            updateFilterCount();
        });
        container.appendChild(label);
    });
}

// Set up all event listeners for the filter system
function setupFilterEvents() {
    // Toggle button opens drawer
    const toggleBtn = document.getElementById('filterToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', openFilterDrawer);
    }

    // Close button
    const closeBtn = document.getElementById('filterCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeFilterDrawer);
    }

    // Overlay closes drawer
    const overlay = document.querySelector('.filter-drawer-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeFilterDrawer);
    }

    // Apply button
    const applyBtn = document.getElementById('filterApplyBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }

    // Clear button
    const clearBtn = document.getElementById('filterClearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            clearContentFilters();
            closeFilterDrawer();
        });
    }

    // Collapsible group toggles
    document.querySelectorAll('.filter-group-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.dataset.group;
            const items = document.querySelector(`.filter-group-items[data-group="${group}"]`);
            if (!items) return;
            const isExpanded = btn.classList.contains('expanded');
            if (isExpanded) {
                btn.classList.remove('expanded');
                items.style.display = 'none';
            } else {
                btn.classList.add('expanded');
                items.style.display = 'flex';
            }
        });
    });
}

// Initialize the entire filter system
function initializeFilters() {
    createIngredientFilters();
    createPriceFilters();
    setupFilterEvents();
}
