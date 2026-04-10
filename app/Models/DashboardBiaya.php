<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DashboardBiaya extends Model
{
    use HasFactory;

    protected $fillable = [
        'divisi',
        'kategori',
        'nominal',
        'keterangan',
        'is_lunas',
        'lunas_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'nominal' => 'decimal:2',
        'is_lunas' => 'boolean',
        'lunas_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
