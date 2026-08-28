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

  /* ---------- Contact Form: validation + WhatsApp handoff ---------- */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const status = document.getElementById("form-status");
    const toast = document.getElementById("contact-toast");
    const toastClose = toast ? toast.querySelector(".contact-toast-close") : null;
    const submitButton = contactForm.querySelector(".contact-submit-btn");
    const submitLabel = contactForm.querySelector(".contact-submit-label");
    const fields = {
      name: contactForm.querySelector('[name="name"]'),
      email: contactForm.querySelector('[name="email"]'),
      subject: contactForm.querySelector('[name="subject"]'),
      message: contactForm.querySelector('[name="message"]'),
    };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    let toastTimer = null;

    function getFieldError(field) {
      const value = field.value.trim();
      if (!value) {
        const emptyMessages = {
          name: "Nama wajib diisi.",
          email: "Email wajib diisi.",
          subject: "Subjek wajib diisi.",
          message: "Pesan wajib diisi.",
        };
        return emptyMessages[field.name] || "Kolom ini wajib diisi.";
      }
      if (field.name === "name" && value.length < 2) return "Nama minimal 2 karakter.";
      if (field.name === "email" && !emailPattern.test(value)) return "Format email belum benar.";
      if (field.name === "subject" && value.length < 3) return "Subjek minimal 3 karakter.";
      if (field.name === "message" && value.length < 10) return "Pesan minimal 10 karakter.";
      return "";
    }

    function setFieldState(field, errorMessage) {
      const fieldWrap = field.closest(".field");
      const error = document.getElementById(field.getAttribute("aria-describedby"));
      const hasError = Boolean(errorMessage);

      field.setAttribute("aria-invalid", String(hasError));
      if (fieldWrap) {
        fieldWrap.classList.toggle("has-error", hasError);
        fieldWrap.classList.toggle("has-valid", !hasError && Boolean(field.value.trim()));
      }
      if (error) error.textContent = errorMessage;
      return !hasError;
    }

    function validateField(field) {
      return setFieldState(field, getFieldError(field));
    }

    function hideToast() {
      if (!toast) return;
      toast.classList.remove("show");
      window.setTimeout(() => {
        if (!toast.classList.contains("show")) toast.hidden = true;
      }, 280);
    }

    function showToast() {
      if (!toast) return;
      window.clearTimeout(toastTimer);
      toast.hidden = false;
      window.requestAnimationFrame(() => toast.classList.add("show"));
      toastTimer = window.setTimeout(hideToast, 6500);
    }

    Object.values(fields).forEach((field) => {
      if (!field) return;
      field.addEventListener("blur", () => {
        field.dataset.touched = "true";
        validateField(field);
      });
      field.addEventListener("input", () => {
        if (field.dataset.touched === "true" || field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fieldList = Object.values(fields).filter(Boolean);
      fieldList.forEach((field) => {
        field.dataset.touched = "true";
      });
      const isValid = fieldList.map(validateField).every(Boolean);

      if (!isValid) {
        const firstInvalid = fieldList.find((field) => field.getAttribute("aria-invalid") === "true");
        if (firstInvalid) firstInvalid.focus();
        if (status) {
          status.className = "form-status is-error";
          status.textContent = "Mohon periksa kembali kolom yang ditandai.";
        }
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add("is-loading");
        submitButton.setAttribute("aria-busy", "true");
      }
      if (submitLabel) submitLabel.textContent = "Menyiapkan WhatsApp";
      if (status) {
        status.className = "form-status is-loading";
        status.textContent = "Sedang menyiapkan pesan Anda...";
      }

      const whatsappNumber = contactForm.dataset.whatsappNumber || "6282119027766";
      const whatsappMessage = [
        "Halo Mirellon Parfum,",
        "",
        "Nama: " + fields.name.value.trim(),
        "Email: " + fields.email.value.trim(),
        "Subjek: " + fields.subject.value.trim(),
        "",
        "Pesan:",
        fields.message.value.trim(),
      ].join("\n");
      const whatsappUrl = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(whatsappMessage);
      const whatsappWindow = window.open("", "_blank");
      if (whatsappWindow) whatsappWindow.opener = null;

      window.setTimeout(() => {
        if (whatsappWindow && !whatsappWindow.closed) {
          whatsappWindow.location.replace(whatsappUrl);
        } else {
          window.location.href = whatsappUrl;
        }

        if (status) {
          status.className = "form-status is-success";
          status.textContent = "WhatsApp telah dibuka. Silakan periksa lalu kirim pesan Anda.";
        }
        showToast();
        contactForm.reset();
        fieldList.forEach((field) => {
          delete field.dataset.touched;
          field.setAttribute("aria-invalid", "false");
          const fieldWrap = field.closest(".field");
          if (fieldWrap) fieldWrap.classList.remove("has-error", "has-valid");
          const error = document.getElementById(field.getAttribute("aria-describedby"));
          if (error) error.textContent = "";
        });
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove("is-loading");
          submitButton.removeAttribute("aria-busy");
        }
        if (submitLabel) submitLabel.textContent = "Kirim Pesan";
      }, 550);
    });

    if (toastClose) toastClose.addEventListener("click", hideToast);
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
    const totalStepsEl = quizWrap.querySelector(".quiz-total-steps");
    const resultCard = quizWrap.querySelector(".quiz-result-card");
    const quizBody = quizWrap.querySelector(".quiz-body");
    const restartBtn = quizWrap.querySelector(".quiz-restart-btn");
    const quizContainer = quizWrap.querySelector(".quiz-container");
    const quizOptions = Array.from(quizWrap.querySelectorAll(".quiz-option"));

    const totalSteps = steps.length;
    const maxScorePerStep = 3;
    const transitionDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 280;
    let currentStep = 1;
    let quizLocked = false;

    const quizRecommendations = {
      "deep-horizon": {
        name: "Deep Horizon",
        gender: "Men / Signature",
        category: "Fresh Woody & Spicy",
        notes: "Top: Litchi, Mandarin Orange, Lotus, Bergamot • Middle: Sea Notes, Orange, Brazilian Rosewood • Base: Tonka Bean, Musk, Amber, Benzoin",
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
        notes: "Top: Bergamot, Sweet Pea • Middle: Peony, Damask Rose • Base: White Musk",
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
        notes: "Top: Orange Blossom, Bergamot • Middle: Tuberose, Indian Jasmine • Base: Madagascar Vanilla, White Musk, Virginia Cedar",
        desc: "Aroma mewah, ceria, dan memikat hati yang menghadirkan kesan mewah modern setiap saat sepanjang hari.",
        image: "images/fleur-voyage.png",
        match: "99% Match",
        tokopedia: "https://tk.tokopedia.com/ZSVDJ2eSw/",
        tiktok: "https://www.tiktok.com/@mirellon_parfum?_r=1&_t=ZS-991wJdPSrNV",
        waText: "Halo Mirellon Parfum, hasil kuis Scent Finder saya adalah Fleur Voyage. Saya ingin memesan parfum ini.",
      },
      "golden-valor": {
        name: "Golden Valor",
        gender: "Unisex / Statement",
        category: "Fruity Amber Woody",
        notes: "Top: Plum, Ozonic Notes, Grapefruit, Bergamot • Middle: Hazelnut, Honey, Cedar, Cashmere Wood, Orange Blossom, Jasmine • Base: Amberwood, Patchouli, Vetiver, Oakmoss",
        desc: "Komposisi plum, honey, dan amberwood yang kaya dengan struktur woody-earthy. Berani, mewah, dan ideal untuk momen yang membutuhkan kehadiran kuat.",
        image: "images/golden-ember.png",
        match: "98% Match",
        tokopedia: "https://tk.tokopedia.com/ZSVDJ2eSw/",
        tiktok: "https://www.tiktok.com/@mirellon_parfum?_r=1&_t=ZS-991wJdPSrNV",
        waText: "Halo Mirellon Parfum, hasil kuis Scent Finder saya adalah Golden Valor. Saya ingin memesan parfum ini.",
      },
      mystic: {
        name: "Mystic",
        gender: "Unisex / Intense",
        category: "Oud Amber Resinous",
        notes: "Top: Agarwood Oud, Rose, Incense, Raspberry, Saffron • Middle: Amberwood, Benzoin, Birch • Base: Geranium",
        desc: "Oud, incense, saffron, dan amberwood membentuk aroma gelap yang artistik. Cocok untuk karakter misterius yang menyukai jejak smoky dan resinous.",
        image: "images/mystic.png",
        match: "98% Match",
        tokopedia: "https://tk.tokopedia.com/ZSVDJ2eSw/",
        tiktok: "https://www.tiktok.com/@mirellon_parfum?_r=1&_t=ZS-991wJdPSrNV",
        waText: "Halo Mirellon Parfum, hasil kuis Scent Finder saya adalah Mystic. Saya ingin memesan parfum ini.",
      },
      lust: {
        name: "Lust",
        gender: "Unisex / Sensual",
        category: "Fruity Floral Gourmand",
        notes: "Top: Star Fruit, Italian Mandarin, Boysenberry • Middle: Lotus, Star Jasmine • Base: Vanilla, Caramelized Pear, Musk, Woody Notes",
        desc: "Buah-buahan cerah bertemu lotus, jasmine, vanilla, dan caramelized pear. Playful, hangat, dan sensual dengan dry-down yang menggoda.",
        image: "images/ocean-breeze.png",
        match: "98% Match",
        tokopedia: "https://tk.tokopedia.com/ZSVDJ2eSw/",
        tiktok: "https://www.tiktok.com/@mirellon_parfum?_r=1&_t=ZS-991wJdPSrNV",
        waText: "Halo Mirellon Parfum, hasil kuis Scent Finder saya adalah Lust. Saya ingin memesan parfum ini.",
      },
      "pear-blanche": {
        name: "Pear Blanche",
        gender: "Unisex / Elegant",
        category: "Fruity Floral Musk",
        notes: "Top: King William Pear, Melon • Middle: Freesia, Rose • Base: Patchouli, Amber, Musk, Rhubarb",
        desc: "Pear dan melon yang juicy berpadu dengan freesia, rose, serta dasar patchouli-amber. Segar, polished, dan mudah dikenakan setiap hari.",
        image: "images/silk-petal.png",
        match: "98% Match",
        tokopedia: "https://tk.tokopedia.com/ZSVDJ2eSw/",
        tiktok: "https://www.tiktok.com/@mirellon_parfum?_r=1&_t=ZS-991wJdPSrNV",
        waText: "Halo Mirellon Parfum, hasil kuis Scent Finder saya adalah Pear Blanche. Saya ingin memesan parfum ini.",
      },
      aura: {
        name: "Aura",
        gender: "Unisex / Minimal",
        category: "Citrus Green Musk",
        notes: "Top: Citruses • Middle: Green Notes, Rose • Base: Musk",
        desc: "Citrus, green notes, rose, dan musk dalam komposisi minimal yang bersih. Ringan, modern, dan terasa personal sebagai signature sehari-hari.",
        image: "images/velvet-noir.png",
        match: "98% Match",
        tokopedia: "https://tk.tokopedia.com/ZSVDJ2eSw/",
        tiktok: "https://www.tiktok.com/@mirellon_parfum?_r=1&_t=ZS-991wJdPSrNV",
        waText: "Halo Mirellon Parfum, hasil kuis Scent Finder saya adalah Aura. Saya ingin memesan parfum ini.",
      },
    };

    let scores = Object.fromEntries(
      Object.keys(quizRecommendations).map((productId) => [productId, 0])
    );

    function updateStepUI() {
      steps.forEach((step) => {
        const stepNum = parseInt(step.dataset.step, 10);
        const isActive = stepNum === currentStep;
        step.classList.toggle("active", isActive);
        step.setAttribute("aria-hidden", String(!isActive));
      });
      quizOptions.forEach((option) => {
        option.classList.remove("is-selected");
        option.setAttribute("aria-pressed", "false");
      });
      if (progressFill) progressFill.style.width = (currentStep / totalSteps) * 100 + "%";
      if (stepCountEl) stepCountEl.textContent = currentStep;
      if (totalStepsEl) totalStepsEl.textContent = totalSteps;
    }

    function calculateMatch() {
      const [productId, score] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
      return { productId, score };
    }

    function showResult(productId, score) {
      const data = quizRecommendations[productId] || quizRecommendations["fleur-voyage"];
      const maxPossibleScore = totalSteps * maxScorePerStep;
      const matchPercentage = Math.min(99, 84 + Math.round((score / maxPossibleScore) * 15));
      if (progressFill) progressFill.style.width = "100%";
      quizBody.style.display = "none";
      resultCard.style.display = "block";

      resultCard.querySelector(".result-match-badge").textContent = `${matchPercentage}% Match`;
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

    quizOptions.forEach((opt) => {
      opt.setAttribute("aria-pressed", "false");
      opt.addEventListener("click", () => {
        const stepNum = parseInt(opt.closest(".quiz-step").dataset.step, 10);
        if (stepNum !== currentStep || quizLocked) return;

        quizLocked = true;
        if (quizContainer) quizContainer.classList.add("is-busy");
        opt.classList.add("is-selected");
        opt.setAttribute("aria-pressed", "true");

        window.setTimeout(() => {
          (opt.dataset.scores || "").split(",").forEach((entry) => {
            const [productId, value] = entry.split(":");
            if (productId in scores) scores[productId] += Number(value) || 0;
          });

          if (currentStep < totalSteps) {
            currentStep++;
            updateStepUI();
          } else {
            const match = calculateMatch();
            showResult(match.productId, match.score);
          }

          quizLocked = false;
          if (quizContainer) quizContainer.classList.remove("is-busy");
        }, transitionDelay);
      });
    });

    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        currentStep = 1;
        scores = Object.fromEntries(
          Object.keys(quizRecommendations).map((productId) => [productId, 0])
        );
        quizBody.style.display = "block";
        resultCard.style.display = "none";
        quizLocked = false;
        if (quizContainer) quizContainer.classList.remove("is-busy");
        updateStepUI();
      });
    }

    updateStepUI();
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
