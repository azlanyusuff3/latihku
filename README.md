# LatihKu Study v9 — QA & Aktiviti Pra

Versi v9 fokus pada ketepatan soalan dan kategori aktiviti yang lebih jelas.

## Perubahan utama
- First launch masih minta **nama + avatar**.
- UI kekal ringkas tanpa coin/pet/shop/world.
- Semua bank static diproses semula dengan QA struktur yang lebih ketat.
- Bank Pra dibina semula dari kosong; soalan warna ambigu lama dibuang.
- Pra kini ada 12 corak aktiviti: Campur-campur, Kenali Huruf, Kenali Nombor, Lukis, Mewarna, Ejaan, Memory, Deria & Alam, Pendengaran, Susun Nombor, Kira-kira, Jam & Masa.
- Aktiviti **Mewarna** boleh ditekan dan diwarnakan terus; **Lukis** guna canvas; **Memory**, **Pendengaran** dan **Susun Nombor** interaktif.
- Tahun 4–6: Mode Ujian + Kesukaran Auto menggunakan agihan aras **5:3:2** sebagai rujukan format UASA KPM. Soalan tetap original, bukan kertas rasmi KPM.
- Matematik Tahun 3+ termasuk variasi susun nombor menaik/menurun, berdasarkan bentuk instrumen PBD rasmi KPM (nombor dijana baharu).
- Progress kekal local dalam phone/browser dan boleh Backup/Restore.

## QA bank soalan
Lihat `data/qa-report.json`. Build v9 menyemak semua item static untuk:
- soalan/jawapan tidak kosong;
- tepat 4 pilihan unik;
- jawapan betul muncul tepat sekali;
- stem Pra yang diketahui ambiguous seperti “yang manakah nama warna?” dibuang;
- stem bentuk “0 sisi lurus” yang boleh mempunyai lebih satu jawapan turut dibuang.

## GitHub Pages
Extract ZIP dan upload **semua isi folder ini** ke root repository. Pastikan `index.html` berada terus di root. Kemudian buka **Settings → Pages → Deploy from a branch → main → /(root)**.
