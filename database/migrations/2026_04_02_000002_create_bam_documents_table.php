<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bam_documents', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat')->unique();
            $table->string('nama_hari');
            $table->string('tanggal_bam');
            $table->string('nama_klient');
            $table->string('tanggal_tanda_tangan');
            $table->string('hasil')->default('BAIK');
            $table->json('items');
            $table->integer('nomor_urut');
            $table->integer('bulan');
            $table->integer('tahun');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bam_documents');
    }
};

