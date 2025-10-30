// Simple, self-contained UI: Categories -> Restaurants -> Menu (with demo data)

(function () {
  // Elements
  const restaurantsSection = document.getElementById('restaurants');
  const restaurantGrid = document.getElementById('restaurant-grid');
  const menuSection = document.getElementById('menu');
  const categoryRow = document.getElementById('category-row');
  const catRestaurants = document.getElementById('category-restaurants');
  const menuGrid = document.getElementById('menu-grid');
  const menuRestaurantName = document.getElementById('menu-restaurant-name');
  const backBtn = document.getElementById('back-to-restaurants');

  // Minimal cart elements
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartBtn = document.getElementById('cart-btn');
  const mobileCartBtn = document.getElementById('mobile-cart-btn');
  const cartClose = document.getElementById('cart-close');
  const continueBtn = document.getElementById('continue-btn');
  const checkoutBtn = document.getElementById('checkout-btn');
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.getElementById('cart-count');
  const cartCountMobileEl = document.getElementById('m-cart-count');
  // Payment elements (for UPI QR toggle)
  const payCOD = document.getElementById('pay-cod');
  const payUPI = document.getElementById('pay-upi');
  const upiBox = document.getElementById('upi-box');
  const addressBox = document.getElementById('address-box');
  const addressInput = document.getElementById('address-input');
  // Auth modal elements
  const authModal = document.getElementById('auth-modal');
  const authClose = document.getElementById('auth-close');
  const loginOpen = document.getElementById('login-open');
  const mobileLoginOpen = document.getElementById('mobile-login-open');
  const authArea = document.getElementById('auth-area');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const authError = document.getElementById('auth-error');
  const tabs = document.querySelectorAll('.tab');

  // Categories (like your screenshot)
  const CATEGORIES = [
    { key: 'Biryani', name: 'Biryani', img: 'https://spicecravings.com/wp-content/uploads/2022/06/Achari-Paneer-Biryani-Featured.jpg' },
    { key: 'Pizza', name: 'Pizza', img: 'https://content.jdmagicbox.com/comp/jammu/g2/9999px191.x191.230625135712.c3g2/catalogue/pizza-wings-bahu-plaza-jammu-trikuta-nagar-jammu-pizza-outlets-9awg9fkgh9.jpg' },
    { key: 'Chinese', name: 'Chinese', img: 'https://www.ohmyveg.co.uk/wp-content/uploads/2024/08/hakka-noodles-1200x1200.jpg' },
    { key: 'Burger', name: 'Burger', img: 'https://imgmediagumlet.lbb.in/media/2025/01/6790b9b0e59da653ef5df1de_1737537968281.jpg' },
    { key: 'Pav Bhaji', name: 'Pav Bhaji', img: 'https://greedyeats.com/wp-content/uploads/2024/01/Pav-bhaji.jpg' },
    { key: 'Dosa', name: 'Dosa', img: 'https://myfoodstory.com/wp-content/uploads/2025/08/Dosa-Recipe-2.jpg' },
    { key: 'Pasta', name: 'Pasta', img: 'https://www.funfoodfrolic.com/wp-content/uploads/2020/09/Tomato-Pasta-Thumbnail.jpg' }
  ];

  // Demo restaurants and menu
  const DEMO_RESTAURANTS = [
    { id: 'r1', name: 'Dwarka Restraunt', categories: ['Biryani','North Indian','Dosa'], rating: 4.3, address: 'Shirdi Nagar', imageUrl: 'https://content.jdmagicbox.com/v2/comp/navi-mumbai/j3/022pxx22.xx22.131109075251.d2j3/catalogue/dwarka-restaurant-and-bar-kalamboli-navi-mumbai-north-indian-restaurants-xt92e.jpg' },
    { id: 'r2', name: 'The Biryani House', categories: ['Biryani'], rating: 4.2, address: 'Shaniwar Peth', imageUrl: 'https://franchisekhoj.com/wp-content/uploads/2022/05/the-biryani-house-amb-1024x1024.webp' },
    { id: 'r3', name: 'Chulbul Dhaba', categories: ['Biryani','Chinese'], rating: 4.0, address: 'Sathe Nagar', imageUrl: 'https://content.jdmagicbox.com/comp/pune/x3/020pxx20.xx20.190315192618.k8x3/catalogue/chulbul-dhaba-baner-pune-dhaba-restaurants-wutqbocpn8.jpg' },
    { id: 'r4', name: 'Hotel RadheKrishna', categories: ['North Indian','Burger','Pav Bhaji','Dosa'], rating: 4.6, address: 'Pimpri Chinchwad', imageUrl: 'https://gos3.ibcdn.com/af956e1c-a14a-4328-8b76-8440535b157e.jpeg' },
    { id: 'r5', name: 'Behrouz Biryani', categories: ['Biryani','Pizza'], rating: 4.1, address: 'Baner', imageUrl: 'https://b.zmtcdn.com/data/pictures/9/20611279/f35f0bbd748a770638f7404e973acd15_featured_v2.jpg' },
    { id: 'r6', name: 'UCOE Canteen', categories: ['Pav Bhaji','Dosa','Biryani','Chinese'], rating: 4.4, address: 'Universal College Campus', imageUrl: 'https://images.shiksha.com/mediadata/images/1590151182phpyBRFJd.jpeg' }
  ];

  const DEMO_MENU = [
    // Dwarka Restraunt
    { id: 1, name: 'Hyderabadi Biryani', price: 185, category: 'Biryani', restaurant: 'Dwarka Restraunt', imageUrl: 'https://www.cubesnjuliennes.com/wp-content/uploads/2018/07/Vegetable-Dum-Biryani-recipe.jpg' },

    // The Biryani House
    { id: 2, name: 'Veg Biryani', price: 159, category: 'Biryani', restaurant: 'The Biryani House', imageUrl: 'https://www.cubesnjuliennes.com/wp-content/uploads/2018/07/Vegetable-Dum-Biryani-recipe.jpg' },
    { id: 20, name: 'Paneer Biryani', price: 189, category: 'Biryani', restaurant: 'The Biryani House', imageUrl: 'https://www.foodiaq.com/wp-content/uploads/2024/10/Paneer-Makhani-Biryani.jpg' },
   
    // Behrouz Biryani
    { id: 3, name: 'Margherita Pizza', price: 129, category: 'Pizza', restaurant: 'Behrouz Biryani', imageUrl: 'https://simplyhomecooked.com/wp-content/uploads/2023/04/Margherita-Pizza-3.jpg' },
    { id: 30, name: 'Behrouz Chicken Biryani', price: 229, category: 'Biryani', restaurant: 'Behrouz Biryani', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVt4aAT6t8SWbxuE7YgThGOLOOPImFMqCpYg&s' },
    { id: 31, name: 'Behrouz Veg Biryani', price: 189, category: 'Biryani', restaurant: 'Behrouz Biryani', imageUrl: 'https://lentillovingfamily.com/wp-content/uploads/2025/08/one-pot-vegetable-birayni-2.jpg' },

    // Chulbul Dhaba
    { id: 42, name: 'Veg Biryani', price: 159, category: 'Biryani', restaurant: 'The Biryani House', imageUrl: 'https://www.cubesnjuliennes.com/wp-content/uploads/2018/07/Vegetable-Dum-Biryani-recipe.jpg' },
    { id: 4, name: 'Hakka Noodles', price: 119, category: 'Chinese', restaurant: 'Chulbul Dhaba', imageUrl: 'https://purendesi.in/wp-content/uploads/2024/05/Hakka-Noodles-Recipe.jpg' },
    { id: 40, name: 'Veg Manchurian', price: 139, category: 'Chinese', restaurant: 'Chulbul Dhaba', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7OI43z3pMact21tHJtOLsEdMQd_3PNlkO4A&s' },
    { id: 41, name: 'Schezwan Fried Rice', price: 149, category: 'Chinese', restaurant: 'Chulbul Dhaba', imageUrl: 'https://cdn.uengage.io/uploads/7057/image-6716-1666791013.jpg' },

    // Hotel RadheKrishna
    { id: 5, name: 'Veg Burger', price: 99, category: 'Burger', restaurant: 'Hotel RadheKrishna', imageUrl: 'https://shwetainthekitchen.com/wp-content/uploads/2024/06/Veggie-Chickpea-Burger.jpg' },
    { id: 50, name: 'Cheese Burger', price: 119, category: 'Burger', restaurant: 'Hotel RadheKrishna', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBFCimCM1wFvb3FZQOZH_j5ta4Qd2SlNj2vg&s' },
    { id: 51, name: 'Aloo Paratha', price: 89, category: 'North Indian', restaurant: 'Hotel RadheKrishna', imageUrl: 'https://static.toiimg.com/photo/53109843.cms' },

    // New: Pav Bhaji (Hotel RadheKrishna)
    { id: 60, name: 'Pav Bhaji', price: 99, category: 'Pav Bhaji', restaurant: 'Hotel RadheKrishna', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxS9_36jgShvcXRGcfZEkbi10Kkxoz8hEbyw&s' },
    { id: 61, name: 'Cheese Pav Bhaji', price: 119, category: 'Pav Bhaji', restaurant: 'Hotel RadheKrishna', imageUrl: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_960,w_960//InstamartAssets/Receipes/cheese_pav_bhaji.webp' },

    // New: Dosa (Dwarka Restraunt, Hotel RadheKrishna)
    { id: 70, name: 'Masala Dosa', price: 129, category: 'Dosa', restaurant: 'Dwarka Restraunt', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYH7H-KRy-dnN9To-d5TJu7dKpY3f_nr0w3Q&s' },
    { id: 71, name: 'Plain Dosa', price: 99, category: 'Dosa', restaurant: 'Dwarka Restraunt', imageUrl: 'https://static.toiimg.com/thumb/53111272.cms?imgsize=132010&width=800&height=800' },

    // New: Universal College Canteen items
    { id: 80, name: 'Pav Bhaji', price: 40, category: 'Pav Bhaji', restaurant: 'UCOE Canteen', imageUrl: 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Instant-Pot-Mumbai-Pav-Bhaji-Recipe.jpg' },
    { id: 81, name: 'Cheese Pav Bhaji', price: 99, category: 'Pav Bhaji', restaurant: 'UCOE Canteen', imageUrl: 'https://vps029.manageserver.in/menu/wp-content/uploads/2024/05/e9ccf813e0e7b1334af5b37ade2acbf8.jpg' },
    { id: 82, name: 'Masala Dosa', price: 40, category: 'Dosa', restaurant: 'UCOE Canteen', imageUrl: 'https://myfoodstory.com/wp-content/uploads/2025/08/Dosa-Recipe-2-500x500.jpg' },
    { id: 83, name: 'Veg Biryani (Mini)', price: 99, category: 'Biryani', restaurant: 'UCOE Canteen', imageUrl: 'https://i.pinimg.com/736x/a0/b2/e7/a0b2e74b691f590ea3dbf615c1ca8bbe.jpg' },
    { id: 84, name: 'Tripple Rice', price: 60, category: 'Chinese', restaurant: 'UCOE Canteen', imageUrl: 'https://vps029.manageserver.in/menu/wp-content/uploads/2024/02/images-2.jpeg' },
    { id: 85, name: 'Scheswan Noodles', price: 70, category: 'Chinese', restaurant: 'UCOE Canteen', imageUrl: 'https://herbivorecucina.com/wp-content/uploads/2023/09/Schezwan-Noodles-2.jpg' },
    { id: 87, name: 'Idli', price: 30, category: 'Dosa', restaurant: 'UCOE Canteen', imageUrl: 'https://shwetainthekitchen.com/wp-content/uploads/2022/01/Idli.jpg' }
  ];

  let currentCategory = 'Biryani';
  let selectedRestaurant = null;
  let ACTIVE_STEPPER_ID = null; // no longer restricts to one; kept for backward compatibility

  // Helpers to toggle restaurants grid below categories
  function showRestaurantsGrid() { if (catRestaurants) catRestaurants.style.display = 'grid'; }
  function hideRestaurantsGrid() { if (catRestaurants) catRestaurants.style.display = 'none'; }

  // API base for backend auth
  const API_BASE = 'http://localhost:8080';

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

  // Simple cart
  let CART = [];
  // Auth state using backend-issued token stored in qc_auth
  function getAuth(){ try { return JSON.parse(localStorage.getItem('qc_auth')) || null; } catch { return null; } }
  function setAuth(auth){
    if (auth) localStorage.setItem('qc_auth', JSON.stringify(auth));
    else {
      try { localStorage.removeItem('qc_auth'); } catch {}
      CART = [];
      try { localStorage.removeItem('qc_cart_simple'); } catch {}
      renderCart(); updateCartBadges(); syncMenuButtons();
    }
    renderAuthArea();
  }
  function authHeader(){ const a = getAuth(); return a?.token ? { 'Authorization': `Bearer ${a.token}` } : {}; }
  function isLoggedIn(){ return !!getAuth()?.token; }
  function getUser(){ const a = getAuth(); return a ? { username: a.username } : null; }
  function clearAuthFields(){
    const lu = document.getElementById('login-username');
    const lp = document.getElementById('login-password');
    const su = document.getElementById('signup-username');
    const sp = document.getElementById('signup-password');
    if (lu) lu.value = '';
    if (lp) lp.value = '';
    if (su) su.value = '';
    if (sp) sp.value = '';
    if (authError) authError.textContent = '';
    // Clear again after a tick to override browser autofill that may run late
    setTimeout(() => {
      if (lu) lu.value = '';
      if (lp) lp.value = '';
      if (su) su.value = '';
      if (sp) sp.value = '';
    }, 50);
  }
  function openAuth(){ clearAuthFields(); authModal?.classList.remove('hidden'); }
  function closeAuth(){ clearAuthFields(); authModal?.classList.add('hidden'); }
  // Prevent aggressive browser autofill: temporarily set fields readonly when opening
  const _applyReadonlyHack = () => {
    const lu = document.getElementById('login-username');
    const lp = document.getElementById('login-password');
    const su = document.getElementById('signup-username');
    const sp = document.getElementById('signup-password');
    [lu, lp, su, sp].forEach(el => { if (el) el.setAttribute('readonly', 'true'); });
    setTimeout(() => { [lu, lp, su, sp].forEach(el => { if (el) el.removeAttribute('readonly'); }); }, 150);
  };
  // Rewire open to include the hack
  const _origOpenAuth = openAuth;
  function openAuth(){ clearAuthFields(); _applyReadonlyHack(); authModal?.classList.remove('hidden'); }
  authClose?.addEventListener('click', closeAuth);
  loginOpen?.addEventListener('click', openAuth);
  mobileLoginOpen?.addEventListener('click', openAuth);

  function renderAuthArea(){
    const u = getUser();
    if (!authArea) return;
    if (u && u.username){
      authArea.innerHTML = `<span class="user-chip">${u.username}</span> <button id="logout-btn" class="btn btn-secondary">Logout</button>`;
      document.getElementById('logout-btn')?.addEventListener('click', ()=>{
        // Logout: clear token/auth and cart
        setAuth(null);
        clearAuthFields();
      });
    } else {
      authArea.innerHTML = `<button id="login-open" class="btn btn-primary">Login</button>`;
      document.getElementById('login-open')?.addEventListener('click', openAuth);
    }
  }

  // Tabs (Login / Sign Up)
  tabs.forEach(t=>{
    t.addEventListener('click', ()=>{
      tabs.forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      const which = t.dataset.tab;
      if (which==='login'){ loginForm?.classList.remove('hidden'); signupForm?.classList.add('hidden'); }
      else { signupForm?.classList.remove('hidden'); loginForm?.classList.add('hidden'); }
      if (authError) authError.textContent = '';
    });
  });

  // Handle Login submit against backend
  loginForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const username = document.getElementById('login-username')?.value?.trim();
    const password = document.getElementById('login-password')?.value?.trim();
    if (!username || !password){ if (authError) authError.textContent = 'Please enter username and password.'; return; }
    try {
      const data = await apiPost('/api/auth/login', { username, password });
      setAuth({ username: data.username, token: data.token });
      closeAuth();
    } catch (err) {
      if (authError) authError.textContent = err.message;
    }
  });

  // Handle Sign Up submit via backend
  signupForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const username = document.getElementById('signup-username')?.value?.trim();
    const password = document.getElementById('signup-password')?.value?.trim();
    if (!username || !password){ if (authError) authError.textContent = 'Please enter username and password.'; return; }
    try {
      const data = await apiPost('/api/auth/signup', { username, password });
      setAuth({ username: data.username, token: data.token });
      closeAuth();
    } catch (err) {
      if (authError) authError.textContent = err.message;
    }
  });
  function loadCart() {
    try {
      if (isLoggedIn()) {
        CART = JSON.parse(localStorage.getItem('qc_cart_simple')) || [];
      } else {
        CART = [];
        try { localStorage.removeItem('qc_cart_simple'); } catch {}
      }
    } catch { CART = []; }
  }
  function saveCart() { localStorage.setItem('qc_cart_simple', JSON.stringify(CART)); }
  function cartCount() { return CART.reduce((n,i)=>n+i.qty,0); }
  function cartTotal() { return CART.reduce((s,i)=>s + i.price * i.qty, 0); }
  function itemQty(id){ const it = CART.find(x=>x.id===id); return it ? it.qty : 0; }
  function itemImage(id){ const m = DEMO_MENU.find(x=>x.id===id); return m ? m.imageUrl : ''; }
  function updateCartBadges() {
    const c = String(cartCount());
    if (cartCountEl) cartCountEl.textContent = c;
    if (cartCountMobileEl) cartCountMobileEl.textContent = c;
  }
  function syncMenuButtons(){
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    grid.querySelectorAll('.menu-item').forEach(card => {
      const addBtn = card.querySelector('.menu-fab');
      const stepper = card.querySelector('.menu-stepper');
      if (!addBtn || !stepper) return;
      const id = parseInt(addBtn?.dataset.id || stepper?.dataset.id, 10);
      const q = itemQty(id);
      const countEl = card.querySelector('.menu-count');
      const shouldShowStepper = q > 0; // show stepper on any card with qty > 0
      if (shouldShowStepper) {
        addBtn.classList.add('hidden');
        stepper.classList.remove('hidden');
        if (countEl) countEl.textContent = String(q);
      } else {
        stepper.classList.add('hidden');
        addBtn.classList.remove('hidden');
      }
    });
  }
  function setActiveStepper(id){ ACTIVE_STEPPER_ID = id; syncMenuButtons(); }
  function bumpCartBadges(){
    if (cartCountEl){ cartCountEl.classList.add('bump'); setTimeout(()=>cartCountEl.classList.remove('bump'), 280); }
    if (cartCountMobileEl){ cartCountMobileEl.classList.add('bump'); setTimeout(()=>cartCountMobileEl.classList.remove('bump'), 280); }
  }
  function openCart() { 
    cartDrawer?.classList.remove('hidden'); 
    cartOverlay?.classList.remove('hidden'); 
    updatePaymentUI();
  }
  function closeCart() { cartDrawer?.classList.add('hidden'); cartOverlay?.classList.add('hidden'); }
  cartBtn?.addEventListener('click', openCart);
  mobileCartBtn?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);
  continueBtn?.addEventListener('click', closeCart);
  // Wire payment method visibility
  // Address persistence helpers
  function getSavedAddress(){
    try { return localStorage.getItem('qc_address') || ''; } catch { return ''; }
  }
  function setSavedAddress(addr){
    try { localStorage.setItem('qc_address', addr || ''); } catch {}
  }
  function prefillAddress(){
    if (!addressInput) return;
    if (!addressInput.value) {
      const saved = getSavedAddress();
      if (saved) addressInput.value = saved;
    }
  }
  function updatePaymentUI(){
    if (payUPI?.checked) { upiBox?.classList.remove('hidden'); } else { upiBox?.classList.add('hidden'); }
    if (payCOD?.checked || payUPI?.checked) { 
      addressBox?.classList.remove('hidden'); 
      prefillAddress();
    } else { 
      addressBox?.classList.add('hidden'); 
    }
  }
  payCOD?.addEventListener('change', updatePaymentUI);
  payUPI?.addEventListener('change', updatePaymentUI);
  updatePaymentUI();
  checkoutBtn?.addEventListener('click', () => {
    if (!CART.length) return;
    // Require delivery address when the address box is visible
    const needsAddress = !addressBox?.classList.contains('hidden');
    if (needsAddress) {
      const addr = addressInput?.value?.trim() || '';
      if (addr.length < 5) {
        alert('Please enter your delivery address before checkout.');
        try { addressInput?.focus(); } catch {}
        return;
      }
      // Persist address for next time
      setSavedAddress(addr);
    }
    const u = getUser();
    alert(`Checkout complete! Thanks, ${u?.username || 'customer'}.`);
    CART = [];
    saveCart();
    renderCart();
    // Ensure all menu cards reset to Add state
    syncMenuButtons();
    // Reset delivery address field and its saved value
    if (addressInput) addressInput.value = '';
    setSavedAddress('');
    closeCart();
  });
  function renderCart() {
    if (!cartItemsEl) return;
    if (!CART.length) {
      cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
      // When cart is empty, reflect this in menu controls too
      syncMenuButtons();
    } else {
      cartItemsEl.innerHTML = CART.map(i => `
        <div class="cart-row">
          <div class="cart-left">
            <img class="cart-thumb" src="${i.imageUrl || itemImage(i.id)}" alt="${i.name}"/>
            <div>
              <div class="cart-item-name">${i.name}</div>
              <div class="cart-item-price">₹${i.price}</div>
            </div>
          </div>
          <div class="cart-right">
            <div class="qty-controls">
              <button class="qty-btn" data-act="dec" data-id="${i.id}">-</button>
              <span>${i.qty}</span>
              <button class="qty-btn" data-act="inc" data-id="${i.id}">+</button>
            </div>
            <button class="remove-btn" data-act="rm" data-id="${i.id}">×</button>
          </div>
        </div>`).join('');
      cartItemsEl.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id, 10);
          const it = CART.find(x=>x.id===id);
          if (!it) return;
          if (btn.dataset.act === 'inc') it.qty += 1; else it.qty -= 1;
          if (it.qty <= 0) CART = CART.filter(x=>x.id!==id);
          saveCart(); updateCartBadges(); renderCart(); syncMenuButtons();
        });
      });
      cartItemsEl.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id, 10);
          CART = CART.filter(x=>x.id!==id);
          saveCart(); updateCartBadges(); renderCart(); syncMenuButtons();
        });
      });
    }
    if (cartTotalEl) cartTotalEl.textContent = `₹${cartTotal()}`;
    updateCartBadges();
  }
  function addToCart(item) {
    if (!isLoggedIn()) {
      alert('Please login to add items to your cart.');
      openAuth();
      return false;
    }
    const ex = CART.find(i=>i.id===item.id);
    if (ex) ex.qty += 1; else CART.push({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, qty: 1 });
    saveCart(); renderCart(); updateCartBadges(); bumpCartBadges(); syncMenuButtons();
    return true;
  }

  // toast removed per request

  function renderCategoryChips() {
    if (!categoryRow) return;
    categoryRow.innerHTML = CATEGORIES.map(c => `
      <button class="chip ${c.key===currentCategory?'active':''}" data-cat="${c.key}" aria-label="${c.name}" title="${c.name}" style="padding:6px;border-radius:9999px;display:inline-flex;align-items:center;justify-content:center;">
        <img src="${c.img}" alt="${c.name}" style="width:160px;height:160px;border-radius:50%;object-fit:cover;display:block;"/>
      </button>
    `).join('');
    categoryRow.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.cat;
        selectedRestaurant = null;
        renderCategoryChips();
        renderRestaurants();
        renderMenuList();
        try { restaurantsSection?.scrollIntoView({behavior:'smooth'}); } catch {}
        showRestaurantsGrid();
        if (backBtn) backBtn.style.display = 'none';
      });
    });
  }

  function renderRestaurants() {
    const targetGrid = catRestaurants || restaurantGrid;
    if (!targetGrid) return;
    const list = DEMO_RESTAURANTS.filter(r => r.categories.includes(currentCategory));
    // Prioritize UCOE Canteen at the top of the list
    list.sort((a,b)=>{
      const aU = a.name === 'UCOE Canteen';
      const bU = b.name === 'UCOE Canteen';
      if (aU && !bU) return -1; if (!aU && bU) return 1; return 0;
    });
    if (!list.length) {
      targetGrid.innerHTML = '<p class="no-results">No restaurants found for this category.</p>';
      return;
    }
    targetGrid.innerHTML = '';
    list.forEach(r => {
      const card = document.createElement('div');
      card.className = 'restaurant-card';
      card.innerHTML = `
        <div class="restaurant-image">
          <img src="${r.imageUrl}" alt="${r.name}"/>
        </div>
        <div class="restaurant-info">
          <div class="restaurant-header">
            <h3>${r.name}</h3>
          </div>
          <p class="restaurant-address">${r.address}</p>
          <button class="btn btn-primary">View Menu</button>
        </div>`;
      card.querySelector('.btn')?.addEventListener('click', () => {
        // Open menu in-page (middle), keep home and footer visible
        selectedRestaurant = r.name;
        if (menuRestaurantName) menuRestaurantName.textContent = r.name;
        hideRestaurantsGrid();
        renderMenuList();
        if (backBtn) backBtn.style.display = 'inline-block';
        try { document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); } catch {}
      });
      targetGrid.appendChild(card);
    });
  }

  function renderMenuList() {
    if (!menuGrid) return;
    // Show items ONLY when a restaurant is selected
    if (!selectedRestaurant) {
      menuGrid.innerHTML = '';
      return;
    }
    // Show all items for the selected restaurant (ignore category filter here)
    let items = DEMO_MENU.filter(i => i.restaurant === selectedRestaurant);
    menuGrid.innerHTML = '';
    if (!items.length) {
      menuGrid.innerHTML = '<p>No items available.</p>';
      return;
    }
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'card menu-item';
      const q = itemQty(item.id);
      div.innerHTML = `
        <div class="menu-media">
          <img src="${item.imageUrl}" alt="${item.name}"/>
          <button class="menu-fab" data-id="${item.id}" aria-label="Add">+</button>
          <div class="menu-stepper hidden" data-id="${item.id}">
            <button class="menu-dec" aria-label="decrease">-</button>
            <span class="menu-count">${q>0?q:0}</span>
            <button class="menu-inc" aria-label="increase">+</button>
          </div>
        </div>
        <div class="menu-item-content">
          <h3>${item.name}</h3>
          <div class="restaurant">${item.restaurant}</div>
          <div class="menu-item-footer">
            <span class="price">₹${item.price}</span>
          </div>
        </div>`;
      const addBtn = div.querySelector('.menu-fab');
      const stepper = div.querySelector('.menu-stepper');
      const countEl = div.querySelector('.menu-count');
      const incBtn = div.querySelector('.menu-inc');
      const decBtn = div.querySelector('.menu-dec');
      addBtn?.addEventListener('click', () => {
        if (!addToCart(item)) return;
        if (countEl) countEl.textContent = String(itemQty(item.id));
        syncMenuButtons();
      });
      incBtn?.addEventListener('click', () => {
        if (!addToCart(item)) return;
        if (countEl) countEl.textContent = String(itemQty(item.id));
      });
      decBtn?.addEventListener('click', () => {
        const ex = CART.find(i=>i.id===item.id);
        if (!ex) return;
        ex.qty -= 1;
        if (ex.qty <= 0) { CART = CART.filter(i=>i.id!==item.id); }
        saveCart(); renderCart(); updateCartBadges(); syncMenuButtons();
        if (countEl) countEl.textContent = String(Math.max(itemQty(item.id),0));
      });
      menuGrid.appendChild(div);
    });
    // Sync visibility for all cards based on existing quantities
    syncMenuButtons();
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      selectedRestaurant = null;
      try { restaurantsSection?.scrollIntoView({behavior:'smooth'}); } catch {}
      renderRestaurants();
      renderMenuList();
      showRestaurantsGrid();
      if (menuRestaurantName) menuRestaurantName.textContent = 'Menu';
      backBtn.style.display = 'none';
    });
  }

  // Init
  loadCart();
  renderCart();
  // Prefill address on initial load
  prefillAddress();
  renderAuthArea();
  renderCategoryChips();
  renderRestaurants();
  showRestaurantsGrid();
  // Do NOT render items until a restaurant is selected
  menuGrid && (menuGrid.innerHTML = '');
})();
