// Main application state
let menuData = null;
let currentFilter = 'all';

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
        
        menuData = await response.json();
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
    
    // Clear existing content
    nav.innerHTML = '';
    
    // Add "All" button
    const allBtn = createCategoryButton('all', 'Tümü', '🍽️');
    nav.appendChild(allBtn);
    
    // Add category buttons
    menuData.categories.forEach(category => {
        const btn = createCategoryButton(category.id, category.name, category.icon);
        nav.appendChild(btn);
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
    card.className = 'menu-item';
    
    // Create image
    const img = document.createElement('img');
    img.className = 'menu-item-image';
    img.alt = item.name;
    img.loading = 'lazy';
    
    // Set image source with fallback
    img.src = item.image;
    img.onerror = () => {
        img.src = 'images/placeholder.svg';
    };
    
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
