# LatihKu Study v15 — Learning Journey Prototype

v15 dibina terus daripada **v13 Smart Practice Engine**. Semua fungsi v13 dikekalkan, tetapi LatihKu kini mempunyai lapisan **belajar sebelum latihan**.

## Aliran baru

Setiap topik mempunyai journey:

1. **Belajar** — micro-lesson 2–4 minit dengan 3 idea penting.
2. **Cuba Bersama** — guided question + Hint + explanation.
3. **Aktiviti Interaktif** — pilih idea yang membantu memahami konsep.
4. **Sentence Lab / Ingat Semula** — BM & BI dapat susun perkataan + free writing; subjek lain guna teach-back/recall.
5. **Kuiz Masteri** — 10 soalan. 80% ke atas ditanda Kuasai.

Pra Sekolah menggunakan journey ringkas yang membawa kepada aktiviti Pra berkaitan.

## Sentence Lab

Sentence Lab ialah scaffold offline, bukan AI cloud:

- susun perkataan menjadi ayat contoh;
- undo/reset dan semak susunan;
- tulis ayat sendiri;
- semakan asas: huruf besar, tanda baca, panjang minimum dan idea penting daripada arahan;
- feedback berbentuk cadangan, bukan exact-answer marking.

Content v15 ini ialah **prototype UI/learning engine**. Bank/ayat contoh boleh diganti atau diperhalus kemudian menggunakan set soalan/contoh yang diberi tanpa mengubah struktur UI.

## UI

UI dibuat lebih hidup dan kid-friendly dengan kad besar, learning path, subject colour, progress nodes dan visual reward. Tiada coins, shop, battle, leaderboard atau gameplay; elemen visual hanya untuk menjadikan pembelajaran lebih menarik.

## Yang dikekalkan

- v13 Smart Practice: curated no-repeat → Smart Generated selepas pool habis.
- weak-topic prioritization.
- Jam & Masa analog besar + procedural Mathematics.
- Pra Mewarna dan Melukis v12.
- Mode Ujian dan Format UASA yang sedia ada.
- XP, streak, progress, backup/restore.
- localStorage + IndexedDB.
- PWA/offline.

## Upload GitHub Pages

Extract ZIP dan upload **semua isi di dalam folder `LatihKu-KSSR-v15`** ke root repository. Pastikan fail baru **`learning-engine.js`** turut berada di root bersama `index.html`, `app.js`, `engine.js`, `smart-engine.js`, `pra-engine.js`, `styles.css`, `sw.js`, `manifest.json`, `icons/` dan `data/`.


## v15 — Hint Point Economy
- XP kekal lifetime progress dan tidak ditolak apabila menggunakan hint.
- Starter wallet: 20 Hint Points untuk user baharu / migrasi dari v14.
- Hint semasa Learning Journey: Level 1 = 2 points, Level 2 = 3 points, Level 3 = 5 points.
- Mode Belajar pada soalan turut mempunyai tiga tahap hint.
- Betul tanpa hint: +3 Hint Points.
- Selesai lesson kali pertama: +5 Hint Points.
- Mastery >=80% kali pertama bagi topik: +10 Hint Points.
- Aktiviti belajar pertama pada hari baharu: +5 Hint Points.
- Jika balance tidak cukup, Hint Level 1 masih boleh diberi percuma supaya pembelajaran tidak dikunci.
