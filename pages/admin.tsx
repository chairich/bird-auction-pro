import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import Countdown from "../components/Countdown";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import { adminEmails } from "../lib/admins";

export default function AdminPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = () => {
      const user = auth.currentUser;
      if (!user || !adminEmails.includes(user.email || "")) {
        alert("ไม่ใช่ผู้ดูแลระบบ");
        router.push("/");
      }
    };
    checkAdmin();
  }, []);

  const fetchAuctions = async () => {
    const snap = await getDocs(collection(db, "auctions"));
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAuctions(data);
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const endAuction = async (id: string) => {
    if (!confirm("คุณต้องการสิ้นสุดการประมูลนี้หรือไม่?")) return;
    const docRef = doc(db, "auctions", id);
    await updateDoc(docRef, {
      endsAt: Timestamp.now(),
      status: "ended",
    });
    alert("✅ สิ้นสุดการประมูลแล้ว");
    fetchAuctions();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧑‍💼 แอดมิน: จัดการการประมูล</h1>
      <div className="space-y-4">
        {auctions.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p>📦 เริ่ม: ฿{item.startPrice} | 💰 ปัจจุบัน: ฿{item.currentBid}</p>
                <Countdown endsAt={item.endsAt} />
              </div>
              <button
                onClick={() => endAuction(item.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                สิ้นสุด
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
