/* =========================================================
   MIRELLON PARFUM — MAIN.JS
   Global site behaviors shared across all pages.
   ========================================================= */

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

  /* ---------- Theme (Dark / Light) ---------- */
  const THEME_KEY = "mirellon-theme";
  const root = document.documentElement;
  const themeToggle = document.querySelectorAll("[data-theme-toggle]");

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    themeToggle.forEach((btn) => {
      btn.setAttribute("aria-pressed", theme === "dark");
      const icon = btn.querySelector("[data-theme-icon]");
      if (icon) icon.textContent = theme === "dark" ? "☀" : "☾";
    });
  }

  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem(THEME_KEY) || "light";
  } catch (e) {
    savedTheme = "light";
  }
  applyTheme(savedTheme);

  themeToggle.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    });
  });

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

  /* ---------- FAQ Accordion ---------- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      faqItems.forEach((other) => {
        other.classList.remove("open");
        const otherAnswer = other.querySelector(".faq-answer");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
        other.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

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
})();