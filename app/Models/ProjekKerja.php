<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjekKerja extends Model
{
    use HasFactory;

    protected $table = 'projek_kerjas';


    /* =============================
       TAMBAH AGAR file_url MASUK API
    ============================== */
    protected $appends = [
        'file_url',
        'first_photo_url'
    ];


    /* =============================
       FIELD YANG BOLEH DISIMPAN
    ============================== */
    protected $fillable = [

        'report_no',
        'divisi',
        'jenis_pekerjaan',
        'karyawan',
        'alamat',
        'status',
        'start_date',
        'problem_description',

        // FILE
        'file'
    ];


    /* =============================
       AUTO CAST
    ============================== */
    protected $casts = [

        'start_date' => 'date:Y-m-d',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    /* =============================
       AUTO LOAD RELATION FOTO
    ============================== */
    protected $with = ['photos'];


    /* =============================
       RELATION FOTO
    ============================== */
    public function photos()
    {
        return $this->hasMany(
            ProjekKerjaPhoto::class,
            'projek_kerja_id'
        );
    }


    /* =============================
       URL FILE DOWNLOAD
    ============================== */
    public function getFileUrlAttribute()
    {
        if ($this->file) {
            return asset('storage/' . $this->file);
        }

        return null;
    }


    /* =============================
       URL FOTO PERTAMA
    ============================== */
    public function getFirstPhotoUrlAttribute()
    {
        if ($this->photos && $this->photos->count() > 0) {
            return asset('storage/' . $this->photos->first()->photo);
        }

        return null;
    }
}