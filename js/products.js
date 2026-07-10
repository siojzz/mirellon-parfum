/* =========================================================
   MIRELLON PARFUM — PRODUCTS.JS
   Product data, grid rendering, filter/search/sort,
   pagination, marketplace popup, and product detail modal.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     MARKETPLACE LINKS
     Ganti nilai di bawah ini dengan link toko Anda masing-masing.
     --------------------------------------------------------- */
  const shopee = "";
  const tokopedia = "";
  const tiktok = "";

  const MARKETPLACE_LINKS = {
    shopee: shopee,
    tokopedia: tokopedia,
    tiktok: tiktok,
  };

  /* ---------------------------------------------------------
     PRODUCT DATA
     badge: "Best Seller" | "New" | null (gender badge is derived
     automatically for the "women" filter chip look in the mock)
     price35 / price50 are in Rupiah, rating is out of 5, reviews
     is the number of reviews shown next to the rating.
     --------------------------------------------------------- */
  const PRODUCTS = [
    {
      id: "deep-horizon",
      name: "Deep Horizon",
      gender: "men",
      category: "Fresh Woody",
      top: "Citrus, Bergamot",
      middle: "Lavender, Geranium",
      base: "Amber, Cedarwood",
      desc: "Parfum pria dengan aroma fresh yang maskulin dan elegan.",
      image: "images/deep-horizon.png",
      badge: "Best Seller",
      rating: 4.9,
      reviews: 287,
      price35: 87000,
      price50: 119000,
    },
    {
      id: "floral-kiss",
      name: "Floral Kiss",
      gender: "women",
      category: "Floral",
      top: "White Flowers",
      middle: "Rose, Peony",
      base: "Musk, Soft Amber",
      desc: "Parfum feminin dengan nuansa bunga yang lembut dan romantis.",
      image: "images/floral-kiss.png",
      badge: "New",
      rating: 4.8,
      reviews: 196,
      price35: 87000,
      price50: 119000,
    },
    {
      id: "fleur-voyage",
      name: "Fleur Voyage",
      gender: "women",
      category: "Elegant Floral",
      top: "Pear, Lychee",
      middle: "Peony, Jasmine",
      base: "White Musk",
      desc: "Parfum elegan untuk wanita aktif dengan aroma bunga modern.",
      image: "images/fleur-voyage.png",
      badge: null,
      rating: 4.7,
      reviews: 153,
      price35: 87000,
      price50: 119000,
    },
    {
      id: "golden-valor",
      name: "Golden Valor",
      gender: "men",
      category: "Oriental Spicy",
      top: "Bergamot",
      middle: "Cinnamon",
      base: "Amber",
      desc: "Parfum pria dengan sentuhan rempah hangat dan aroma amber yang berkarakter kuat.",
      image: "images/golden-ember.png",
      badge: null,
      rating: 4.6,
      reviews: 98,
      price35: 92000,
      price50: 129000,
    },
    {
      id: "velvet-noir",
      name: "Velvet Noir",
      gender: "men",
      category: "Woody Leather",
      top: "Black Pepper",
      middle: "Leather",
      base: "Vetiver",
      desc: "Parfum pria maskulin dengan nuansa kulit dan kayu tegas, cocok untuk malam hari.",
      image: "images/velvet-noir.png",
      badge: "Best Seller",
      rating: 4.8,
      reviews: 211,
      price35: 95000,
      price50: 135000,
    },
    {
      id: "silk-petal",
      name: "Silk Petal",
      gender: "women",
      category: "Soft Floral",
      top: "Bergamot",
      middle: "Jasmine",
      base: "Sandalwood",
      desc: "Parfum wanita lembut dengan sentuhan melati dan kayu cendana yang menenangkan.",
      image: "images/silk-petal.png",
      badge: null,
      rating: 4.7,
      reviews: 134,
      price35: 87000,
      price50: 119000,
    },
    {
      id: "ocean-breeze",
      name: "Ocean Breeze",
      gender: "unisex",
      category: "Aquatic Fresh",
      top: "Sea Salt",
      middle: "Lavender",
      base: "Musk",
      desc: "Aroma segar seperti angin laut, cocok dipakai pria maupun wanita yang aktif seharian.",
      image: "images/ocean-breeze.png",
      badge: null,
      rating: 4.5,
      reviews: 87,
      price35: 85000,
      price50: 115000,
    },
    {
      id: "amber-dusk",
      name: "Amber Dusk",
      gender: "unisex",
      category: "Oriental Amber",
      top: "Saffron",
      middle: "Amber",
      base: "Vanilla",
      desc: "Karakter oriental hangat dengan sentuhan vanilla elegan, ideal untuk momen spesial.",
      image: "images/amber-dusk.png",
      badge: "New",
      rating: 4.9,
      reviews: 176,
      price35: 92000,
      price50: 129000,
    },
  ];

  const grid = document.querySelector(".product-grid");
  if (!grid) return;

  const noResults = document.querySelector(".no-results");
  const searchInput = document.querySelector("#product-search");
  const filterBtns = document.querySelectorAll(".filter-pill");
  const sortSelect = document.querySelector("#product-sort");
  const countEl = document.querySelector("#product-count");
  const paginationWrap = document.querySelector(".pagination");

  const PAGE_SIZE = 6;

  let activeFilter = "all";
  let activeQuery = "";
  let activeSort = "newest";
  let currentPage = 1;
  let wishlist = [];

  /* ---------------------------------------------------------
     HELPERS
     --------------------------------------------------------- */
  function formatPrice(n) {
    return "Rp" + n.toLocaleString("id-ID");
  }

  function starRow(rating) {
    const full = Math.round(rating);
    let out = "";
    for (let i = 0; i < 5; i++) {
      out += `<span class="star${i < full ? " filled" : ""}">★</span>`;
    }
    return out;
  }

  const NOTE_ICONS = {
    top: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
    middle: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20.5s-7.5-4.6-9.6-9.1C.9 8 2.4 4.8 5.6 4.1c2-.4 3.9.5 5 2.1 1.1-1.6 3-2.5 5-2.1 3.2.7 4.7 3.9 3.2 7.3-2.1 4.5-9.6 9.1-9.6 9.1z"/></svg>',
    base: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2C7 6 4 10.5 4 14.5A8 8 0 0 0 20 14.5C20 10.5 17 6 12 2z"/></svg>',
  };

  /* ---------------------------------------------------------
     RENDER — product card
     --------------------------------------------------------- */
  function productCardHTML(p) {
    const isWishlisted = wishlist.includes(p.id);
    return `
      <article class="product-card" data-aos="fade-up">
        <div class="product-media">
          ${p.badge ? `<span class="product-badge product-badge-${p.badge.toLowerCase().replace(/\s+/g, "-")}">${p.badge}</span>` : `<span class="product-badge product-badge-${p.gender}">${p.gender}</span>`}
          <button class="wishlist-btn${isWishlisted ? " active" : ""}" data-id="${p.id}" aria-label="Simpan ke wishlist" aria-pressed="${isWishlisted}">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="${isWishlisted ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8"><path d="M12 20.5s-7.5-4.6-9.6-9.1C.9 8 2.4 4.8 5.6 4.1c2-.4 3.9.5 5 2.1 1.1-1.6 3-2.5 5-2.1 3.2.7 4.7 3.9 3.2 7.3-2.1 4.5-9.6 9.1-9.6 9.1z"/></svg>
          </button>
          <div class="media-shine" aria-hidden="true"></div>
          <img src="${p.image}" alt="Botol parfum Mirellon ${p.name}" loading="lazy" width="200" height="300" onerror="this.style.display='none'">
        </div>
        <div class="product-body">
          <h3>${p.name}</h3>
          <div class="product-category">${p.category}</div>

          <ul class="notes-icon-list">
            <li><span class="note-icon">${NOTE_ICONS.top}</span><span class="note-label">Top</span><span class="note-value">${p.top}</span></li>
            <li><span class="note-icon">${NOTE_ICONS.middle}</span><span class="note-label">Heart</span><span class="note-value">${p.middle}</span></li>
            <li><span class="note-icon">${NOTE_ICONS.base}</span><span class="note-label">Base</span><span class="note-value">${p.base}</span></li>
          </ul>

          <div class="price-divider"></div>

          <div class="price-row">
            <div class="price-item"><span>35ml</span><strong>${formatPrice(p.price35)}</strong></div>
          </div>

          <div class="product-actions">
            <button class="btn-view-details detail-btn" data-id="${p.id}" aria-haspopup="dialog">View Details <span class="arrow" aria-hidden="true">&#8594;</span></button>
          </div>
        </div>
      </article>
    `;
  }

  /* ---------------------------------------------------------
     3D TILT — bottle follows the cursor inside product-media
     Skipped on touch devices and prefers-reduced-motion.
     --------------------------------------------------------- */
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hasFinePointer && !prefersReducedMotion) {
    grid.classList.add("pointer-fine");
  }

  function bindTiltEvents() {
    if (!hasFinePointer || prefersReducedMotion) return;
    grid.querySelectorAll(".product-media").forEach((media) => {
      const img = media.querySelector("img");
      media.addEventListener("mousemove", (e) => {
        const rect = media.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        media.style.transform = `rotateY(${relX * 9}deg) rotateX(${relY * -9}deg)`;
        if (img) img.style.transform = `translate3d(${relX * -10}px, ${relY * -10}px, 30px) scale(1.06)`;
      });
      media.addEventListener("mouseleave", () => {
        media.style.transform = "";
        if (img) img.style.transform = "";
      });
    });
  }

  /* ---------------------------------------------------------
     FILTER + SEARCH + SORT
     --------------------------------------------------------- */
  function getFiltered() {
    return PRODUCTS.filter((p) => {
      let matchFilter = true;
      if (activeFilter === "new") matchFilter = p.badge === "New";
      else if (activeFilter === "bestseller") matchFilter = p.badge === "Best Seller";
      else if (activeFilter !== "all") matchFilter = p.gender === activeFilter;

      const matchQuery =
        !activeQuery ||
        p.name.toLowerCase().includes(activeQuery) ||
        p.category.toLowerCase().includes(activeQuery) ||
        p.desc.toLowerCase().includes(activeQuery);
      return matchFilter && matchQuery;
    });
  }

  function getSorted(list) {
    const sorted = list.slice();
    switch (activeSort) {
      case "price-asc":
        sorted.sort((a, b) => a.price35 - b.price35);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price35 - a.price35);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        /* "newest" keeps catalogue order but surfaces New items first */
        sorted.sort((a, b) => (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0));
    }
    return sorted;
  }

  /* ---------------------------------------------------------
     PAGINATION
     --------------------------------------------------------- */
  function renderPagination(totalItems) {
    if (!paginationWrap) return;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    paginationWrap.innerHTML = "";
    if (totalPages <= 1) return;

    const makeBtn = (label, page, opts = {}) => {
      const btn = document.createElement("button");
      btn.innerHTML = label;
      btn.setAttribute("aria-label", opts.ariaLabel || `Halaman ${page}`);
      if (opts.active) btn.classList.add("active");
      if (opts.disabled) {
        btn.disabled = true;
        btn.classList.add("disabled");
      } else {
        btn.addEventListener("click", () => {
          currentPage = page;
          render();
          grid.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      return btn;
    };

    paginationWrap.appendChild(makeBtn("&#8592;", currentPage - 1, { ariaLabel: "Halaman sebelumnya", disabled: currentPage === 1 }));

    const pages = [];
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    pages.forEach((p) => {
      if (p === "...") {
        const span = document.createElement("span");
        span.className = "pagination-ellipsis";
        span.textContent = "...";
        paginationWrap.appendChild(span);
      } else {
        paginationWrap.appendChild(makeBtn(String(p), p, { active: p === currentPage }));
      }
    });

    paginationWrap.appendChild(makeBtn("&#8594;", currentPage + 1, { ariaLabel: "Halaman berikutnya", disabled: currentPage === totalPages }));
  }

  /* ---------------------------------------------------------
     MAIN RENDER
     --------------------------------------------------------- */
  function render() {
    const filtered = getSorted(getFiltered());
    const limit = grid.dataset.limit ? parseInt(grid.dataset.limit, 10) : null;

    let toRender;
    if (limit && !activeQuery && activeFilter === "all") {
      toRender = filtered.slice(0, limit);
    } else {
      toRender = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    }

    grid.innerHTML = toRender.map(productCardHTML).join("");
    if (noResults) noResults.classList.toggle("show", filtered.length === 0);
    if (countEl) countEl.textContent = filtered.length;

    if (!limit) renderPagination(filtered.length);

    /* re-observe new cards for scroll animation, if observer available */
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      grid.querySelectorAll("[data-aos]").forEach((el) => observer.observe(el));
    } else {
      grid.querySelectorAll("[data-aos]").forEach((el) => el.classList.add("in-view"));
    }

    bindCardEvents();
    bindTiltEvents();
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter || "all";
      currentPage = 1;
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      activeQuery = searchInput.value.trim().toLowerCase();
      currentPage = 1;
      render();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      activeSort = sortSelect.value;
      currentPage = 1;
      render();
    });
  }

  /* ---------------------------------------------------------
     WISHLIST (visual, saved locally)
     --------------------------------------------------------- */
  try {
    wishlist = JSON.parse(localStorage.getItem("mirellon-wishlist") || "[]");
  } catch (e) {
    wishlist = [];
  }

  function toggleWishlist(id, btn) {
    const idx = wishlist.indexOf(id);
    if (idx > -1) {
      wishlist.splice(idx, 1);
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
      btn.querySelector("svg").setAttribute("fill", "none");
    } else {
      wishlist.push(id);
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      btn.querySelector("svg").setAttribute("fill", "currentColor");
    }
    try { localStorage.setItem("mirellon-wishlist", JSON.stringify(wishlist)); } catch (e) { /* ignore */ }
  }

  /* ---------------------------------------------------------
     MARKETPLACE POPUP
     --------------------------------------------------------- */
  const marketplaceOverlay = document.querySelector("#marketplace-popup");

  function openMarketplacePopup(productId) {
    if (!marketplaceOverlay) return;
    marketplaceOverlay.dataset.productId = productId;
    marketplaceOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeOverlay(overlay) {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (marketplaceOverlay) {
    marketplaceOverlay.addEventListener("click", (e) => {
      if (e.target === marketplaceOverlay || e.target.closest("[data-close]")) {
        closeOverlay(marketplaceOverlay);
      }
    });

    marketplaceOverlay.querySelectorAll(".marketplace-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const store = btn.dataset.store;
        const link = MARKETPLACE_LINKS[store];
        if (link) {
          window.open(link, "_blank", "noopener");
        } else {
          alert("Link marketplace belum diatur. Silakan tambahkan URL pada js/products.js.");
        }
        closeOverlay(marketplaceOverlay);
      });
    });
  }

  /* ---------------------------------------------------------
     PRODUCT DETAIL MODAL
     --------------------------------------------------------- */
  const detailOverlay = document.querySelector("#product-modal");

  function openDetailModal(productId) {
    const p = PRODUCTS.find((item) => item.id === productId);
    if (!p || !detailOverlay) return;

    detailOverlay.querySelector(".modal-media img").src = p.image;
    detailOverlay.querySelector(".modal-media img").alt = `Botol parfum Mirellon ${p.name}`;
    detailOverlay.querySelector(".modal-title").textContent = p.name;
    detailOverlay.querySelector(".modal-category").textContent = p.category;
    detailOverlay.querySelector(".modal-desc").textContent = p.desc;
    detailOverlay.querySelector(".modal-top").textContent = p.top;
    detailOverlay.querySelector(".modal-middle").textContent = p.middle;
    detailOverlay.querySelector(".modal-base").textContent = p.base;
    detailOverlay.querySelector(".modal-buy").dataset.id = p.id;

    const priceEl = detailOverlay.querySelector(".modal-price");
    if (priceEl) priceEl.textContent = `35ml ${formatPrice(p.price35)}  ·  50ml ${formatPrice(p.price50)}`;
    const ratingEl = detailOverlay.querySelector(".modal-rating");
    if (ratingEl) ratingEl.innerHTML = `${starRow(p.rating)} <span class="rating-num">${p.rating.toFixed(1)}</span> <span class="rating-count">(${p.reviews})</span>`;

    detailOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  if (detailOverlay) {
    detailOverlay.addEventListener("click", (e) => {
      if (e.target === detailOverlay || e.target.closest("[data-close]")) {
        closeOverlay(detailOverlay);
      }
    });

    const modalBuyBtn = detailOverlay.querySelector(".modal-buy");
    if (modalBuyBtn) {
      modalBuyBtn.addEventListener("click", () => {
        closeOverlay(detailOverlay);
        openMarketplacePopup(modalBuyBtn.dataset.id);
      });
    }
  }

  function bindCardEvents() {
    grid.querySelectorAll(".detail-btn").forEach((btn) => {
      btn.addEventListener("click", () => openDetailModal(btn.dataset.id));
    });
    grid.querySelectorAll(".wishlist-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleWishlist(btn.dataset.id, btn);
      });
    });
  }

  render();
})();