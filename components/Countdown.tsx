import { useEffect, useState } from "react";

export default function Countdown({ endsAt }: { endsAt: any }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const endTime = endsAt?.seconds ? endsAt.seconds * 1000 : Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;
      if (diff <= 0) {
        setTimeLeft("หมดเวลาแล้ว");
        clearInterval(timer);
        return;
      }
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      const hrs = Math.floor(diff / 1000 / 60 / 60);
      setTimeLeft(`${hrs} ชม ${mins} นาที ${secs} วิ`);
    }, 1000);

    return () => clearInterval(timer);
  }, [endsAt]);

  return <p className="text-sm text-red-600 mt-1">⏱ เหลือเวลา: {timeLeft}</p>;
}
