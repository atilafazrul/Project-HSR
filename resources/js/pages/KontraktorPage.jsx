import React from "react";
import { Hammer, FileText, History } from "lucide-react";

const KontraktorPage = ({ goBack }) => {
  return (
    <div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={goBack}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          ← Kembali
        </button>

        <h2 className="text-3xl font-bold">Divisi Kontraktor</h2>
      </div>

      <p className="text-gray-500 mb-8">
        Kelola proyek, dokumentasi, dan riwayat kontraktor
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card
          icon={<Hammer size={30} className="text-blue-600" />}
          title="Proyek"
          desc="Kelola data proyek"
        />

        <Card
          icon={<FileText size={30} className="text-green-600" />}
          title="Dokumentasi"
          desc="Upload laporan proyek"
        />

        <Card
          icon={<History size={30} className="text-purple-600" />}
          title="Riwayat"
          desc="Histori proyek"
        />

      </div>
    </div>
  );
};

const Card = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
);

export default KontraktorPage;