
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

  const products = [
    {
      name: "Deep Horizon", price: "Rp 79.000",
      desc: "Parfum pria dengan aroma fresh yang maskulin dan elegan."
    },
    {
      name: "Floral Kiss", price: "Rp 79.000",
      desc: "Parfum feminin dengan nuansa bunga yang lembut dan romantis."
    },
    {
      name: "Fleur Voyage", price: "Rp 79.000",
      desc: "Keanggunan Tuberose dan Melati yang membangkitkan pesona eksotis."
    },
    {
      name: "Golden Ember", price: "Rp 79.000",
      desc: "Aroma hangat yang memikat, memadukan kekayaan rempah dan manisnya vanilla."
    },
    {
      name: "Mystic", price: "Rp 79.000",
      desc: "Aroma misterius yang memadukan wangi kayu dan rempah oriental yang eksotis."
    },
    {
      name: "Ocean Breeze", price: "Rp 79.000",
      desc: "Kesegaran lautan tropis yang membangkitkan semangat dan energi positif."
    },
    {
      name: "Silk Petal", price: "Rp 79.000",
      desc: "Kelembutan kelopak sutra dalam sentuhan aroma bunga dan bedak yang mewah."
    },
    {
      name: "Velvet Noir", price: "Rp 79.000",
      desc: "Pesona gelap yang memikat dengan wangi bunga malam yang intens dan manis."
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

  updateWheel();
});
