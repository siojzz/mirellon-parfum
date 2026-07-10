# Mirellon Parfum — Website Resmi

Website statis (HTML5, CSS3, Vanilla JavaScript) untuk brand parfum lokal **Mirellon Parfum**.

## Struktur Folder

```
/
├── index.html
├── about.html
├── products.html
├── notes.html
├── contact.html
├── robots.txt
├── sitemap.xml
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animation.css
├── js/
│   ├── main.js
│   ├── slider.js
│   └── products.js
├── images/
└── assets/
```

## Menjalankan Secara Lokal

Karena website ini murni statis, cukup buka `index.html` langsung di browser, atau gunakan local server (disarankan agar path relatif berjalan sempurna):

```bash
# Python 3
python -m http.server 8080

# atau Node.js
npx serve .
```

Lalu buka `http://localhost:8080` di browser.

## Mengganti Link Marketplace

Buka `js/products.js`, lalu isi tiga variabel berikut dengan link toko Anda:

```js
const shopee = "https://shopee.co.id/tokoanda";
const tokopedia = "https://tokopedia.com/tokoanda";
const tiktok = "https://tiktokshop.com/tokoanda";
```

## Publish ke GitHub Pages

1. Buat repository baru di GitHub, lalu push seluruh folder ini.
2. Masuk ke **Settings → Pages**.
3. Pada **Source**, pilih branch `main` dan folder `/root`.
4. Simpan — GitHub akan memberikan URL publik (`https://username.github.io/nama-repo/`).

## Publish ke Vercel

1. Buat akun di [vercel.com](https://vercel.com) dan hubungkan dengan GitHub.
2. Klik **New Project**, pilih repository Mirellon Parfum.
3. Karena ini situs statis, biarkan pengaturan default (**Framework Preset: Other**, tanpa build command).
4. Klik **Deploy** — Vercel akan otomatis memberikan URL publik dan HTTPS.

Setiap kali Anda push perubahan ke branch `main`, Vercel maupun GitHub Pages akan otomatis memperbarui website.
