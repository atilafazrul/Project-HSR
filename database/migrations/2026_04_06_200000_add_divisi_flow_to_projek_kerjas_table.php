<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projek_kerjas', function (Blueprint $table) {
            $table->string('created_by_divisi')->nullable()->after('divisi');
            $table->json('divisi_flow')->nullable()->after('created_by_divisi');
        });
    }

    public function down(): void
    {
        Schema::table('projek_kerjas', function (Blueprint $table) {
            $table->dropColumn(['created_by_divisi', 'divisi_flow']);
        });
    }
};

