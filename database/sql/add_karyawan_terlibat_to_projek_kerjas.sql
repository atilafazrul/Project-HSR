-- Menyimpan daftar semua karyawan yang terlibat di 1 project (multi-karyawan).

ALTER TABLE `projek_kerjas`
  ADD COLUMN `karyawan_terlibat` JSON NULL AFTER `pic_karyawan`;

