<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::updateOrCreate(
            ['email' => 'super@admin.com'],
            [
                'name'     => 'Super Admin',
                'password' => Hash::make('123456'),
                'role'     => 'super_admin',
                'divisi'   => null,
            ]
        );

        // Admin Utama
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name'     => 'Admin',
                'password' => Hash::make('123456'),
                'role'     => 'admin',
                'divisi'   => null,
            ]
        );

        // ATILA - Service
        User::updateOrCreate(
            ['email' => 'atila@admin.com'],
            [
                'name'     => 'ATILA',
                'password' => Hash::make('123456'),
                'role'     => 'admin',
                'divisi'   => 'Service',
            ]
        );

        // Aqila - IT
        User::updateOrCreate(
            ['email' => 'aqila@admin.com'],
            [
                'name'     => 'Aqila',
                'password' => Hash::make('123456'),
                'role'     => 'admin',
                'divisi'   => 'IT',
            ]
        );

        // Yuda - Sales
        User::updateOrCreate(
            ['email' => 'yuda@sales.com'],
            [
                'name'     => 'Yuda',
                'password' => Hash::make('123456'),
                'role'     => 'admin',
                'divisi'   => 'Sales',
            ]
        );

        // Daffa - Kontraktor
        User::updateOrCreate(
            ['email' => 'daffa@kontraktor.com'],
            [
                'name'     => 'Daffa',
                'password' => Hash::make('123456'),
                'role'     => 'admin',
                'divisi'   => 'Kontraktor',
            ]
        );
    }
}