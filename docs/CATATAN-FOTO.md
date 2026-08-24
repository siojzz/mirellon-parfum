# Daftar Nama File Foto Produk

Upload foto Anda ke folder `images/` dengan **nama file persis seperti ini** (format PNG, boleh JPG asal ekstensi juga disesuaikan di kode). File placeholder dengan nama yang sama sudah saya siapkan — tinggal timpa (replace) langsung.

| No | Produk | Nama File | Digunakan di |
|----|--------|-----------|--------------|
| 1 | Deep Horizon | `deep-horizon.png` | Products, Homepage, Modal |
| 2 | Floral Kiss | `floral-kiss.png` | Products, Homepage, About |
| 3 | Fleur Voyage | `fleur-voyage.png` | Products, Homepage |
| 4 | Golden Ember | `golden-ember.png` | Products |
| 5 | Velvet Noir | `velvet-noir.png` | Products |
| 6 | Silk Petal | `silk-petal.png` | Products |
| 7 | Ocean Breeze | `ocean-breeze.png` | Products |
| 8 | Amber Dusk | `amber-dusk.png` | Products |
| — | Foto botol utama (hero) | `bottle-hero.png` | Homepage Hero, About |

## Rekomendasi Ukuran Foto

- Rasio potret, sekitar **800 x 1200 px**.
- Background transparan (PNG) atau background gelap solid — akan menyatu rapi dengan section hitam di hero dan card produk.
- Kompres dulu (misal via TinyPNG) sebelum upload agar loading tetap cepat.

## Cara Upload

1. Buka folder `images/` di project Anda.
2. Timpa (overwrite) file placeholder yang sudah ada dengan foto asli, pastikan nama filenya sama persis (huruf kecil semua, pakai tanda strip `-`).
3. Simpan, lalu refresh browser — foto baru akan otomatis muncul karena path di kode sudah mengarah ke nama file ini.

Tidak perlu ubah kode apa pun lagi — semua path di `js/products.js`, `index.html`, dan `about.html` sudah diarahkan ke nama file PNG di atas.
