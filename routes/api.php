<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

use App\Models\User;
use App\Http\Controllers\ProjekKerjaController;


/*
|--------------------------------------------------------------------------
| AUTH API
|--------------------------------------------------------------------------
*/

// ================= LOGIN =================
Route::post('/login', function (Request $request) {

    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $validated['email'])->first();

    if (!$user || !Hash::check($validated['password'], $user->password)) {

        return response()->json([
            'success' => false,
            'message' => 'Email atau password salah'
        ], 401);
    }

    return response()->json([
        'success' => true,
        'user' => $user
    ]);
});


/*
|--------------------------------------------------------------------------
| PROFILE API
|--------------------------------------------------------------------------
*/

// ================= GET PROFILE =================
Route::get('/profile', function (Request $request) {

    $user = User::find($request->query('user_id'));

    if (!$user) {

        return response()->json([
            'success' => false,
            'message' => 'User tidak ditemukan'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'user' => $user
    ]);
});


// ================= UPDATE PROFILE =================
Route::put('/profile', function (Request $request) {

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

    $user->update($validated);

    return response()->json([
        'success' => true,
        'message' => 'Profile berhasil diupdate',
        'user' => $user
    ]);
});


/*
|--------------------------------------------------------------------------
| PROFILE PHOTO API
|--------------------------------------------------------------------------
*/

// ================= UPLOAD PHOTO =================
Route::post('/profile/photo', function (Request $request) {

    $validated = $request->validate([
        'user_id' => 'required|integer',
        'photo' => 'required|image|max:2048'
    ]);

    $user = User::find($validated['user_id']);

    if (!$user) {

        return response()->json([
            'success' => false,
            'message' => 'User tidak ditemukan'
        ], 404);
    }

    if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
        Storage::disk('public')->delete($user->profile_photo);
    }

    $path = $request->file('photo')->store('profile-photos', 'public');

    $user->profile_photo = $path;
    $user->save();

    return response()->json([
        'success' => true,
        'profile_photo' => $path
    ]);
});


// ================= DELETE PHOTO =================
Route::delete('/profile/photo', function (Request $request) {

    $user = User::find($request->user_id);

    if (!$user) {

        return response()->json([
            'success' => false,
            'message' => 'User tidak ditemukan'
        ], 404);
    }

    if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
        Storage::disk('public')->delete($user->profile_photo);
    }

    $user->profile_photo = null;
    $user->save();

    return response()->json([
        'success' => true,
        'message' => 'Foto berhasil dihapus'
    ]);
});


/*
|--------------------------------------------------------------------------
| PROJEK KERJA API
|--------------------------------------------------------------------------
*/


// ================= READ =================
Route::get('/projek-kerja', [ProjekKerjaController::class, 'index']);
Route::get('/projek-kerja/{id}', [ProjekKerjaController::class, 'show']);


// ================= CREATE =================
Route::post('/projek-kerja', [ProjekKerjaController::class, 'store']);


// ================= UPDATE FULL =================
Route::put('/projek-kerja/{id}', [ProjekKerjaController::class, 'update']);


// ================= UPDATE STATUS =================
Route::patch('/projek-kerja/{id}/status', [
    ProjekKerjaController::class,
    'updateStatus'
]);


// ================= UPDATE DESKRIPSI =================
Route::patch('/projek-kerja/{id}/deskripsi', [
    ProjekKerjaController::class,
    'updateDescription'
]);


// ================= PHOTO =================
Route::post('/projek-kerja/{id}/add-photo', [
    ProjekKerjaController::class,
    'addPhoto'
]);

// ======= GET FOTO (BARU - UNTUK ADMIN & SUPER ADMIN) =======
Route::get('/projek-kerja/{id}/photos', [
    ProjekKerjaController::class,
    'getPhotos'
]);

Route::delete('/projek-kerja/photo/{photoId}', [
    ProjekKerjaController::class,
    'deletePhoto'
]);


// ================= DELETE =================
Route::delete('/projek-kerja/{id}', [
    ProjekKerjaController::class,
    'destroy'
]);