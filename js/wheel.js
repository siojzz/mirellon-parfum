
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("wheel-slider");
  if (!slider) return;

  const btnPrev = document.getElementById("wheel-prev");
  const btnNext = document.getElementById("wheel-next");
  const items = document.querySelectorAll(".wheel-item");
  const infoCard = document.getElementById("wheel-info-card");
  
  // Elements to update
  const tTitle = document.getElementById("wheel-title");
  const tPrice = document.getElementById("wheel-price");
  const tDesc = document.getElementById("wheel-desc");
  const tNotes = document.getElementById("wheel-notes");

  // Product Data
  const products = [
    {
      name: "Deep Horizon", price: "Rp 79.000",
      desc: "Parfum pria dengan aroma fresh yang maskulin dan elegan.",
      notes: ["Citrus", "Bergamot", "Lavender", "Amber"]
    },
    {
      name: "Floral Kiss", price: "Rp 79.000",
      desc: "Parfum feminin dengan nuansa bunga yang lembut dan romantis.",
      notes: ["White Flowers", "Rose", "Peony", "Musk"]
    },
    {
      name: "Fleur Voyage", price: "Rp 79.000",
      desc: "Keanggunan Tuberose dan Melati yang membangkitkan pesona eksotis.",
      notes: ["Tuberose", "Jasmine", "Ylang-ylang", "Sandalwood"]
    },
    {
      name: "Golden Ember", price: "Rp 79.000",
      desc: "Aroma hangat yang memikat, memadukan kekayaan rempah dan manisnya vanilla.",
      notes: ["Spices", "Cinnamon", "Vanilla", "Tonka Bean"]
    },
    {
      name: "Mystic", price: "Rp 79.000",
      desc: "Aroma misterius yang memadukan wangi kayu dan rempah oriental yang eksotis.",
      notes: ["Oud", "Incense", "Patchouli", "Sandalwood"]
    },
    {
      name: "Ocean Breeze", price: "Rp 79.000",
      desc: "Kesegaran lautan tropis yang membangkitkan semangat dan energi positif.",
      notes: ["Sea Salt", "Aquatic Notes", "Citrus", "Musk"]
    },
    {
      name: "Silk Petal", price: "Rp 79.000",
      desc: "Kelembutan kelopak sutra dalam sentuhan aroma bunga dan bedak yang mewah.",
      notes: ["Cherry Blossom", "Powdery Notes", "White Musk"]
    },
    {
      name: "Velvet Noir", price: "Rp 79.000",
      desc: "Pesona gelap yang memikat dengan wangi bunga malam yang intens dan manis.",
      notes: ["Black Orchid", "Plum", "Dark Chocolate", "Patchouli"]
    }
  ];

  let currentIndex = 0;
  const totalItems = items.length;

  function updateWheel() {
    // Rotate slider
    const rotation = currentIndex * 45;
    slider.style.transform = `rotate(${rotation}deg)`;

    // Update active class
    // In our logic, if currentIndex is 1 (we rotated +45deg), then item 1 (-45deg initially) is now at 0deg.
    // So the active item index IS currentIndex (modulo totalItems)
    const normalizedIndex = ((currentIndex % totalItems) + totalItems) % totalItems;
    
    items.forEach((item, idx) => {
      if (idx === normalizedIndex) item.classList.add("active");
      else item.classList.remove("active");
    });

    // Update Card Info with Animation
    infoCard.classList.remove("changed");
    infoCard.classList.add("changing");
    
    setTimeout(() => {
      const p = products[normalizedIndex];
      tTitle.textContent = p.name;
      tPrice.textContent = p.price;
      tDesc.textContent = p.desc;
      tNotes.innerHTML = p.notes.map(n => `<span class="note-pill">${n}</span>`).join('');
      
      infoCard.classList.remove("changing");
      infoCard.classList.add("changed");
    }, 300); // Wait for fade out
  }

  btnPrev.addEventListener("click", () => {
    currentIndex--;
    updateWheel();
  });

  btnNext.addEventListener("click", () => {
    currentIndex++;
    updateWheel();
  });
  
  // init
  updateWheel();
});
