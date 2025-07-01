import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db, storage } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AdminAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const fetchAds = async () => {
    const snap = await getDocs(collection(db, "ads"));
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAds(data);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleSubmit = async () => {
    if (!imageFile || !url) return alert("กรุณาเลือกภาพและใส่ลิงก์");

    const storageRef = ref(storage, `ads/${Date.now()}-${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);

    await addDoc(collection(db, "ads"), {
      image: imageUrl,
      url,
      createdAt: Timestamp.now(),
    });

    setImageFile(null);
    setUrl("");
    fetchAds();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "ads", id));
    fetchAds();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📢 จัดการโฆษณา</h1>

      <div className="space-y-2">
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        <input
          type="text"
          placeholder="ลิงก์ URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white py-2 px-4 rounded"
        >
          ➕ เพิ่มโฆษณา
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ads.map((ad) => (
          <div key={ad.id} className="border p-2 rounded shadow">
            <img src={ad.image} alt="ad" className="w-full h-32 object-cover mb-2" />
            <a href={ad.url} target="_blank" className="text-blue-600 text-sm block">
              {ad.url}
            </a>
            <button
              onClick={() => handleDelete(ad.id)}
              className="text-red-600 text-xs mt-1"
            >
              ❌ ลบ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
