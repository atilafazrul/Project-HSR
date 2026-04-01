<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class DownloadAuth
{
    public function handle(Request $request, Closure $next)
    {
        // Cek token dari header Authorization
        $token = $request->bearerToken();
        
        // Jika tidak ada, cek dari query parameter
        if (!$token) {
            $token = $request->query('token');
        }
        
        if ($token) {
            $tokenModel = PersonalAccessToken::findToken($token);
            if ($tokenModel && $tokenModel->tokenable) {
                auth()->login($tokenModel->tokenable);
                return $next($request);
            }
        }
        
        // Jika tidak ada token yang valid
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized. Silakan login terlebih dahulu.'
        ], 401);
    }
}