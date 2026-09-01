# LatihKu Study v10 — KPM-Aligned QA Edition

Versi ini fokus kepada ketepatan soalan dan keserupaan format latihan dengan pentaksiran KPM, bukan mengejar jumlah soalan yang besar.

## Perubahan utama
- Onboarding 2 langkah: **Nama → Sticker**. Nama disimpan sebelum sticker dipilih, jadi tak hilang bila tukar sticker.
- Sticker lebih banyak: bola, unicorn, roket, dinosaur, panda, kucing, rainbow, bintang, kereta, crown dan lain-lain.
- Bank static dibuang duplicate exact; v10 mempunyai **1,557 item static unik** + Mathematics procedural generator.
- Semua static item: 4 pilihan unik dan jawapan betul muncul tepat sekali.
- Generator Matematik di-stress-test pada **189,000 generated items**.
- Isu nilai tempat seperti `1,166` telah dibaiki: target digit mesti unik dan soalan menyatakan tempat digit dengan jelas.
- Soalan mempunyai label sumber/alignment: `KPM PBD published example`, `KPM PBD pattern`, `KPM UASA pattern`, atau `KPM-aligned`.
- Tahun 4–6: BM, BI, Matematik, Sains dan Sejarah ada **Format UASA**.
- Matematik Format UASA menggunakan **short answer** dan agihan aras 5:3:2.
- Sains/Sejarah Format UASA mencampurkan objektif dengan limited-response yang boleh auto-mark.
- Pra Sekolah masih guna aktiviti visual/interaktif v9: lukis, mewarna, memory, pendengaran, susun nombor dan lain-lain.

## Nota KPM
KPM menyediakan panduan PBD, MOBIM, format instrumen/JSU UASA dan sebahagian contoh/released materials. Sekolah membina atau mentadbir instrumen mengikut panduan yang berkenaan; LatihKu tidak mendakwa semua soalan originalnya ialah soalan rasmi KPM.

## GitHub Pages
Extract ZIP dan upload **semua isi folder ini** ke root repository. Pastikan `index.html` berada di root. Kemudian GitHub → Settings → Pages → Deploy from a branch → `main` → `/(root)`.
