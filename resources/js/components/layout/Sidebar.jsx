import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Folder,
  User,
  ChevronDown,
  ChevronRight,
  Monitor,
  Wrench,
  BarChart3,
  Hammer,
  Menu,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  user,
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
  logout,
  showProfileOnly = false,
  isExpanded = true,
  setIsExpanded,
}) {
  const [openDivisi, setOpenDivisi] = useState(() => {
    // Load state dari localStorage, default true jika belum ada
    const saved = localStorage.getItem("sidebarDivisiOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [internalExpanded, setInternalExpanded] = useState(true);

  // Simpan state openDivisi ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("sidebarDivisiOpen", JSON.stringify(openDivisi));
  }, [openDivisi]);

  // Gunakan props jika ada, gunakan internal state jika tidak
  const expanded = isExpanded !== undefined ? isExpanded : internalExpanded;

  const toggleSidebar = () => {
    if (setIsExpanded) {
      setIsExpanded(!isExpanded);
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  // Cek apakah user super admin
  const isSuperAdmin = user?.role === "super_admin";

  // Cek apakah user biasa (admin atau user role)
  const isRegularUser = user?.role === "admin" || user?.role === "user";

  // Get divisi page untuk navigasi
  const getDivisiPage = (divisiName) => {
    const map = {
      IT: "it",
      SERVICE: "service",
      KONTRAKTOR: "kontraktor",
      SALES: "sales",
    };
    return map[divisiName?.toUpperCase()] || "service";
  };

  // Get icon untuk divisi
  const getDivisiIcon = (divisiName) => {
    const map = {
      IT: <Monitor size={18} />,
      SERVICE: <Wrench size={18} />,
      KONTRAKTOR: <Hammer size={18} />,
      SALES: <BarChart3 size={18} />,
    };
    return map[divisiName?.toUpperCase()] || <Wrench size={18} />;
  };

  // Daftar semua divisi untuk super admin
  const allDivisis = [
    { name: "IT", icon: <Monitor size={18} /> },
    { name: "Service", icon: <Wrench size={18} /> },
    { name: "Kontraktor", icon: <Hammer size={18} /> },
    { name: "Sales", icon: <BarChart3 size={18} /> },
  ];

  return (
    <aside
      className={`sidebar-no-scrollbar fixed z-40 top-0 left-0 h-full
      ${expanded ? "w-72" : "w-20"}
      text-white
      flex flex-col justify-between overflow-y-auto overflow-x-hidden
      transform transition-all duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      style={{
        backgroundColor: '#172238',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <div className="p-4">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 mb-6 rounded-lg hover:bg-slate-800 transition-colors duration-200"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <div className={`hidden ${expanded ? "lg:flex justify-center" : "lg:flex justify-center"} mb-10 transition-all duration-300`}>
          <img
            src="/images/LOGO HSR.png"
            alt="HSR Logo"
            className={`h-14 object-contain transition-all duration-300 ${expanded ? "opacity-100" : "opacity-0 w-0"}`}
          />
          {!expanded && (
            <img
              src="/images/LOGO HSR.png"
              alt="HSR Logo"
              className="h-10 object-contain absolute"
            />
          )}
        </div>

        <div className="space-y-2">
          {/* Dashboard Menu */}
          <div onClick={() => setCurrentPage("dashboard")}>
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              text="Dashboard"
              active={currentPage === "dashboard"}
              expanded={expanded}
            />
          </div>

          {/* Divisi Section */}
          {isSuperAdmin ? (
            // SUPER ADMIN - Dropdown dengan semua divisi
            <div
              className={`flex items-center justify-between px-4 py-2 rounded-lg hover:bg-slate-800 cursor-pointer transition`}
              onClick={() => setOpenDivisi(!openDivisi)}
            >
              <div className="flex items-center">
                <span className="flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center">
                  <Folder size={18} />
                </span>
                <span
                  className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? "opacity-100 max-w-60" : "opacity-0 max-w-0 ml-0"
                    }`}
                >
                  Divisi
                </span>
              </div>
              <span
                className={`transition-all duration-300 overflow-hidden ${expanded ? "opacity-100 max-w-6" : "opacity-0 max-w-0"
                  }`}
              >
                {openDivisi ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            </div>
          ) : (
            // ADMIN / USER BIASA - Label divisi tanpa dropdown
            <div className={`flex items-center px-4 py-2 bg-slate-800 rounded-lg`}>
              <span className="flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center">
                <Folder size={18} />
              </span>
              <span
                className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? "opacity-100 max-w-60" : "opacity-0 max-w-0 ml-0"
                  }`}
              >
                Divisi
              </span>
            </div>
          )}

          {/* Divisi Items */}
          {isSuperAdmin ? (
            // SUPER ADMIN - Tampilkan semua divisi dengan dropdown
            openDivisi && (
              <div className="space-y-1">
                {allDivisis.map((divisi) => (
                  <div
                    key={divisi.name}
                    onClick={() => setCurrentPage(getDivisiPage(divisi.name))}
                  >
                    <SidebarItem
                      icon={divisi.icon}
                      text={divisi.name}
                      active={currentPage === getDivisiPage(divisi.name)}
                      expanded={expanded}
                      indented={true}
                    />
                  </div>
                ))}
              </div>
            )
          ) : (
            // ADMIN / USER BIASA - Hanya tampilkan divisi sendiri
            <div>
              <div onClick={() => setCurrentPage(getDivisiPage(user?.divisi))}>
                <SidebarItem
                  icon={getDivisiIcon(user?.divisi)}
                  text={user?.divisi || "Service"}
                  active={currentPage === getDivisiPage(user?.divisi)}
                  expanded={expanded}
                  indented={true}
                />
              </div>
            </div>
          )}

          {/* Profile Menu */}
          <div onClick={() => setCurrentPage("profile")}>
            <SidebarItem
              icon={<User size={18} />}
              text="Profile"
              active={currentPage === "profile"}
              expanded={expanded}
            />
          </div>
        </div>
      </div>

      <button
        onClick={logout}
        className={`mx-4 mb-4 bg-red-500 hover:bg-red-600 py-3 rounded-xl font-medium shadow-lg transition-all cursor-pointer duration-300 px-4 flex items-center justify-start`}
      >
        <span className="flex-shrink-0">
          <LogOut size={20} />
        </span>
        <span
          className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? "opacity-100 max-w-40" : "opacity-0 max-w-0 ml-0"
            }`}
        >
          Logout
        </span>
      </button>
    </aside>
  );
}

// SidebarItem Component
const SidebarItem = ({ icon, text, active, expanded, indented = false }) => (
  <div
    className={`flex items-center py-2 rounded-lg cursor-pointer text-base transition-all duration-300 ${active ? "bg-blue-500" : "hover:bg-slate-800"} ${indented && expanded ? "pl-8 pr-4" : "px-4"
      }`}
  >
    <span className="flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center">
      {icon}
    </span>
    <span
      className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? "opacity-100 max-w-60" : "opacity-0 max-w-0 ml-0"
        }`}
    >
      {text}
    </span>
  </div>
);
