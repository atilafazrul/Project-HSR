<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ServiceReportPart extends Model
{
    use HasFactory;

    protected $table = 'service_report_parts';

    protected $fillable = [
        'service_report_id',
        'part_name',
        'part_no',
        'in',
        'out',
        'qty',
    ];

    protected $casts = [
        'qty' => 'integer',
    ];

    public function serviceReport()
    {
        return $this->belongsTo(ServiceReport::class);
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> a7703d7d77dc671bc8c5d1e33e430d84fd52d0de
