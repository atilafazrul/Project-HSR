<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBarangDibeliToProjekKerjas extends Migration
{
    public function up()
{
    Schema::table('projek_kerjas', function (Blueprint $table) {
        $table->text('barang_dibeli')->nullable()->after('problem_description');
    });
}

public function down()
{
    Schema::table('projek_kerjas', function (Blueprint $table) {
        $table->dropColumn('barang_dibeli');
    });
}
}