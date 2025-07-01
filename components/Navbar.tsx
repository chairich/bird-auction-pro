import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">🐦 Pet Auction</Link>
      <div className="space-x-4">
        <Link href="/auctions">ประมูล</Link>
        <Link href="/admin/ads">โฆษณา</Link>
        <Link href="/admin">แอดมิน</Link>
        <Link href="/login">เข้าสู่ระบบ</Link>
      </div>
    </nav>
  );
}