<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdateStatusToNewEnum extends Migration
{
    public function up()
    {
        // Ubah data lama ke status baru (opsional, sesuaikan mapping)
        DB::statement("UPDATE projek_kerjas SET status = 'Dibuat' WHERE status = 'Proses'");
        DB::statement("UPDATE projek_kerjas SET status = 'Selesai' WHERE status = 'Selesai'");
        DB::statement("UPDATE projek_kerjas SET status = 'Dibuat' WHERE status = 'Terlambat'");

        // Ubah kolom status menjadi enum baru
        DB::statement("ALTER TABLE projek_kerjas MODIFY COLUMN status ENUM('Dibuat', 'Persiapan', 'Proses Pekerjaan', 'Editing', 'Invoicing', 'Selesai') NOT NULL DEFAULT 'Dibuat'");
    }

    public function down()
    {
        // Kembalikan ke enum lama (jika rollback)
        DB::statement("ALTER TABLE projek_kerjas MODIFY COLUMN status ENUM('Proses', 'Selesai', 'Terlambat') NOT NULL DEFAULT 'Proses'");
    }
}