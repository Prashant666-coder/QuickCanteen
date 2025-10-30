// Dedicated restaurant page script using same demo data and simple cart
(function(){
  const params = new URLSearchParams(location.search);
  let rest = params.get('name');
  if (!rest) {
    try { rest = localStorage.getItem('qc_selected_restaurant') || ''; } catch { rest = ''; }
  }
  const restaurantTitle = document.getElementById('restaurant-title');
  const categoryRow = document.getElementById('category-row');
  const menuGrid = document.getElementById('menu-grid');

  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartBtn = document.getElementById('cart-btn');
  const cartClose = document.getElementById('cart-close');
  const continueBtn = document.getElementById('continue-btn');
  const checkoutBtn = document.getElementById('checkout-btn');
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.getElementById('cart-count');

  // Demo data (mirrors simple.js)
  const DEMO_MENU = [
    // Dwarka Restraunt
    { id: 1, name: 'Hyderabadi Biryani', price: 185, category: 'Biryani', restaurant: 'Dwarka Restraunt', imageUrl: 'https://www.thehosteller.com/_next/image/?url=https%3A%2F%2Fstatic.thehosteller.com%2Fhostel%2Fimages%2Fimage.jpg%2Fimage-1744199226259.jpg&w=2048&q=75' },
    { id: 10, name: 'Chicken Biryani', price: 215, category: 'Biryani', restaurant: 'Dwarka Restraunt', imageUrl: 'https://placehold.co/600x400?text=Chicken+Biryani' },
    { id: 11, name: 'Egg Biryani', price: 199, category: 'Biryani', restaurant: 'Dwarka Restraunt', imageUrl: 'https://placehold.co/600x400?text=Egg+Biryani' },

    // The Biryani House
    { id: 2, name: 'Veg Biryani', price: 159, category: 'Biryani', restaurant: 'The Biryani House', imageUrl: 'https://placehold.co/600x400?text=Veg+Biryani' },
    { id: 20, name: 'Paneer Biryani', price: 189, category: 'Biryani', restaurant: 'The Biryani House', imageUrl: 'https://placehold.co/600x400?text=Paneer+Biryani' },
    { id: 21, name: 'Dum Biryani', price: 199, category: 'Biryani', restaurant: 'The Biryani House', imageUrl: 'https://placehold.co/600x400?text=Dum+Biryani' },

    // Behrouz Biryani
    { id: 3, name: 'Margherita Pizza', price: 129, category: 'Pizza', restaurant: 'Behrouz Biryani', imageUrl: 'https://placehold.co/600x400?text=Margherita' },
    { id: 30, name: 'Behrouz Chicken Biryani', price: 229, category: 'Biryani', restaurant: 'Behrouz Biryani', imageUrl: 'https://placehold.co/600x400?text=Chicken+Biryani' },
    { id: 31, name: 'Behrouz Veg Biryani', price: 189, category: 'Biryani', restaurant: 'Behrouz Biryani', imageUrl: 'https://placehold.co/600x400?text=Veg+Biryani' },

    // Chulbul Dhaba
    { id: 4, name: 'Hakka Noodles', price: 119, category: 'Chinese', restaurant: 'Chulbul Dhaba', imageUrl: 'https://placehold.co/600x400?text=Hakka+Noodles' },
    { id: 40, name: 'Veg Manchurian', price: 139, category: 'Chinese', restaurant: 'Chulbul Dhaba', imageUrl: 'https://placehold.co/600x400?text=Veg+Manchurian' },
    { id: 41, name: 'Schezwan Fried Rice', price: 149, category: 'Chinese', restaurant: 'Chulbul Dhaba', imageUrl: 'https://placehold.co/600x400?text=Schezwan+Rice' },
    { id: 42, name: 'Veg Biryani', price: 159, category: 'Biryani', restaurant: 'The Biryani House', imageUrl: 'https://www.cubesnjuliennes.com/wp-content/uploads/2018/07/Vegetable-Dum-Biryani-recipe.jpg' },

    // Hotel RadheKrishna
    { id: 5, name: 'Veg Burger', price: 99, category: 'Burger', restaurant: 'Hotel RadheKrishna', imageUrl: 'https://placehold.co/600x400?text=Veg+Burger' },
    { id: 50, name: 'Cheese Burger', price: 119, category: 'Burger', restaurant: 'Hotel RadheKrishna', imageUrl: 'https://placehold.co/600x400?text=Cheese+Burger' },
    { id: 51, name: 'Aloo Paratha', price: 89, category: 'North Indian', restaurant: 'Hotel RadheKrishna', imageUrl: 'https://placehold.co/600x400?text=Aloo+Paratha' }
  ];

  // Helpers
  const eq = (a,b) => String(a||'').toLowerCase().trim() === String(b||'').toLowerCase().trim();

  // Compute categories available for this restaurant only
  const REST_ITEMS = DEMO_MENU.filter(i => eq(i.restaurant, rest));
  const CATEGORIES = Array.from(new Set(REST_ITEMS.map(i => i.category)));
  let CURRENT_CATEGORY = CATEGORIES[0] || 'All';
  let CART = [];

  function loadCart(){ try{ CART = JSON.parse(localStorage.getItem('qc_cart_simple'))||[]; } catch { CART = []; } }
  function saveCart(){ localStorage.setItem('qc_cart_simple', JSON.stringify(CART)); }
  function cartCount(){ return CART.reduce((n,i)=>n+i.qty,0); }
  function cartTotal(){ return CART.reduce((s,i)=>s+i.price*i.qty,0); }
  function updateCartBadges(){ if (cartCountEl) cartCountEl.textContent = String(cartCount()); }
  function bumpCartBadges(){ if (cartCountEl){ cartCountEl.classList.add('bump'); setTimeout(()=>cartCountEl.classList.remove('bump'), 280); } }
  function openCart(){ cartDrawer?.classList.remove('hidden'); cartOverlay?.classList.remove('hidden'); }
  function closeCart(){ cartDrawer?.classList.add('hidden'); cartOverlay?.classList.add('hidden'); }

  cartBtn?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);
  continueBtn?.addEventListener('click', closeCart);
  // Function to show thank you message
  function showThankYouMessage(total) {
    // Remove any existing thank you message
    const existingMessage = document.querySelector('.thank-you-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message container
    const thankYouDiv = document.createElement('div');
    thankYouDiv.className = 'thank-you-message';
    thankYouDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    `;

    // Create content
    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 10px;
      text-align: center;
      max-width: 90%;
      width: 400px;
    `;

    content.innerHTML = `
      <h2 style="color: #f97316; margin-top: 0;">Thank You for Your Order! 🎉</h2>
      <p>Your order of ₹${total} has been placed successfully.</p>
      <p>We'll prepare your food with love! ❤️</p>
      <button style="
        background: #f97316;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 1rem;
        font-size: 1rem;
      ">Close</button>
    `;

    // Add close functionality
    const closeBtn = content.querySelector('button');
    closeBtn.addEventListener('click', () => {
      thankYouDiv.remove();
    });

    // Add to DOM
    thankYouDiv.appendChild(content);
    document.body.appendChild(thankYouDiv);
  }

  // Update checkout button click handler
  checkoutBtn?.addEventListener('click', () => {
    const orderTotal = cartTotal();
    if (orderTotal <= 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Show thank you message first
    showThankYouMessage(orderTotal);
    
    // Then clear cart and close
    CART = [];
    saveCart();
    renderCart();
    closeCart();
  });

  function renderCart(){
    if (!cartItemsEl) return;
    if (!CART.length){ cartItemsEl.innerHTML = '<p>Your cart is empty.</p>'; }
    else {
      cartItemsEl.innerHTML = CART.map(i=>`<div class="cart-row"><div><div class="cart-item-name">${i.name}</div><div class="cart-item-price">₹${i.price}</div></div><div class="qty-controls"><button class="qty-btn" data-act="dec" data-id="${i.id}">-</button><span>${i.qty}</span><button class="qty-btn" data-act="inc" data-id="${i.id}">+</button><button class="remove-btn" data-act="rm" data-id="${i.id}">×</button></div></div>`).join('');
      cartItemsEl.querySelectorAll('.qty-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const id = parseInt(btn.dataset.id,10);
          const it = CART.find(x=>x.id===id); if (!it) return;
          if (btn.dataset.act==='inc') it.qty++; else it.qty--;
          if (it.qty<=0) CART = CART.filter(x=>x.id!==id);
          saveCart(); updateCartBadges(); renderCart();
        });
      });
      cartItemsEl.querySelectorAll('.remove-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{ const id=parseInt(btn.dataset.id,10); CART=CART.filter(x=>x.id!==id); saveCart(); updateCartBadges(); renderCart(); });
      });
    }
    if (cartTotalEl) cartTotalEl.textContent = `₹${cartTotal()}`;
    updateCartBadges();
  }
  function addToCart(item){ const ex=CART.find(i=>i.id===item.id); if (ex) ex.qty++; else CART.push({ id:item.id, name:item.name, price:item.price, qty:1 }); saveCart(); renderCart(); bumpCartBadges(); }

  function renderCategories(){
    if (!categoryRow) return;
    const REST_CATEGORIES = Array.from(new Set(REST_ITEMS.map(i => i.category))).filter(cat => cat && cat.toLowerCase() !== 'north');
    categoryRow.innerHTML = REST_CATEGORIES.map(cat=>`<button class="chip ${cat.toLowerCase()===CURRENT_CATEGORY.toLowerCase()?'active':''}" data-cat="${cat}" title="${cat}" aria-label="${cat}" style="padding:6px;border-radius:9999px;display:inline-flex;align-items:center;justify-content:center;"><img src="https://placehold.co/160x160?text=${encodeURIComponent(cat)}" alt="${cat}" style="width:160px;height:160px;border-radius:50%;object-fit:cover;display:block;"/></button>`).join('');
    categoryRow.querySelectorAll('.chip').forEach(btn=>{
      btn.addEventListener('click',()=>{ CURRENT_CATEGORY = btn.dataset.cat; renderCategories(); renderMenu(); });
    });
  }

  function renderMenu(){
    if (!menuGrid) return;
    const items = REST_ITEMS.filter(i => CURRENT_CATEGORY==='All' ? true : i.category.toLowerCase() === CURRENT_CATEGORY.toLowerCase());
    menuGrid.innerHTML = '';
    if (!items.length){ menuGrid.innerHTML = '<p>No items available.</p>'; return; }
    items.forEach(item=>{
      const div = document.createElement('div');
      div.className = 'card menu-item';
      div.innerHTML = `<img src="${item.imageUrl}" alt="${item.name}"/><div class="menu-item-content"><h3>${item.name}</h3><div class="restaurant">${item.restaurant}</div><div class="menu-item-footer"><span class="price">₹${item.price}</span><button class="btn btn-secondary">Add</button></div></div>`;
      const btn = div.querySelector('button');
      btn?.addEventListener('click', ()=> {
        addToCart(item);
        if (btn){
          const prev = btn.textContent;
          btn.classList.add('added');
          btn.textContent = 'Added ✓';
          btn.disabled = true;
          setTimeout(()=>{ btn.classList.remove('added'); btn.textContent = prev; btn.disabled = false; }, 600);
        }
      });
      menuGrid.appendChild(div);
    });
  }

  // Init
  if (restaurantTitle) restaurantTitle.textContent = rest || 'Restaurant';
  loadCart();
  renderCart();
  renderCategories();
  renderMenu();
})();
