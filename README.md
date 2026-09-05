# LatihKu Study v20

Baseline: v19. This build preserves existing local progress and adds an offline AI Question Engine.

## v20 additions
- Curated-first rotation: unseen static questions are used before generated ones.
- Year 1/2 PDF-pattern generator: creates original variations inspired by the structure/difficulty of the supplied practice corpus. Source PDFs are **not included** in the PWA.
- Recent generated signatures are remembered to reduce repetition.
- Procedural Mathematics now participates in recent-question tracking.
- New subjects where source material exists: SRA/KAFA (T1–T2), Bahasa Arab (T1–T2), Pendidikan Seni Visual (T2), Pendidikan Muzik (T2).
- Existing subjects/levels without a PDF set continue using the v19 curated bank, then v19 Smart Generator after the unseen bank is exhausted.
- Pra Sekolah remains the existing activity engine.

## Offline
No API key is required. All generation happens in JavaScript on-device. Use Settings → Download Semua once to cache static question packs. The PWA shell and generator work offline after first load.

## Update on GitHub Pages
Upload/replace the files in the repository root. Keep `index.html` at root. v20 uses a new service-worker cache name so clients will receive the new shell. Existing progress remains under the same storage key.
