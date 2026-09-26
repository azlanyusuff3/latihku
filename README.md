# LatihKu Study 23.1.0

LatihKu is a vanilla HTML/CSS/JavaScript local-first PWA. It has no account, backend, external AI service or analytics endpoint. Serve this directory over HTTPS (or localhost); deploy the repository's static files to GitHub Pages. No build step is required.

## Learning and content

SK and SRA have separate year/subject/topic routes; Pra includes activities and Buku Mewarna. Curated JSON packs under `data/` are used first where available, followed by local procedural Smart/PDF-pattern generation. Math and SRA Years 1–2 can generate without a JSON pack. The adaptive tutor, visual explanation, learning flow and Smart Practice run on the device. “AI” in product labels describes these local rules, not a trained model or remote LLM.

## Storage and backups

Progress stays under **`latihkuStudyV10`** in localStorage and is mirrored to IndexedDB (`LatihKuStudyDB`). The more recent valid copy is loaded at startup; writes to the mirror are serialized. A separate IndexedDB database stores coloring canvas layers. Backup JSON contains progress and completed coloring metadata, **not** canvas layers. Restore validates the structure and keeps older compatible backups; export a backup before replacing progress. Reset clears learning state and the separate canvas database. Raw sessions are capped at 100; subject aggregates and overall counts continue for future sessions. Older progress contributes the retained sessions to new aggregates, while preexisting overall answer counts remain intact.

A saved in-progress quiz keeps its questions, answers, score, settings, timer and response timing. “Sambung Sesi” restores it after refresh or PWA restart. Invalid saved quizzes are ignored without erasing the rest of progress.

## Timer

Timer is optional. When enabled, regular Latihan and Ujian use a **total session budget of 45 seconds × question count**. UASA practice uses a proportional reference of 75 minutes for 30 questions (5: 12m30s, 10: 25m, 20: 50m, 30: 75m); this is a practice setting, not an official examination duration. The countdown pauses while backgrounded or between app restarts. The displayed seconds refresh every second, but storage checkpoints occur roughly every 15 seconds and at answer, exit, and background events.

## Offline and updates

The service worker precaches the app shell and keeps version-specific question and coloring caches. In Settings, **Download Bank Soalan** verifies and awaits every configured JSON pack; **Download Buku Mewarna** does the same for all coloring images. Failed or partial downloads do not receive a completion marker and can be retried. Clear-cache buttons remove the corresponding Cache Storage data while leaving learning progress and coloring layers intact. The app shell requires one successful online load after a deployment to activate the latest version.

## Development checks

Run `node tests/check.mjs` (Node 22). GitHub Actions runs the same check on pushes and PRs. It verifies config paths/counts/bytes/topics, coloring assets, manifest icons, generated question structure across years and subjects, saved quiz/backup structure, streak day rules and timer calculations. This is a structural and logic check; test touch interactions and PWA installation on actual iPhone/Android browsers before a public release.

Historical SRA source notes are retained in `SOURCES-v22.md` as an archive of the earlier content work.
