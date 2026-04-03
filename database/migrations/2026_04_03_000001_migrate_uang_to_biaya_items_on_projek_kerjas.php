<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projek_kerjas', function (Blueprint $table) {
            $table->json('biaya_jalan_items')->nullable()->after('barang_dibeli');
            $table->json('biaya_pengeluaran_items')->nullable()->after('biaya_jalan_items');
            $table->json('biaya_reimbursment_items')->nullable()->after('biaya_pengeluaran_items');
        });

        if (Schema::hasColumn('projek_kerjas', 'uang_jalan')) {
            DB::table('projek_kerjas')->orderBy('id')->chunk(100, function ($rows) {
                foreach ($rows as $row) {
                    $jalan = [];
                    $pengeluaran = [];
                    $uangJalan = isset($row->uang_jalan) ? (float) $row->uang_jalan : 0;
                    $uangPengeluaran = isset($row->uang_pengeluaran) ? (float) $row->uang_pengeluaran : 0;
                    if ($uangJalan > 0) {
                        $jalan[] = ['nominal' => $uangJalan, 'keterangan' => ''];
                    }
                    if ($uangPengeluaran > 0) {
                        $pengeluaran[] = ['nominal' => $uangPengeluaran, 'keterangan' => ''];
                    }
                    DB::table('projek_kerjas')->where('id', $row->id)->update([
                        'biaya_jalan_items' => json_encode($jalan),
                        'biaya_pengeluaran_items' => json_encode($pengeluaran),
                        'biaya_reimbursment_items' => json_encode([]),
                    ]);
                }
            });

            Schema::table('projek_kerjas', function (Blueprint $table) {
                $table->dropColumn(['uang_jalan', 'uang_pengeluaran']);
            });
        }
    }

    public function down(): void
    {
        Schema::table('projek_kerjas', function (Blueprint $table) {
            $table->decimal('uang_jalan', 15, 2)->default(0)->after('barang_dibeli');
            $table->decimal('uang_pengeluaran', 15, 2)->default(0)->after('uang_jalan');
        });

        DB::table('projek_kerjas')->orderBy('id')->chunk(100, function ($rows) {
            foreach ($rows as $row) {
                $jalan = 0;
                $pengeluaran = 0;
                if (! empty($row->biaya_jalan_items)) {
                    $items = json_decode($row->biaya_jalan_items, true) ?: [];
                    foreach ($items as $it) {
                        $jalan += (float) ($it['nominal'] ?? 0);
                    }
                }
                if (! empty($row->biaya_pengeluaran_items)) {
                    $items = json_decode($row->biaya_pengeluaran_items, true) ?: [];
                    foreach ($items as $it) {
                        $pengeluaran += (float) ($it['nominal'] ?? 0);
                    }
                }
                DB::table('projek_kerjas')->where('id', $row->id)->update([
                    'uang_jalan' => $jalan,
                    'uang_pengeluaran' => $pengeluaran,
                ]);
            }
        });

        Schema::table('projek_kerjas', function (Blueprint $table) {
            $table->dropColumn([
                'biaya_jalan_items',
                'biaya_pengeluaran_items',
                'biaya_reimbursment_items',
            ]);
        });
    }
};
