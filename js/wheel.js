
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
      top: "Litchi, Mandarin Orange, Lotus, Bergamot", 
      heart: "Sea Notes, Orange, Brazilian Rosewood", 
      base: "Tonka Bean, Musk, Amber, Benzoin",
      desc: "Kombinasi segar laut dan kehangatan amber yang dirancang untuk kehadiran maskulin yang tegas."
    },
    {
      name: "Floral Kiss", price: "Rp 79.000", family: "Romantic Floral",
      top: "Bergamot, Sweet Pea", 
      heart: "Peony, Damask Rose", 
      base: "White Musk",
      desc: "Buket bunga yang manis dan memikat. Aroma romantis dengan sentuhan peony dan musk yang anggun."
    },
    {
      name: "Fleur Voyage", price: "Rp 79.000", family: "White Floral",
      top: "Orange Blossom, Bergamot", 
      heart: "Tuberose, Indian Jasmine", 
      base: "Madagascar Vanilla, White Musk, Virginia Cedar",
      desc: "Harmoni elegan bunga putih dan kelembutan vanilla yang menciptakan jejak memikat dan mewah."
    },
    {
      name: "Golden Valor", price: "Rp 79.000", family: "Woody Spicy",
      top: "Plum, Ozonic Notes, Grapefruit, Bergamot", 
      heart: "Hazelnut, Honey, Cedar, Cashmere Wood, Orange Blossom, Jasmine", 
      base: "Amberwood, Patchouli, Vetiver, Oakmoss",
      desc: "Kaya akan madu dan rempah, memberikan aura berani dan berkelas layaknya emas."
    },
    {
      name: "Mystic", price: "Rp 79.000", family: "Oriental Woody",
      top: "Agarwood Oud, Rose, Incense, Raspberry, Saffron", 
      heart: "Amberwood, Benzoin, Birch", 
      base: "Geranium",
      desc: "Misterius dan hangat dengan paduan mawar, oud, dan asap kemenyan yang sangat memikat."
    },
    {
      name: "Lust", price: "Rp 89.000", family: "Fruity Floral",
      top: "Star Fruit, Italian Mandarin, Boysenberry", 
      heart: "Lotus, Star Jasmine", 
      base: "Vanilla, Caramelized Pear, Musk, Woody Notes",
      desc: "Aroma memikat yang penuh gairah dengan manisnya karamel dan kesegaran buah tropis."
    },
    {
      name: "Pear Blanche", price: "Rp 79.000", family: "Fruity Chypre",
      top: "King William Pear, Melon", 
      heart: "Freesia, Rose", 
      base: "Patchouli, Amber, Musk, Rhubarb",
      desc: "Kesegaran buah pir yang renyah berpadu dengan keanggunan freesia, menciptakan kesan mewah bercahaya."
    },
    {
      name: "Aura", price: "Rp 79.000", family: "Fresh Floral",
      top: "Citruses", 
      heart: "Green Notes, Rose", 
      base: "Musk",
      desc: "Aura segar dari kombinasi citrus dan dedaunan hijau, memberikan energi yang bersih dan memukau."
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
