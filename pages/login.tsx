import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import { isAdminEmail } from "../lib/admins";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      if (!isAdminEmail(email)) {
        setError("คุณไม่ใช่แอดมิน");
        return;
      }
      router.push("/admin/ads");
    } catch (err) {
      setError("เข้าสู่ระบบล้มเหลว");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold mb-4">🔐 เข้าสู่ระบบแอดมิน</h1>
      {error && <p className="text-red-600">{error}</p>}
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
      >
        เข้าสู่ระบบด้วย Google
      </button>
    </div>
  );
}
