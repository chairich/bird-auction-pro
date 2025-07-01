import { useEffect, useState } from "react";
import { db, storage } from "../../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type Ad = {
  id?: string;
  image: string;
  link: string;
  position: string;
  active: boolean;
};

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [form, setForm] = useState<Ad>({
    image: "",
    link: "",
    position: "top",
    active: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchAds = async () => {
    const snapshot = await getDocs(collection(db, "ads"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Ad[];
    setAds(data);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleSubmit = async () => {
    if (!form.link || !form.position) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    let imageUrl = form.image;

    if (file) {
      const imageRef = ref(storage, `ads/${Date.now()}-${file.name}`);
      await uploadBytes(imageRef, file);
      imageUrl = await getDownloadURL(imageRef);
    }

    const newData = { ...form, image: imageUrl };

    if (editingId) {
      await updateDoc(doc(db, "ads", editingId), newData);
      alert("✅ แก้ไขแล้ว");
    } else {
      await addDoc(collection(db, "ads"), newData);
      alert("✅ เพิ่มโฆษณาแล้ว");
    }

    setForm({ image: "", link: "", position: "top", active: true });
    setFile(null);
    setEditingId(null);
    fetchAds();
  };

  const handleEdit = (ad: Ad) => {
    setForm(ad);
    setEditingId(ad.id || null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("ลบโฆษณานี้?")) {
      await deleteDoc(doc(db, "ads", id));
      fetchAds();
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🖼 จัดการโฆษณา (อัปโหลดได้)</h1>

      <div className="space-y-2 mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 w-full"
        />
        <input
          placeholder="ลิงก์ปลายทาง"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className="border p-2 w-full"
        />
        <select
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="top">Top</option>
          <option value="between">Between</option>
          <option value="sidebar">Sidebar</option>
          <option value="footer">Footer</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          แสดงผล
        </label>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white py-2 px-4 rounded"
        >
          {editingId ? "บันทึกการแก้ไข" : "เพิ่มโฆษณา"}
        </button>
      </div>

      <hr className="my-4" />

      <div className="space-y-4">
        {ads.map((ad) => (
          <div key={ad.id} className="border p-4 rounded shadow bg-white">
            <img src={ad.image} className="h-24 object-contain mb-2" />
            <p className="text-sm text-gray-700">{ad.link}</p>
            <p className="text-xs">ตำแหน่ง: {ad.position} | {ad.active ? "✅ Active" : "❌ ไม่แสดง"}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(ad)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                แก้ไข
              </button>
              <button
                onClick={() => handleDelete(ad.id!)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
