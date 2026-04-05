<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projek_kerjas', function (Blueprint $table) {
            $table->json('biaya_edit_meta')->nullable()->after('biaya_reimbursment_items');
        });
    }

    public function down(): void
    {
        Schema::table('projek_kerjas', function (Blueprint $table) {
            $table->dropColumn('biaya_edit_meta');
        });
    }
};
