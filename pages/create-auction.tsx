import { useState } from "react";
import { supabase } from "../lib/supabase";
import { db } from "../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

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
    try {
      let imageUrl = "";

      if (image) {
        const filename = `auction-images/${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from("images") // ต้องสร้าง bucket ชื่อ images ใน Supabase
          .upload(filename, image);

        if (error) throw error;

        const { data: urlData } = supabase.storage.from("images").getPublicUrl(filename);
        imageUrl = urlData?.publicUrl || "";
      }

      const endsAt = Timestamp.fromDate(new Date(endTime));

      await addDoc(collection(db, "auctions"), {
        name,
        startPrice: parseFloat(startPrice),
        minIncrement: parseFloat(minIncrement),
        currentBid: parseFloat(startPrice),
        image: imageUrl,
        endsAt,
        createdAt: Timestamp.now(),
        bids: [],
        status: "active",
      });

      alert("🎉 ประกาศสำเร็จ!");
      setForm({ name: "", startPrice: "", minIncrement: "", endTime: "", image: null });
    } catch (error: any) {
      console.error("❌ Upload Error:", error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ลงประกาศประมูล</h1>
      <input placeholder="ชื่อสัตว์เลี้ยง" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 w-full mb-2" />
      <input type="number" placeholder="ราคาเริ่มต้น (บาท)" value={form.startPrice} onChange={(e) => setForm({ ...form, startPrice: e.target.value })} className="border p-2 w-full mb-2" />
      <input type="number" placeholder="ขั้นต่ำในการเพิ่มราคา (บาท)" value={form.minIncrement} onChange={(e) => setForm({ ...form, minIncrement: e.target.value })} className="border p-2 w-full mb-2" />
      <input type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="border p-2 w-full mb-2" />
      <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} className="mb-4" />
      <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={uploading}>
        {uploading ? "⏳ กำลังอัปโหลด..." : "สร้างรายการประมูล"}
      </button>
    </div>
  );
}
