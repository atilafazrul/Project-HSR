<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\User;

Route::post('/login', function (Request $request) {

    try {

        // Validasi input
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Cari user berdasarkan email
        $user = User::where('email', $validated['email'])->first();

        // Jika user tidak ditemukan atau password salah
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah'
            ], 401);
        }

        // Return data user (TANPA password)
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'profile_photo' => $user->profile_photo,
                'role' => $user->role,
                'divisi' => $user->divisi
            ]
        ]);

    } catch (\Throwable $e) {

        return response()->json([
            'success' => false,
            'message' => 'Server error',
            'error' => $e->getMessage()
        ], 500);

    }

});

// GET Profile
Route::get('/profile', function (Request $request) {
    try {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'User ID diperlukan'
            ], 400);
        }

        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'profile_photo' => $user->profile_photo,
                'role' => $user->role,
                'divisi' => $user->divisi
            ]
        ]);

    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => 'Server error',
            'error' => $e->getMessage()
        ], 500);
    }
});

// UPDATE Profile
Route::put('/profile', function (Request $request) {
    try {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500'
        ]);

        $user = User::find($validated['user_id']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        // Cek email jika email diubah
        if ($user->email !== $validated['email']) {
            $existingUser = User::where('email', $validated['email'])->first();
            if ($existingUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email sudah digunakan'
                ], 400);
            }
        }

        // Update user
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? null;
        $user->address = $validated['address'] ?? null;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile berhasil diupdate',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'profile_photo' => $user->profile_photo,
                'role' => $user->role,
                'divisi' => $user->divisi
            ]
        ]);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors' => $e->errors()
        ], 422);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => 'Server error',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Upload Profile Photo
Route::post('/profile/photo', function (Request $request) {
    try {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'photo' => 'required|image|max:2048' // Max 2MB
        ]);

        $user = User::find($validated['user_id']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        // Hapus foto lama jika ada
        if ($user->profile_photo && Storage::exists('public/' . $user->profile_photo)) {
            Storage::delete('public/' . $user->profile_photo);
        }

        // Simpan foto baru
        $path = $request->file('photo')->store('profile-photos', 'public');
        $user->profile_photo = $path;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Foto profile berhasil diupdate',
            'profile_photo' => $path
        ]);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors' => $e->errors()
        ], 422);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => 'Server error',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Delete Profile Photo
Route::delete('/profile/photo', function (Request $request) {
    try {
        $validated = $request->validate([
            'user_id' => 'required|integer'
        ]);

        $user = User::find($validated['user_id']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        // Hapus foto jika ada
        if ($user->profile_photo && Storage::exists('public/' . $user->profile_photo)) {
            Storage::delete('public/' . $user->profile_photo);
        }

        $user->profile_photo = null;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Foto profile berhasil dihapus'
        ]);

    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => 'Server error',
            'error' => $e->getMessage()
        ], 500);
    }
});
