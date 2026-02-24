<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('projek_kerjas', function (Blueprint $table) {

            $table->id();

            $table->string('report_no')->unique();
            $table->string('divisi');
            $table->string('jenis_pekerjaan');
            $table->string('karyawan');
            $table->string('alamat');
            $table->string('status')->default('Proses');
            $table->date('start_date');
            $table->text('problem_description')->nullable();
            $table->string('photo')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('projek_kerjas');
    }
};