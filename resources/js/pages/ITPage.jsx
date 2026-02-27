import React from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { 
  Package, 
  ListTodo, 
  FileText 
} from "lucide-react";
=======
import { Monitor, FileText, ListTodo } from "lucide-react";
>>>>>>> a7703d7d77dc671bc8c5d1e33e430d84fd52d0de

const ITPage = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const basePath =
    role === "super_admin"
      ? "/super_admin"
      : "/admin";

  return (
    <div>

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">

        <button
          onClick={() => navigate(`${basePath}/dashboard`)}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          ← Kembali
        </button>

        <h2 className="text-3xl font-bold">
          Divisi IT
        </h2>

      </div>

      <p className="text-gray-500 mb-8">
        Kelola aset dan progres pekerjaan IT
      </p>

      {/* CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* INVENTORY */}
        <Card
          icon={<Package size={30} className="text-blue-600" />}
          title="Inventory"
          desc="Kelola perangkat, server, dan stok barang IT"
          onClick={() => navigate(`${basePath}/it/inventory`)}
        />

        {/* PROGRES */}
        <Card
          icon={<ListTodo size={30} className="text-green-600" />}
          title="Progres Pekerjaan"
          desc="Pantau status dan perkembangan pekerjaan IT"
          onClick={() => navigate(`${basePath}/it/projek`)}
        />

        {/* BUAT PDF */}
        <Card
<<<<<<< HEAD
          icon={<FileText size={30} className="text-pink-600" />}
=======
          icon={<FileText size={30} className="text-purple-600" />}
>>>>>>> a7703d7d77dc671bc8c5d1e33e430d84fd52d0de
          title="Buat PDF"
          desc="Buat PDF pekerjaan IT"
          onClick={() => navigate(`${basePath}/it/buat-pdf`)}
        />

      </div>

    </div>
  );
};


/* CARD COMPONENT */
const Card = ({ icon, title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
  >
    <div className="mb-4">
      {icon}
    </div>

    <h3 className="text-xl font-semibold mb-2">
      {title}
    </h3>

    <p className="text-gray-500 text-sm">
      {desc}
    </p>
  </div>
);

export default ITPage;