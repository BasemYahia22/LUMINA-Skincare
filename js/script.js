/*
 * LUMINA Luxury Skincare - Premium Theme Interaction Script
 * Features: Local Storage Cart Engine, Product Filters, Galleries, Lightbox, FAQs, Reveals & Counters
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all subsystems safely (with element-existence checks)
  initDynamicProductPage();
  initStickyHeader();
  initMobileMenu();
  initCartEngine();
  initSearchPopup();
  initFAQAccordions();
  initBeforeAfterSlider();
  initTestimonialSlider();
  initBackToTop();
  initScrollReveal();
  initAnimatedCounters();
  initProductPageGallery();
  initProductVariantSelector();
  initCollectionFilters();
  initContactForm();
});

// ==========================================
// 1. STICKY HEADER & SCROLL EFFECTS
// ==========================================
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll(); // Trigger initially
}

// ==========================================
// 2. MOBILE MENU DRAWER
// ==========================================
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-menu-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer || !overlay) return;

  const openMenu = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Mobile Submenus Accordion
  const submenuTriggers = document.querySelectorAll('.mobile-submenu-trigger');
  submenuTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parentLi = trigger.closest('li');
      const submenu = parentLi.querySelector('.mobile-submenu');
      const icon = trigger.querySelector('svg');
      
      if (submenu) {
        const isOpen = submenu.classList.toggle('open');
        if (isOpen) {
          icon.style.transform = 'rotate(180deg)';
        } else {
          icon.style.transform = '';
        }
      }
    });
  });
}

// ==========================================
// 3. CART SYSTEM (FRONTEND ENGINE)
// ==========================================
// Centralized mock product registry to enrich cart data
const PRODUCT_REGISTRY = {
  'peptide-cleanser': {
    id: 'peptide-cleanser',
    title: 'The Silk Peptide Cleanser',
    category: 'Cleansers',
    price: 34.00,
    comparePrice: 42.00,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
    link: '/product.html?id=peptide-cleanser',
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An ultra-gentle, non-stripping cleanser infused with pure silk peptides, organic oat milk, and hydrolyzed ceramides. Melting away pollution, SPF, and light makeup while preserving the lipid coat of sensitive skin profiles.',
    howToApply: 'Massage 1-2 pumps onto dry or damp skin for 60 seconds. Rinse thoroughly with lukewarm water. Use morning and night as the foundational step of your barrier restoration ritual.',
    ingredients: 'Active Ingredients: Silk Peptides (3.0%), Colloidal Oat Extract (2.0%), Ceramide NP (1.0%), Hyaluronic Acid. Inactive Ingredients: Aqua, Cocamidopropyl Betaine, Sodium Cocoyl Isethionate, Glycerin, Phenoxyethanol.',
    packaging: 'Housed in a 100% recyclable amber glass bottle with a BPA-free pump dispenser. Safe, clean, and formulated to retain active freshness.'
  },
  'barrier-serum': {
    id: 'barrier-serum',
    title: 'Barrier Repair Serum',
    category: 'Serums',
    price: 48.00,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
    link: '/product.html?id=barrier-serum',
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A silky, biomimetic moisture booster packed with high-purity lipids and soothing botanical extracts. Instantly fortifies the intercellular glue of your epidermis, easing capillaries and locking hydration for up to 72 hours.',
    howToApply: 'Press 2-3 drops onto freshly cleansed, damp face and neck morning and night. Smooth gently into skin until fully absorbed. Follow with your preferred LUMINA moisture cream to lock in active botanicals securely.',
    ingredients: 'Active Ingredients: Squalane (Biomimetic), Ceramide NP (5.0%), Niacinamide (4.0%), Resveratrol (Red Grape Active), Centella Asiatica Extract (Cica). Inactive Ingredients: Aqua, Glycerin, Pentylene Glycol, Sodium Hyaluronate Crosspolymer, Xanthan Gum, Phenoxyethanol.',
    packaging: 'Housed in 100% recyclable heavy pharmaceutical amber glass to guard fragile active compounds against UV degradation. Outer carton is made from post-consumer recycled fiber board, printed with organic soy-inks.'
  },
  'pha-toner': {
    id: 'pha-toner',
    title: 'Resurfacing PHA Toner',
    category: 'Toners',
    price: 38.00,
    comparePrice: 46.00,
    rating: 4.6,
    reviews: 52,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
    link: '/product.html?id=pha-toner',
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An advanced micro-exfoliating treatment formulated with Gluconolactone (PHA), skin-soothing panthenol, and cooling cucumber distillates. Gently sweeps away dead cells without micro-tears or pH disruptions.',
    howToApply: 'Pour a few drops into your palms or onto a reusable bamboo pad. Press gently onto face and neck, avoiding the eye area. Use 3-4 times a week during your evening ritual.',
    ingredients: 'Active Ingredients: Gluconolactone PHA (6.0%), Panthenol Vitamin B5 (2.0%), Licorice Root Extract, Cucumber Distillate. Inactive Ingredients: Aqua, Aloe Barbadensis Leaf Juice, Propanediol, Phenoxyethanol.',
    packaging: 'Encased in a beautiful frosted green pharmaceutical glass bottle with a reducer plug for precise, spill-free dispensing. Eco-friendly and fully recyclable.'
  },
  'youth-cream': {
    id: 'youth-cream',
    title: 'Bakuchiol Youth Cream',
    category: 'Creams',
    price: 64.00,
    rating: 4.9,
    reviews: 165,
    image: 'https://images.unsplash.com/photo-1631730359575-38e4755d772b?auto=format&fit=crop&w=600&q=80',
    link: '/product.html?id=youth-cream',
    images: [
      'https://images.unsplash.com/photo-1631730359575-38e4755d772b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A luxurious botanical retinol alternative. Packed with pure Bakuchiol, barrier-strengthening peptides, and organic shea butter, this dense cream restores skin elasticity and fills fine lines while you sleep.',
    howToApply: 'Apply a dime-sized amount to clean skin as the final step of your evening ritual. Warm between palms and press upward from collarbones to forehead for lymphatic release.',
    ingredients: 'Active Ingredients: Bakuchiol Retinol-Alt (2.0%), Copper Tripeptide-1, Organic Shea Butter, Evening Primrose Oil. Inactive Ingredients: Aqua, Caprylic/Capric Triglyceride, Glyceryl Stearate, Glycerin, Phenoxyethanol.',
    packaging: 'Housed in a wide-mouth heavy amber glass jar with an aluminum seal. Minimizes plastics and is entirely reusable as a luxury storage container.'
  },
  'glow-nectar': {
    id: 'glow-nectar',
    title: 'Radiance Vitamin C Nectar',
    category: 'Serums',
    price: 52.00,
    rating: 4.7,
    reviews: 74,
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=600&q=80',
    link: '/product.html?id=glow-nectar',
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A high-potency, ultra-stable Vitamin C oil serum enriched with Tetrahexyldecyl Ascorbate, ferulic acid, and pure sea buckthorn pulp. Brightens dark spots, evens tone, and fights oxidation without redness.',
    howToApply: 'Smooth 2 drops over face and neck in the morning. Follow immediately with your daily SPF to boost antioxidant defenses against solar radiation and ambient pollution.',
    ingredients: 'Active Ingredients: Tetrahexyldecyl Ascorbate (8.0%), Ferulic Acid (1.0%), Sea Buckthorn Oil, Vitamin E Tocopherol. Inactive Ingredients: Squalane, Rosehip Seed Oil, Jojoba Esters, Phenoxyethanol.',
    packaging: 'Protected in dark amber glass with a precision gold-collared glass dropper, preserving the delicate antioxidant actives from oxygen and light.'
  },
  'mineral-veil': {
    id: 'mineral-veil',
    title: 'Mineral Veil SPF 50',
    category: 'Sunscreen',
    price: 42.00,
    rating: 4.5,
    reviews: 39,
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80',
    link: '/product.html?id=mineral-veil',
    images: [
      'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An invisible, featherlight 100% mineral sunscreen that acts as a physical shield and botanical primer. Delivers zinc oxide protection with an air-whipped texture and absolutely zero white cast.',
    howToApply: 'Shake well. Apply generously (about a nickel-sized amount) to face, ears, and neck 15 minutes before sun exposure. Reapply every 2 hours or after perspiring.',
    ingredients: 'Active Ingredients: Non-Nano Zinc Oxide (20.5%), Red Algae Extract, Squalane, Green Tea Polyphenols. Inactive Ingredients: Aqua, Coco-Caprylate, Silica, Polyglyceryl-3 Polyricinoleate, Glycerin, Phenoxyethanol.',
    packaging: 'Packaged in a post-consumer recycled squeezable tube with a gold screw cap, perfect for on-the-go daily application while caring for the oceans.'
  }
};

let cartState = JSON.parse(localStorage.getItem('lumina_cart')) || [];

function initCartEngine() {
  const cartToggleBtn = document.querySelector('.cart-toggle');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.drawer-overlay');
  const cartCloseBtn = document.querySelector('.cart-drawer-close');

  if (!cartDrawer) return;

  const openCart = () => {
    cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartDrawer.classList.remove('open');
    if (cartOverlay && !document.querySelector('.mobile-menu-drawer.open')) {
      cartOverlay.classList.remove('open');
    }
    document.body.style.overflow = '';
  };

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Watch for add-to-cart clicks (global selector)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-add-to-cart]');
    if (trigger) {
      e.preventDefault();
      const productId = trigger.getAttribute('data-product-id');
      const quantity = parseInt(document.querySelector('#product-quantity')?.value || 1);
      const selectedVariant = document.querySelector('.variant-btn.active')?.textContent.trim() || 'Standard';
      
      addToCart(productId, quantity, selectedVariant);
      openCart();
    }
  });

  renderCart();
}

function addToCart(productId, quantity = 1, variant = 'Standard') {
  const product = PRODUCT_REGISTRY[productId];
  if (!product) return;

  const existingItemIndex = cartState.findIndex(
    item => item.id === productId && item.variant === variant
  );

  if (existingItemIndex > -1) {
    cartState[existingItemIndex].quantity += quantity;
  } else {
    cartState.push({
      id: productId,
      title: product.title,
      price: product.price,
      image: product.image,
      variant: variant,
      quantity: quantity
    });
  }

  saveCart();
  renderCart();
  showNotificationToast(`Added ${product.title} to your bag!`);
}

function removeFromCart(productId, variant) {
  cartState = cartState.filter(item => !(item.id === productId && item.variant === variant));
  saveCart();
  renderCart();
}

function updateCartItemQty(productId, variant, delta) {
  const itemIndex = cartState.findIndex(item => item.id === productId && item.variant === variant);
  if (itemIndex > -1) {
    cartState[itemIndex].quantity += delta;
    if (cartState[itemIndex].quantity <= 0) {
      cartState.splice(itemIndex, 1);
    }
    saveCart();
    renderCart();
  }
}

function saveCart() {
  localStorage.setItem('lumina_cart', JSON.stringify(cartState));
}

function renderCart() {
  const container = document.querySelector('.cart-items-container');
  const countBadges = document.querySelectorAll('.cart-count');
  const subtotalEl = document.getElementById('cart-subtotal');
  
  if (!container) return;

  // Calculate stats
  let totalItems = 0;
  let subtotal = 0.00;

  cartState.forEach(item => {
    totalItems += item.quantity;
    subtotal += item.price * item.quantity;
  });

  // Update Badges
  countBadges.forEach(badge => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  });

  // Update Subtotal
  if (subtotalEl) {
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  // Render HTML
  if (cartState.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-message">
        <p>Your shopping bag is empty.</p>
        <a href="./collection.html" class="btn btn-primary">Shop All Products</a>
      </div>
    `;
    return;
  }

  container.innerHTML = cartState.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img" referrerPolicy="no-referrer">
      <div class="cart-item-info">
        <div class="cart-item-title-row">
          <div>
            <h5 class="cart-item-title">${item.title}</h5>
            <div class="cart-item-variant">${item.variant}</div>
          </div>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-adjuster">
            <button class="qty-btn dec-btn" onclick="adjustCartItemQtyDirect('${item.id}', '${item.variant}', -1)">−</button>
            <input type="text" class="qty-input" value="${item.quantity}" readonly>
            <button class="qty-btn inc-btn" onclick="adjustCartItemQtyDirect('${item.id}', '${item.variant}', 1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeCartItemDirect('${item.id}', '${item.variant}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Attach globally accessible wrapper helpers for inline onclick triggers
window.adjustCartItemQtyDirect = (id, variant, delta) => {
  updateCartItemQty(id, variant, delta);
};

window.removeCartItemDirect = (id, variant) => {
  removeFromCart(id, variant);
};

// Toast notification helper
function showNotificationToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="toast-success-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </span>
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.classList.remove('show')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;

  // Animate in
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Auto dismiss
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ==========================================
// 4. INSTANT SEARCH POPUP ENGINE
// ==========================================
function initSearchPopup() {
  const searchToggle = document.querySelector('.search-toggle');
  const searchPopup = document.querySelector('.search-popup');
  const searchClose = document.querySelector('.search-popup-close');
  const searchInput = document.querySelector('.search-input');
  const suggestionGrid = document.querySelector('.suggestion-grid');

  if (!searchPopup || !searchToggle) return;

  const openSearch = () => {
    searchPopup.classList.add('open');
    setTimeout(() => searchInput.focus(), 300);
    document.body.style.overflow = 'hidden';
  };

  const closeSearch = () => {
    searchPopup.classList.remove('open');
    document.body.style.overflow = '';
  };

  searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  // Real-time search filter mock logic
  if (searchInput && suggestionGrid) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const products = Object.values(PRODUCT_REGISTRY);

      if (query.length === 0) {
        // Restore default curated items
        renderSuggestions(products.slice(0, 3));
        return;
      }

      const filtered = products.filter(
        p => p.title.toLowerCase().includes(query)
      );

      renderSuggestions(filtered);
    });

    const renderSuggestions = (list) => {
      if (list.length === 0) {
        suggestionGrid.innerHTML = `<div style="grid-column: span 3; text-align:center; color:var(--color-text-tertiary)">No products found matching your search.</div>`;
        return;
      }

      suggestionGrid.innerHTML = list.map(p => `
        <a href="${p.link}" class="suggestion-item">
          <img src="${p.image}" alt="${p.title}" class="suggestion-item-img" referrerPolicy="no-referrer">
          <div>
            <div class="suggestion-item-title">${p.title}</div>
            <div class="suggestion-item-price">$${p.price.toFixed(2)}</div>
          </div>
        </a>
      `).join('');
    };

    // Render original 3 suggestions first
    renderSuggestions(Object.values(PRODUCT_REGISTRY).slice(0, 3));
  }
}

// ==========================================
// 5. FAQ ACCORDIONS WITH SMOOTH AUTO-HEIGHT
// ==========================================
function initFAQAccordions() {
  const accordionItems = document.querySelectorAll('.faq-item');
  
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items (Shopify style accordion behavior)
      const parent = item.parentElement;
      parent.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.faq-content');
        if (otherContent) otherContent.style.maxHeight = '0';
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        content.style.maxHeight = '0';
      }
    });
  });
}

// ==========================================
// 6. BEFORE/AFTER SPLIT VIEW SLIDER
// ==========================================
function initBeforeAfterSlider() {
  const container = document.querySelector('.comparison-slider-container');
  if (!container) return;

  const beforeImage = container.querySelector('.image-before');
  const handle = container.querySelector('.slider-handle');

  if (!beforeImage || !handle) return;

  let active = false;

  const slide = (x) => {
    const rect = container.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;

    // Boundary constraints
    if (position < 0) position = 0;
    if (position > 100) position = 100;

    beforeImage.style.width = `${position}%`;
    handle.style.left = `${position}%`;
  };

  // Mouse & Touch triggers
  const startDrag = () => { active = true; };
  const stopDrag = () => { active = false; };
  
  handle.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  
  window.addEventListener('mousemove', (e) => {
    if (!active) return;
    slide(e.pageX);
  });

  handle.addEventListener('touchstart', startDrag);
  window.addEventListener('touchend', stopDrag);
  
  window.addEventListener('touchmove', (e) => {
    if (!active) return;
    slide(e.touches[0].clientX);
  });

  // Drag over container also slides smoothly for better interaction
  container.addEventListener('click', (e) => {
    slide(e.pageX);
  });
}

// ==========================================
// 7. TESTIMONIAL CAROUSEL SLIDER
// ==========================================
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  if (slides.length === 0) return;

  let currentIdx = 0;

  const showSlide = (idx) => {
    slides.forEach(s => s.classList.remove('active'));
    
    currentIdx = (idx + slides.length) % slides.length;
    slides[currentIdx].classList.add('active');
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentIdx - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentIdx + 1));
  }

  // Optional: Auto play every 6 seconds
  setInterval(() => {
    showSlide(currentIdx + 1);
  }, 6000);
}

// ==========================================
// 8. BACK TO TOP BUTTON
// ==========================================
function initBackToTop() {
  let bttBtn = document.querySelector('.back-to-top');
  
  if (!bttBtn) {
    // Generate dynamically if missing in index.html to ensure complete layout
    bttBtn = document.createElement('button');
    bttBtn.className = 'back-to-top';
    bttBtn.setAttribute('aria-label', 'Back to top');
    bttBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
    `;
    document.body.appendChild(bttBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      bttBtn.classList.add('show');
    } else {
      bttBtn.classList.remove('show');
    }
  }, { passive: true });

  bttBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==========================================
// 9. SCROLL REVEAL (AESTHETIC ANIMATION ENGINE)
// ==========================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed for better client performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Reveals slightly before entry
  });

  revealElements.forEach(el => observer.observe(el));
}

// ==========================================
// 10. ANIMATED STATISTICS COUNTERS
// ==========================================
function initAnimatedCounters() {
  const counterEls = document.querySelectorAll('.counter-number');
  if (counterEls.length === 0) return;

  const runCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const isPercentage = el.getAttribute('data-suffix') || '';
    const speed = 1500; // Complete within 1.5s
    const increment = target / (speed / 16); // ~60fps step
    
    let current = 0;

    const updateCount = () => {
      current += increment;
      if (current >= target) {
        el.textContent = target + isPercentage;
      } else {
        el.textContent = Math.floor(current) + isPercentage;
        requestAnimationFrame(updateCount);
      }
    };

    updateCount();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => observer.observe(el));
}

// ==========================================
// 11. PRODUCT DETAIL PAGE GALLERY
// ==========================================
function initProductPageGallery() {
  const mainImg = document.querySelector('.product-gallery-main img');
  const thumbs = document.querySelectorAll('.thumb-btn');

  if (!mainImg || thumbs.length === 0) return;

  // Thumb clicks
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const newSrc = thumb.getAttribute('data-full-src');
      if (newSrc) {
        mainImg.src = newSrc;
      }
    });
  });

  // Lightbox Modal
  let lightbox = document.querySelector('.lightbox-modal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close Lightbox">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="lightbox-content">
        <img src="" alt="Enlarged View" referrerPolicy="no-referrer">
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  mainImg.addEventListener('click', () => {
    lightboxImg.src = mainImg.src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// ==========================================
// 12. PRODUCT VARIANT & QUANTITY ACTIONS
// ==========================================
function initProductVariantSelector() {
  const variantBtns = document.querySelectorAll('.variant-btn');
  const variantValueLabel = document.querySelector('.variant-selected-value');
  const priceLabel = document.querySelector('.product-price-current');
  const qtyInput = document.querySelector('#product-quantity');
  const qtyDec = document.querySelector('#qty-dec');
  const qtyInc = document.querySelector('#qty-inc');

  // Variant Click
  variantBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      variantBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const value = btn.getAttribute('data-variant-value') || btn.textContent.trim();
      if (variantValueLabel) variantValueLabel.textContent = value;

      // Mock varying price point based on variants
      const priceOffset = parseFloat(btn.getAttribute('data-price-offset') || '0');
      const basePrice = parseFloat(document.querySelector('[data-base-price]')?.getAttribute('data-base-price') || '48.00');
      
      if (priceLabel) {
        priceLabel.textContent = `$${(basePrice + priceOffset).toFixed(2)}`;
      }
    });
  });

  // Page Quantity adjusting checks
  if (qtyInput) {
    if (qtyDec) {
      qtyDec.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val > 1) {
          qtyInput.value = val - 1;
        }
      });
    }

    if (qtyInc) {
      qtyInc.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val < 10) {
          qtyInput.value = val + 1;
        }
      });
    }
  }
}

// ==========================================
// 13. COLLECTION GRID FILTERS & SORT ENGINE
// ==========================================
const COLLECTION_PRODUCTS = [
  { id: 'peptide-cleanser', category: 'cleansers', type: 'bestsellers', name: 'The Silk Peptide Cleanser', price: 34.00, comparePrice: 42.00, image1: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80', image2: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80', tag: 'Sale', rating: 4.8, reviews: 124 },
  { id: 'barrier-serum', category: 'serums', type: 'bestsellers', name: 'Barrier Repair Serum', price: 48.00, image1: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80', image2: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80', tag: 'Hot', rating: 4.9, reviews: 89 },
  { id: 'pha-toner', category: 'toners', type: 'new', name: 'Resurfacing PHA Toner', price: 38.00, comparePrice: 46.00, image1: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80', image2: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=600&q=80', tag: 'Sale', rating: 4.6, reviews: 52 },
  { id: 'glow-nectar', category: 'serums', type: 'new', name: 'Radiance Vitamin C Nectar', price: 52.00, image1: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=600&q=80', image2: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80', tag: 'New', rating: 4.7, reviews: 74 },
  { id: 'youth-cream', category: 'creams', type: 'bestsellers', name: 'Bakuchiol Youth Cream', price: 64.00, image1: 'https://images.unsplash.com/photo-1631730359575-38e4755d772b?auto=format&fit=crop&w=600&q=80', image2: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80', tag: '', rating: 4.9, reviews: 165 },
  { id: 'mineral-veil', category: 'sunscreen', type: 'all', name: 'Mineral Veil SPF 50', price: 42.00, image1: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80', image2: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80', tag: '', rating: 4.5, reviews: 39 }
];

function initCollectionFilters() {
  const collectionGrid = document.getElementById('collection-grid');
  if (!collectionGrid) return;

  const filterInputs = document.querySelectorAll('.filter-checkbox-label input');
  const sortSelect = document.getElementById('sort-by');
  const countEl = document.querySelector('.collection-count');

  const filterAndSortProducts = () => {
    // 1. Get Selected categories & types
    const activeCategories = [];
    const activeTypes = [];

    filterInputs.forEach(input => {
      if (input.checked) {
        if (input.name === 'category') {
          activeCategories.push(input.value);
        } else if (input.name === 'type') {
          activeTypes.push(input.value);
        }
      }
    });

    // 2. Filter products
    let filteredList = [...COLLECTION_PRODUCTS];

    if (activeCategories.length > 0) {
      filteredList = filteredList.filter(p => activeCategories.includes(p.category));
    }

    if (activeTypes.length > 0) {
      filteredList = filteredList.filter(p => {
        if (activeTypes.includes('new') && p.type === 'new') return true;
        if (activeTypes.includes('bestsellers') && p.type === 'bestsellers') return true;
        if (activeTypes.includes('sale') && p.comparePrice > 0) return true;
        return false;
      });
    }

    // 3. Sort products
    const sortBy = sortSelect ? sortSelect.value : 'featured';

    if (sortBy === 'price-low-high') {
      filteredList.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      filteredList.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'title-ascending') {
      filteredList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rating') {
      filteredList.sort((a, b) => b.rating - a.rating);
    }

    // 4. Render Grid HTML
    renderCollectionGrid(filteredList);

    // Update count labels
    if (countEl) {
      countEl.textContent = `${filteredList.length} products`;
    }
  };

  const renderCollectionGrid = (list) => {
    if (list.length === 0) {
      collectionGrid.innerHTML = `
        <div style="grid-column: span 3; text-align: center; padding: 4rem 1rem;">
          <h3 style="margin-bottom: 1rem;">No Products Match Your Filters</h3>
          <p>Try unchecking some filter categories or reset fields.</p>
        </div>
      `;
      return;
    }

    collectionGrid.innerHTML = list.map(p => `
      <div class="product-card reveal">
        <div class="product-card-img-wrap">
          ${p.tag ? `<span class="product-tag ${p.tag.toLowerCase()}">${p.tag}</span>` : ''}
          <a href="./product.html?id=${p.id}">
            <img src="${p.image1}" alt="${p.name}" class="product-card-img" referrerPolicy="no-referrer">
            <img src="${p.image2}" alt="${p.name}" class="product-card-img-hover" referrerPolicy="no-referrer">
          </a>
          <button class="product-card-quick-add" data-product-id="${p.id}" data-add-to-cart>Quick Add</button>
        </div>
        <div class="product-card-info">
          <span class="product-card-category">${p.category}</span>
          <a href="./product.html?id=${p.id}" class="product-card-title">${p.name}</a>
          <div class="product-card-rating">
            ${Array(Math.floor(p.rating)).fill('★').join('')}
            ${p.rating % 1 !== 0 ? '½' : ''}
            <span class="product-card-rating-text">(${p.reviews})</span>
          </div>
          <div class="product-card-price-row">
            <span class="product-card-price">$${p.price.toFixed(2)}</span>
            ${p.comparePrice ? `<span class="product-card-compare-price">$${p.comparePrice.toFixed(2)}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    // Re-init scroll reveals for new products
    initScrollReveal();
  };

  // Bind Listeners
  filterInputs.forEach(input => input.addEventListener('change', filterAndSortProducts));
  if (sortSelect) sortSelect.addEventListener('change', filterAndSortProducts);

  // Initial render
  filterAndSortProducts();
}

// ==========================================
// 14. CONTACT FORM VALIDATION & SUCCESS ACTION
// ==========================================
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value;
    const email = form.querySelector('[name="email"]')?.value;
    const message = form.querySelector('[name="message"]')?.value;

    if (!name || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }

    // Success simulation
    form.innerHTML = `
      <div style="text-align: center; padding: 2rem 0;">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.5" style="margin-bottom: 1.5rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <h3 class="font-serif" style="font-size: 1.8rem; margin-bottom: 1rem;">Thank You, ${name}</h3>
        <p>Your message has been received. Our luxury customer care team will get back to you within 24 business hours.</p>
      </div>
    `;
    
    showNotificationToast('Message sent successfully!');
  });
}

// ==========================================
// 15. DYNAMIC PRODUCT PAGE LOADER
// ==========================================
function initDynamicProductPage() {
  const params = new URLSearchParams(window.location.search);
  let productId = params.get('id');
  
  // Default to barrier-serum if on product page without an ID
  if (!productId && window.location.pathname.includes('product.html')) {
    productId = 'barrier-serum';
  }
  
  if (!productId) return;

  const product = PRODUCT_REGISTRY[productId];
  if (!product) return;

  // 1. Update Title & Meta
  document.title = `${product.title} | LUMINA Luxury Skincare`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', product.description);

  // 2. Update Breadcrumbs
  const breadcrumbActive = document.getElementById('active-product-breadcrumb');
  if (breadcrumbActive) breadcrumbActive.textContent = product.title;

  // 3. Update Text Content
  const brandEl = document.getElementById('product-detail-brand');
  const titleEl = document.getElementById('product-detail-title');
  const reviewsEl = document.getElementById('product-detail-reviews-label');
  const ratingStarsEl = document.querySelector('.product-rating-stars');
  const descEl = document.getElementById('product-detail-description');

  if (brandEl) brandEl.textContent = `LUMINA ${product.category}`;
  if (titleEl) titleEl.textContent = product.title;
  if (reviewsEl) reviewsEl.textContent = `(${product.reviews} client reviews)`;
  if (ratingStarsEl) {
    const starCount = Math.floor(product.rating || 5);
    ratingStarsEl.textContent = '★'.repeat(starCount) + (product.rating % 1 !== 0 ? '½' : '');
  }
  if (descEl) descEl.textContent = product.description;

  // 4. Update Price Panel
  const pricePanel = document.querySelector('.product-price-panel');
  const priceCurrent = document.getElementById('product-detail-price');
  const priceCompare = document.getElementById('product-detail-compare-price');

  if (pricePanel) pricePanel.setAttribute('data-base-price', product.price.toFixed(2));
  if (priceCurrent) priceCurrent.textContent = `$${product.price.toFixed(2)}`;
  if (priceCompare) {
    if (product.comparePrice) {
      priceCompare.textContent = `$${product.comparePrice.toFixed(2)}`;
      priceCompare.style.display = 'inline';
    } else {
      priceCompare.style.display = 'none';
    }
  }

  // 5. Update Add to Cart Button Data Attribute
  const cartBtn = document.getElementById('page-add-to-cart-btn');
  if (cartBtn) {
    cartBtn.setAttribute('data-product-id', product.id);
    cartBtn.setAttribute('data-add-to-cart', '');
  }

  // 6. Update Gallery
  const images = product.images || [product.image, product.image, product.image];
  const thumb1 = document.getElementById('thumb-img-1');
  const thumb2 = document.getElementById('thumb-img-2');
  const thumb3 = document.getElementById('thumb-img-3');
  const mainVisual = document.getElementById('product-main-visual');

  if (thumb1 && images[0]) {
    thumb1.src = images[0].replace('w=1200', 'w=300');
    thumb1.parentElement.setAttribute('data-full-src', images[0]);
  }
  if (thumb2 && images[1]) {
    thumb2.src = images[1].replace('w=1200', 'w=300');
    thumb2.parentElement.setAttribute('data-full-src', images[1]);
  }
  if (thumb3 && images[2]) {
    thumb3.src = images[2].replace('w=1200', 'w=300');
    thumb3.parentElement.setAttribute('data-full-src', images[2]);
  }
  if (mainVisual && images[0]) {
    mainVisual.src = images[0];
  }

  // 7. Update Tabs
  const tabTriggers = document.querySelectorAll('.product-accordion .faq-trigger');
  if (tabTriggers.length >= 2) {
    // Tab 1: How To Apply
    const content1 = tabTriggers[0].nextElementSibling?.querySelector('.faq-content-inner p');
    if (content1 && product.howToApply) content1.textContent = product.howToApply;

    // Tab 2: Ingredients
    const content2 = tabTriggers[1].nextElementSibling?.querySelector('.faq-content-inner p');
    if (content2 && product.ingredients) content2.textContent = product.ingredients;

    // Tab 3: Packaging
    if (tabTriggers.length >= 3) {
      const content3 = tabTriggers[2].nextElementSibling?.querySelector('.faq-content-inner p');
      if (content3 && product.packaging) content3.textContent = product.packaging;
    }
  }

  // 8. Render Related Products (Complementary Routines)
  const relatedGrid = document.getElementById('related-grid');
  if (relatedGrid) {
    const productsList = COLLECTION_PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);
    relatedGrid.innerHTML = productsList.map(p => `
      <div class="product-card reveal">
        <div class="product-card-img-wrap">
          ${p.tag ? `<span class="product-tag ${p.tag.toLowerCase()}">${p.tag}</span>` : ''}
          <a href="./product.html?id=${p.id}">
            <img src="${p.image1}" alt="${p.name}" class="product-card-img" referrerPolicy="no-referrer">
            <img src="${p.image2}" alt="${p.name}" class="product-card-img-hover" referrerPolicy="no-referrer">
          </a>
          <button class="product-card-quick-add" data-product-id="${p.id}" data-add-to-cart>Quick Add</button>
        </div>
        <div class="product-card-info">
          <span class="product-card-category">${p.category}</span>
          <a href="./product.html?id=${p.id}" class="product-card-title">${p.name}</a>
          <div class="product-card-rating">
            ${'★'.repeat(Math.floor(p.rating))}
            ${p.rating % 1 !== 0 ? '½' : ''}
            <span class="product-card-rating-text">(${p.reviews})</span>
          </div>
          <div class="product-card-price-row">
            <span class="product-card-price">$${p.price.toFixed(2)}</span>
            ${p.comparePrice ? `<span class="product-card-compare-price">$${p.comparePrice.toFixed(2)}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
    
    // Ensure scroll reveal registers the newly added related products
    initScrollReveal();
  }
}
