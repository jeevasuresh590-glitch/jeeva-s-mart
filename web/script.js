/**
 * JeevaMart - Core Frontend JavaScript Engine
 * Handles REST API communication, authentication state, cart operations,
 * wishlist, countdown timers, search/filter, and dynamic modals.
 */

const API_BASE = '/api';

// Currency Formatter (Converts minor units to Indian Rupees or formatted currency)
function formatCurrency(cents) {
  if (cents === undefined || cents === null) return '₹0';
  const rupees = (Number(cents) / 100);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(rupees);
}

// Toast Notifications
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';
  if (type === 'warning') icon = '⚡';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Authentication Storage Helpers
const Auth = {
  getToken() {
    return localStorage.getItem('jeevamart_token');
  },
  getUser() {
    try {
      const data = localStorage.getItem('jeevamart_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setAuth(token, user) {
    localStorage.setItem('jeevamart_token', token);
    localStorage.setItem('jeevamart_user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('jeevamart_token');
    localStorage.removeItem('jeevamart_user');
  },
  isLoggedIn() {
    return !!this.getToken();
  },
  getRole() {
    const u = this.getUser();
    return u ? u.role : null;
  }
};

// Wishlist Storage Helpers
const Wishlist = {
  getIds() {
    try {
      const w = localStorage.getItem('jeevamart_wishlist');
      return w ? JSON.parse(w) : [];
    } catch {
      return [];
    }
  },
  has(id) {
    return this.getIds().includes(Number(id));
  },
  toggle(id) {
    const numId = Number(id);
    let list = this.getIds();
    let added = false;
    if (list.includes(numId)) {
      list = list.filter(item => item !== numId);
    } else {
      list.push(numId);
      added = true;
    }
    localStorage.setItem('jeevamart_wishlist', JSON.stringify(list));
    this.updateBadge();
    return added;
  },
  updateBadge() {
    const badge = document.getElementById('navWishlistCount');
    if (!badge) return;
    const count = this.getIds().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
};

function toggleWishlist(productId, btnElement) {
  const isAdded = Wishlist.toggle(productId);
  if (btnElement) {
    btnElement.classList.toggle('active', isAdded);
    btnElement.style.color = isAdded ? '#ef4444' : '#71717a';
  }
  showToast(isAdded ? 'Added to your wishlist!' : 'Removed from wishlist.', 'info');
}

// Unified API Request Handler
async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const token = Auth.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`[API Error: ${endpoint}]`, err);
    throw err;
  }
}

// -------------------------------------------------------------
// Authentication Actions
// -------------------------------------------------------------
async function login(email, password) {
  try {
    const res = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.success && res.data) {
      Auth.setAuth(res.data.token, res.data.user);
      showToast(`Welcome back, ${res.data.user.name}!`, 'success');
      setTimeout(() => {
        if (res.data.user.role === 'SELLER') {
          window.location.href = 'seller.html';
        } else if (res.data.user.role === 'ADMIN') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 700);
      return res.data;
    }
  } catch (err) {
    showToast(err.message || 'Invalid email or password.', 'error');
    throw err;
  }
}

async function register(name, email, password, confirmPassword, role) {
  if (password !== confirmPassword) {
    showToast('Passwords do not match.', 'error');
    return;
  }
  try {
    const res = await apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword, role })
    });
    if (res.success) {
      showToast('Registration successful! Please login.', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    }
  } catch (err) {
    showToast(err.message || 'Registration failed.', 'error');
  }
}

function logout() {
  Auth.clear();
  showToast('Logged out successfully.', 'info');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 500);
}

// Quick Demo Switcher helper for presentation
function quickLogin(role) {
  const accounts = {
    BUYER: { email: 'buyer@jeevamart.com', pass: 'Buyer@123' },
    SELLER: { email: 'seller@jeevamart.com', pass: 'Seller@123' },
    ADMIN: { email: 'admin@jeevamart.com', pass: 'Admin@123' }
  };
  const acc = accounts[role];
  if (acc) {
    const emailField = document.getElementById('loginEmail');
    const passField = document.getElementById('loginPassword');
    if (emailField && passField) {
      emailField.value = acc.email;
      passField.value = acc.pass;
    }
    login(acc.email, acc.pass);
  }
}

// -------------------------------------------------------------
// Cart Operations
// -------------------------------------------------------------
async function updateCartCountBadge() {
  const badge = document.getElementById('navCartCount');
  if (!badge) return;

  if (!Auth.isLoggedIn()) {
    badge.textContent = '0';
    badge.style.display = 'none';
    return;
  }

  try {
    const res = await apiRequest('/cart');
    if (res.success && res.data) {
      const count = res.data.items ? res.data.items.length : 0;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  } catch {
    badge.textContent = '0';
    badge.style.display = 'none';
  }
}

async function addToCart(productId, quantity = 1) {
  if (!Auth.isLoggedIn()) {
    showToast('Please login to add items to cart.', 'warning');
    setTimeout(() => { window.location.href = 'login.html'; }, 1000);
    return;
  }

  try {
    const res = await apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId: Number(productId), quantity: Number(quantity) })
    });
    if (res.success) {
      showToast('Product added to bag!', 'success');
      updateCartCountBadge();
    }
  } catch (err) {
    showToast(err.message || 'Could not add to bag.', 'error');
  }
}

async function updateCartItemQuantity(productId, quantity) {
  try {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    const res = await apiRequest(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
    if (res.success) {
      if (typeof renderCartPage === 'function') {
        renderCartPage();
      }
      updateCartCountBadge();
    }
  } catch (err) {
    showToast(err.message || 'Failed to update quantity.', 'error');
  }
}

async function removeFromCart(productId) {
  try {
    const res = await apiRequest(`/cart/${productId}`, {
      method: 'DELETE'
    });
    if (res.success) {
      showToast('Product removed from bag.', 'info');
      if (typeof renderCartPage === 'function') {
        renderCartPage();
      }
      updateCartCountBadge();
    }
  } catch (err) {
    showToast(err.message || 'Failed to remove product.', 'error');
  }
}

// -------------------------------------------------------------
// Modern Product Card Template Generator (Inspiration Ref)
// -------------------------------------------------------------
const FALLBACK_CATEGORY_IMAGES = {
  Fashion: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
  Electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  Beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
  Fitness: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
  Home: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
  Accessories: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
  Default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
};

function resolveProductImageUrl(url, category) {
  if (url && typeof url === 'string' && url.trim().length > 0) {
    return url.trim();
  }
  return FALLBACK_CATEGORY_IMAGES[category] || FALLBACK_CATEGORY_IMAGES.Default;
}

function getFallbackPlaceholder(category) {
  return FALLBACK_CATEGORY_IMAGES[category] || FALLBACK_CATEGORY_IMAGES.Default;
}

function createProductCardHtml(product, options = {}) {
  const isOutOfStock = product.stockQty <= 0;
  const isWish = Wishlist.has(product.id);
  const fallbackImg = getFallbackPlaceholder(product.category);
  const initialImg = resolveProductImageUrl(product.imageUrl, product.category);
  
  // Choose badge
  let badgeHtml = '';
  if (product.discountPercent && product.discountPercent > 0) {
    badgeHtml = `<span class="badge-pill-discount">-${product.discountPercent}%</span>`;
  } else if (product.id <= 6) {
    badgeHtml = `<span class="badge-pill-black">New</span>`;
  }

  return `
    <div class="product-card-modern" data-id="${product.id}">
      <div class="product-card-top" onclick="openProductModal(${product.id})">
        ${badgeHtml}
        <button class="card-wishlist-btn ${isWish ? 'active' : ''}" style="${isWish ? 'color: #ef4444;' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id}, this);" title="Save to Wishlist">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="${isWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
        <img 
          class="product-card-img" 
          src="${initialImg}" 
          alt="${product.name}" 
          loading="lazy" 
          onerror="this.onerror=null;this.src='${fallbackImg}';"
        />
      </div>

      <div class="product-card-body">
        <h3 class="product-card-title" onclick="openProductModal(${product.id})" title="${product.name}">
          ${product.name}
        </h3>

        <div class="product-card-pricing">
          <span class="product-price-now">${formatCurrency(product.priceCents)}</span>
          ${product.originalPriceCents > product.priceCents ? `
            <span class="product-price-prev">${formatCurrency(product.originalPriceCents)}</span>
          ` : ''}
        </div>

        <div class="product-rating-stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          <span class="product-rating-count">(${product.reviewCount || 128})</span>
        </div>

        <div class="product-card-footer">
          <button class="btn-circle-cart" ${isOutOfStock ? 'disabled' : ''} onclick="addToCart(${product.id})" title="Add to Bag">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Best Seller Card Template Generator (Horizontal Split)
function createBestSellerCardHtml(product) {
  const isOutOfStock = product.stockQty <= 0;
  const fallbackImg = getFallbackPlaceholder(product.category);
  const initialImg = resolveProductImageUrl(product.imageUrl, product.category);

  return `
    <div class="bestseller-card">
      <div class="bestseller-img-box" onclick="openProductModal(${product.id})" style="cursor: pointer;">
        <span class="badge-pill-bestseller">Bestseller</span>
        <img 
          class="bestseller-img" 
          src="${initialImg}" 
          alt="${product.name}" 
          loading="lazy" 
          onerror="this.onerror=null;this.src='${fallbackImg}';"
        />
      </div>

      <div class="bestseller-info">
        <h3 class="product-card-title" onclick="openProductModal(${product.id})" title="${product.name}">
          ${product.name}
        </h3>

        <div class="product-card-pricing">
          <span class="product-price-now">${formatCurrency(product.priceCents)}</span>
          ${product.originalPriceCents > product.priceCents ? `
            <span class="product-price-prev">${formatCurrency(product.originalPriceCents)}</span>
          ` : ''}
        </div>

        <div class="product-rating-stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          <span class="product-rating-count">(${product.reviewCount || 140})</span>
        </div>

        <p class="bestseller-desc">${product.description}</p>

        <div class="bestseller-btn-row">
          <button class="btn-quick-add" ${isOutOfStock ? 'disabled' : ''} onclick="addToCart(${product.id})">
            ${isOutOfStock ? 'Out of Stock' : 'Quick Add +'}
          </button>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// Product Details Modal
// -------------------------------------------------------------
async function openProductModal(productId) {
  let modal = document.getElementById('productDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'productDetailModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close-btn" onclick="closeProductModal()">✕</button>
      <div style="text-align:center; padding: 40px;">
        <p>Loading product details...</p>
      </div>
    </div>
  `;
  modal.classList.add('active');

  try {
    const res = await apiRequest(`/products/${productId}`);
    const product = res.data;
    const revRes = await apiRequest(`/products/${productId}/reviews`).catch(() => ({ data: [] }));
    const reviews = revRes.data || [];
    const isOutOfStock = product.stockQty <= 0;

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 820px;">
        <button class="modal-close-btn" onclick="closeProductModal()">✕</button>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; align-items: center;">
          <div style="background: #fafaf9; border-radius: var(--radius-lg); padding: 24px; display: flex; align-items: center; justify-content: center;">
            <img src="${resolveProductImageUrl(product.imageUrl, product.category)}" alt="${product.name}" style="max-width: 100%; max-height: 360px; object-fit: contain;" onerror="this.onerror=null;this.src='${getFallbackPlaceholder(product.category)}';" />
          </div>
          <div>
            <div style="font-size: 11px; color: var(--primary); text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">${product.category}</div>
            <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 12px; line-height: 1.25;">${product.name}</h2>
            
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
              <span style="color: #f59e0b; font-size: 14px;">★★★★★</span>
              <span style="font-size: 13px; color: #71717a; font-weight: 600;">${product.averageRating || 4.8} (${reviews.length} reviews)</span>
              <span style="margin-left: auto; font-size: 12px; color: #71717a;">Seller: <strong>${product.sellerName || 'Verified Studio'}</strong></span>
            </div>

            <div class="product-card-pricing" style="margin-bottom: 18px;">
              <span class="product-price-now" style="font-size: 24px;">${formatCurrency(product.priceCents)}</span>
              ${product.originalPriceCents > product.priceCents ? `
                <span class="product-price-prev" style="font-size: 16px;">${formatCurrency(product.originalPriceCents)}</span>
                <span style="background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: var(--radius-pill);">${product.discountPercent}% OFF</span>
              ` : ''}
            </div>

            <p style="font-size: 14px; color: #52525b; line-height: 1.6; margin-bottom: 24px;">${product.description}</p>

            <div style="margin-bottom: 24px;">
              <span style="font-size: 12px; font-weight: 700; color: ${isOutOfStock ? '#ef4444' : '#10b981'};">
                ${isOutOfStock ? '● Currently Out of Stock' : '● In Stock (' + product.stockQty + ' available)'}
              </span>
            </div>

            <div style="display: flex; gap: 12px; align-items: center;">
              <div class="qty-control">
                <button class="qty-btn" onclick="decreaseModalQty()">-</button>
                <span class="qty-value" id="modalQtyVal">1</span>
                <button class="qty-btn" onclick="increaseModalQty(${product.stockQty})">+</button>
              </div>
              <button class="btn-card-fill" style="flex:1; padding: 12px 20px;" ${isOutOfStock ? 'disabled' : ''} onclick="addModalItemToCart(${product.id})">
                Add to Bag
              </button>
              <button class="btn-primary-pill" style="padding: 12px 24px;" ${isOutOfStock ? 'disabled' : ''} onclick="buyNowDirect(${product.id})">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <!-- Customer Reviews -->
        <div style="margin-top: 36px; border-top: 1px solid var(--border-light); padding-top: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
            <h3 style="font-size: 18px; font-weight: 800;">Customer Reviews (${reviews.length})</h3>
            ${Auth.isLoggedIn() ? `
              <button class="btn-card-outline" style="font-size: 12px;" onclick="toggleAddReviewForm(${product.id})">Write a Review</button>
            ` : '<span style="font-size: 12px; color: #71717a;"><a href="login.html" style="color: var(--primary); font-weight:600;">Login</a> to write a review</span>'}
          </div>

          <div id="reviewFormContainer" style="display: none; background: #faf9f7; padding: 18px; border-radius: var(--radius-md); margin-bottom: 20px;">
            <div class="form-group">
              <label class="form-label">Rating (1 to 5 Stars)</label>
              <select id="reviewRatingInput" class="form-select">
                <option value="5">★★★★★ 5 - Excellent</option>
                <option value="4">★★★★☆ 4 - Very Good</option>
                <option value="3">★★★☆☆ 3 - Average</option>
                <option value="2">★★☆☆☆ 2 - Poor</option>
                <option value="1">★☆☆☆☆ 1 - Terrible</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Your Feedback</label>
              <textarea id="reviewCommentInput" class="form-textarea" rows="3" placeholder="Share your honest experience..."></textarea>
            </div>
            <button class="btn-primary-pill" style="padding: 10px 20px; font-size: 13px;" onclick="submitProductReview(${product.id})">Post Review</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${reviews.length === 0 ? '<p style="color: #71717a; font-size: 13px;">No reviews yet. Be the first to share your experience!</p>' : ''}
            ${reviews.map(r => `
              <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="font-size: 13px; color: #09090b;">${r.userName || 'Verified Buyer'}</strong>
                  <span style="color: #f59e0b; font-size: 12px;">★ ${r.rating}</span>
                </div>
                <p style="font-size: 13px; color: #52525b;">${r.comment}</p>
                <span style="font-size: 11px; color: #a1a1aa; margin-top: 4px; display: block;">${new Date(r.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    showToast(err.message || 'Error loading product details', 'error');
    closeProductModal();
  }
}

function closeProductModal() {
  const modal = document.getElementById('productDetailModal');
  if (modal) modal.classList.remove('active');
}

let currentModalQty = 1;
function increaseModalQty(max) {
  if (currentModalQty < max) {
    currentModalQty++;
    document.getElementById('modalQtyVal').textContent = currentModalQty;
  }
}
function decreaseModalQty() {
  if (currentModalQty > 1) {
    currentModalQty--;
    document.getElementById('modalQtyVal').textContent = currentModalQty;
  }
}

function addModalItemToCart(productId) {
  addToCart(productId, currentModalQty);
  closeProductModal();
}

async function buyNowDirect(productId) {
  await addToCart(productId, currentModalQty);
  closeProductModal();
  window.location.href = 'checkout.html';
}

function toggleAddReviewForm() {
  const f = document.getElementById('reviewFormContainer');
  if (f) {
    f.style.display = f.style.display === 'none' ? 'block' : 'none';
  }
}

async function submitProductReview(productId) {
  const rating = Number(document.getElementById('reviewRatingInput').value);
  const comment = document.getElementById('reviewCommentInput').value.trim();
  if (!comment) {
    showToast('Please enter your review comments.', 'warning');
    return;
  }

  try {
    const res = await apiRequest(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    });
    if (res.success) {
      showToast('Thank you! Your review was submitted.', 'success');
      openProductModal(productId);
    }
  } catch (err) {
    showToast(err.message || 'Failed to submit review.', 'error');
  }
}

// -------------------------------------------------------------
// Search Bar Toggle & Global Search
// -------------------------------------------------------------
function toggleSearchBar() {
  const bar = document.getElementById('globalSearchBar');
  if (bar) {
    bar.classList.toggle('active');
    if (bar.classList.contains('active')) {
      const input = document.getElementById('globalSearchInput');
      if (input) input.focus();
    }
  }
}

function handleGlobalSearch(e) {
  if (e) e.preventDefault();
  const q = document.getElementById('globalSearchInput')?.value.trim();
  if (q) {
    window.location.href = `products.html?search=${encodeURIComponent(q)}`;
  }
}

// -------------------------------------------------------------
// Live Countdown Timer for Flash Sale Promo Banner
// -------------------------------------------------------------
function initPromoCountdown() {
  // Target time: 2 days, 15 hours from now, or end of week
  const now = new Date();
  const target = new Date(now.getTime() + (2 * 24 * 3600 + 15 * 3600 + 45 * 60 + 30) * 1000);

  function update() {
    const current = new Date();
    const diff = Math.max(0, target - current);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById('timerDays');
    const hEl = document.getElementById('timerHours');
    const mEl = document.getElementById('timerMins');
    const sEl = document.getElementById('timerSecs');

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// -------------------------------------------------------------
// Global Navigation Sync
// -------------------------------------------------------------
function syncNavigationUI() {
  const user = Auth.getUser();
  const authNav = document.getElementById('navAuthArea');
  if (authNav) {
    if (user) {
      authNav.innerHTML = `
        <a href="profile.html" class="nav-user-chip" title="Account Settings">
          <span>${user.name.split(' ')[0]}</span>
          <span class="role-badge">${user.role}</span>
        </a>
      `;
    } else {
      authNav.innerHTML = `
        <a href="login.html" class="nav-icon-btn" title="Sign In">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </a>
      `;
    }
  }

  updateCartCountBadge();
  Wishlist.updateBadge();
}

document.addEventListener('DOMContentLoaded', () => {
  syncNavigationUI();
  initPromoCountdown();
});
