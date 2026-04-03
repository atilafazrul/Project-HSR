<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjekKerja;
use App\Models\ProjekKerjaPhoto;
use App\Models\ProjekKerjaFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProjekKerjaController extends Controller
{
    protected function isSuperAdmin(Request $request): bool
    {
        return $request->user()?->role === 'super_admin';
    }

    protected function rejectIfLockedForAdmin(Request $request, ProjekKerja $projek)
    {
        if ($projek->is_lunas && ! $this->isSuperAdmin($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Data sudah lunas, hanya superadmin yang bisa mengubah.',
            ], 403);
        }

        return null;
    }

    /**
     * @param  array<int, mixed>|null  $items
     * @return array<int, array{nominal: float, keterangan: string}>
     */
    protected function filterBiayaItems(?array $items): array
    {
        if ($items === null) {
            return [];
        }
        $out = [];
        foreach ($items as $row) {
            if (! is_array($row)) {
                continue;
            }
            $nom = isset($row['nominal']) ? (float) $row['nominal'] : 0;
            $ket = isset($row['keterangan']) ? trim((string) $row['keterangan']) : '';
            if ($nom < 0) {
                $nom = 0;
            }
            if ($nom > 0 || $ket !== '') {
                $out[] = ['nominal' => round($nom, 2), 'keterangan' => $ket];
            }
        }

        return $out;
    }

    /* ======================================================
       GET ALL
    ====================================================== */
    public function index()
    {
        $projek = ProjekKerja::with(['photos','files'])->latest()->get();
        return response()->json($projek);
    }

    /* ======================================================
       GET SINGLE
    ====================================================== */
    public function show($id)
    {
        $projek = ProjekKerja::with(['photos','files'])->findOrFail($id);
        return response()->json($projek);
    }

    /* ======================================================
       CREATE PROJECT + FILE + PHOTO
    ====================================================== */
    public function store(Request $request)
    {
        $request->validate([
            'divisi' => 'required|string',
            'jenis_pekerjaan' => 'required|string',
            'karyawan' => 'required|string',
            'alamat' => 'required|string',
            'status' => 'required|in:Dibuat,Persiapan,Proses Pekerjaan,Editing,Invoicing,Selesai',
            'start_date' => 'required|date',
            'problem_description' => 'nullable|string',
            'barang_dibeli' => 'nullable|string',
            'biaya_jalan_items' => 'nullable|array',
            'biaya_jalan_items.*.nominal' => 'required|numeric|min:0',
            'biaya_jalan_items.*.keterangan' => 'nullable|string|max:2000',
            'biaya_pengeluaran_items' => 'nullable|array',
            'biaya_pengeluaran_items.*.nominal' => 'required|numeric|min:0',
            'biaya_pengeluaran_items.*.keterangan' => 'nullable|string|max:2000',
            'biaya_reimbursment_items' => 'nullable|array',
            'biaya_reimbursment_items.*.nominal' => 'required|numeric|min:0',
            'biaya_reimbursment_items.*.keterangan' => 'nullable|string|max:2000',
            'file' => 'nullable|file|max:5120',
            'files.*' => 'nullable|file|max:5120',
            'photos.*' => 'nullable|image|max:2048'
        ]);

        DB::beginTransaction();

        try {
            $today = date('dmY');
            $lastId = ProjekKerja::max('id') ?? 0;
            $newNumber = $lastId + 1;
            $reportNo = "SR" . str_pad($newNumber, 3, "0", STR_PAD_LEFT) . "/HSR/" . $today;

            $projek = ProjekKerja::create([
                'report_no' => $reportNo,
                'divisi' => $request->divisi,
                'jenis_pekerjaan' => $request->jenis_pekerjaan,
                'karyawan' => $request->karyawan,
                'alamat' => $request->alamat,
                'status' => $request->status,
                'start_date' => Carbon::parse($request->start_date)->format('Y-m-d'),
                'problem_description' => $request->problem_description,
                'barang_dibeli' => $request->barang_dibeli,
                'biaya_jalan_items' => $this->filterBiayaItems($request->input('biaya_jalan_items')),
                'biaya_pengeluaran_items' => $this->filterBiayaItems($request->input('biaya_pengeluaran_items')),
                'biaya_reimbursment_items' => $this->filterBiayaItems($request->input('biaya_reimbursment_items')),
            ]);

            /* ================= FILE UPLOAD ================= */
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = $file->getClientOriginalName();
                $path = $file->storeAs('projek-files', $fileName, 'public');
                ProjekKerjaFile::create([
                    'projek_kerja_id' => $projek->id,
                    'file' => $path
                ]);
            }

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $fileName = $file->getClientOriginalName();
                    $path = $file->storeAs('projek-files', $fileName, 'public');
                    ProjekKerjaFile::create([
                        'projek_kerja_id' => $projek->id,
                        'file' => $path
                    ]);
                }
            }

            /* ================= PHOTO UPLOAD ================= */
            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $photo) {
                    $fileName = $photo->getClientOriginalName();
                    $path = $photo->storeAs('projek-photos', $fileName, 'public');
                    ProjekKerjaPhoto::create([
                        'projek_kerja_id' => $projek->id,
                        'photo' => $path
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $projek
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /* ======================================================
       UPDATE PROJECT (FULL)
    ====================================================== */
    public function update(Request $request, $id)
    {
        $request->validate([
            'divisi' => 'required|string',
            'jenis_pekerjaan' => 'required|string',
            'karyawan' => 'required|string',
            'alamat' => 'required|string',
            'status' => 'required|in:Dibuat,Persiapan,Proses Pekerjaan,Editing,Invoicing,Selesai',
            'start_date' => 'required|date',
            'problem_description' => 'nullable|string',
            'barang_dibeli' => 'nullable|string',
            'biaya_jalan_items' => 'nullable|array',
            'biaya_jalan_items.*.nominal' => 'required|numeric|min:0',
            'biaya_jalan_items.*.keterangan' => 'nullable|string|max:2000',
            'biaya_pengeluaran_items' => 'nullable|array',
            'biaya_pengeluaran_items.*.nominal' => 'required|numeric|min:0',
            'biaya_pengeluaran_items.*.keterangan' => 'nullable|string|max:2000',
            'biaya_reimbursment_items' => 'nullable|array',
            'biaya_reimbursment_items.*.nominal' => 'required|numeric|min:0',
            'biaya_reimbursment_items.*.keterangan' => 'nullable|string|max:2000',
        ]);

        $projek = ProjekKerja::findOrFail($id);

        $data = [
            'divisi' => $request->divisi,
            'jenis_pekerjaan' => $request->jenis_pekerjaan,
            'karyawan' => $request->karyawan,
            'alamat' => $request->alamat,
            'status' => $request->status,
            'start_date' => Carbon::parse($request->start_date)->format('Y-m-d'),
            'problem_description' => $request->problem_description,
            'barang_dibeli' => $request->barang_dibeli,
        ];
        if ($request->has('biaya_jalan_items')) {
            $data['biaya_jalan_items'] = $this->filterBiayaItems($request->input('biaya_jalan_items'));
        }
        if ($request->has('biaya_pengeluaran_items')) {
            $data['biaya_pengeluaran_items'] = $this->filterBiayaItems($request->input('biaya_pengeluaran_items'));
        }
        if ($request->has('biaya_reimbursment_items')) {
            $data['biaya_reimbursment_items'] = $this->filterBiayaItems($request->input('biaya_reimbursment_items'));
        }

        $projek->update($data);

        return response()->json([
            'success' => true,
            'data' => $projek
        ]);
    }

    /* ======================================================
       GET PHOTOS
    ====================================================== */
    public function getPhotos($id)
    {
        $projek = ProjekKerja::with('photos')->find($id);
        if (!$projek) {
            return response()->json(['success' => false], 404);
        }
        $photos = [];
        foreach ($projek->photos as $photo) {
            $photos[] = [
                'id' => $photo->id,
                'url' => asset('storage/' . $photo->photo)
            ];
        }
        return response()->json([
            'success' => true,
            'photos' => $photos
        ]);
    }

    /* ======================================================
       GET FILES
    ====================================================== */
    public function getFiles($id)
    {
        $projek = ProjekKerja::with('files')->find($id);
        if (!$projek) {
            return response()->json(['success' => false], 404);
        }
        $files = [];
        foreach ($projek->files as $file) {
            $files[] = [
                'id' => $file->id,
                'url' => asset('storage/' . $file->file)
            ];
        }
        return response()->json([
            'success' => true,
            'files' => $files
        ]);
    }

    /* ======================================================
       ADD PHOTO
    ====================================================== */
    public function addPhoto(Request $request, $id)
    {
        $request->validate([
            'photo' => 'required|image|max:2048'
        ]);

        $photo = $request->file('photo');
        $fileName = $photo->getClientOriginalName();
        $path = $photo->storeAs('projek-photos', $fileName, 'public');

        $photoModel = ProjekKerjaPhoto::create([
            'projek_kerja_id' => $id,
            'photo' => $path
        ]);

        return response()->json([
            'success' => true,
            'photo' => $photoModel
        ]);
    }

    /* ======================================================
       ADD FILE
    ====================================================== */
    public function addFile(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|max:5120'
        ]);

        $fileUpload = $request->file('file');
        $fileName = $fileUpload->getClientOriginalName();
        $path = $fileUpload->storeAs('projek-files', $fileName, 'public');

        $fileModel = ProjekKerjaFile::create([
            'projek_kerja_id' => $id,
            'file' => $path
        ]);

        return response()->json([
            'success' => true,
            'file' => $fileModel
        ]);
    }

    /* ======================================================
       DELETE PHOTO
    ====================================================== */
    public function deletePhoto($id)
    {
        $photo = ProjekKerjaPhoto::findOrFail($id);
        if (Storage::disk('public')->exists($photo->photo)) {
            Storage::disk('public')->delete($photo->photo);
        }

        $photo->delete();

        return response()->json(['success' => true]);
    }

    /* ======================================================
       DELETE FILE
    ====================================================== */
    public function deleteFile($id)
    {
        $file = ProjekKerjaFile::findOrFail($id);
        if (Storage::disk('public')->exists($file->file)) {
            Storage::disk('public')->delete($file->file);
        }

        $file->delete();

        return response()->json(['success' => true]);
    }

    /* ======================================================
       UPDATE STATUS
    ====================================================== */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Dibuat,Persiapan,Proses Pekerjaan,Editing,Invoicing,Selesai'
        ]);

        $projek = ProjekKerja::findOrFail($id);
        $projek->update(['status' => $request->status]);

        return response()->json(['success' => true]);
    }

    /* ======================================================
       UPDATE DESCRIPTION
    ====================================================== */
    public function updateDescription(Request $request, $id)
    {
        $request->validate([
            'problem_description' => 'nullable|string'
        ]);

        $projek = ProjekKerja::findOrFail($id);
        $projek->update([
            'problem_description' => $request->problem_description
        ]);

        return response()->json(['success' => true]);
    }

    /* ======================================================
       UPDATE BIAYA (JALAN, PENGELUARAN, REIMBURSMENT)
    ====================================================== */
    public function updateUang(Request $request, $id)
    {
        $request->validate([
            'biaya_jalan_items' => 'required|array',
            'biaya_jalan_items.*.nominal' => 'required|numeric|min:0',
            'biaya_jalan_items.*.keterangan' => 'nullable|string|max:2000',
            'biaya_pengeluaran_items' => 'required|array',
            'biaya_pengeluaran_items.*.nominal' => 'required|numeric|min:0',
            'biaya_pengeluaran_items.*.keterangan' => 'nullable|string|max:2000',
            'biaya_reimbursment_items' => 'required|array',
            'biaya_reimbursment_items.*.nominal' => 'required|numeric|min:0',
            'biaya_reimbursment_items.*.keterangan' => 'nullable|string|max:2000',
        ]);

        $projek = ProjekKerja::findOrFail($id);
        if ($resp = $this->rejectIfLockedForAdmin($request, $projek)) {
            return $resp;
        }
        $projek->update([
            'biaya_jalan_items' => $this->filterBiayaItems($request->input('biaya_jalan_items')),
            'biaya_pengeluaran_items' => $this->filterBiayaItems($request->input('biaya_pengeluaran_items')),
            'biaya_reimbursment_items' => $this->filterBiayaItems($request->input('biaya_reimbursment_items')),
        ]);

        return response()->json([
            'success' => true,
            'data' => $projek->fresh(),
        ]);
    }

    /* ======================================================
       EXPORT BIAYA → CSV (dibuka di Microsoft Excel)
    ====================================================== */
    public function exportBiayaCsv($id)
    {
        $projek = ProjekKerja::findOrFail($id);

        $sections = [
            'Biaya Jalan' => $projek->biaya_jalan_items ?? [],
            'Biaya Pengeluaran' => $projek->biaya_pengeluaran_items ?? [],
            'Biaya Reimbursment' => $projek->biaya_reimbursment_items ?? [],
        ];

        $filename = 'biaya-projek-'.preg_replace('/[^a-zA-Z0-9_-]/', '_', (string) $projek->report_no).'-'.$id.'.csv';

        return response()->streamDownload(function () use ($sections, $projek) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, ['Ringkasan Biaya Projek Kerja'], ';');
            fputcsv($out, ['No. Laporan', $projek->report_no], ';');
            fputcsv($out, ['Divisi', $projek->divisi], ';');
            fputcsv($out, ['Jenis Pekerjaan', $projek->jenis_pekerjaan], ';');
            fputcsv($out, ['Karyawan', $projek->karyawan], ';');
            fputcsv($out, [], ';');

            $grand = 0.0;
            foreach ($sections as $title => $rows) {
                fputcsv($out, [$title], ';');
                fputcsv($out, ['No', 'Nominal (IDR)', 'Keterangan'], ';');
                $sub = 0.0;
                $no = 1;
                foreach ($rows as $row) {
                    $nom = isset($row['nominal']) ? (float) $row['nominal'] : 0;
                    $ket = isset($row['keterangan']) ? (string) $row['keterangan'] : '';
                    $sub += $nom;
                    fputcsv($out, [$no, number_format($nom, 2, ',', ''), $ket], ';');
                    $no++;
                }
                fputcsv($out, ['Subtotal '.$title, number_format($sub, 2, ',', ''), ''], ';');
                $grand += $sub;
                fputcsv($out, [], ';');
            }
            fputcsv($out, ['TOTAL KESELURUHAN (IDR)', number_format($grand, 2, ',', ''), ''], ';');
            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function setLunas(Request $request, $id)
    {
        if (! $this->isSuperAdmin($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya superadmin yang bisa mengubah status lunas.',
            ], 403);
        }

        $request->validate([
            'is_lunas' => 'required|boolean',
        ]);

        $projek = ProjekKerja::findOrFail($id);
        $isLunas = (bool) $request->boolean('is_lunas');

        $projek->update([
            'is_lunas' => $isLunas,
            'lunas_at' => $isLunas ? now() : null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $projek->fresh(),
        ]);
    }

    /* ======================================================
       DELETE PROJECT
    ====================================================== */
    public function destroy($id)
    {
        $projek = ProjekKerja::with(['photos', 'files'])->findOrFail($id);
        foreach ($projek->photos as $photo) {
            if (Storage::disk('public')->exists($photo->photo)) {
                Storage::disk('public')->delete($photo->photo);
            }
        }

        foreach ($projek->files as $file) {
            if (Storage::disk('public')->exists($file->file)) {
                Storage::disk('public')->delete($file->file);
            }
        }

        $projek->delete();

        return response()->json(['success' => true]);
    }
}