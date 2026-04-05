-- ============================================================
-- Projek kerja: kolom JSON biaya (jalan / pengeluaran / reimbursment)
-- ============================================================
-- CEK DULU apa yang sudah ada (jalankan ini di HeidiSQL):
--
--   SHOW COLUMNS FROM `projek_kerjas` WHERE Field LIKE 'biaya%';
--
-- • Error 1054 "Unknown column biaya_jalan_items"  → kolom belum ada, tambah yang kurang.
-- • Error 1060 "Duplicate column biaya_jalan_items" → kolom SUDAH ADA; JANGAN jalankan
--   baris ALTER untuk kolom itu lagi. Lanjut cek apakah yang lain sudah lengkap.
--
-- Jika tidak ada kolom `barang_dibeli`, ganti AFTER `barang_dibeli` jadi AFTER `problem_description`.
-- ============================================================

-- Hanya jalankan SATU per satu yang masih hilang (abaikan jika sudah ada):

-- ALTER TABLE `projek_kerjas`
--   ADD COLUMN `biaya_jalan_items` JSON NULL DEFAULT NULL AFTER `barang_dibeli`;

-- ALTER TABLE `projek_kerjas`
--   ADD COLUMN `biaya_pengeluaran_items` JSON NULL DEFAULT NULL AFTER `biaya_jalan_items`;

-- ALTER TABLE `projek_kerjas`
--   ADD COLUMN `biaya_reimbursment_items` JSON NULL DEFAULT NULL AFTER `biaya_pengeluaran_items`;
