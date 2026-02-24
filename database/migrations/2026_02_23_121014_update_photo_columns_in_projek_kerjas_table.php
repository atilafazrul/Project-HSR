<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Update tabel projek_kerjas
        |--------------------------------------------------------------------------
        */

        Schema::table('projek_kerjas', function (Blueprint $table) {

            // Tambah kolom file (PDF/DOC/XLS)
            if (!Schema::hasColumn('projek_kerjas', 'file')) {
                $table->string('file')->nullable()->after('problem_description');
            }

            // Hapus kolom foto lama (jika ada)
            if (Schema::hasColumn('projek_kerjas', 'photo_before')) {
                $table->dropColumn('photo_before');
            }

            if (Schema::hasColumn('projek_kerjas', 'photo_after')) {
                $table->dropColumn('photo_after');
            }

            if (Schema::hasColumn('projek_kerjas', 'photo')) {
                $table->dropColumn('photo');
            }
        });

        /*
        |--------------------------------------------------------------------------
        | Buat tabel multi foto
        |--------------------------------------------------------------------------
        */

        if (!Schema::hasTable('projek_kerja_photos')) {

            Schema::create('projek_kerja_photos', function (Blueprint $table) {

                $table->id();

                $table->foreignId('projek_kerja_id')
                      ->constrained('projek_kerjas')
                      ->onDelete('cascade');

                $table->string('photo');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Hapus tabel foto
        |--------------------------------------------------------------------------
        */

        Schema::dropIfExists('projek_kerja_photos');

        /*
        |--------------------------------------------------------------------------
        | Rollback tabel projek_kerjas
        |--------------------------------------------------------------------------
        */

        Schema::table('projek_kerjas', function (Blueprint $table) {

            // Hapus kolom file
            if (Schema::hasColumn('projek_kerjas', 'file')) {
                $table->dropColumn('file');
            }

            // Kembalikan kolom foto lama
            if (!Schema::hasColumn('projek_kerjas', 'photo_before')) {
                $table->string('photo_before')->nullable();
            }

            if (!Schema::hasColumn('projek_kerjas', 'photo_after')) {
                $table->string('photo_after')->nullable();
            }
        });
    }
};