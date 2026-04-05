-- Status lunas untuk biaya projek (superadmin).
-- Jalankan sekali di database aplikasi (mis. web-HSR).

ALTER TABLE `projek_kerjas`
  ADD COLUMN `is_lunas` TINYINT(1) NOT NULL DEFAULT 0 AFTER `biaya_reimbursment_items`,
  ADD COLUMN `lunas_at` TIMESTAMP NULL DEFAULT NULL AFTER `is_lunas`;

-- Jika error karena AFTER (urutan kolom beda), pakai tanpa AFTER:
-- ALTER TABLE `projek_kerjas`
--   ADD COLUMN `is_lunas` TINYINT(1) NOT NULL DEFAULT 0,
--   ADD COLUMN `lunas_at` TIMESTAMP NULL DEFAULT NULL;

-- Jika error Duplicate column → kolom sudah ada, abaikan.
