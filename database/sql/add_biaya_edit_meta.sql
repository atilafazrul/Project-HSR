-- Menambah kolom audit "siapa terakhir mengubah biaya" per kategori.
-- Jalankan sekali di database yang dipakai aplikasi (mis. web-HSR).

ALTER TABLE `projek_kerjas`
  ADD COLUMN `biaya_edit_meta` JSON NULL DEFAULT NULL AFTER `biaya_reimbursment_items`;

-- Jika error "Duplicate column" → kolom sudah ada, abaikan.
-- Jika error "Unknown column biaya_reimbursment_items" → hapus bagian AFTER ... atau pakai:
-- ALTER TABLE `projek_kerjas` ADD COLUMN `biaya_edit_meta` JSON NULL DEFAULT NULL;
