import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function FotoProjekPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);


  // ================= AMBIL FOTO =================
  const fetchPhotos = async () => {

    try {

      const res = await axios.get(
        `http://127.0.0.1:8000/api/projek-kerja/${id}/photos`
      );

      if (res.data.success) {
        setPhotos(res.data.photos);
      }

    } catch (err) {

      console.error("Gagal load foto:", err);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPhotos();
  }, [id]);


  // ================= TAMBAH FOTO =================
  const handleUpload = async (file) => {

    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {

      await axios.post(
        `http://127.0.0.1:8000/api/projek-kerja/${id}/add-photo`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      fetchPhotos();

    } catch (err) {
      alert("Gagal upload foto");
    }
  };


  // ================= HAPUS FOTO =================
  const handleDelete = async (photoId) => {

    if (!window.confirm("Hapus foto ini?")) return;

    try {

      await axios.delete(
        `http://127.0.0.1:8000/api/projek-kerja/photo/${photoId}`
      );

      fetchPhotos();

    } catch (err) {
      alert("Gagal hapus foto");
    }
  };


  if (loading) {
    return <div className="p-10">Loading...</div>;
  }


  return (
    <div className="p-10">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded"
      >
        ← Kembali
      </button>


      <h2 className="text-3xl font-bold mb-8">
        Kelola Foto Projek
      </h2>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


        {/* LIST FOTO */}
        {photos.map(photo => (

          <div
            key={photo.id}
            className="bg-white p-4 rounded-xl shadow"
          >

            <img
              src={photo.url}
              className="w-full h-48 object-cover rounded mb-4"
              alt="projek"
            />


            <div className="flex gap-2 flex-wrap">

              {/* DOWNLOAD */}
              <a
                href={photo.url}
                download
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Download
              </a>


              {/* HAPUS */}
              <button
                onClick={() => handleDelete(photo.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Hapus
              </button>

            </div>

          </div>
        ))}


        {/* TAMBAH FOTO */}
        <label className="bg-gray-200 flex items-center justify-center rounded-xl cursor-pointer h-64">

          + Tambah Foto

          <input
            type="file"
            hidden
            onChange={(e) =>
              handleUpload(e.target.files[0])
            }
          />

        </label>

      </div>

    </div>
  );
}