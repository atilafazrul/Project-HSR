<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sppd_documents', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat');
            $table->string('nomor_urut');
            $table->integer('bulan');
            $table->integer('tahun');
            $table->string('pejabat_perintah');
            $table->string('nama_pegawai');
            $table->string('jabatan');
            $table->string('tempat_berangkat');
            $table->string('tempat_tujuan');
            $table->string('transportasi');
            $table->string('tanggal_berangkat');
            $table->string('tanggal_kembali');
            $table->text('maksud');
            $table->string('pengikut_nama')->nullable();
            $table->string('atas_beban');
            $table->text('keterangan')->nullable();
            $table->string('dibuat_oleh');
            $table->string('tanggal_tanda_tangan');
            $table->string('approve_nama');
            $table->string('approve_jabatan')->default('Direktur');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sppd_documents');
    }
};