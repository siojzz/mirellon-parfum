
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("img-slider");
  if (!slider) return;

  const btnPrev = document.getElementById("wheel-prev");
  const btnNext = document.getElementById("wheel-next");
  const items = document.querySelectorAll(".img-item");
  const infoCard = document.getElementById("wheel-info-card");
  
  const tTitle = document.getElementById("wheel-title");
  const tPrice = document.getElementById("wheel-price");
  const tDesc = document.getElementById("wheel-desc");
  const tFamily = document.getElementById("wheel-family");
  const tTop = document.getElementById("wheel-top");
  const tHeart = document.getElementById("wheel-heart");
  const tBase = document.getElementById("wheel-base");
  const tCurrent = document.getElementById("wheel-current");
  const tNumber = document.getElementById("wheel-number");
  const buyBtn = document.getElementById("wheel-buy-btn");

  const products = [
    {
      name: "Deep Horizon", price: "Rp 79.000", family: "Fresh Woody",
      top: "Bergamot", heart: "Lavender", base: "Cedarwood",
      desc: "Komposisi segar dan maskulin dengan kedalaman kayu yang tenang—dirancang untuk kehadiran yang tegas tanpa terasa berlebihan."
    },
    {
      name: "Floral Kiss", price: "Rp 79.000", family: "Romantic Floral",
      top: "White Flowers", heart: "Rose & Peony", base: "Soft Musk",
      desc: "Buket bunga yang lembut, modern, dan intim. Sebuah aroma romantis dengan jejak musk yang halus di kulit."
    },
    {
      name: "Fleur Voyage", price: "Rp 79.000", family: "Fruity Floral",
      top: "Pear & Lychee", heart: "Peony & Jasmine", base: "White Musk",
      desc: "Kilau buah pir dan lychee bertemu bunga putih yang anggun—cerah, memikat, dan mudah dikenali sejak semprotan pertama."
    },
    {
      name: "Golden Ember", price: "Rp 79.000", family: "Oriental Spicy",
      top: "Bergamot", heart: "Cinnamon", base: "Amber",
      desc: "Rempah hangat dan amber berlapis membentuk aura yang kaya, berani, dan berkelas untuk momen setelah matahari terbenam."
    },
    {
      name: "Mystic", price: "Rp 79.000", family: "Soft Floral Woody",
      top: "Bergamot", heart: "Jasmine", base: "Sandalwood",
      desc: "Melati yang bercahaya di atas sandalwood lembut. Tenang, misterius, dan meninggalkan kesan personal yang hangat."
    },
    {
      name: "Lust", price: "Rp 89.000", family: "Aquatic Musk",
      top: "Sea Salt", heart: "Lavender", base: "Musk",
      desc: "Kesegaran mineral bertemu musk yang bersih. Sebuah komposisi uniseks yang sensual, ringan, dan sangat modern."
    },
    {
      name: "Silk Petal", price: "Rp 79.000", family: "Powdery Floral",
      top: "White Petals", heart: "Iris", base: "Clean Musk",
      desc: "Nuansa kelopak dan bedak yang terasa seperti sutra—lembut, rapi, dan mewah dengan cara yang sangat understated."
    },
    {
      name: "Velvet Noir", price: "Rp 79.000", family: "Dark Floral",
      top: "Black Pepper", heart: "Night Bloom", base: "Patchouli",
      desc: "Bunga malam, rempah, dan patchouli menciptakan jejak gelap yang halus—dramatis, dewasa, dan penuh daya tarik."
    }
  ];

  let currentIndex = 0;
  const totalItems = items.length;

  function updateWheel() {
    // 360 / 8 = 45 derajat per rotasi
    const rotation = currentIndex * 45;
    slider.style.transform = `rotate(${rotation}deg)`;

    const normalizedIndex = ((currentIndex % totalItems) + totalItems) % totalItems;
    
    items.forEach((item, idx) => {
      if (idx === normalizedIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    infoCard.classList.remove("changed");
    infoCard.classList.add("changing");
    
    setTimeout(() => {
      const p = products[normalizedIndex];
      tTitle.textContent = p.name;
      tPrice.textContent = p.price;
      tDesc.textContent = p.desc;
      if (tFamily) tFamily.textContent = p.family;
      if (tTop) tTop.textContent = p.top;
      if (tHeart) tHeart.textContent = p.heart;
      if (tBase) tBase.textContent = p.base;
      if (tCurrent) tCurrent.textContent = String(normalizedIndex + 1).padStart(2, "0");
      if (tNumber) tNumber.textContent = String(normalizedIndex + 1).padStart(2, "0");
      if (buyBtn) {
        const message = `Halo Mirellon Parfum, saya ingin memesan ${p.name} ukuran 35 ml (${p.price}).`;
        buyBtn.href = `https://wa.me/6282119027766?text=${encodeURIComponent(message)}`;
        buyBtn.setAttribute("aria-label", `Pesan ${p.name} melalui WhatsApp`);
      }
      
      infoCard.classList.remove("changing");
      infoCard.classList.add("changed");
    }, 300);
  }

  btnPrev.addEventListener("click", () => {
    currentIndex--;
    updateWheel();
  });

  btnNext.addEventListener("click", () => {
    currentIndex++;
    updateWheel();
  });
  
  // Fitur tambahan: Klik botol untuk langsung memutar ke produk tersebut
  items.forEach((item, idx) => {
    item.addEventListener("click", () => {
       // Menghitung selisih langkah tercepat (arah putaran)
       let diff = idx - (((currentIndex % totalItems) + totalItems) % totalItems);
       if (diff > totalItems / 2) diff -= totalItems;
       else if (diff < -totalItems / 2) diff += totalItems;
       
       currentIndex += diff;
       updateWheel();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      currentIndex--;
      updateWheel();
    } else if (event.key === "ArrowRight") {
      currentIndex++;
      updateWheel();
    }
  });

  updateWheel();
});
