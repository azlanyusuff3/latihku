# LatihKu v24.0.1

LatihKu is a local-first and offline-first learning and practice PWA for Malaysian **Sekolah Kebangsaan** pupils from Pra to Tahun 6. It uses vanilla HTML, CSS and JavaScript, with no account, backend, cloud database, remote AI API or build step. Host the static repository over HTTPS, such as GitHub Pages, or run it on localhost for development.

## Navigation and learning

The five tabs are **Utama**, **Latihan**, **Pra**, **Prestasi** and **Tetapan**. Choose a year and a supported SK subject, then a topic and a practice mode. Latihan Biasa gives feedback while answering; Mode Ujian reviews at the end; Format UASA is available for supported years and subjects and is practice rather than an official paper. Difficulty and question count are under Pilihan lanjut. Pra includes early activities and Buku Mewarna with 236 worksheets. The adaptive learning flow, visual explanations, mastery, response timing and Smart Practice run entirely on the device. Curated JSON questions take priority; procedural Smart and PDF pattern generators provide further items. No generated content is sent to a server.

## Progress and upgrades

Progress remains in **`latihkuStudyV10`** in localStorage and is mirrored to IndexedDB (`LatihKuStudyDB`). The more recent valid copy is loaded on startup, and writes to the mirror are serialized. Coloring canvas layers use a separate IndexedDB database. A v23 user who last selected SRA is moved to a valid SK subject and topic without resetting profile, XP, streak, SK history, mastery, Pra or coloring work. Legacy SRA sessions and subject-specific analytics are removed during migration; profile, XP, streak and SK progress are retained. Older backups remain importable. A saved SK quiz keeps questions, answers, score, mode, timer and timing state; **Sambung latihan** restores it after refresh or restart. An incompatible legacy SRA quiz is discarded while the rest of progress is retained.

Backup exports local progress and completed coloring metadata as JSON; canvas layers remain on that device. Restore validates structure and accepts compatible older backups, including old SRA preferences. Reset clears learning state and the separate coloring database. Recent raw sessions are capped at 100; lifetime subject aggregates remain separate.

## Timer and offline use

The optional timer for regular practice and examination modes is a **total session budget of 45 seconds × question count**. UASA practice scales a 75-minute reference for 30 questions proportionally (5: 12m30s, 10: 25m, 20: 50m, 30: 75m). This is a practice budget, not an official examination duration. Background time is paused. UI seconds update without writing storage every second; checkpoints occur about every 15 seconds and on answer, exit and background.

The service worker precaches versioned shell URLs and uses release-specific caches for question packs and coloring assets. Versioned script and style URLs also bypass an older service worker cache during upgrades. **Download Bank Soalan** verifies all 40 configured SK packs; **Download Buku Mewarna** verifies every image. Partial failures do not mark the package complete, and retry works. Cache controls clear downloaded assets without removing progress or saved coloring layers. To receive an update, open the app online once so the new shell can install and activate.

## Development and deployment

Run `node tests/check.mjs` with Node 22. GitHub Actions runs it on push and pull requests. It checks pack paths, counts, sizes and topics, coloring and icon assets, generated MCQs across supported years and subjects, anti-repeat behavior, migration, backup validation and timer calculations. Deploy the repository's static files to GitHub Pages; no package install or compilation is needed. Confirm touch drawing and PWA installation on actual iPhone and Android devices when publishing.
