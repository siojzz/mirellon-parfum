/* =========================================================
   MIRELLON PARFUM — MAIN.JS
   Global site behaviors shared across all pages.
   ========================================================= */

/* ---------- Global Marketplace Configuration ----------
   Ganti nilai link di bawah ini agar otomatis aktif di seluruh halaman website: */
window.MIRELLON_CONFIG = window.MIRELLON_CONFIG || {};
window.MIRELLON_CONFIG.marketplace = {
  shopee: "",
  tokopedia: "https://tk.tokopedia.com/ZSVDJ2eSw/",
  tiktok: "https://www.tiktok.com/@mirellon_parfum?_r=1&_t=ZS-991wJdPSrNV",
};

(function () {
  "use strict";

  /* ---------- Loading Screen ---------- */
  const loader = document.getElementById("loading-screen");
  window.addEventListener("load", () => {
    if (loader) {
      setTimeout(() => loader.classList.add("hidden"), 500);
    }
  });

  /* ---------- Page Transition ----------
     Reuses the loading-screen curtain: on internal link clicks it
     closes the curtain, then navigates. The next page's own load
     handler above opens it again, giving a seamless close/open feel. */
  const prefersReducedMotionNav = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (loader && !prefersReducedMotionNav) {
    document.addEventListener("click", (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      if (link.hostname !== window.location.hostname) return;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const targetPage = link.pathname.split("/").pop() || "index.html";
      if (targetPage === currentPage) return;

      e.preventDefault();
      loader.classList.remove("hidden");
      loader.classList.add("leaving");
      setTimeout(() => {
        window.location.href = link.href;
      }, 550);
    });
  }

  /* ---------- Sticky / Transparent Header ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const isTransparentHero = header.dataset.transparentHero === "true";

    function updateHeader() {
      const scrolled = window.scrollY > 60;
      if (isTransparentHero && !scrolled) {
        header.classList.add("transparent");
        header.classList.remove("solid");
      } else {
        header.classList.remove("transparent");
        header.classList.add("solid");
      }
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* ---------- Mobile Navigation ---------- */
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileClose = document.querySelector(".mobile-nav .close-btn");

  function toggleMobileNav(open) {
    if (!mobileNav) return;
    mobileNav.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (hamburger) hamburger.addEventListener("click", () => toggleMobileNav(true));
  if (mobileClose) mobileClose.addEventListener("click", () => toggleMobileNav(false));
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => toggleMobileNav(false));
    });
  }

  /* ---------- Back To Top ---------- */
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => {
        backToTop.classList.toggle("show", window.scrollY > 500);
      },
      { passive: true }
    );
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll Reveal Animations (AOS-style) ---------- */
  const revealTargets = document.querySelectorAll("[data-aos]");
  if ("IntersectionObserver" in window && revealTargets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Contact Form (client-side demo submit) ---------- */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.getElementById("form-status");
      const nameField = contactForm.querySelector('[name="name"]');
      const name = nameField ? nameField.value.trim() : "";
      if (status) {
        status.textContent = name
          ? `Terima kasih, ${name}! Pesan Anda telah kami terima.`
          : "Terima kasih! Pesan Anda telah kami terima.";
      }
      contactForm.reset();
    });
  }

  /* ---------- Notes / Blog: Search, Category Filter, Pagination ---------- */
  const notesGrid = document.querySelector(".notes-grid");
  if (notesGrid) {
    const cards = Array.from(notesGrid.querySelectorAll(".note-card"));
    const searchInput = document.querySelector("#notes-search");
    const categoryBtns = document.querySelectorAll(".notes-category-btn");
    const paginationWrap = document.querySelector(".pagination");
    const PAGE_SIZE = 3;

    let activeCategory = "all";
    let activeQuery = "";
    let currentPage = 1;

    function getFiltered() {
      return cards.filter((card) => {
        const cat = card.dataset.category || "all";
        const text = card.textContent.toLowerCase();
        const matchCat = activeCategory === "all" || cat === activeCategory;
        const matchQuery = !activeQuery || text.includes(activeQuery);
        return matchCat && matchQuery;
      });
    }

    function renderNotes() {
      const filtered = getFiltered();
      const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;

      cards.forEach((card) => card.classList.add("note-hidden"));
      filtered
        .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
        .forEach((card) => card.classList.remove("note-hidden"));

      const noResults = document.querySelector(".notes-no-results");
      if (noResults) noResults.classList.toggle("show", filtered.length === 0);

      if (paginationWrap) {
        paginationWrap.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement("button");
          btn.textContent = i;
          if (i === currentPage) btn.classList.add("active");
          btn.addEventListener("click", () => {
            currentPage = i;
            renderNotes();
            notesGrid.scrollIntoView({ behavior: "smooth", block: "start" });
          });
          paginationWrap.appendChild(btn);
        }
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        activeQuery = searchInput.value.trim().toLowerCase();
        currentPage = 1;
        renderNotes();
      });
    }

    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.category || "all";
        currentPage = 1;
        renderNotes();
      });
    });

    renderNotes();
  }

  /* ---------- Set active nav link ---------- */
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link, .mobile-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* =========================================================
     PREMIUM UI ENHANCEMENTS
     Scroll progress bar, animated title underline, cursor
     spotlight glow on cards, product 3D tilt, and site-wide
     magnetic buttons (outside the homepage hero, which already
     has its own richer version in hero-fx.js).
     ========================================================= */

  const hasHoverFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotionUI = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll Progress Bar ---------- */
  if (!reducedMotionUI) {
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(progressBar);

    function updateScrollProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
    }
    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
  }

  /* ---------- Section Title Underline Reveal ---------- */
  const titleTargets = document.querySelectorAll(".section-title");
  if ("IntersectionObserver" in window && titleTargets.length) {
    const titleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            titleObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    titleTargets.forEach((el) => titleObserver.observe(el));
  } else {
    titleTargets.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Cursor Spotlight Glow (why-cards, note-cards, shop cards) ---------- */
  if (hasHoverFine && !reducedMotionUI) {
    document.querySelectorAll(".why-card, .note-card, body.shop-page .product-card").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--mx", x + "%");
        el.style.setProperty("--my", y + "%");
      });
    });
  }

  /* ---------- Product Card 3D Tilt ---------- */
  if (hasHoverFine && !reducedMotionUI) {
    const TILT_MAX = 7;
    document.querySelectorAll(".product-media").forEach((media) => {
      media.addEventListener("mousemove", (e) => {
        const rect = media.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;
        const rotateY = (relX - 0.5) * TILT_MAX * 2;
        const rotateX = (0.5 - relY) * TILT_MAX * 2;
        media.classList.add("tilting");
        media.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      media.addEventListener("mouseleave", () => {
        media.classList.remove("tilting");
        media.style.transform = "";
      });
    });
  }

  /* ---------- Magnetic Buttons (site-wide, outside the homepage hero) ---------- */
  if (hasHoverFine && !reducedMotionUI) {
    const MAGNETIC_STRENGTH = 0.3;
    document.querySelectorAll(".btn-magnetic").forEach((btn) => {
      if (btn.closest("#hero-spotlight")) return; /* hero-fx.js already handles these */
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate(${relX * MAGNETIC_STRENGTH}px, ${relY * MAGNETIC_STRENGTH}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Marketplace Links Handler (Footer & Sitewide) ---------- */
  function bindMarketplaceLinks() {
    const config = window.MIRELLON_CONFIG?.marketplace || {};

    document.querySelectorAll("[data-store], #footer-shopee, #footer-tokopedia, #footer-tiktok").forEach((link) => {
      const store = link.dataset.store || (link.id ? link.id.replace("footer-", "") : "");
      if (!store) return;

      const url = config[store];
      if (url && url.trim() !== "") {
        link.setAttribute("href", url);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener");
      }

      link.addEventListener("click", (e) => {
        const currentUrl = config[store] || (link.getAttribute("href") && link.getAttribute("href") !== "#" ? link.getAttribute("href") : "");
        if (currentUrl && currentUrl.trim() !== "" && currentUrl !== "#") {
          if (link.getAttribute("href") === "#") {
            e.preventDefault();
            window.open(currentUrl, "_blank", "noopener");
          }
        } else {
          e.preventDefault();
          const storeName = store.charAt(0).toUpperCase() + store.slice(1);
          alert(`Link toko ${storeName} belum diisi. Anda dapat mengaturnya pada js/main.js.`);
        }
      });
    });
  }
  bindMarketplaceLinks();

  /* ---------- Luxury Announcement Bar Dismiss ---------- */
  const topBar = document.querySelector(".announcement-bar");
  const topBarClose = document.querySelector(".announcement-close");
  if (topBar && topBarClose) {
    if (sessionStorage.getItem("mirellon-topbar-dismissed") === "true") {
      topBar.style.display = "none";
    }
    topBarClose.addEventListener("click", () => {
      topBar.classList.add("dismissed");
      setTimeout(() => {
        topBar.style.display = "none";
      }, 300);
      try { sessionStorage.setItem("mirellon-topbar-dismissed", "true"); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- FAQ Accordion ---------- */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      const questionBtn = item.querySelector(".faq-question");
      if (!questionBtn) return;
      questionBtn.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove("active");
            const otherBtn = other.querySelector(".faq-question");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          }
        });
        if (isOpen) {
          item.classList.remove("active");
          questionBtn.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("active");
          questionBtn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }
  initFaqAccordion();

  /* ---------- Interactive Scent Match Quiz ---------- */
  function initScentQuiz() {
    const quizWrap = document.querySelector("#scent-quiz");
    if (!quizWrap) return;

    const steps = quizWrap.querySelectorAll(".quiz-step");
    const progressFill = quizWrap.querySelector(".quiz-progress-fill");
    const stepCountEl = quizWrap.querySelector(".quiz-current-step");
    const resultCard = quizWrap.querySelector(".quiz-result-card");
    const quizBody = quizWrap.querySelector(".quiz-body");
    const restartBtn = quizWrap.querySelector(".quiz-restart-btn");

    let currentStep = 1;
    const answers = { persona: "", occasion: "", notes: "" };

    const quizRecommendations = {
      "deep-horizon": {
        name: "Deep Horizon",
        gender: "Men / Signature",
        category: "Fresh Woody & Spicy",
        notes: "Top: Citrus, Bergamot • Heart: Lavender, Geranium • Base: Amber, Cedarwood",
        desc: "Kombinasi segar dan maskulin yang memancarkan aura ketegasan, profesionalisme, dan kepercayaan diri tanpa batas.",
        image: "images/deep-horizon.png",
        match: "98% Match",
        tokopedia: "https://tk.tokopedia.com/ZSVDJ2eSw/",
        tiktok: "https://www.tiktok.com/@mirellon_parfum?_r=1&_t=ZS-991wJdPSrNV",
        waText: "Halo Mirellon Parfum, hasil kuis Scent Finder saya adalah Deep Horizon. Saya ingin memesan parfum ini.",
      },
      "floral-kiss": {
        name: "Floral Kiss",
        gender: "Women / Romance",
        category: "Romantic Floral & Powdery",
        notes: "Top: White Flowers • Heart: Damask Rose, Peony • Base: Soft Musk, Warm Amber",
        desc: "Nuansa floral yang manis, lembut, dan memikat. Sangat ideal untuk momen romantis dan memancarkan pesona anggun alami.",
        image: "images/floral-kiss.png",
        match: "97% Match",
        tokopedia: "https://tk.tokopedia.com/ZSVDJ2eSw/",
        tiktok: "https://www.tiktok.com/@mirellon_parfum?_r=1&_t=ZS-991wJdPSrNV",
        waText: "Halo Mirellon Parfum, hasil kuis Scent Finder saya adalah Floral Kiss. Saya ingin memesan parfum ini.",
      },
      "fleur-voyage": {
        name: "Fleur Voyage",
        gender: "Women & Unisex / Haute",
        category: "Fresh Fruity Floral & Tuberose",
        notes: "Top: Juicy Pear, Lychee • Heart: French Peony, White Jasmine • Base: White Musk, Tuberose",
        desc: "Aroma mewah, ceria, dan memikat hati yang menghadirkan kesan mewah modern setiap saat sepanjang hari.",
        image: "images/fleur-voyage.png",
        match: "99% Match",
        tokopedia: "https://tk.tokopedia.com/ZSVDJ2eSw/",
        tiktok: "https://www.tiktok.com/@mirellon_parfum?_r=1&_t=ZS-991wJdPSrNV",
        waText: "Halo Mirellon Parfum, hasil kuis Scent Finder saya adalah Fleur Voyage. Saya ingin memesan parfum ini.",
      },
    };

    function updateStepUI() {
      steps.forEach((step) => {
        const stepNum = parseInt(step.dataset.step, 10);
        step.classList.toggle("active", stepNum === currentStep);
      });
      if (progressFill) progressFill.style.width = ((currentStep - 1) / 3) * 100 + "%";
      if (stepCountEl) stepCountEl.textContent = currentStep;
    }

    function calculateMatch() {
      // Logic mapping based on user responses
      if (answers.persona === "men" || answers.notes === "woody") {
        return "deep-horizon";
      } else if (answers.persona === "women" && (answers.notes === "floral" || answers.occasion === "romantic")) {
        return "floral-kiss";
      } else {
        return "fleur-voyage";
      }
    }

    function showResult(productId) {
      const data = quizRecommendations[productId] || quizRecommendations["fleur-voyage"];
      if (progressFill) progressFill.style.width = "100%";
      quizBody.style.display = "none";
      resultCard.style.display = "block";

      resultCard.querySelector(".result-match-badge").textContent = data.match;
      resultCard.querySelector(".result-img").src = data.image;
      resultCard.querySelector(".result-img").alt = data.name;
      resultCard.querySelector(".result-category").textContent = data.category;
      resultCard.querySelector(".result-title").textContent = data.name;
      resultCard.querySelector(".result-notes").textContent = data.notes;
      resultCard.querySelector(".result-desc").textContent = data.desc;

      const waBtn = resultCard.querySelector(".result-btn-wa");
      if (waBtn) {
        waBtn.href = `https://wa.me/6282119027766?text=${encodeURIComponent(data.waText)}`;
      }
      const tokpedBtn = resultCard.querySelector(".result-btn-tokopedia");
      if (tokpedBtn) tokpedBtn.href = data.tokopedia;
      const tiktokBtn = resultCard.querySelector(".result-btn-tiktok");
      if (tiktokBtn) tiktokBtn.href = data.tiktok;

      resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    quizWrap.querySelectorAll(".quiz-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        const stepNum = parseInt(opt.closest(".quiz-step").dataset.step, 10);
        const val = opt.dataset.val;

        if (stepNum === 1) answers.persona = val;
        if (stepNum === 2) answers.occasion = val;
        if (stepNum === 3) answers.notes = val;

        if (currentStep < 3) {
          currentStep++;
          updateStepUI();
        } else {
          const matchId = calculateMatch();
          showResult(matchId);
        }
      });
    });

    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        currentStep = 1;
        answers.persona = "";
        answers.occasion = "";
        answers.notes = "";
        quizBody.style.display = "block";
        resultCard.style.display = "none";
        updateStepUI();
      });
    }
  }
  initScentQuiz();

  /* ---------- Interactive Olfactory Notes Explorer (notes.html) ---------- */
  function initNotesExplorer() {
    const explorer = document.querySelector("#olfactory-explorer");
    if (!explorer) return;

    const tabs = explorer.querySelectorAll(".pyramid-tier-btn");
    const contents = explorer.querySelectorAll(".tier-content-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetTier = tab.dataset.tier;
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        contents.forEach((content) => {
          if (content.dataset.tier === targetTier) {
            content.classList.add("active");
          } else {
            content.classList.remove("active");
          }
        });
      });
    });
  }
  initNotesExplorer();
})();


  // Mouse Parallax for Hero Editorial Image
  const heroVisual = document.querySelector('.editorial-parallax-wrapper');
  if (heroVisual) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15; // Max 15px move
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      // We apply via custom properties so it doesn't override the CSS animations
      heroVisual.style.setProperty('--parallax-x', x + 'px');
      heroVisual.style.setProperty('--parallax-y', y + 'px');
    });
  }
