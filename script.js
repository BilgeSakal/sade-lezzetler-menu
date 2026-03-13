// Main application state
let menuData = null;
let currentFilter = 'all';

/* ============================================
   MANUAL FILTER SYSTEM
   ============================================ */

const FILTER_GROUPS = {
    protein: {
        name: 'Protein',
        icon: '🍗',
        options: [
            { id: 'tavuk', name: 'Tavuk', icon: '🍗' },
            { id: 'et', name: 'Et/Köfte', icon: '🥩' },
            { id: 'balik', name: 'Balık', icon: '🐟' },
            { id: 'yumurta', name: 'Yumurta', icon: '🥚' },
            { id: 'tofu', name: 'Tofu', icon: '🟨' },
            { id: 'koyu-peynir', name: 'Koyu Peynir', icon: '🧀' },
            { id: 'beyaz-peynir', name: 'Beyaz Peynir', icon: '🧀' },
            { id: 'hellim', name: 'Hellim', icon: '🧀' },
            { id: 'baklagil', name: 'Baklagiller', icon: '🫘' }
        ]
    },
    carb: {
        name: 'Karbonhidrat',
        icon: '🍞',
        options: [
            { id: 'ekmek', name: 'Ekmek', icon: '🍞' },
            { id: 'pilav', name: 'Pilav', icon: '🍚' },
            { id: 'makarna', name: 'Makarna', icon: '🍝' },
            { id: 'kinoa', name: 'Kinoa', icon: '🌾' },
            { id: 'bulgur', name: 'Bulgur', icon: '🌾' },
            { id: 'kuskus', name: 'Kuskus', icon: '🌾' },
            { id: 'wrap', name: 'Wrap/Tortilla', icon: '🌯' },
            { id: 'noodle', name: 'Noodle', icon: '🍜' }
        ]
    },
    allergens: {
        name: 'Alerjen Maddeler',
        icon: '⚠️',
        options: [
            { id: 'gluten', name: 'Gluten', icon: '🌾' },
            { id: 'sut', name: 'Süt', icon: '🥛' },
            { id: 'yumurta-allergen', name: 'Yumurta', icon: '🥚' },
            { id: 'yer-fistigi', name: 'Yer Fıstığı', icon: '🥜' },
            { id: 'susam', name: 'Susam', icon: '🪴' },
            { id: 'bal', name: 'Bal', icon: '🍯' }
        ]
    }
};

const PRICE_RANGES = [
    { id: 'all', name: 'Tümü', min: 0, max: Infinity, icon: '💰' },
    { id: '0-300', name: '0-300₺', min: 0, max: 300, icon: '💰' },
    { id: '300-450', name: '300-450₺', min: 300, max: 450, icon: '💰💰' },
    { id: '450-600', name: '450-600₺', min: 450, max: 600, icon: '💰💰💰' },
    { id: '600+', name: '600₺+', min: 600, max: Infinity, icon: '💎' }
];

// Filter state
let activeFilters = {
    protein: [],
    carb: [],
    allergens: [],
    price: 'all'
};

// Initialize filters
function initializeFilters() {
    createFilterOptions();
    createPriceFilters();
    setupFilterEvents();
}

// Create filter options
function createFilterOptions() {
    Object.keys(FILTER_GROUPS).forEach(groupKey => {
        const group = FILTER_GROUPS[groupKey];
        const container = document.getElementById(`${groupKey}Options`);
        if (!container) return;
        
        group.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'filter-option';
            label.innerHTML = `
                <input type="checkbox" value="${option.id}" data-group="${groupKey}">
                <span>${option.icon} ${option.name}</span>
            `;
            container.appendChild(label);
        });
    });
}

// Create price filters
function createPriceFilters() {
    const container = document.getElementById('priceFilters');
    if (!container) return;
    
    PRICE_RANGES.forEach(range => {
        const label = document.createElement('label');
        label.className = range.id === 'all' ? 'price-option active' : 'price-option';
        label.innerHTML = `
            <input type="radio" name="priceRange" value="${range.id}" ${range.id === 'all' ? 'checked' : ''}>
            <span>${range.icon} ${range.name}</span>
        `;
        container.appendChild(label);
    });
}

// Setup filter events
function setupFilterEvents() {
    const toggleBtn = document.getElementById('filterToggleBtn');
    const drawer = document.getElementById('filterDrawer');
    const closeBtn = document.getElementById('filterCloseBtn');
    const overlay = drawer.querySelector('.filter-drawer-overlay');
    
    // Toggle drawer
    toggleBtn.addEventListener('click', () => {
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    const closeDrawer = () => {
        drawer.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
    
    // Price radio button styling
    document.querySelectorAll('.price-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.price-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        });
    });
    
    // Clear filters
    document.getElementById('filterClearBtn').addEventListener('click', () => {
        // Clear all checkboxes
        document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        // Reset price to "all"
        document.querySelectorAll('input[name="priceRange"]').forEach(radio => {
            radio.checked = radio.value === 'all';
        });
        document.querySelectorAll('.price-option').forEach(o => o.classList.remove('active'));
        document.querySelector('.price-option')?.classList.add('active');
        
        // Reset state
        activeFilters = { protein: [], carb: [], allergens: [], price: 'all' };
        updateFilterCount();
    });
    
    // Apply filters
    document.getElementById('filterApplyBtn').addEventListener('click', () => {
        // Get checked filters
        activeFilters.protein = Array.from(
            document.querySelectorAll('input[data-group="protein"]:checked')
        ).map(cb => cb.value);
        
        activeFilters.carb = Array.from(
            document.querySelectorAll('input[data-group="carb"]:checked')
        ).map(cb => cb.value);
        
        activeFilters.allergens = Array.from(
            document.querySelectorAll('input[data-group="allergens"]:checked')
        ).map(cb => cb.value);
        
        const selectedPrice = document.querySelector('input[name="priceRange"]:checked');
        activeFilters.price = selectedPrice ? selectedPrice.value : 'all';
        
        updateFilterCount();
        renderMenu();
        closeDrawer();
    });
}

// Check if item matches filters
// PROTEIN & CARB: OR logic (show if contains ANY selected)
// ALLERGEN: NOT logic (exclude if contains ANY selected)
function itemMatchesFilters(item) {
    // ===== PROTEIN: OR Logic =====
    if (activeFilters.protein.length > 0) {
        const hasSelectedProtein = item.categories?.protein && 
            activeFilters.protein.some(p => item.categories.protein.includes(p));
        
        if (!hasSelectedProtein) {
            return false;
        }
    }
    
    // ===== CARB: OR Logic =====
    if (activeFilters.carb.length > 0) {
        const hasSelectedCarb = item.categories?.carb && 
            activeFilters.carb.some(c => item.categories.carb.includes(c));
        
        if (!hasSelectedCarb) {
            return false;
        }
    }
    
    // ===== ALLERGEN: NOT Logic (exclude if contains) =====
    if (activeFilters.allergens.length > 0) {
        const hasSelectedAllergen = item.categories?.allergens && 
            activeFilters.allergens.some(a => item.categories.allergens.includes(a));
        
        if (hasSelectedAllergen) {
            return false;
        }
    }
    
    // ===== PRICE: Check range =====
    if (activeFilters.price !== 'all') {
        const priceRange = PRICE_RANGES.find(r => r.id === activeFilters.price);
        if (priceRange) {
            const price = parseFloat(item.price);
            if (price < priceRange.min || price >= priceRange.max) {
                return false;
            }
        }
    }
    
    return true;
}

// Update filter count badge
function updateFilterCount() {
    const count = activeFilters.protein.length + 
                  activeFilters.carb.length + 
                  activeFilters.allergens.length + 
                  (activeFilters.price !== 'all' ? 1 : 0);
    
    const badge = document.getElementById('filterCount');
    
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

// Load menu data
async function loadMenuData() {
    try {
        const response = await fetch('menu-data.json');
        menuData = await response.json();
        setupCategoryNav();
        renderMenu();
    } catch (error) {
        console.error('Error loading menu data:', error);
        document.getElementById('menuContainer').innerHTML = '<p>Menü yüklenemedi</p>';
    }
}

// Setup category navigation
function setupCategoryNav() {
    const categoryNav = document.getElementById('categoryNav');
    if (!categoryNav || !menuData) return;
    
    categoryNav.innerHTML = '';
    
    // All button
    const allBtn = document.createElement('button');
    allBtn.className = 'category-btn active';
    allBtn.dataset.category = 'all';
    allBtn.textContent = 'Tümü';
    allBtn.addEventListener('click', () => {
        currentFilter = 'all';
        updateCategoryButtons();
        renderMenu();
    });
    categoryNav.appendChild(allBtn);
    
    // Category buttons
    menuData.categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.dataset.category = category.id;
        btn.innerHTML = `${category.icon} ${category.name}`;
        btn.addEventListener('click', () => {
            currentFilter = category.id;
            updateCategoryButtons();
            renderMenu();
        });
        categoryNav.appendChild(btn);
    });
}

// Update category button states
function updateCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === currentFilter) {
            btn.classList.add('active');
        }
    });
}

// Render menu
function renderMenu() {
    const container = document.getElementById('menuContainer');
    if (!container || !menuData) return;
    
    container.innerHTML = '';
    
    let categoriesToRender = menuData.categories;
    
    // Apply category filter
    if (currentFilter !== 'all') {
        categoriesToRender = categoriesToRender.filter(cat => cat.id === currentFilter);
    }
    
    // Apply content filters
    categoriesToRender = categoriesToRender.map(category => {
        const filteredItems = category.items.filter(item => itemMatchesFilters(item));
        
        return {
            ...category,
            items: filteredItems
        };
    }).filter(category => category.items.length > 0);
    
    // Render categories
    if (categoriesToRender.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>Sonuç Bulunamadı</h3>
                <p>Seçtiğiniz filtrelere uygun ürün bulunamadı.</p>
            </div>
        `;
        return;
    }
    
    categoriesToRender.forEach(category => {
        const categorySection = createCategorySection(category);
        container.appendChild(categorySection);
    });
}

// Create category section
function createCategorySection(category) {
    const section = document.createElement('section');
    section.className = 'category-section';
    
    // Category header
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
        <h2><span class="category-icon">${category.icon}</span> ${category.name}</h2>
    `;
    section.appendChild(header);
    
    // Items grid
    const grid = document.createElement('div');
    grid.className = 'items-grid';
    
    category.items.forEach(item => {
        const itemEl = createMenuItemElement(item);
        grid.appendChild(itemEl);
    });
    
    section.appendChild(grid);
    return section;
}

// Create menu item element
function createMenuItemElement(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    if (item.featured) div.classList.add('featured');
    
    div.innerHTML = `
        <div class="item-image-wrapper">
            <img src="https://via.placeholder.com/300x200?text=${encodeURIComponent(item.name)}" 
                 alt="${item.name}" 
                 class="item-image"
                 loading="lazy">
            ${item.featured ? '<div class="featured-badge">⭐ Öne Çıkan</div>' : ''}
        </div>
        <div class="item-content">
            <h3 class="item-name">${item.name}</h3>
            <p class="item-description">${item.description}</p>
            <div class="item-footer">
                <span class="item-price">${item.price}₺</span>
                <button class="item-btn">Sepete Ekle</button>
            </div>
        </div>
    `;
    
    return div;
}

// Scroll to top button
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMenuData();
    setupScrollToTop();
    initCategoryScroll();
    initImageModal();
    initializeFilters();
});

// Category scroll functionality
function initCategoryScroll() {
    const nav = document.getElementById('categoryNav');
    if (!nav) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    nav.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - nav.offsetLeft;
        scrollLeft = nav.scrollLeft;
    });
    
    nav.addEventListener('mouseleave', () => {
        isDown = false;
    });
    
    nav.addEventListener('mouseup', () => {
        isDown = false;
    });
    
    nav.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - nav.offsetLeft;
        const walk = (x - startX) * 1;
        nav.scrollLeft = scrollLeft - walk;
    });
}

// Image modal
function initImageModal() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('item-image')) {
            const modal = document.createElement('div');
            modal.className = 'image-modal active';
            modal.innerHTML = `
                <div class="image-modal-overlay"></div>
                <div class="image-modal-content">
                    <button class="image-modal-close">✕</button>
                    <img src="${e.target.src}" alt="${e.target.alt}">
                </div>
            `;
            
            document.body.appendChild(modal);
            
            modal.querySelector('.image-modal-close').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.querySelector('.image-modal-overlay').addEventListener('click', () => {
                modal.remove();
            });
        }
    });
}
