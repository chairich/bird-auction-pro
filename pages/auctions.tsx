import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";
import Countdown from "../components/Countdown";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      const snap = await getDocs(collection(db, "auctions"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAuctions(data);
    };
    fetchAuctions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📦 รายการประมูล</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {auctions.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{item.name}</h2>
            <p className="text-gray-600">เริ่มต้น: ฿{item.startPrice}</p>
            <p className="text-gray-900 font-bold">ปัจจุบัน: ฿{item.currentBid || item.startPrice}</p>
            <Countdown endsAt={item.endsAt} />
            <Link
              href={`/auctions/${item.id}`}
              className="block mt-3 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              ดูรายละเอียด
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
