/* =========================================================
   MIRELLON PARFUM — HERO-FX.JS
   Custom cursor, magnetic buttons, and smooth bottle parallax
   ========================================================= */

(function () {
  "use strict";

  const hero = document.getElementById("hero-spotlight");
  if (!hero) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Skip cursor + magnetic buttons on touch devices or reduced motion */
  if (!hasHover || prefersReducedMotion) return;

  /* ---------- Custom elegant cursor ---------- */
  const cursor = document.getElementById("custom-cursor");
  if (cursor) {
    let mouse = { x: -100, y: -100 };
    let smooth = { x: -100, y: -100 };

    hero.addEventListener("mouseenter", () => cursor.classList.add("active"));
    hero.addEventListener("mouseleave", () => cursor.classList.remove("active"));
    hero.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const interactive = hero.querySelectorAll("a, button");
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
    });

    function cursorLoop() {
      smooth.x += (mouse.x - smooth.x) * 0.18;
      smooth.y += (mouse.y - smooth.y) * 0.18;
      cursor.style.transform = `translate(${smooth.x}px, ${smooth.y}px) translate(-50%, -50%)`;
      requestAnimationFrame(cursorLoop);
    }
    cursorLoop();
  }

  /* ---------- Magnetic buttons ---------- */
  const magneticBtns = hero.querySelectorAll(".btn-magnetic");
  const MAGNETIC_STRENGTH = 0.35;

  magneticBtns.forEach((btn) => {
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

  /* ---------- Subtle mouse parallax on Editorial perfume artwork ---------- */
  const editorialImg = hero.querySelector(".editorial-artwork-img");
  if (editorialImg) {
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      editorialImg.style.transform = `translate(${x * 16}px, ${y * 10}px) scale(1.01)`;
    });
    hero.addEventListener("mouseleave", () => {
      editorialImg.style.transform = "";
    });
  }
})();