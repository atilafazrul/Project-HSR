<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Fixes databases where biaya_edit_meta (or lunas) was applied but
 * 2026_04_03_000001_migrate_uang_to_biaya_items_on_projek_kerjas never ran,
 * leaving biaya_*_items columns missing.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('projek_kerjas')) {
            return;
        }

        if (Schema::hasColumn('projek_kerjas', 'biaya_jalan_items')) {
            return;
        }

        $anchor = null;
        foreach (['barang_dibeli', 'problem_description', 'start_date'] as $col) {
            if (Schema::hasColumn('projek_kerjas', $col)) {
                $anchor = $col;
                break;
            }
        }

        Schema::table('projek_kerjas', function (Blueprint $table) use ($anchor) {
            if ($anchor) {
                $table->json('biaya_jalan_items')->nullable()->after($anchor);
            } else {
                $table->json('biaya_jalan_items')->nullable();
            }
            $table->json('biaya_pengeluaran_items')->nullable()->after('biaya_jalan_items');
            $table->json('biaya_reimbursment_items')->nullable()->after('biaya_pengeluaran_items');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('projek_kerjas')) {
            return;
        }

        Schema::table('projek_kerjas', function (Blueprint $table) {
            if (Schema::hasColumn('projek_kerjas', 'biaya_reimbursment_items')) {
                $table->dropColumn([
                    'biaya_jalan_items',
                    'biaya_pengeluaran_items',
                    'biaya_reimbursment_items',
                ]);
            }
        });
    }
};
