# LatihKu Adventure KSSR v3

PWA latihan gamified untuk Pra Sekolah hingga Tahun 6. Tiada login dan tiada backend diperlukan.

## Apa yang baru dalam v3

- Adventure Map + mastery stars ikut topik
- Pet companion + pet level
- XP, coin dan local league (Bronze hingga Master)
- Daily missions
- Combo, Mystery Question dan bonus XP
- Power-ups: 50:50, Shield dan 2x XP
- Rescue My Mistakes: soalan salah disimpan dan perlu dijawab betul 2 kali untuk mastered
- Trophy Room / achievements
- Build Your World menggunakan coin hasil belajar (tiada real money)
- Avatar + pet picker
- Backup / Restore progress menggunakan fail JSON
- Request Persistent Storage daripada browser
- Autosave + dual local persistence (localStorage + IndexedDB mirror)
- Active quiz boleh disambung semula selepas keluar app
- Offline question packs seperti v2

## Bank soalan

- 10,127 static questions dalam 40 modular JSON packs
- Matematik menggunakan procedural generator untuk variasi tambahan
- Soalan disusun mengikut level, subjek dan topik

## Progress kekal macam mana?

Semua XP, coin, streak, pet XP, mastery, mistakes, world, history dan quiz yang belum habis disimpan dalam peranti.

V3 menyimpan state ke:
1. `localStorage`
2. `IndexedDB` sebagai mirror kedua

State juga disimpan apabila app masuk background / ditutup.

Penting: storage local masih boleh hilang jika pengguna sengaja clear site/app data, uninstall dengan clear data, reset browser, atau OS/browser membuang storage. Untuk progress penting, gunakan **Tetapan > Backup progress**. V3 juga ada butang **Lindungi storage** yang menggunakan Persistent Storage API jika browser menyokongnya.

## Upgrade daripada v2

V3 menggunakan key progress yang sama (`latihkuState`) dan ada migration schema. Jika v3 menggantikan v2 pada **origin/domain yang sama**, progress v2 seperti XP, streak dan history akan dibawa masuk ke v3. Feature baru seperti coin/pet/world akan mendapat default sahaja.

Cara paling selamat sebelum upgrade:
- buka v2
- jika ada backup sendiri, simpan
- deploy v3 pada repo/domain yang sama
- refresh app selepas GitHub Pages siap deploy

Jika pindah ke domain/GitHub account lain, local progress tidak ikut secara automatik kerana browser storage terikat kepada origin. Gunakan Backup/Restore v3 untuk pindah selepas itu.

## Upload ke GitHub Pages

1. Extract `LatihKu-KSSR-v3.zip`.
2. Buka repository GitHub yang hendak digunakan.
3. Upload **semua isi folder `LatihKu-KSSR-v3`** ke root repository. Pastikan `index.html` berada terus di root.
4. Jika upgrade repo v2, replace file lama dengan file v3 tetapi kekalkan folder `data/` daripada package v3.
5. GitHub > Settings > Pages.
6. Source: `Deploy from a branch`.
7. Branch: `main`, folder: `/ (root)`.
8. Save dan buka URL GitHub Pages.
9. Jika masih nampak v2 pada first load, refresh sekali lagi kerana service worker lama mungkin sedang bertukar kepada v3.
10. Dalam app: Tetapan > `Download semua untuk offline` jika mahu semua subject tersedia tanpa internet.
11. Dalam app: Tetapan > `Lindungi storage` dan buat `Backup progress` jika progress penting.

## Fail utama

- `index.html` - shell PWA
- `app.js` - UI, game loop dan persistence
- `engine.js` - question engine
- `config.js` - level/subjek/question-pack config
- `styles.css` - responsive mobile UI
- `manifest.json` - PWA manifest
- `sw.js` - offline cache/service worker
- `data/` - 40 modular question packs
- `icons/` - PWA icons

## Nota

LatihKu ialah aplikasi latihan sokongan dan bukan aplikasi rasmi KPM. Kandungan adalah bank latihan original / generated dan bukan salinan proprietary bank soalan pihak ketiga.
