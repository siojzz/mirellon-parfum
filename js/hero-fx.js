/* =========================================================
   MIRELLON PARFUM — HERO-FX.JS
   Premium hero interactions: parallax, floating, cinematic zoom,
   cursor tracking, smooth reveal sequencing
   ========================================================= */

(function () {
  "use strict";

  const hero = document.getElementById("hero-spotlight");
  if (!hero) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const hasHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  /* ---------- Product Image — Reveal Sequencing ---------- */
  const editorialImg = hero.querySelector(".editorial-artwork-img");

  if (editorialImg) {
    // After initial CSS reveal animation completes, add the floating class
    editorialImg.addEventListener("animationend", function handler(e) {
      if (e.animationName === "heroImageReveal") {
        editorialImg.removeEventListener("animationend", handler);

        if (!prefersReducedMotion) {
          // Small delay before starting ambient floating
          setTimeout(() => {
            editorialImg.classList.add("hero-floating");
          }, 400);
        }
      }
    });
  }

  /* Skip interactive effects on touch devices or reduced motion */
  if (!hasHover || prefersReducedMotion) return;

  /* ---------- Subtle Mouse Parallax on Product Image ---------- */
  if (editorialImg) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    const PARALLAX_STRENGTH_X = 14;
    const PARALLAX_STRENGTH_Y = 8;
    const LERP_FACTOR = 0.06;

    function updateParallax() {
      currentX += (targetX - currentX) * LERP_FACTOR;
      currentY += (targetY - currentY) * LERP_FACTOR;

      editorialImg.style.setProperty("--parallax-x", `${currentX}px`);
      editorialImg.style.setProperty("--parallax-y", `${currentY}px`);

      // Direct transform for smoother feel when not using CSS animation
      if (!editorialImg.classList.contains("hero-floating") &&
          !editorialImg.classList.contains("hero-active")) {
        editorialImg.style.transform =
          `translate(${currentX}px, ${currentY}px) scale(1)`;
      }

      rafId = requestAnimationFrame(updateParallax);
    }

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;

      targetX = normalizedX * PARALLAX_STRENGTH_X;
      targetY = normalizedY * PARALLAX_STRENGTH_Y;
    });

    hero.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
    });

    // Start parallax loop
    rafId = requestAnimationFrame(updateParallax);

    // Clean up on page hide
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!document.hidden && !rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    });
  }

  /* ---------- Custom Elegant Cursor ---------- */
  const cursor = document.getElementById("custom-cursor");
  if (cursor) {
    let mouse = { x: -100, y: -100 };
    let smooth = { x: -100, y: -100 };

    hero.addEventListener("mouseenter", () => cursor.classList.add("active"));
    hero.addEventListener("mouseleave", () =>
      cursor.classList.remove("active")
    );
    hero.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const interactive = hero.querySelectorAll("a, button");
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", () =>
        cursor.classList.add("hovering")
      );
      el.addEventListener("mouseleave", () =>
        cursor.classList.remove("hovering")
      );
    });

    function cursorLoop() {
      smooth.x += (mouse.x - smooth.x) * 0.15;
      smooth.y += (mouse.y - smooth.y) * 0.15;
      cursor.style.transform = `translate(${smooth.x}px, ${smooth.y}px) translate(-50%, -50%)`;
      requestAnimationFrame(cursorLoop);
    }
    cursorLoop();
  }

  /* ---------- Magnetic Buttons ---------- */
  const magneticBtns = hero.querySelectorAll(".btn-magnetic");
  const MAGNETIC_STRENGTH = 0.3;

  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${relX * MAGNETIC_STRENGTH}px, ${
        relY * MAGNETIC_STRENGTH
      }px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });

  /* ---------- Navbar Glassmorphism on Scroll ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    let lastScroll = 0;
    const scrollThreshold = 80;

    function handleHeaderScroll() {
      const scrollY = window.scrollY;

      if (scrollY > scrollThreshold) {
        header.classList.add("solid", "hero-scrolled");
        header.classList.remove("transparent");
      } else {
        header.classList.remove("solid", "hero-scrolled");
        header.classList.add("transparent");
      }

      lastScroll = scrollY;
    }

    // Use passive scroll listener for performance
    window.addEventListener("scroll", handleHeaderScroll, { passive: true });
    // Initialize on load
    handleHeaderScroll();
  }
})();