import React, { useState } from "react";
import {
  MapPin,
  ListTodo,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import Profile from "./Profile.jsx";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

/* IMPORT PAGE */
import ITPage from "./ITPage";
import ServicePage from "./ServicePage";
import SalesPage from "./SalesPage";
import KontraktorPage from "./KontraktorPage";

const SuperAdminDashboard = ({ user, logout }) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(user);

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  /* ================= PROFILE PAGE ================= */
  if (currentPage === "profile") {
    return (
      <Profile
        user={currentUser}
        logout={logout}
        onProfileUpdate={handleProfileUpdate}
        setCurrentPage={setCurrentPage}
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6fb] relative">

      {/* ================= SIDEBAR ================= */}
      <Sidebar
        user={currentUser}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logout={logout}
        isExpanded={sidebarExpanded}
        setIsExpanded={setSidebarExpanded}
      />

      {/* ================= MAIN ================= */}
      <main
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out
        ${sidebarExpanded ? "lg:ml-72" : "lg:ml-20"}`}
      >

        {/* HEADER */}
        <Header
          user={currentUser}
          currentPage={currentPage}
          showBell={true}
        />

        {/* CONTENT */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">

          {/* ================= DASHBOARD ================= */}
          {currentPage === "dashboard" && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Dashboard
              </h2>

              <p className="text-gray-500 mb-10">
                Selamat Datang di Sistem Dokumentasi Kerja
              </p>

              {/* DIVISI CARD */}
              <div className="bg-white rounded-3xl shadow-md p-8 mb-12">
                <h3 className="text-xl font-semibold mb-6">Divisi</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

                  <Card title="IT" desc="Kelola dokumentasi IT" image="/images/istockphoto-1321221451-612x61211.jpg" setCurrentPage={setCurrentPage} />
                  <Card title="SERVICE" desc="Kelola dokumentasi Service" image="/images/service.jpg" setCurrentPage={setCurrentPage} />
                  <Card title="KONTRAKTOR" desc="Kelola dokumentasi Kontraktor" image="/images/kontraktor.jpg" setCurrentPage={setCurrentPage} />
                  <Card title="SALES" desc="Kelola dokumentasi Sales" image="/images/sales.jpg" setCurrentPage={setCurrentPage} />

                </div>
              </div>

              {/* SUMMARY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">

                <SummaryCard title="Total Tugas" value="235" icon={<ListTodo />} color="blue" />
                <SummaryCard title="Tugas Selesai" value="180" icon={<CheckCircle />} color="green" />
                <SummaryCard title="Sedang Dikerjakan" value="42" icon={<Clock />} color="yellow" />
                <SummaryCard title="Tugas Terlambat" value="13" icon={<AlertTriangle />} color="red" />

              </div>

              {/* TABLE */}
              <div className="bg-white rounded-3xl shadow-md p-8">
                <h3 className="text-xl font-semibold mb-6">
                  Aktivitas Pekerjaan
                </h3>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="py-3 text-left">Divisi</th>
                      <th className="py-3 text-left">Tugas</th>
                      <th className="py-3 text-left">Karyawan</th>
                      <th className="py-3 text-left">Lokasi</th>
                      <th className="py-3 text-left">Status</th>
                      <th className="py-3 text-left">Tanggal</th>
                    </tr>
                  </thead>

                  <tbody>
                    <ReportRow divisi="IT" tugas="Set Up Server" karyawan="Sandi" lokasi="Jakarta" status="Selesai" tanggal="24 April 2024" />
                    <ReportRow divisi="Service" tugas="Service AC" karyawan="Indra" lokasi="Bandung" status="Proses" tanggal="23 April 2024" />
                    <ReportRow divisi="Kontraktor" tugas="Panel Listrik" karyawan="Budi" lokasi="Tangerang" status="Terlambat" tanggal="22 April 2024" />
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ================= PAGE ASLI ================= */}
          {currentPage === "it" && <ITPage goBack={() => setCurrentPage("dashboard")} />}
          {currentPage === "service" && <ServicePage goBack={() => setCurrentPage("dashboard")} />}
          {currentPage === "sales" && <SalesPage goBack={() => setCurrentPage("dashboard")} />}
          {currentPage === "kontraktor" && <KontraktorPage goBack={() => setCurrentPage("dashboard")} />}

        </div>
      </main>
    </div>
  );
};

/* ================= COMPONENT ================= */

const Card = ({ title, desc, image, setCurrentPage }) => {

  const handleClick = () => {
    setCurrentPage(title.toLowerCase());
  };

  return (
    <div onClick={handleClick} className="relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer">
      <img src={image} alt={title} className="w-full h-56 object-cover group-hover:scale-110 transition" />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute bottom-0 p-6 text-white w-full">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-sm mb-4">{desc}</p>
        <button className="bg-white/20 px-4 py-2 rounded-xl">Masuk →</button>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color }) => {

  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600"
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      </div>
      <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
};

const ReportRow = ({ divisi, tugas, karyawan, lokasi, status, tanggal }) => {

  const statusColor = {
    Selesai: "bg-green-100 text-green-600",
    Proses: "bg-yellow-100 text-yellow-600",
    Terlambat: "bg-red-100 text-red-600"
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-4">{divisi}</td>
      <td className="py-4 font-medium">{tugas}</td>
      <td className="py-4">{karyawan}</td>
      <td className="py-4 flex items-center gap-2 text-gray-600">
        <MapPin size={16} />
        {lokasi}
      </td>
      <td className="py-4">
        <span className={`px-3 py-1 rounded-full text-xs ${statusColor[status]}`}>
          {status}
        </span>
      </td>
      <td className="py-4 text-gray-500">{tanggal}</td>
    </tr>
  );
};

export default SuperAdminDashboard;