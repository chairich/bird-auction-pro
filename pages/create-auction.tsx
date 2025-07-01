import { useState } from "react";
import { supabase } from "../lib/supabase";

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
        const filePath = `auction-images/${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from("auction-images")
          .upload(filePath, image);
        if (error) throw error;

        const { data: publicUrl } = supabase.storage
          .from("auction-images")
          .getPublicUrl(filePath);
        imageUrl = publicUrl.publicUrl;
      }

      const { error } = await supabase.from("auctions").insert([
        {
          name,
          start_price: parseFloat(startPrice),
          min_increment: parseFloat(minIncrement),
          current_bid: parseFloat(startPrice),
          image: imageUrl,
          ends_at: new Date(endTime).toISOString(),
        },
      ]);
      if (error) throw error;

      alert("🎉 ประกาศสำเร็จ!");
      setForm({ name: "", startPrice: "", minIncrement: "", endTime: "", image: null });
    } catch (err: any) {
      console.error("❌", err);
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setUploading(false);
    }
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
        placeholder="ราคาเริ่มต้น"
        value={form.startPrice}
        onChange={(e) => setForm({ ...form, startPrice: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <input
        type="number"
        placeholder="ขั้นต่ำการเพิ่มราคา"
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
        className="w-full bg-blue-600 text-white py-2 rounded"
        disabled={uploading}
      >
        {uploading ? "⏳ กำลังอัปโหลด..." : "สร้างรายการประมูล"}
      </button>
    </div>
  );
}
