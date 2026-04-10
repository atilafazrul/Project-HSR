import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axiosConfig";
import { DollarSign, Trash2 } from "lucide-react";

const kategoriConfig = [
  { key: "jalan", label: "Biaya Jalan" },
  { key: "pengeluaran", label: "Biaya Pengeluaran" },
  { key: "reimbursment", label: "Biaya Reimbursment" },
];

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const formatDateTime = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "-";
  const datePart = d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(":", ".");
  return `${datePart} ${timePart}`;
};

export default function BiayaDashboardPanel({ user }) {
  const [summary, setSummary] = useState({
    jalan: 0,
    pengeluaran: 0,
    reimbursment: 0,
    total: 0,
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    jalan: { nominal: "", keterangan: "" },
    pengeluaran: { nominal: "", keterangan: "" },
    reimbursment: { nominal: "", keterangan: "" },
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sumRes, listRes] = await Promise.all([
        api.get("/dashboard-biaya/summary"),
        api.get("/dashboard-biaya"),
      ]);
      setSummary(sumRes.data?.data || {});
      setItems(listRes.data?.data || []);
    } catch (err) {
      console.error("Gagal load dashboard biaya", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const grouped = useMemo(
    () => ({
      jalan: items.filter((i) => i.kategori === "jalan"),
      pengeluaran: items.filter((i) => i.kategori === "pengeluaran"),
      reimbursment: items.filter((i) => i.kategori === "reimbursment"),
    }),
    [items]
  );

  const submitKategori = async (kategori) => {
    const row = form[kategori];
    const nominal = Number(row.nominal || 0);
    if (!nominal || nominal <= 0) {
      alert("Nominal harus lebih dari 0");
      return;
    }
    try {
      await api.post("/dashboard-biaya", {
        kategori,
        nominal,
        keterangan: row.keterangan || "",
      });
      setForm((p) => ({ ...p, [kategori]: { nominal: "", keterangan: "" } }));
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal simpan biaya");
    }
  };

  const toggleLunas = async (row) => {
    try {
      await api.patch(`/dashboard-biaya/${row.id}`, { is_lunas: !row.is_lunas });
      setItems((prev) =>
        prev.map((x) =>
          x.id === row.id ? { ...x, is_lunas: !x.is_lunas, lunas_at: !x.is_lunas ? new Date().toISOString() : null } : x
        )
      );
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal update lunas");
    }
  };

  const removeRow = async (id) => {
    if (!window.confirm("Hapus data biaya ini?")) return;
    try {
      await api.delete(`/dashboard-biaya/${id}`);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal hapus data");
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-4 sm:p-5 md:p-6 lg:p-8 mb-6 sm:mb-8 md:mb-10">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
        <DollarSign size={18} className="text-emerald-600" />
        Biaya Diluar Projek
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {kategoriConfig.map((k) => (
          <div key={k.key} className="rounded-xl border p-3 bg-gray-50">
            <p className="text-sm font-semibold mb-2">{k.label}</p>
            <input
              type="number"
              min="0"
              value={form[k.key].nominal}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  [k.key]: { ...p[k.key], nominal: e.target.value },
                }))
              }
              placeholder="Nominal"
              className="w-full border rounded-lg p-2 text-sm mb-2"
            />
            <input
              type="text"
              value={form[k.key].keterangan}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  [k.key]: { ...p[k.key], keterangan: e.target.value },
                }))
              }
              placeholder="Keterangan"
              className="w-full border rounded-lg p-2 text-sm mb-2"
            />
            <button
              type="button"
              onClick={() => submitKategori(k.key)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm"
            >
              Simpan {k.label}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Summary title="Biaya Jalan" value={summary.jalan} />
        <Summary title="Pengeluaran" value={summary.pengeluaran} />
        <Summary title="Reimbursment" value={summary.reimbursment} />
        <Summary title="Total" value={summary.total} highlight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {kategoriConfig.map((k) => (
          <div key={k.key} className="border rounded-xl p-3">
            <p className="text-sm font-semibold mb-2">{k.label}</p>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {(grouped[k.key] || []).map((row) => (
                <div key={row.id} className="text-xs border rounded-lg p-2">
                  <p className="font-semibold">{rupiah(row.nominal)}</p>
                  {row.keterangan ? <p className="text-gray-600">{row.keterangan}</p> : null}
                  <p className="mt-1 text-[11px] text-gray-500">
                    <span className="font-medium">{row.creator_name || row.updater_name || "-"}</span>, {formatDateTime(row.created_at)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleLunas(row)}
                      className={`px-2 py-1 rounded border ${row.is_lunas ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "bg-yellow-100 text-yellow-700 border-yellow-300"}`}
                    >
                      {row.is_lunas ? "Lunas" : "Belum"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="px-2 py-1 rounded border bg-red-100 text-red-600 border-red-300"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {(grouped[k.key] || []).length === 0 ? (
                <p className="text-xs text-gray-400">Belum ada data</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {loading ? <p className="text-xs text-gray-400 mt-3">Memuat...</p> : null}
    </div>
  );
}

function Summary({ title, value, highlight = false }) {
  return (
    <div className={`rounded-xl p-3 border ${highlight ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}>
      <p className="text-xs text-gray-600">{title}</p>
      <p className="font-bold text-sm">{rupiah(value)}</p>
    </div>
  );
}
