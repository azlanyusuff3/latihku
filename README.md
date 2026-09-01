# LatihKu Study v12 — Pra Activities Upgrade

v11 dibina terus daripada **v10 KPM-Aligned QA Edition**. Semua ciri v10 dikekalkan, termasuk onboarding Nama → Sticker, progress/offline, bank soalan yang telah di-QA dan Format UASA.

## Perubahan v11
- Soalan **Jam & Masa** kini boleh memaparkan **jam analog besar** dengan nombor **1–12** yang jelas.
- Jam bukan lagi bergantung pada emoji jam kecil untuk aktiviti Pra Sekolah.
- Generator Matematik topik **Masa** kini menjana visual jam analog secara procedural.
- Aras masa ikut tahap: Tahun awal fokus jam penuh/setengah jam; tahap lebih tinggi boleh merangkumi suku jam dan interval 5 minit pada aras sukar.
- Soalan boleh minta murid membaca waktu pada jam atau mengira beberapa jam selepas waktu yang ditunjukkan.
- Visual jam turut dibawa ke soalan Matematik **Format UASA** apabila item Masa terpilih.
- Cache PWA dinaikkan ke v11 supaya browser mengambil fail baru selepas deploy.

## Baseline yang dikekalkan daripada v10
- 1,557 static unique items + Mathematics procedural generator.
- Semua static MCQ mempunyai 4 pilihan unik dan jawapan betul muncul tepat sekali.
- Place-value ambiguity fix dan KPM/PBD/UASA alignment labels.
- Tahun 4–6: Format UASA untuk BM, BI, Matematik, Sains dan Sejarah.
- Pra Sekolah: aktiviti visual/interaktif termasuk lukis, mewarna, memory, pendengaran dan susun nombor.

## GitHub Pages
Extract ZIP dan upload **semua isi folder ini** ke root repository. Pastikan `index.html` berada di root. Kemudian GitHub → Settings → Pages → Deploy from a branch → `main` → `/(root)`.

> Nota: v11 belum memasukkan set soalan tambahan yang akan diberi kemudian; package ini fokus pada upgrade Jam & Masa dahulu seperti dipersetujui.


## v12 — Pra Activities Upgrade
- Mewarna: pilih sample line-art original (buah, haiwan, rumah, bunga, kenderaan, bentuk), palette, tap/fill, reset dan tukar gambar.
- Melukis: pilih sample/tiru atau canvas kosong, warna, 4 saiz brush, eraser, undo dan clear.
- Baki emoji jam dalam teks soalan Pra dibuang; visual Jam & Masa v11 dikekalkan.
- Semua progress, offline/PWA, onboarding dan QA baseline v10/v11 dikekalkan.
