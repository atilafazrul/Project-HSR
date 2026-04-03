<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projek_kerjas', function (Blueprint $table) {
            $table->boolean('is_lunas')->default(false)->after('biaya_reimbursment_items');
            $table->timestamp('lunas_at')->nullable()->after('is_lunas');
        });
    }

    public function down(): void
    {
        Schema::table('projek_kerjas', function (Blueprint $table) {
            $table->dropColumn(['is_lunas', 'lunas_at']);
        });
    }
};
