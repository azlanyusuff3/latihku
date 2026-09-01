# LatihKu KSSR v17 — Adaptive Visual Tutor

Versi ini meneruskan v16 tetapi menukar Learning Journey kepada visual-first learning.

## Perubahan utama
- **Adaptive Visual Tutor** offline: tiada API, tiada kos, tiada internet diperlukan.
- Tiada Hint / Hint Points.
- Flow belajar: **Tengok → Gerak → Cuba Bersama → Cuba Sendiri → Masteri**.
- Cuba Sendiri perlu 2 jawapan visual betul berturut-turut.
- Jika salah, tutor automatik masuk mode reteach: visual konkrit → pecah langkah → buat contoh bersama.
- Selepas reteach, murid menerima **soalan baru**, bukan soalan yang sama.
- Visual khusus untuk Matematik (objek, base-10, pecahan, jam, wang, ukuran, bentuk, carta), BM (simpulan bahasa, tatabahasa, ejaan, kosa kata), BI, Sains, Sejarah, Pendidikan Islam/Jawi, Moral, PJPK dan Pra.
- Butang audio ringkas menggunakan speech synthesis peranti apabila tersedia.
- Progress adaptive disimpan bersama progress sedia ada.
- Smart Practice v13, Mastery, PWA/offline, Jam, Mewarna, Melukis, XP/streak dikekalkan.

## Nota
Adaptive Tutor v17 menggunakan rule-based local adaptation, bukan cloud LLM. Ini disengajakan supaya selamat untuk PWA kanak-kanak, boleh offline dan tidak menghantar jawapan murid ke server.
