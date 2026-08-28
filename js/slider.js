/* =========================================================
   MIRELLON PARFUM — SLIDER.JS
   Auto-playing testimonial slider used on the homepage.
   ========================================================= */

(function () {
  "use strict";

  const track = document.querySelector(".reviews-track");
  if (!track) return;

  const slides = Array.from(track.children);
  const dotsWrap = document.querySelector(".reviews-dots");
  const prevBtn = document.querySelector(".reviews-nav .prev");
  const nextBtn = document.querySelector(".reviews-nav .next");
  const currentEl = document.querySelector(".reviews-current");
  const totalEl = document.querySelector(".reviews-total");
  const slider = document.querySelector(".reviews-slider");

  let index = 0;
  let autoTimer = null;
  const AUTO_DELAY = 5500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (totalEl) totalEl.textContent = String(slides.length).padStart(2, "0");

  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Tampilkan ulasan ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsWrap) return;
    Array.from(dotsWrap.children).forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    if (currentEl) currentEl.textContent = String(index + 1).padStart(2, "0");
    updateDots();
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
    restartAuto();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  function restartAuto() {
    if (autoTimer) clearInterval(autoTimer);
    if (reduceMotion || document.hidden) return;
    autoTimer = setInterval(next, AUTO_DELAY);
  }

  function pauseAuto() {
    if (!autoTimer) return;
    clearInterval(autoTimer);
    autoTimer = null;
  }

  if (slider) {
    slider.addEventListener("mouseenter", pauseAuto);
    slider.addEventListener("mouseleave", restartAuto);
    slider.addEventListener("focusin", pauseAuto);
    slider.addEventListener("focusout", restartAuto);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseAuto();
    else restartAuto();
  });

  /* Swipe support */
  let startX = 0;
  track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) prev();
    else if (diff < -50) next();
  }, { passive: true });

  render();
  restartAuto();
})();
