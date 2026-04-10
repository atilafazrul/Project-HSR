<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_biayas', function (Blueprint $table) {
            $table->id();
            $table->string('divisi')->nullable();
            $table->enum('kategori', ['jalan', 'pengeluaran', 'reimbursment']);
            $table->decimal('nominal', 15, 2)->default(0);
            $table->text('keterangan')->nullable();
            $table->boolean('is_lunas')->default(false);
            $table->timestamp('lunas_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->index(['kategori', 'is_lunas']);
            $table->index('divisi');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_biayas');
    }
};
