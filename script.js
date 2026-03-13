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
