import { useRouter } from "next/router";
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import Countdown from "../../components/Countdown";

interface Bid {
  amount: number;
  time: Timestamp;
}

interface Auction {
  id: string;
  name: string;
  image: string;
  startPrice: number;
  minIncrement: number;
  currentBid?: number;
  endsAt: Timestamp;
  bids?: Bid[];
}

export default function AuctionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bid, setBid] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchData = async () => {
      const docRef = doc(db, "auctions", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Auction;
        setAuction(data);
        setBid((data.currentBid || data.startPrice) + data.minIncrement);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleBid = async () => {
    if (!auction || !bid) return;
    const now = Timestamp.now().seconds;
    const end = auction.endsAt?.seconds;
    const minBid = (auction.currentBid || auction.startPrice) + auction.minIncrement;

    if (now > end) return setError("หมดเวลาแล้ว");
    if (bid < minBid) return setError(`ต้องใส่ราคา ≥ ฿${minBid}`);

    setSubmitting(true);
    const docRef = doc(db, "auctions", auction.id);
    await updateDoc(docRef, {
      currentBid: bid,
      bids: arrayUnion({ amount: bid, time: Timestamp.now() }),
    });
    alert("🎉 ประมูลสำเร็จ");
    router.reload();
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!auction) return <p className="p-4">ไม่พบรายการ</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <img
        src={auction.image}
        alt={auction.name}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h1 className="text-2xl font-bold">{auction.name}</h1>
      <Countdown endsAt={auction.endsAt} />
      <p>เริ่มต้น: ฿{auction.startPrice} | ปัจจุบัน: ฿{auction.currentBid ?? auction.startPrice}</p>
      <p>ขั้นต่ำ: ฿{auction.minIncrement}</p>
      <input
        type="number"
        value={bid}
        onChange={(e) => setBid(Number(e.target.value))}
        className="border p-2 w-full my-2"
      />
      {error && <p className="text-red-600">{error}</p>}
      <button
        onClick={handleBid}
        disabled={submitting}
        className="bg-green-600 text-white py-2 px-4 rounded"
      >
        {submitting ? "กำลังประมูล..." : "ยืนยันการประมูล"}
      </button>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">📜 ประวัติการประมูล</h3>
        <ul className="text-sm mt-2 space-y-1">
          {auction.bids?.length ? (
            auction.bids
              .slice()
              .reverse()
              .map((b, i) => (
                <li key={i}>
                  💰 {b.amount} บาท - 🕒{" "}
                  {new Date(b.time.seconds * 1000).toLocaleString()}
                </li>
              ))
          ) : (
            <li>ไม่มี</li>
          )}
        </ul>
      </div>
    </div>
  );
}
