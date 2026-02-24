import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  MapPin,
  ListTodo,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

import axios from "axios";

/* PAGES */
import Profile from "./Profile.jsx";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import ITPage from "./ITPage";
import ServicePage from "./ServicePage";
import SalesPage from "./SalesPage";
import KontraktorPage from "./KontraktorPage";
import ProjekKerjaPage from "./ProjekKerjaPage";
import FotoProjekPage from "./FotoProjekPage";

/* ================= DUMMY ================= */

const ComingSoon = ({ title }) => (
  <div className="bg-white rounded-2xl shadow p-10 text-center">
    <h2 className="text-2xl font-bold mb-3">{title}</h2>
    <p className="text-gray-500">Halaman sedang dikembangkan</p>
  </div>
);

export default function SuperAdminDashboard({ user, logout }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.includes("projek-kerja/foto")) return "Kelola Foto";
    if (path.includes("projek-kerja")) return "Projek Kerja";
    if (path.includes("/it")) return "Divisi IT";
    if (path.includes("service")) return "Divisi Service";
    if (path.includes("sales")) return "Divisi Sales";
    if (path.includes("kontraktor")) return "Divisi Kontraktor";
    if (path.includes("profile")) return "Profile";
    if (path.includes("dashboard")) return "Dashboard";

    return "Super Admin";
  };

  useEffect(() => {
    document.title = `WEB HSR - ${getPageTitle()}`;
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">

      <Sidebar
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logout={logout}
        isExpanded={sidebarExpanded}
        setIsExpanded={setSidebarExpanded}
        navigate={navigate}
        role={user?.role}
      />

      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarExpanded ? "lg:ml-72" : "lg:ml-20"
        }`}
      >

        <Header
          user={user}
          showBell={false}
          title={getPageTitle()}
        />

        <div className="flex-1 p-8 overflow-y-auto">

          <Routes>

            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard user={user} />} />

            <Route path="it">
              <Route index element={<ITPage user={user} />} />
              <Route path="projek" element={<ProjekKerjaPage />} />
              <Route path="aset" element={<ComingSoon title="Aset IT" />} />
              <Route path="riwayat" element={<ComingSoon title="Riwayat IT" />} />
            </Route>

            <Route path="service">
              <Route index element={<ServicePage user={user} />} />
              <Route path="projek" element={<ProjekKerjaPage />} />
              <Route path="riwayat" element={<ComingSoon title="Riwayat Service" />} />
            </Route>

            <Route path="sales">
              <Route index element={<SalesPage user={user} />} />
              <Route path="projek" element={<ProjekKerjaPage />} />
              <Route path="riwayat" element={<ComingSoon title="Riwayat Sales" />} />
            </Route>

            <Route path="kontraktor">
              <Route index element={<KontraktorPage user={user} />} />
              <Route path="projek" element={<ProjekKerjaPage />} />
              <Route path="proyek" element={<ComingSoon title="Data Proyek" />} />
              <Route path="riwayat" element={<ComingSoon title="Riwayat Kontraktor" />} />
            </Route>

            <Route path="projek-kerja" element={<ProjekKerjaPage />} />
            <Route path="projek-kerja/foto/:id" element={<FotoProjekPage />} />

            <Route
              path="profile"
              element={<Profile user={user} logout={logout} />}
            />

            <Route path="*" element={<Navigate to="dashboard" replace />} />

          </Routes>

        </div>
      </main>
    </div>
  );
}

/* ================= DASHBOARD ================= */

const Dashboard = ({ user }) => {

  const [projek, setProjek] = useState([]);
  const [showDesc, setShowDesc] = useState(false);
  const [descText, setDescText] = useState("");

  const navigate = useNavigate();

  const basePath =
    user?.role === "super_admin"
      ? "/super_admin"
      : "/admin";

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/projek-kerja")
      .then((res) => {

        let data = res.data;

        if (user?.role !== "super_admin") {
          data = data.filter(p => p.divisi === user?.divisi);
        }

        setProjek(data);

      })
      .catch(err => console.error(err));

  }, [user]);

  const itCount = projek.filter(p => p.divisi === "IT").length;
  const serviceCount = projek.filter(p => p.divisi === "Service").length;
  const salesCount = projek.filter(p => p.divisi === "Sales").length;
  const kontraktorCount = projek.filter(p => p.divisi === "Kontraktor").length;

  const total = projek.length;
  const selesai = projek.filter(p => p.status === "Selesai").length;
  const proses = projek.filter(p => p.status === "Proses").length;
  const terlambat = projek.filter(p => p.status === "Terlambat").length;

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/projek-kerja/${id}/status`,
        { status }
      );

      setProjek(prev =>
        prev.map(p => p.id === id ? { ...p, status } : p)
      );

    } catch {
      alert("Gagal update status");
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Yakin hapus data?")) return;

    try {

      await axios.delete(
        `http://127.0.0.1:8000/api/projek-kerja/${id}`
      );

      setProjek(prev => prev.filter(p => p.id !== id));

    } catch {
      alert("Gagal hapus");
    }
  };

  const getStatusColor = (status) => {

    if (status === "Selesai")
      return "bg-green-100 text-green-700 border-green-400";

    if (status === "Terlambat")
      return "bg-red-100 text-red-700 border-red-400";

    return "bg-yellow-100 text-yellow-700 border-yellow-400";
  };

  return (
    <>

      {/* DIVISI */}
      <div className="bg-white rounded-3xl shadow-md p-8 mb-12">
        <h3 className="text-xl font-semibold mb-6">Divisi</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          <DivisiCard image="/images/it.jpg" title="Divisi IT" count={itCount} onClick={() => navigate(`${basePath}/it`)} />
          <DivisiCard image="/images/service.jpg" title="Divisi Service" count={serviceCount} onClick={() => navigate(`${basePath}/service`)} />
          <DivisiCard image="/images/sales.jpg" title="Divisi Sales" count={salesCount} onClick={() => navigate(`${basePath}/sales`)} />
          <DivisiCard image="/images/kontraktor.jpg" title="Divisi Kontraktor" count={kontraktorCount} onClick={() => navigate(`${basePath}/kontraktor`)} />

        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">

        <SummaryCard title="Total Tugas" value={total} icon={<ListTodo />} color="blue" />
        <SummaryCard title="Tugas Selesai" value={selesai} icon={<CheckCircle />} color="green" />
        <SummaryCard title="Sedang Dikerjakan" value={proses} icon={<Clock />} color="yellow" />
        <SummaryCard title="Tugas Terlambat" value={terlambat} icon={<AlertTriangle />} color="red" />

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <h3 className="text-xl font-semibold mb-6">
          Aktivitas Pekerjaan
        </h3>

        <table className="w-full text-sm text-center">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Divisi</th>
              <th className="p-3">Tugas</th>
              <th className="p-3">Karyawan</th>
              <th className="p-3">Lokasi</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Deskripsi</th>
              <th className="p-3">Status</th>
              <th className="p-3">File</th>
              <th className="p-3">Foto</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {projek.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">

                <td className="p-3">{item.divisi}</td>
                <td className="p-3 font-medium">{item.jenis_pekerjaan}</td>
                <td className="p-3">{item.karyawan}</td>
                <td className="p-3">{item.alamat}</td>
                <td className="p-3">{new Date(item.start_date).toLocaleDateString("id-ID")}</td>

                <td className="p-3">
                  {item.problem_description ? (
                    <button
                      onClick={() => {
                        setDescText(item.problem_description);
                        setShowDesc(true);
                      }}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs"
                    >
                      📄 Lihat
                    </button>
                  ) : "-"}
                </td>

                <td className="p-3">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item.id, e.target.value)
                    }
                    className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}
                  >
                    <option value="Proses">Proses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Terlambat">Terlambat</option>
                  </select>
                </td>

                <td className="p-3">
                  {item.file_url ? (
                    <a href={item.file_url} target="_blank" rel="noreferrer" className="text-blue-600">
                      Download
                    </a>
                  ) : "-"}
                </td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      navigate(`${basePath}/projek-kerja/foto/${item.id}`)
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
                  >
                    Lihat
                  </button>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                  >
                    Hapus
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDesc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <button onClick={() => setShowDesc(false)} className="absolute top-3 right-3 text-xl">✕</button>
            <h3 className="text-xl font-bold mb-4">📝 Detail Deskripsi</h3>
            <div className="border rounded-xl p-4 bg-gray-50 whitespace-pre-wrap">
              {descText}
            </div>
          </div>
        </div>
      )}

    </>
  );
};

/* ================= CARD ================= */

const DivisiCard = ({ image, title, count, onClick }) => (
  <div onClick={onClick} className="relative rounded-3xl overflow-hidden shadow cursor-pointer group">
    <img src={image} alt={title} className="h-56 w-full object-cover group-hover:scale-110 transition duration-300" />
    <div className="absolute inset-0 bg-black/50"></div>
    <div className="absolute bottom-0 p-6 text-white">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-sm mb-2">Total {count} Pekerjaan</p>
      <button className="bg-white/20 px-4 py-2 rounded-xl text-sm">Masuk →</button>
    </div>
  </div>
);

/* ================= SUMMARY ================= */

const SummaryCard = ({ title, value, icon, color }) => {
  const map = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow flex justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>
      <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${map[color]}`}>
        {icon}
      </div>
    </div>
  );
};