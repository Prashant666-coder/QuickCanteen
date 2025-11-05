

// Basic mobile menu toggle and smooth scrolling
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      mobileMenu?.classList.add('hidden');
      target.scrollIntoView({ behavior: 'smooth' });
    }

  });
});

  // ===== Auth helpers (minimal) =====
  function isLoggedIn() { return !!getAuth()?.username; }
  function requireAuth() {
    if (!isLoggedIn()) { openAuthModal(); return false; }
    return true;
  }

  // ===== Cart (minimal) =====
  let CART = [];
  function loadCart() { try { CART = JSON.parse(localStorage.getItem('qc_cart')) || []; } catch { CART = []; } }
  function saveCart() { localStorage.setItem('qc_cart', JSON.stringify(CART)); }
  function cartCount() { return CART.reduce((n,i)=>n+i.quantity,0); }
  function itemQty(menuItemId) { const it = CART.find(i=>i.menuItemId===menuItemId); return it ? it.quantity : 0; }
  function cartTotal() {
    return CART.reduce((sum,i)=>{
      const m = MENU_CACHE.find(x=>x.id===i.menuItemId);
      return sum + (m ? m.price * i.quantity : 0);
    },0);
  }
  function syncMenuButtons() {
    document.querySelectorAll('.menu-item').forEach(card => {
      const addBtn = card.querySelector('.add-to-cart');
      const stepper = card.querySelector('.menu-stepper');
      if (!addBtn || !stepper) return;
      const id = parseInt(addBtn.dataset.id || stepper.dataset.id, 10);
      const qty = itemQty(id);
      const countEl = stepper.querySelector('.menu-count');
      if (qty > 0) {
        addBtn.classList.add('hidden');
        stepper.classList.remove('hidden');
        if (countEl) countEl.textContent = String(qty);
      } else {
        stepper.classList.add('hidden');
        addBtn.classList.remove('hidden');
      }
    });
  }
  function updateCartBadges() {
    const el = document.getElementById('cart-count');
    const mel = document.getElementById('m-cart-count');
    const c = cartCount();
    if (el) el.textContent = String(c);
    if (mel) mel.textContent = String(c);
  }
  function addToCart(menuItemId) {
    const ex = CART.find(i=>i.menuItemId===menuItemId);
    if (ex) ex.quantity += 1; else CART.push({ menuItemId, quantity: 1 });
    saveCart(); updateCartBadges(); renderCart(); syncMenuButtons();
  }
  function removeFromCart(menuItemId) {
    CART = CART.filter(i=>i.menuItemId!==menuItemId); saveCart(); updateCartBadges(); renderCart(); syncMenuButtons();
  }
  function changeQty(menuItemId, delta) {
    const it = CART.find(i=>i.menuItemId===menuItemId); if (!it) return;
    it.quantity += delta; if (it.quantity<=0) removeFromCart(menuItemId); else { saveCart(); updateCartBadges(); renderCart(); syncMenuButtons(); }
  }

  // Cart DOM refs and drawer controls
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartBtn = document.getElementById('cart-btn');
  const mobileCartBtn = document.getElementById('mobile-cart-btn');
  const cartClose = document.getElementById('cart-close');
  const checkoutBtn = document.getElementById('checkout-btn');
  const continueBtn = document.getElementById('continue-btn');
  const payCOD = document.getElementById('pay-cod');
  const payUPI = document.getElementById('pay-upi');
  const addressInput = document.getElementById('address-input');

  function openCart() { cartDrawer?.classList.remove('hidden'); cartOverlay?.classList.remove('hidden'); }
  function closeCart() { cartDrawer?.classList.add('hidden'); cartOverlay?.classList.add('hidden'); }

  cartBtn?.addEventListener('click', openCart);
  mobileCartBtn?.addEventListener('click', () => { openCart(); mobileMenu?.classList.add('hidden'); });
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);
  continueBtn?.addEventListener('click', closeCart);

// API base
const API_BASE = 'http://localhost:8080';

// INR currency formatter
const fmtINR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

// ===== Auth State =====
   function getAuth() {
     try {
       return JSON.parse(localStorage.getItem('qc_auth')) || null;
     } catch { return null; }
   }
   function setAuth(auth) {
    if (auth) {
      localStorage.setItem('qc_auth', JSON.stringify(auth));
    } else {
      // On logout: clear auth and cart so items don't persist after refresh
      localStorage.removeItem('qc_auth');
      CART = [];
      localStorage.removeItem('qc_cart');
      updateCartBadges();
      renderCart();
      syncMenuButtons();
    }
    updateAuthUI();
   }

   function authHeader() {
     const a = getAuth();
     return a?.token ? { 'Authorization': `Bearer ${a.token}` } : {};
   }

   function updateAuthUI() {
     const area = document.getElementById('auth-area');
     const loginOpen = document.getElementById('login-open');
     const auth = getAuth();
     if (area) {
       if (auth?.username) {
         area.innerHTML = `<span class="user-chip">Hi, ${auth.username}</span> <button id="logout-btn" class="btn btn-secondary">Logout</button>`;
         const logoutBtn = document.getElementById('logout-btn');
         logoutBtn?.addEventListener('click', () => setAuth(null));
       } else {
         area.innerHTML = `<button id="login-open" class="btn btn-primary">Login</button>`;
         document.getElementById('login-open')?.addEventListener('click', openAuthModal);
       }
     }
   }

   // ===== Auth Modal =====
   const authModal = document.getElementById('auth-modal');
   const authClose = document.getElementById('auth-close');
   const tabs = document.querySelectorAll('.tabs .tab');
   const loginForm = document.getElementById('login-form');
   const signupForm = document.getElementById('signup-form');
   const authError = document.getElementById('auth-error');

   function openAuthModal() {
     authModal?.classList.remove('hidden');
     // focus username field for quick login
     setTimeout(() => document.getElementById('login-username')?.focus(), 0);
   }
   function closeAuthModal() {
     authModal?.classList.add('hidden');
     authError && (authError.textContent = '');
   }

   // Force modal hidden on initial load to avoid accidental display from cached DOM state
   document.addEventListener('DOMContentLoaded', () => {
     authModal?.classList.add('hidden');
   });

   document.getElementById('login-open')?.addEventListener('click', openAuthModal);
   document.getElementById('mobile-login-open')?.addEventListener('click', () => { openAuthModal(); mobileMenu?.classList.add('hidden'); });
   authClose?.addEventListener('click', closeAuthModal);

   tabs.forEach(tab => tab.addEventListener('click', () => {
     tabs.forEach(t => t.classList.remove('active'));
     tab.classList.add('active');
     if (tab.dataset.tab === 'login') {
       loginForm?.classList.remove('hidden');
       signupForm?.classList.add('hidden');
     } else {
       loginForm?.classList.add('hidden');
     }
   }));

   async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || 'Request failed');
    return data;
  }

   loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
  });

  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value;
    try {
      const data = await apiPost('/api/auth/signup', { username, password });
      setAuth({ username: data.username, token: data.token });
      closeAuthModal();
    } catch (err) {
      authError.textContent = err.message;
    }
  });

  // ===== Demo fallback menu data =====
  const DEFAULT_MENU = [
    { id: 1, name: 'Biryani', price: 185, category: 'Biryani', restaurant: 'The Biryani House', imageUrl: '' },
    { id: 2, name: 'Margherita Pizza', price: 159, category: 'Pizza', restaurant: 'Dwarka Restraunt', imageUrl: '' },
    { id: 3, name: 'Hakka Noodles', price: 129, category: 'Chinese', restaurant: 'Chulbul Dhaba', imageUrl: '' },
    { id: 4, name: 'Veg Burger', price: 99, category: 'Burger', restaurant: 'Hotel Sandeep', imageUrl: '' },
    { id: 5, name: 'Pav Bhaji', price: 89, category: 'North Indian', restaurant: 'Behrouz Biryani', imageUrl: '' },
  ];

  async function fetchMenu() {
    try {
      const res = await fetch(`${API_BASE}/api/menu`);
      if (!res.ok) throw new Error('Failed to load menu');
      const data = await res.json();
      return Array.isArray(data) && data.length ? data : DEFAULT_MENU;
    } catch (_) {
      return DEFAULT_MENU;
    }
  }
  function createMenuCard(item) {
    const div = document.createElement('div');
    div.className = 'card menu-item';
    const fallbackImg = 'https://placehold.co/600x400/eeeeee/666666?text=Food+Image';
    const imgSrc = item.imageUrl && item.imageUrl.trim() ? item.imageUrl : fallbackImg;
    const qty = itemQty(item.id);
    div.innerHTML = `
      <img src="${imgSrc}" alt="${item.name}" onerror="this.onerror=null;this.src='${fallbackImg}';" />
      <div class="menu-item-content">
        <h3>${item.name}</h3>
        ${item.restaurant ? `<div class="restaurant">${item.restaurant}</div>` : ''}
        <p>${item.description || ''}</p>
        <div class="menu-item-footer">
          <span class="price">${fmtINR.format(item.price)}</span>
          <button class="btn btn-secondary add-to-cart ${qty>0 ? 'hidden' : ''}" data-id="${item.id}">Add</button>
          <div class="menu-stepper ${qty>0 ? '' : 'hidden'}" data-id="${item.id}" style="display:inline-flex;align-items:center;gap:12px;padding:6px 12px;border:1px solid #e5e7eb;border-radius:9999px;">
            <button class="menu-dec" aria-label="decrease" style="background:none;border:none;font-size:20px;line-height:20px;">-</button>
            <span class="menu-count" style="min-width:16px;text-align:center;">${qty>0 ? qty : 0}</span>
            <button class="menu-inc" aria-label="increase" style="background:none;border:none;font-size:20px;line-height:20px;">+</button>
          </div>
        </div>
      </div>
    `;
    // wire card controls
    const addBtn = div.querySelector('.add-to-cart');
    const stepper = div.querySelector('.menu-stepper');
    const countEl = div.querySelector('.menu-count');
    const incBtn = div.querySelector('.menu-inc');
    const decBtn = div.querySelector('.menu-dec');
    addBtn?.addEventListener('click', () => {
      if (!requireAuth()) return;
      addToCart(item.id);
      if (countEl) countEl.textContent = String(itemQty(item.id));
      addBtn.classList.add('hidden');
      stepper.classList.remove('hidden');
    });
    incBtn?.addEventListener('click', () => {
      if (!requireAuth()) return;
      addToCart(item.id);
      if (countEl) countEl.textContent = String(itemQty(item.id));
    });
    decBtn?.addEventListener('click', () => {
      if (!requireAuth()) return;
      changeQty(item.id, -1);
      const q = itemQty(item.id);
      if (countEl) countEl.textContent = String(Math.max(q,0));
      if (q <= 0) { stepper.classList.add('hidden'); addBtn.classList.remove('hidden'); }
    });
    return div;
  }

  // Menu state
  let MENU_CACHE = [];
  let CURRENT_CATEGORY = 'All';
  window.CURRENT_CATEGORY = CURRENT_CATEGORY;

  function renderCategories(items) {
    const row = document.getElementById('category-row');
    if (!row) return;
    const cats = Array.from(new Set(items.map(i => i.category).filter(Boolean))).sort();
    const allCats = ['All', ...cats];
    row.innerHTML = allCats.map(cat => `
      <button class="chip ${cat === CURRENT_CATEGORY ? 'active' : ''}" data-cat="${cat}">${cat}</button>
    `).join('');
    row.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        CURRENT_CATEGORY = btn.dataset.cat;
        window.CURRENT_CATEGORY = CURRENT_CATEGORY;
        row.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenu();
      });
    });
  }

  

   // Esc key closes cart
   window.addEventListener('keydown', (e) => {
     if (e.key === 'Escape') closeCart();
   });
  // Minimal menu rendering with optional restaurant filter set by restaurants.js
  async function renderMenu() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    grid.innerHTML = '<p>Loading menu...</p>';
    try {
      const items = await fetchMenu();
      const selectedRestaurantName = window.SELECTED_RESTAURANT_NAME || null;
      let scoped = Array.isArray(items) ? items.slice() : [];
      if (selectedRestaurantName) {
        scoped = scoped.filter(i => (i.restaurant || '').toLowerCase() === selectedRestaurantName.toLowerCase());
      }
      MENU_CACHE = scoped;
      renderCategories(scoped);
      const filtered = CURRENT_CATEGORY === 'All' ? scoped : scoped.filter(i => i.category === CURRENT_CATEGORY);
      grid.innerHTML = '';
      filtered.forEach(item => grid.appendChild(createMenuCard(item)));
    } catch (err) {
      grid.innerHTML = `<p style="color:#b91c1c">${err.message}</p>`;
    }
  }
   // Payment method toggle
   const upiBox = document.getElementById('upi-box');
   const addressBox = document.getElementById('address-box');
   function updatePaymentUI() {
    if (payUPI?.checked) {
      upiBox?.classList.remove('hidden');
    } else {
      upiBox?.classList.add('hidden');
    }
    // Show address input when a payment option is selected (either)
    if (payCOD?.checked || payUPI?.checked) {
      addressBox?.classList.remove('hidden');
    } else {
      addressBox?.classList.add('hidden');
    }
  }
   payCOD?.addEventListener('change', updatePaymentUI);
   payUPI?.addEventListener('change', updatePaymentUI);
   updatePaymentUI();

   const cartItemsEl = document.getElementById('cart-items');
   const cartTotalEl = document.getElementById('cart-total');
   function renderCart() {

     if (CART.length === 0) {
       cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
     } else {
       cartItemsEl.innerHTML = CART.map(i => {
         const m = MENU_CACHE.find(x => x.id === i.menuItemId);
         if (!m) return '';
         return `
           <div class="cart-row">
             <div>
               <div class="cart-item-name">${m.name}</div>
               <div class="cart-item-price">$${m.price.toFixed(2)}</div>
             </div>
             <div class="qty-controls">
               <button class="qty-btn" data-act="dec" data-id="${m.id}">-</button>
               <span>${i.quantity}</span>
               <button class="qty-btn" data-act="inc" data-id="${m.id}">+</button>
               <button class="remove-btn" data-act="rm" data-id="${m.id}">×</button>
             </div>
           </div>`;
       }).join('');

       // wire qty/remove
       cartItemsEl.querySelectorAll('.qty-btn').forEach(btn => {
         btn.addEventListener('click', () => {
           const id = parseInt(btn.dataset.id, 10);
           const act = btn.dataset.act;
           changeQty(id, act === 'inc' ? 1 : -1);
         });
       });
       cartItemsEl.querySelectorAll('.remove-btn').forEach(btn => {
         btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id, 10)));
       });
     }
     if (cartTotalEl) cartTotalEl.textContent = fmtINR.format(cartTotal());
   }

   checkoutBtn?.addEventListener('click', async () => {
     if (CART.length === 0) return;
     if (!requireAuth()) return;
     try {
       const paymentMethod = payUPI?.checked ? 'UPI' : 'COD';
       const address = (addressInput?.value || '').trim();
       if (!address) {
         alert('Please enter your delivery address.');
         addressInput?.focus();
         return;
       }
       const body = {
         items: CART.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
         paymentMethod,
         address
       };
       const order = await apiPost('/api/orders', body);
       // Clear cart
       CART = [];
       saveCart();
       updateCartBadges();
       renderCart();
       alert(`Order #${order.id} placed via ${paymentMethod}. Total ${fmtINR.format(order.total)}`);
       closeCart();
     } catch (e) {
       alert(`Checkout failed: ${e.message}`);
     }
   });

   // ===== Init =====
   loadCart();
   updateCartBadges();
   updateAuthUI();
  renderMenu();
