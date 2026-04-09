<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projek_kerjas', function (Blueprint $table) {
            $table->json('karyawan_terlibat')->nullable()->after('pic_karyawan');
        });
    }

    public function down(): void
    {
        Schema::table('projek_kerjas', function (Blueprint $table) {
            $table->dropColumn(['karyawan_terlibat']);
        });
    }
};

