import React from "react";
import { History, Plus } from "lucide-react";
import { useSPPD } from "./hooks/useSPPD";
import { SPPDForm } from "./components/forms/SPPDForm";
import { SPPDHistory } from "./components/history/SPPDHistory";

export default function SPPDPage() {
  const {
    activeTab,
    setActiveTab,
    loading,
    fetchingNomor,
    nextNomorSurat,
    searchTerm,
    setSearchTerm,
    formData,
    filteredHistory,
    selectedItem,
    showViewModal,
    isEditing,
    handleInputChange,
    resetForm,
    handleSubmit,
    handleView,
    closeViewModal,
    handleGeneratePDF,
    handleDelete,
    handleEdit,
    cancelEdit,
  } = useSPPD();

  const handleTabChange = (tab) => {
    if (isEditing) {
      if (window.confirm("Anda sedang mengedit dokumen. Yakin ingin membatalkan?")) {
        cancelEdit();
        setActiveTab(tab);
      }
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">{isEditing ? "Edit SPPD" : "Generate SPPD"}</h2>
          <p className="text-gray-500">
            {isEditing ? "Perbarui data dokumen SPPD" : "Buat dan kelola dokumen Surat Perintah Perjalanan Dinas"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleTabChange("form")}
          className={'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ' + (activeTab === "form" ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100')}
        >
          <Plus size={18} />
          {isEditing ? "Edit Dokumen" : "Buat Baru"}
        </button>
        <button
          onClick={() => handleTabChange("history")}
          className={'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ' + (activeTab === "history" ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100')}
        >
          <History size={18} />
          Riwayat ({filteredHistory.length})
        </button>
      </div>

      <div className="animate-fadeIn">
        {activeTab === "form" ? (
          <SPPDForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onReset={isEditing ? cancelEdit : resetForm}
            loading={loading}
            nextNomorSurat={nextNomorSurat}
            fetchingNomor={fetchingNomor}
            isEditing={isEditing}
          />
        ) : (
          <SPPDHistory
            filteredHistory={filteredHistory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onView={handleView}
            onGeneratePDF={handleGeneratePDF}
            onDelete={handleDelete}
            onEdit={handleEdit}
            selectedItem={selectedItem}
            showViewModal={showViewModal}
            onCloseViewModal={closeViewModal}
          />
        )}
      </div>
    </div>
  );
}