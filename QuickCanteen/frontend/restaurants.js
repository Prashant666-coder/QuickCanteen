// Restaurant-related functionality

// Restaurant data structure
let RESTAURANTS = [];
let CURRENT_RESTAURANT_ID = null;

// DOM Elements
let restaurantGrid, restaurantSearch, restaurantFilter, restaurantSort;

// Initialize restaurant page elements
function initRestaurantPage() {
    restaurantGrid = document.getElementById('restaurant-grid');
    restaurantSearch = document.getElementById('restaurant-search');
    restaurantFilter = document.getElementById('restaurant-filter');
    restaurantSort = document.getElementById('restaurant-sort');

    // Add event listeners if elements exist
    if (restaurantSearch) {
        restaurantSearch.addEventListener('input', filterAndRenderRestaurants);
    }
    
    if (restaurantFilter) {
        restaurantFilter.addEventListener('change', filterAndRenderRestaurants);
    }
    
    if (restaurantSort) {
        restaurantSort.addEventListener('change', filterAndRenderRestaurants);
    }
}

// Fetch restaurants from the API
async function fetchRestaurants() {
    try {
        const response = await fetch(`${API_BASE}/api/restaurants`);
        if (!response.ok) throw new Error('Failed to load restaurants');
        RESTAURANTS = await response.json();
        return RESTAURANTS;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return [];
    }
}

// Create a restaurant card element
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    
    const isCanteen = restaurant.type === 'canteen';
    const discountBadge = isCanteen && restaurant.studentDiscount 
        ? `<div class="badge badge-discount">${restaurant.studentDiscount}% Student Discount</div>` 
        : '';
    
    card.innerHTML = `
        <div class="restaurant-image">
            <img src="${restaurant.imageUrl || 'https://placehold.co/400x300/eeeeee/666666?text=' + encodeURIComponent(restaurant.name)}" 
                 alt="${restaurant.name}" 
                 onerror="this.onerror=null;this.src='https://placehold.co/400x300/eeeeee/666666?text='+encodeURIComponent('${restaurant.name}');">
            ${isCanteen ? '<span class="canteen-tag">Canteen</span>' : ''}
            ${discountBadge}
        </div>
        <div class="restaurant-info">
            <div class="restaurant-header">
                <h3>${restaurant.name}</h3>
                <div class="restaurant-rating">
                    ${renderRating(restaurant.rating || 0)}
                    <span>${restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
            <p class="restaurant-cuisine">${restaurant.cuisine || 'Various cuisines'}</p>
            <p class="restaurant-address">${restaurant.address || ''}</p>
            <div class="restaurant-meta">
                <span class="restaurant-status ${restaurant.isOpen ? 'open' : 'closed'}">
                    ${restaurant.isOpen ? 'Open Now' : 'Closed'}
                </span>
                <span class="restaurant-delivery-time">
                    ${restaurant.deliveryTime || '20-30'} min
                </span>
            </div>
            <button class="btn btn-primary view-menu-btn" data-restaurant-id="${restaurant.id}">
                View Menu
            </button>
        </div>
    `;

    // Add click handler for the view menu button
    const viewMenuBtn = card.querySelector('.view-menu-btn');
    if (viewMenuBtn) {
        viewMenuBtn.addEventListener('click', () => {
            selectRestaurant(restaurant.id);
            // Scroll to menu section
            document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    return card;
}

// Render rating stars
function renderRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '★';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '½';
        } else {
            stars += '☆';
        }
    }
    
    return `<span class="stars" aria-label="Rating: ${rating} out of 5">${stars}</span>`;
}

// Filter and sort restaurants based on user input
function filterAndRenderRestaurants() {
    if (!restaurantGrid) return;
    
    const searchTerm = (restaurantSearch?.value || '').toLowerCase();
    const filterValue = restaurantFilter?.value || 'all';
    const sortValue = restaurantSort?.value || 'rating-desc';
    
    let filtered = [...RESTAURANTS];
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(searchTerm) ||
            (r.cuisine && r.cuisine.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply type filter
    if (filterValue !== 'all') {
        filtered = filtered.filter(r => 
            filterValue === 'canteen' ? r.type === 'canteen' : r.type !== 'canteen'
        );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
        switch (sortValue) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'rating-desc':
                return (b.rating || 0) - (a.rating || 0);
            case 'rating-asc':
                return (a.rating || 0) - (b.rating || 0);
            default:
                return 0;
        }
    });
    
    // Render the filtered and sorted restaurants
    renderRestaurants(filtered);
}

// Render the list of restaurants
function renderRestaurants(restaurants) {
    if (!restaurantGrid) return;
    
    if (!restaurants || restaurants.length === 0) {
        restaurantGrid.innerHTML = '<p class="no-results">No restaurants found. Try adjusting your search.</p>';
        return;
    }
    
    restaurantGrid.innerHTML = '';
    restaurants.forEach(restaurant => {
        restaurantGrid.appendChild(createRestaurantCard(restaurant));
    });
}

// Set the currently selected restaurant
function selectRestaurant(restaurantId) {
    CURRENT_RESTAURANT_ID = restaurantId;
    const restaurant = RESTAURANTS.find(r => String(r.id) === String(restaurantId));
    if (restaurant) {
        // expose selection for app.js filtering
        window.SELECTED_RESTAURANT_NAME = restaurant.name;
        // update simple header details
        const nameEl = document.getElementById('menu-restaurant-name');
        if (nameEl) nameEl.textContent = restaurant.name;
        const typeTag = document.getElementById('restaurant-type');
        if (typeTag) typeTag.style.display = restaurant.type === 'canteen' ? 'inline-block' : 'none';
        const addrEl = document.getElementById('restaurant-address');
        if (addrEl && restaurant.address) addrEl.textContent = restaurant.address;
        // toggle sections
        document.getElementById('menu')?.style.setProperty('display','block');
        document.getElementById('restaurants')?.style.setProperty('display','none');
        // update URL
        try { window.history.pushState({ restaurantId }, '', `#restaurant-${restaurantId}`); } catch {}
    }
    // render menu filtered
    if (typeof renderMenu === 'function') renderMenu();
    
    // highlight selection
    document.querySelectorAll('.restaurant-card').forEach(card => {
        const cardRestaurantId = card.querySelector('.view-menu-btn')?.dataset.restaurantId;
        if (cardRestaurantId === String(restaurantId)) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

// Initialize the restaurant page when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    initRestaurantPage();
    // always load restaurants when grid exists
    await fetchRestaurants();
    filterAndRenderRestaurants();
    // handle hash selection
    const hash = window.location.hash;
    if (hash.startsWith('#restaurant-')) {
        const restaurantId = hash.replace('#restaurant-', '');
        selectRestaurant(restaurantId);
    }
});

// Make the selectRestaurant function available globally
window.selectRestaurant = selectRestaurant;

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createRestaurantCard,
        renderRating,
        filterAndRenderRestaurants,
        selectRestaurant
    };
}
