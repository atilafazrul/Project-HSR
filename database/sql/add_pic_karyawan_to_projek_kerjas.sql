-- PIC karyawan untuk divisi penerima (mis. IT) setelah project dioper.
-- Jalankan sekali di database aplikasi (mis. web-HSR).

ALTER TABLE `projek_kerjas`
  ADD COLUMN `pic_karyawan` VARCHAR(255) NULL AFTER `karyawan`;

