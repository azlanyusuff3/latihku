# LatihKu v24.4.0

LatihKu is a local-first and offline-first learning and practice PWA for Malaysian **Sekolah Kebangsaan** pupils from Pra to Tahun 6. It uses vanilla HTML, CSS and JavaScript, with no account, backend, cloud database, remote AI API or build step. Host the static repository over HTTPS, such as GitHub Pages, or run it on localhost for development.

## Navigation and learning

The six tabs are **Utama**, **Latihan**, **General**, **Pra**, **Prestasi** and **Tetapan**. Choose a year and a supported SK subject, then a topic and a practice mode. For Tahun 1–6, the practice screen now offers **5, 10, 20, 30 or 50 questions** per set across SK subjects. Latihan Biasa gives feedback while answering; Mode Ujian reviews at the end; Format UASA is available for supported years and subjects and is practice rather than an official paper. Difficulty and question count are under Pilihan lanjut. Pra includes early activities and Buku Mewarna with 236 worksheets. The adaptive learning flow, visual explanations, mastery, response timing and Smart Practice run entirely on the device. Curated JSON questions take priority; procedural Smart and PDF pattern generators provide further items. No generated content is sent to a server.

## Progress and upgrades

Progress remains in **`latihkuStudyV10`** in localStorage and is mirrored to IndexedDB (`LatihKuStudyDB`). The more recent valid copy is loaded on startup, and writes to the mirror are serialized. Coloring canvas layers use a separate IndexedDB database. A v23 user who last selected SRA is moved to a valid SK subject and topic without resetting profile, XP, streak, SK history, mastery, Pra or coloring work. Legacy SRA sessions and subject-specific analytics are removed during migration; profile, XP, streak and SK progress are retained. Older backups remain importable. A saved SK quiz keeps questions, answers, score, mode, timer and timing state; **Sambung latihan** restores it after refresh or restart. An incompatible legacy SRA quiz is discarded while the rest of progress is retained.

Backup exports local progress and completed coloring metadata as JSON; canvas layers remain on that device. Restore validates structure and accepts compatible older backups, including old SRA preferences. Reset clears learning state and the separate coloring database. Recent raw sessions are capped at 100; lifetime subject aggregates remain separate.

## Timer and offline use

The optional timer for regular practice and examination modes is a **total session budget of 45 seconds × question count**. UASA practice scales a 75-minute reference for 30 questions proportionally (5: 12m30s, 10: 25m, 20: 50m, 30: 75m, 50: 125m). This is a practice budget, not an official examination duration. Background time is paused. UI seconds update without writing storage every second; checkpoints occur about every 15 seconds and on answer, exit and background.

The service worker precaches versioned shell URLs and uses release-specific caches for question packs and coloring assets. Versioned script and style URLs also bypass an older service worker cache during upgrades. **Download Bank Soalan** verifies all 40 configured SK packs; **Download Buku Mewarna** verifies every image. Partial failures do not mark the package complete, and retry works. Cache controls clear downloaded assets without removing progress or saved coloring layers. To receive an update, open the app online once so the new shell can install and activate.

## Development and deployment

Run `node tests/check.mjs` with Node 22. GitHub Actions runs it on push and pull requests. It checks pack paths, counts, sizes and topics, coloring and icon assets, generated MCQs across supported years and subjects, anti-repeat behavior, migration, backup validation and timer calculations. Deploy the repository's static files to GitHub Pages; no package install or compilation is needed. Confirm touch drawing and PWA installation on actual iPhone and Android devices when publishing.

## Bendera Dunia dalam Kuiz General

The **Bendera Negara** category within General offers a visual multiple-choice flag quiz with 195 sovereign countries (193 UN members plus Palestine and Vatican City). Each question shows a bundled SVG flag and four randomized country-name answers. A set has 5, 10, 20, or 30 unique flags; recent flags are deprioritized across sessions. Users receive immediate correctness feedback, review answers, earn the same global XP, and can save/resume the active General session. General history and summary are stored separately from SK subjects, preserving existing year/subject choices, school progress and backups.

The SVG sprite (`assets/world-flags.svg`) is distributed locally and precached by the service worker; **no image CDN or network call is needed for questions after installation/update**. The artwork comes from [amckenna41/iso3166-flags](https://github.com/amckenna41/iso3166-flags), MIT-licensed (full notice: `assets/FLAGS_LICENSE.txt`). Country English fallback names are based on [hampusborgos/country-flags](https://github.com/hampusborgos/country-flags); display names use the device's Malay locale where supported. This General bank intentionally excludes dependent territories; it can be expanded separately if desired.


## Kuiz General — v24.2.0

Menu General berasingan daripada Pra dan Tahun 1–6. 963 soalan dalam dua puluh kategori:
Bendera Negara, Ibu Negara, Negara & Peta Dunia, Mercu Tanda Dunia,
Kenali Malaysia, Makanan Malaysia & Dunia, Buah & Sayur, Haiwan,
Bunyi Haiwan, Tumbuhan & Bunga, Angkasa Lepas, Tubuh Badan Manusia,
Lima Deria, Kenderaan, Papan Tanda Jalan & Keselamatan, Pekerjaan,
Sukan, Alat Muzik, Warna/Bentuk/Corak dan Brain Challenge/Logik.

Setiap kategori mempunyai sesi 5, 10, 20 atau 30 soalan rawak, empat pilihan
jawapan, feedback, penerangan, semakan bergambar dan resume. ID soalan tidak
berulang dalam satu sesi; imej atau subjek boleh muncul dalam soalan yang berbeza.
Progress General direkodkan berasingan dengan statistik sepanjang penggunaan.
XP menggunakan sistem global sedia ada. Tiada daily challenge, badge atau
leaderboard baru. Kuiz bendera lama dan rekodnya dimigrasikan secara selamat.

Semua imej dan rakaman audio sebenar dibundle dalam repo. Service worker
menyimpan aset General ketika pemasangan update; pastikan status General
menyatakan semua kategori tersedia offline sebelum memutuskan internet.
Update yang gagal memuatkan satu aset tidak menggantikan worker lama.
Imej soalan ialah foto, ilustrasi anatomi, garis bentuk geografi sebenar atau
komposisi puzzle daripada foto. Imej utama soalan tidak menggunakan emoji/icon.

Attribution: [assets/general/ATTRIBUTION.md](assets/general/ATTRIBUTION.md),
[sources.json](assets/general/sources.json) dan
[audio-sources.json](assets/general/audio-sources.json).
Audio ESC-50 dipilih **hanya daripada fail individu yang dinyatakan CC0**
dalam LICENSE sumber; bukan lesen keseluruhan dataset.
Peta Natural Earth adalah public domain. Fakta geografi daripada
mledoze/countries mempunyai lesen ODbL; sumber dan subset disimpan dalam
`data/general/geography-reference.json`.

Bank JSON berada dalam `data/general/`. `general-data.js` ialah bank runtime
synchronous, `general-engine.js` mengurus generation/validation/migration,
dan `general-assets.js` ialah inventory precache. Alat build Python dalam
`scripts/` hanya digunakan semasa pembangunan; app tidak mempunyai runtime API.

Checks: `node tests/check.mjs`, `node tests/general.mjs` dan `node tests/general-worker.mjs`.
Browser regression: `node tests/general-browser.cjs` (Playwright diperlukan).

## Matematik Tahun 2 — operasi asas dan penyelesaian masalah

Tahun 2 Matematik mempunyai pilihan khas **Tambah**, **Tolak**, **Darab**, **Bahagi**, **Soalan Berayat**, **Bentuk Lazim** dan **KBAT Dua Langkah**. Bank soalan asal dijana secara offline daripada pola latihan Tahap 1 Bahasa Melayu dan DLP, bukan salinan PDF. Enjin menghasilkan nilai rawak, pilihan jawapan unik, langkah penyelesaian dan latihan dua langkah. Dalam topik gabungan asal, soalan baharu bercampur dengan latihan LatihKu yang sedia ada. Generator dimuatkan melalui `year2-math-engine.js` dan disimpan dalam precache PWA; tiada data kemajuan lama dipadam.


## Fahami Soalan Berayat — Matematik Tahun 1–6

The offline guided learning mode covers four operations with grade-appropriate numbers and 5, 10, 20, 30 or 50 questions per set. Each question guides pupils through identifying what changes in the story, selecting the corresponding mathematical sentence, and calculating a final answer. Mistakes receive immediate reasoning and a retry, rather than relying solely on memorised keywords. No timer is used.

Access it from the home-screen shortcut or from Mathematics > Fahami Soalan Berayat. A guided session can be saved and resumed; recent guided sessions and current progress are stored in the existing local profile under wordProblems. Results also contribute to standard Maths progress, with independent success counted only when all three stages are correct on the first try. Original LatihKu-generated questions work offline without APIs or third-party packages.

### Cartoon Spot the Difference (24.5.3)

Eight original SVG scenes in `spot-scenes.js` use identical paired geometry with 5–7 registered differences per scene. Touch either picture to answer; two temporary hints are available per round. Phone layouts stack equal-size scenes. Keyboard players can focus a board, move the crosshair with arrow keys and submit with Enter/Space. No external image downloads are required.

Implementation references reviewed: [DaHaMMeR79/Spot-The-Difference](https://github.com/DaHaMMeR79/Spot-The-Difference) for region detection and found markers, and [widmogrod/js-spot-the-difference](https://github.com/widmogrod/js-spot-the-difference) for per-board difference data and proportional positioning. Artwork and implementation here are original; no reference assets or code were copied. Run `node tests/spot-browser.cjs` with Playwright for scaled input, hint limits, level progression and mobile/desktop regression.

### Worm Game controls (24.5.4)

Tap anywhere on the board to steer the worm toward that spot, measured from its head. A tap straight ahead, straight behind or on the head is ignored, so the worm never reverses by accident. Swipe on the board and the arrow/WASD keys still work; the on-screen d-pad was removed. Space or the pause button pauses.
