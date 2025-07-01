import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function LoginPage() {
  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("✅ เข้าสู่ระบบแล้ว");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">เข้าสู่ระบบ</h1>
      <button
        onClick={login}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        🔐 เข้าสู่ระบบด้วย Google
      </button>
    </div>
  );
}
