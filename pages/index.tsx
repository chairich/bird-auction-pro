import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Ad {
  id: string;
  image: string;
  url: string;
}

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      const querySnapshot = await getDocs(collection(db, "ads"));
      const data: Ad[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Ad[];
      setAds(data);
    };
    fetchAds();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        🐦 Welcome to Pet Auction
      </h1>

      {/* 🔗 เมนู */}
      <div className="space-x-4">
        <Link href="/auctions" className="text-blue-600 underline">ไปดูรายการประมูล →</Link>
        <Link href="/create-auction" className="text-green-600 underline">+ ลงประกาศ</Link>
        <Link href="/admin" className="text-red-600 underline">🔐 เข้าหน้า Admin</Link>
      </div>

      {/* 📢 ป้ายโฆษณา */}
      <div>
        <h2 className="text-xl font-semibold mb-2">📢 โฆษณา</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ads.length > 0 ? (
            ads.map((ad) => (
              <a key={ad.id} href={ad.url} target="_blank" rel="noopener noreferrer">
                <img src={ad.image} alt="ads" className="rounded shadow hover:scale-105 transition" />
              </a>
            ))
          ) : (
            <p className="text-gray-500">ไม่มีโฆษณา</p>
          )}
        </div>
      </div>
    </div>
  );
}
