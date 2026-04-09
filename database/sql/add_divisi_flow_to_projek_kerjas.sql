-- Tambah kolom untuk riwayat divisi (divisi terlibat) dan asal divisi pembuat.
-- Jalankan di database yang dipakai aplikasi (mis. web-HSR).

ALTER TABLE `projek_kerjas`
  ADD COLUMN `created_by_divisi` VARCHAR(50) NULL AFTER `divisi`,
  ADD COLUMN `divisi_flow` JSON NULL AFTER `created_by_divisi`;

-- Optional: inisialisasi data lama (biar minimal berisi divisi saat ini)
UPDATE `projek_kerjas`
SET `created_by_divisi` = COALESCE(`created_by_divisi`, `divisi`),
    `divisi_flow` = COALESCE(`divisi_flow`, JSON_ARRAY(`divisi`))
WHERE `created_by_divisi` IS NULL OR `divisi_flow` IS NULL;

