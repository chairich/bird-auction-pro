// pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">🐦 Welcome to Pet Auction</h1>
      <p className="mt-4">
        <Link href="/auctions" className="text-blue-600 underline">
          ไปดูรายการประมูล →
        </Link>
      </p>
    </main>
  );
}
