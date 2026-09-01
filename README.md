# LatihKu KSSR v2.0

PWA latihan interaktif original untuk Pra Sekolah hingga Tahun 6.

## Apa yang ada

- Tanpa login / akaun
- Pra Sekolah + Tahun 1 hingga Tahun 6
- Matematik, Bahasa Melayu, Bahasa Inggeris, Sains, Sejarah (Tahun 4–6), Pendidikan Islam, Pendidikan Moral dan PJPK
- 10,127 soalan static dalam 40 pek JSON modular
- Matematik procedural: set soalan baharu dijana dalam app
- Mode Belajar dan Mode Ujian
- Pilihan 5 / 10 / 20 / 30 soalan
- Kesukaran Auto / Mudah / Sederhana / Sukar
- Explanation selepas menjawab dalam Mode Belajar
- Score, XP, streak, badge, sejarah latihan dan analisis topik lemah
- PWA installable
- Lazy loading: hanya pek subjek yang dibuka akan dimuat turun
- Tetapan `Download semua untuk offline` untuk cache semua 40 pek
- Progress disimpan menggunakan localStorage pada peranti
- Tiada backend/database/server diperlukan

## Struktur

```text
LatihKu-KSSR-v2/
├── index.html
├── styles.css
├── config.js
├── engine.js
├── app.js
├── sw.js
├── manifest.json
├── README.md
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── data/
    ├── bank-summary.json
    ├── pra/
    ├── 1/
    ├── 2/
    ├── 3/
    ├── 4/
    ├── 5/
    └── 6/
```

## Upload ke GitHub Pages

1. Create repository baru di GitHub, contoh `latihku`.
2. Extract ZIP ini.
3. Upload **semua isi di dalam folder `LatihKu-KSSR-v2`** ke root repository. Pastikan `index.html` berada di root repo, bukan terperangkap dalam satu folder tambahan.
4. GitHub → repository → **Settings** → **Pages**.
5. Di `Build and deployment`, pilih **Deploy from a branch**.
6. Branch: `main`, folder: `/ (root)` → **Save**.
7. GitHub akan beri URL Pages. Buka URL itu sekali secara online.
8. Dalam LatihKu → **Tetapan** → **Download semua untuk offline** jika mahu semua bank soalan tersedia tanpa internet.
9. iPhone/iPad: Safari → Share → **Add to Home Screen**. Android/Chrome: menu → **Install app / Add to Home Screen**.

## Tentang bank soalan

Bank soalan disimpan sebagai fail JSON mengikut Tahun + Subjek. Contoh:

```text
data/3/bm.json
data/4/sci.json
data/6/hist.json
```

Ini memudahkan tambah soalan kemudian tanpa membesarkan satu fail JavaScript utama. App hanya fetch pack yang diperlukan.

Matematik tidak bergantung sepenuhnya pada soalan static. `engine.js` menjana variasi nombor, tambah/tolak, darab/bahagi, pecahan, wang, masa, ukuran, bentuk/ruang dan data berdasarkan Tahun serta difficulty.

## Nota kandungan

LatihKu ialah aplikasi latihan sokongan original dan bukan aplikasi rasmi Kementerian Pendidikan Malaysia. Kandungan tidak disalin daripada MyLatih atau bank soalan proprietary pihak lain.

## Update versi akan datang

Untuk update app di GitHub, replace fail yang berubah dan commit. Service worker v2 menggunakan cache version berasingan supaya shell lama boleh dibuang selepas update.
