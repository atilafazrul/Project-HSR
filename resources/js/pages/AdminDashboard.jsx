import React, { useState } from "react";
import {
  ListTodo,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
} from "lucide-react";

/* IMPORT PAGE ASLI */
import ITPage from "./ITPage";
import ServicePage from "./ServicePage";
import SalesPage from "./SalesPage";
import KontraktorPage from "./KontraktorPage";
import Profile from "./Profile.jsx";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function AdminDashboard({ user, logout }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(user);

  const currentDivisi = user?.divisi || "Service";

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

  /* ================= HELPER ================= */

  const getDivisiPage = () => {
    if (currentDivisi === "IT") return "it";
    if (currentDivisi === "Service" || currentDivisi === "SERVICE") return "service";
    if (currentDivisi === "Kontraktor") return "kontraktor";
    if (currentDivisi === "Sales") return "sales";
    return "service";
  };

  const getDivisiImage = () => {
    if (currentDivisi === "IT") return "/images/it.jpg";
    if (currentDivisi === "Service" || currentDivisi === "SERVICE") return "/images/service.jpg";
    if (currentDivisi === "Kontraktor") return "/images/kontraktor.jpg";
    if (currentDivisi === "Sales") return "/images/sales.jpg";
    return "/images/service.jpg";
  };

  /* ================= LAYOUT ================= */

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">

      {/* SIDEBAR */}
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

      {/* MAIN */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
        ${sidebarExpanded ? "lg:ml-72" : "lg:ml-20"}`}
      >

        {/* HEADER */}
        <Header
          user={currentUser}
          currentPage={currentPage}
          showBell={false}
        />

        {/* CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">

          {/* DASHBOARD */}
          {currentPage === "dashboard" && (
            <>
              <h2 className="text-3xl font-bold mb-2">
                Selamat Datang, {currentUser?.name}
              </h2>

              <p className="text-gray-500 mb-10">
                Selamat datang, {user?.name}
              </p>

              {/* CARD DIVISI (BALIK) */}
              <div className="bg-white rounded-3xl shadow p-8 mb-10">

                <h3 className="text-xl font-semibold mb-6">
                  Divisi
                </h3>

                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">

                  <DivisiCard
                    title={currentDivisi}
                    image={getDivisiImage()}
                    onClick={() => setCurrentPage(getDivisiPage())}
                  />

                </div>

              </div>

              {/* SUMMARY */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

                <SummaryCard title="Total Tugas" value="120" icon={<ListTodo />} color="blue" />
                <SummaryCard title="Selesai" value="90" icon={<CheckCircle />} color="green" />
                <SummaryCard title="Proses" value="20" icon={<Clock />} color="yellow" />
                <SummaryCard title="Terlambat" value="10" icon={<AlertTriangle />} color="red" />

              </div>

              {/* TABLE */}
              <div className="bg-white rounded-3xl shadow p-8">

                <h3 className="text-xl font-semibold mb-6">
                  Aktivitas
                </h3>

                <table className="w-full text-sm border-collapse">

                  <thead>
                    <tr className="border-b text-gray-500">

                      <th className="py-3 px-3 text-left">Divisi</th>
                      <th className="py-3 px-3 text-left">Tugas</th>
                      <th className="py-3 px-3 text-left">Karyawan</th>
                      <th className="py-3 px-3 text-left">Lokasi</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-center">Tanggal</th>

                    </tr>
                  </thead>
                </table>

              </div>
            </>
          )}

          {/* PAGE ASLI */}
          {currentPage === "it" && <ITPage goBack={() => setCurrentPage("dashboard")} />}
          {currentPage === "service" && <ServicePage goBack={() => setCurrentPage("dashboard")} />}
          {currentPage === "sales" && <SalesPage goBack={() => setCurrentPage("dashboard")} />}
          {currentPage === "kontraktor" && <KontraktorPage goBack={() => setCurrentPage("dashboard")} />}

        </div>
      </main>
    </div>
  );
}

/* ================= COMPONENT ================= */

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
        <p className="text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>

      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${map[color]}`}>
        {icon}
      </div>

    </div>
  );
};

const DivisiCard = ({ title, image, onClick }) => (
  <div
    onClick={onClick}
    className="relative rounded-3xl overflow-hidden shadow cursor-pointer group"
  >

    <img
      src={image}
      className="h-56 w-full object-cover group-hover:scale-110 transition"
    />

    <div className="absolute inset-0 bg-black/50"></div>

    <div className="absolute bottom-0 p-6 text-white">

      <h3 className="text-2xl font-bold">{title}</h3>

      <button className="bg-white/20 px-4 py-2 rounded-xl mt-2">
        Masuk →
      </button>

    </div>
  </div>
);

const Row = ({ divisi, tugas, nama, lokasi, status, tanggal = "2025" }) => {

  const map = {
    Selesai: "bg-green-100 text-green-600",
    Proses: "bg-yellow-100 text-yellow-600",
    Terlambat: "bg-red-100 text-red-600",
  };

  return (
    <tr className="border-b hover:bg-gray-50">

      <td className="py-4 px-3 font-medium">{divisi}</td>
      <td className="py-4 px-3">{tugas}</td>
      <td className="py-4 px-3">{nama}</td>

      <td className="py-4 px-3">
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin size={14} />
          <span>{lokasi}</span>
        </div>
      </td>

      <td className="py-4 px-3 text-center">

        <span className={`px-3 py-1 rounded-full text-xs ${map[status]}`}>
          {status}
        </span>

      </td>

      <td className="py-4 px-3 text-center text-gray-500">
        {tanggal}
      </td>

    </tr>
  );
};
