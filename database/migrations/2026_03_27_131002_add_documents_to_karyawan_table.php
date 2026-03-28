<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 🔥 GANTI KE USERS (INI KUNCI NYA)
        Schema::table('users', function (Blueprint $table) {

            // Single file documents
            if (!Schema::hasColumn('users', 'ktp')) {
                $table->string('ktp')->nullable()->after('golongan_darah');
            }

            if (!Schema::hasColumn('users', 'kk')) {
                $table->string('kk')->nullable()->after('ktp');
            }

            if (!Schema::hasColumn('users', 'akte')) {
                $table->string('akte')->nullable()->after('kk');
            }

            // 🔥🔥🔥 NEW: Multiple files documents (JSON)
            if (!Schema::hasColumn('users', 'ijazah')) {
                $table->json('ijazah')->nullable()->after('akte');
            }

            if (!Schema::hasColumn('users', 'sertifikat')) {
                $table->json('sertifikat')->nullable()->after('ijazah');
            }

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            if (Schema::hasColumn('users', 'ktp')) {
                $table->dropColumn('ktp');
            }

            if (Schema::hasColumn('users', 'kk')) {
                $table->dropColumn('kk');
            }

            if (Schema::hasColumn('users', 'akte')) {
                $table->dropColumn('akte');
            }

            if (Schema::hasColumn('users', 'ijazah')) {
                $table->dropColumn('ijazah');
            }

            if (Schema::hasColumn('users', 'sertifikat')) {
                $table->dropColumn('sertifikat');
            }

        });
    }
};