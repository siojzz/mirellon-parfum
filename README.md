# Mirellon Parfum — Official Website

Website resmi dan katalog interaktif untuk brand haute parfumerie lokal **Mirellon Parfum** yang dibangun dengan standar performa tinggi, responsive mobile-first, semantic HTML5, modern CSS3, dan Vanilla JavaScript.

---

## 📁 Struktur Folder Project

```text
mirellon/
├── index.html              # Homepage (Hero Editorial, Scent Match Quiz, Trust Badges, FAQ)
├── about.html              # Halaman Tentang Brand & Filosofi Wewangian
├── products.html           # Halaman Katalog Produk, Filter, Pencarian & Modal Detail
├── notes.html              # Piramida Olfactory Aroma Interaktif
├── contact.html            # Halaman Kontak & Layanan Konsultasi Pelanggan
├── robots.txt              # Konfigurasi Crawling Mesin Pencari (SEO)
├── sitemap.xml             # Peta Situs XML Resmi (SEO)
├── README.md               # Dokumentasi Teknis & Panduan Project
│
├── css/                    # Direktori Stylesheet
│   ├── style.css           # Design System, Tipografi, Komponen & Dark/Light Themes
│   ├── responsive.css      # Media Queries untuk Smartphone, Tablet & Desktop
│   └── animation.css       # Keyframe Animations & Micro-Interactions
│
├── js/                     # Direktori JavaScript Engine
│   ├── main.js             # Controller Global, Theme Switcher, Quiz & Notes Explorer
│   ├── products.js         # Data Produk, Dynamic Filter, Modal & Order Generator
│   ├── hero-fx.js          # Interactive Editorial Hero FX
│   ├── slider.js           # Carousel Review & Testimoni Pelanggan
│   └── spotlight.js        # Spotlight Lighting Effect
│
├── images/                 # Aset Visual & Artwork Botol HD
│   ├── fleur-voyage-tuberose-hd-solid.png  # Hero Artwork Botol Fleur Voyage HD Solid Black
│   ├── deep-horizon.png    # Aset Botol Deep Horizon
│   ├── floral-kiss.png     # Aset Botol Floral Kiss
│   ├── favicon.svg         # Favicon Brand Mirellon
│   └── ...                 # Artwork pendukung lainnya
│
├── docs/                   # Dokumen Catatan & Database
│   ├── CATATAN-FOTO.md     # Catatan Panduan Aset Foto
│   └── Latihan SQl.session.sql
│
└── mockups/                # Koleksi Standalone Social Media Mockups
    ├── garuda-charter-instagram.html
    ├── garuda-charter-tiktok.html
    ├── garuda-umrah-instagram.html
    ├── garuda-umrah-tiktok.html
    ├── instagram.html
    ├── tiktok.html
    └── mockup tiktok.html
```

---

## 🚀 Cara Menjalankan Secara Lokal

Website ini murni statis tanpa dependency server yang rumit. Anda dapat membukanya langsung di browser atau menggunakan local server:

```bash
# Menggunakan Python 3 (Disarankan)
python -m http.server 8080

# Atau menggunakan Node.js / NPX
npx serve .
```
Buka `http://localhost:8080` di web browser Anda.

---

## ⚙️ Konfigurasi Link Marketplace & WhatsApp

Seluruh link checkout & pemesanan resmi terpusat di `js/main.js` dan `js/products.js`:

- **WhatsApp Admin:** `https://wa.me/6282119027766`
- **Tokopedia Official:** `https://tk.tokopedia.com/ZSVDJ2eSw/`
- **TikTok Shop:** `https://www.tiktok.com/@mirellon_parfum?_r=1&_t=ZS-991wJdPSrNV`
- **Email:** `mirellonparfum@gmail.com`

---

## 🌐 Panduan Deployment

### 1. GitHub Pages
1. Push repository ke branch `main`.
2. Masuk ke **Settings → Pages**.
3. Pilih Source: `Deploy from a branch` → branch `main` / `root`.
4. Website aktif di `https://<username>.github.io/<repo-name>/`.

### 2. Vercel / Netlify
1. Hubungkan repository GitHub ke dashboard Vercel / Netlify.
2. Framework Preset: **Other / Static**.
3. Klik **Deploy** — website otomatis live dengan sertifikat SSL/HTTPS gratis.
