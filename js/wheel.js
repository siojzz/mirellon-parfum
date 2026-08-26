/* =========================================================
   MIRELLON — OLFACTORY PRODUCT SHOWCASE
   Editorial product switching with note-led ambient themes.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const showcase = document.querySelector(".olfactory-showcase");
  if (!showcase) return;

  const products = [
    {
      id: "deep-horizon",
      name: "Deep Horizon",
      image: "images/deep-horizon.png",
      price: "Rp 79.000",
      family: "Fresh Woody",
      top: "Litchi, Mandarin Orange, Lotus, Bergamot",
      heart: "Sea Notes, Orange, Brazilian Rosewood",
      base: "Tonka Bean, Musk, Amber, Benzoin",
      desc: "Komposisi segar dan maskulin dengan kedalaman kayu yang tenang—dirancang untuk kehadiran yang tegas tanpa terasa berlebihan.",
      theme: {
        base: "#091114",
        glow: "rgba(78, 134, 153, .34)",
        warm: "rgba(202, 166, 95, .19)",
        line: "rgba(181, 207, 215, .13)",
        accent: "#c9b17b",
      },
    },
    {
      id: "floral-kiss",
      name: "Floral Kiss",
      image: "images/floral-kiss.png",
      price: "Rp 79.000",
      family: "Romantic Floral",
      top: "Bergamot, Sweet Pea",
      heart: "Peony, Damask Rose",
      base: "White Musk",
      desc: "Buket bunga yang lembut, modern, dan intim. Sebuah aroma romantis dengan jejak musk yang halus di kulit.",
      theme: {
        base: "#170f13",
        glow: "rgba(202, 123, 146, .3)",
        warm: "rgba(230, 194, 177, .2)",
        line: "rgba(238, 197, 209, .13)",
        accent: "#d6af9f",
      },
    },
    {
      id: "fleur-voyage",
      name: "Fleur Voyage",
      image: "images/fleur-voyage.png",
      price: "Rp 79.000",
      family: "Fruity Floral",
      top: "Orange Blossom, Bergamot",
      heart: "Tuberose, Indian Jasmine",
      base: "Madagascar Vanilla, White Musk, Virginia Cedar",
      desc: "Kilau buah pir dan lychee bertemu bunga putih yang anggun—cerah, memikat, dan mudah dikenali sejak semprotan pertama.",
      theme: {
        base: "#13140e",
        glow: "rgba(181, 188, 105, .3)",
        warm: "rgba(231, 206, 151, .21)",
        line: "rgba(219, 220, 176, .13)",
        accent: "#d6c88f",
      },
    },
    {
      id: "golden-valor",
      name: "Golden Valor",
      image: "images/golden-ember.png",
      price: "Rp 79.000",
      family: "Oriental Spicy",
      top: "Plum, Ozonic Notes, Grapefruit, Bergamot",
      heart: "Hazelnut, Honey, Cedar, Cashmere Wood, Orange Blossom, Jasmine",
      base: "Amberwood, Patchouli, Vetiver, Oakmoss",
      desc: "Rempah hangat dan amber berlapis membentuk aura yang kaya, berani, dan berkelas untuk momen setelah matahari terbenam.",
      theme: {
        base: "#150c07",
        glow: "rgba(183, 88, 36, .34)",
        warm: "rgba(224, 151, 61, .23)",
        line: "rgba(230, 167, 99, .14)",
        accent: "#d39f5f",
      },
    },
    {
      id: "mystic",
      name: "Mystic",
      image: "images/mystic.png",
      price: "Rp 79.000",
      family: "Soft Floral Woody",
      top: "Agarwood Oud, Rose, Incense, Raspberry, Saffron",
      heart: "Amberwood, Benzoin, Birch",
      base: "Geranium",
      desc: "Melati yang bercahaya di atas sandalwood lembut. Tenang, misterius, dan meninggalkan kesan personal yang hangat.",
      theme: {
        base: "#0e0c13",
        glow: "rgba(102, 78, 133, .34)",
        warm: "rgba(174, 137, 111, .18)",
        line: "rgba(182, 165, 207, .13)",
        accent: "#b7a1c3",
      },
    },
    {
      id: "lust",
      name: "Lust",
      image: "images/ocean-breeze.png",
      price: "Rp 89.000",
      family: "Aquatic Musk",
      top: "Star Fruit, Italian Mandarin, Boysenberry",
      heart: "Lotus, Star Jasmine",
      base: "Vanilla, Caramelized Pear, Musk, Woody Notes",
      desc: "Kesegaran mineral bertemu musk yang bersih. Sebuah komposisi uniseks yang sensual, ringan, dan sangat modern.",
      theme: {
        base: "#071214",
        glow: "rgba(51, 137, 151, .35)",
        warm: "rgba(161, 194, 192, .17)",
        line: "rgba(152, 211, 216, .13)",
        accent: "#8dbfc2",
      },
    },
    {
      id: "pear-blanche",
      name: "Pear Blanche",
      image: "images/silk-petal.png",
      price: "Rp 79.000",
      family: "Powdery Floral",
      top: "King William Pear, Melon",
      heart: "Freesia, Rose",
      base: "Patchouli, Amber, Musk, Rhubarb",
      desc: "Nuansa kelopak dan bedak yang terasa seperti sutra—lembut, rapi, dan mewah dengan cara yang sangat understated.",
      theme: {
        base: "#170f14",
        glow: "rgba(211, 162, 190, .3)",
        warm: "rgba(237, 216, 222, .18)",
        line: "rgba(233, 199, 218, .13)",
        accent: "#d8b5c8",
      },
    },
    {
      id: "aura",
      name: "Aura",
      image: "images/velvet-noir.png",
      price: "Rp 79.000",
      family: "Dark Floral",
      top: "Citruses",
      heart: "Green Notes, Rose",
      base: "Musk",
      desc: "Bunga malam, rempah, dan patchouli menciptakan jejak gelap yang halus—dramatis, dewasa, dan penuh daya tarik.",
      theme: {
        base: "#100709",
        glow: "rgba(126, 29, 48, .36)",
        warm: "rgba(173, 90, 76, .18)",
        line: "rgba(187, 117, 127, .13)",
        accent: "#bc7f79",
      },
    },
  ];

  const elements = {
    prev: document.getElementById("wheel-prev"),
    next: document.getElementById("wheel-next"),
    stage: document.getElementById("product-stage"),
    panel: document.getElementById("wheel-info-card"),
    art: document.getElementById("product-art"),
    image: document.getElementById("showcase-product-image"),
    artNumber: document.getElementById("product-art-number"),
    artCaption: document.getElementById("product-art-caption"),
    current: document.getElementById("wheel-current"),
    number: document.getElementById("wheel-number"),
    title: document.getElementById("wheel-title"),
    family: document.getElementById("wheel-family"),
    desc: document.getElementById("wheel-desc"),
    top: document.getElementById("wheel-top"),
    heart: document.getElementById("wheel-heart"),
    base: document.getElementById("wheel-base"),
    price: document.getElementById("wheel-price"),
    buy: document.getElementById("wheel-buy-btn"),
    rail: document.getElementById("variant-rail"),
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const requestedId = window.location.hash.replace("#", "");
  let currentIndex = Math.max(0, products.findIndex((product) => product.id === requestedId));
  let transitionTimer = null;
  let entranceTimer = null;

  function normalize(index) {
    return (index + products.length) % products.length;
  }

  function buildVariantRail() {
    products.forEach((product, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "variant-rail-button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-label", `Tampilkan ${product.name}`);
      button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><i></i>`;
      button.addEventListener("click", () => updateProduct(index));
      elements.rail.appendChild(button);
    });
  }

  function applyTheme(product) {
    showcase.dataset.product = product.id;
    showcase.style.setProperty("--scent-base", product.theme.base);
    showcase.style.setProperty("--scent-glow", product.theme.glow);
    showcase.style.setProperty("--scent-warm", product.theme.warm);
    showcase.style.setProperty("--scent-line", product.theme.line);
    showcase.style.setProperty("--scent-accent", product.theme.accent);

  }

  function renderProduct(index) {
    currentIndex = normalize(index);
    const product = products[currentIndex];
    const number = String(currentIndex + 1).padStart(2, "0");

    applyTheme(product);
    elements.image.src = product.image;
    elements.image.alt = `Kemasan Mirellon ${product.name} Eau de Parfum`;
    elements.artNumber.textContent = number;
    elements.artCaption.textContent = `35 ML · ${product.family.toUpperCase()}`;
    elements.current.textContent = number;
    elements.number.textContent = number;
    elements.title.textContent = product.name;
    elements.family.textContent = product.family;
    elements.desc.textContent = product.desc;
    elements.top.textContent = product.top;
    elements.heart.textContent = product.heart;
    elements.base.textContent = product.base;
    elements.price.textContent = product.price;

    const message = `Halo Mirellon Parfum, saya ingin memesan ${product.name} ukuran 35 ml (${product.price}).`;
    elements.buy.href = `https://wa.me/6282119027766?text=${encodeURIComponent(message)}`;
    elements.buy.setAttribute("aria-label", `Pesan ${product.name} melalui WhatsApp`);
    elements.art.setAttribute("aria-label", `Tampilkan aroma setelah ${product.name}`);

    elements.rail.querySelectorAll(".variant-rail-button").forEach((button, railIndex) => {
      const active = railIndex === currentIndex;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });

    try {
      history.replaceState(null, "", `#${product.id}`);
    } catch (error) {
      /* Hash state is a progressive enhancement. */
    }
  }

  function updateProduct(index, immediate = false) {
    const nextIndex = normalize(index);
    if (!immediate && nextIndex === currentIndex) return;
    const direction = index >= currentIndex ? "next" : "prev";

    window.clearTimeout(transitionTimer);
    window.clearTimeout(entranceTimer);

    if (immediate || reduceMotion) {
      renderProduct(nextIndex);
      showcase.classList.remove("is-changing", "is-entering", "direction-next", "direction-prev");
      return;
    }

    showcase.classList.remove("is-entering", "direction-next", "direction-prev");
    showcase.classList.add(`direction-${direction}`);
    showcase.classList.add("is-changing");
    transitionTimer = window.setTimeout(() => {
      renderProduct(nextIndex);
      showcase.classList.remove("is-changing");
      void showcase.offsetWidth;
      showcase.classList.add("is-entering");
      entranceTimer = window.setTimeout(() => showcase.classList.remove("is-entering"), 780);
    }, 220);
  }

  elements.prev.addEventListener("click", () => updateProduct(currentIndex - 1));
  elements.next.addEventListener("click", () => updateProduct(currentIndex + 1));
  elements.art.addEventListener("click", () => updateProduct(currentIndex + 1));

  elements.stage.addEventListener("pointermove", (event) => {
    if (reduceMotion || event.pointerType === "touch") return;

    const rect = elements.stage.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

    elements.stage.style.setProperty("--pointer-x", `${x * 100}%`);
    elements.stage.style.setProperty("--pointer-y", `${y * 100}%`);
    elements.art.style.setProperty("--tilt-x", `${(0.5 - y) * 7}deg`);
    elements.art.style.setProperty("--tilt-y", `${(x - 0.5) * 9}deg`);
  });

  elements.stage.addEventListener("pointerleave", () => {
    elements.stage.style.setProperty("--pointer-x", "38%");
    elements.stage.style.setProperty("--pointer-y", "48%");
    elements.art.style.setProperty("--tilt-x", "0deg");
    elements.art.style.setProperty("--tilt-y", "0deg");
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.matches("input, textarea, select")) return;

    if (event.key === "ArrowLeft") updateProduct(currentIndex - 1);
    if (event.key === "ArrowRight") updateProduct(currentIndex + 1);
  });

  let touchStartX = 0;
  elements.stage.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  elements.stage.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (distance > 55) updateProduct(currentIndex - 1);
    if (distance < -55) updateProduct(currentIndex + 1);
  }, { passive: true });

  buildVariantRail();
  updateProduct(currentIndex, true);

  window.setTimeout(() => {
    products.forEach((product) => {
      const image = new Image();
      image.src = product.image;
    });
  }, 600);
});
