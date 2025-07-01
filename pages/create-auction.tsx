import { useState } from "react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CreateAuction() {
  const [form, setForm] = useState({
    name: "",
    startPrice: "",
    minIncrement: "",
    endTime: "",
    image: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    const { name, startPrice, minIncrement, endTime, image } = form;
    if (!name || !startPrice || !minIncrement || !endTime)
      return alert("กรุณากรอกข้อมูลให้ครบ");

    setUploading(true);
    let imageUrl = "";

    if (image) {
      const imgRef = ref(storage, `auction-images/${Date.now()}-${image.name}`);
      await uploadBytes(imgRef, image);
      imageUrl = await getDownloadURL(imgRef);
    }

    const endsAt = Timestamp.fromDate(new Date(endTime));

    await addDoc(collection(db, "auctions"), {
      name,
      startPrice: parseFloat(startPrice),
      minIncrement: parseFloat(minIncrement),
      currentBid: parseFloat(startPrice),
      image: imageUrl || "",
      endsAt,
      createdAt: Timestamp.now(),
      bids: [],
      status: "active",
    });

    alert("🎉 ประกาศสำเร็จ!");
    setForm({ name: "", startPrice: "", minIncrement: "", endTime: "", image: null });
    setUploading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ลงประกาศประมูล</h1>
      <input
        placeholder="ชื่อสัตว์เลี้ยง"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <input
        type="number"
        placeholder="ราคาเริ่มต้น (บาท)"
        value={form.startPrice}
        onChange={(e) => setForm({ ...form, startPrice: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <input
        type="number"
        placeholder="ขั้นต่ำในการเพิ่มราคา (บาท)"
        value={form.minIncrement}
        onChange={(e) => setForm({ ...form, minIncrement: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <input
        type="datetime-local"
        value={form.endTime}
        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
        className="mb-4"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={uploading}
      >
        {uploading ? "⏳ กำลังอัปโหลด..." : "สร้างรายการประมูล"}
      </button>
    </div>
  );
}
const handleSubmit = async () => {
  try {
    const { name, startPrice, minIncrement, endTime, image } = form;
    if (!name || !startPrice || !minIncrement || !endTime)
      return alert("กรุณากรอกข้อมูลให้ครบ");

    setUploading(true);
    let imageUrl = "";

    if (image) {
      const imgRef = ref(storage, `auction-images/${Date.now()}-${image.name}`);
      console.log("Uploading to:", imgRef.fullPath);
      await uploadBytes(imgRef, image);
      imageUrl = await getDownloadURL(imgRef);
      console.log("Image uploaded:", imageUrl);
    }

    const endsAt = Timestamp.fromDate(new Date(endTime));

    await addDoc(collection(db, "auctions"), {
      name,
      startPrice: parseFloat(startPrice),
      minIncrement: parseFloat(minIncrement),
      currentBid: parseFloat(startPrice),
      image: imageUrl || "",
      endsAt,
      createdAt: Timestamp.now(),
      bids: [],
      status: "active",
    });

    alert("🎉 ประกาศสำเร็จ!");
    setForm({ name: "", startPrice: "", minIncrement: "", endTime: "", image: null });
  } catch (err) {
    console.error("❌ Error:", err);
    alert("เกิดข้อผิดพลาด: " + err);
  } finally {
    setUploading(false);
  }
};
