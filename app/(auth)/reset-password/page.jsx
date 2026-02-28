'use client'
import { useEffect, useState } from "react";
import { Playwrite_AT } from "next/font/google";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const playwrite = Playwrite_AT({
  subsets: ["latin"],
});

export default function ResetPassword() {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 👉 if otp/email not found → redirect login
  useEffect(() => {
    const otp = localStorage.getItem("otp");
    const email = localStorage.getItem("email");

    if (!otp || !email) {
      router.push("/login");
    }
  }, [router]);

  async function doLogin() {

    const otp = localStorage.getItem("otp");
    const email = localStorage.getItem("email");

    if (!otp || !email) {
      toast.error("Session expired, login again");
      router.push("/login");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password not match");
      return;
    }

    try {
      setLoading(true);

      const formdata = new FormData();
      formdata.append("email", email);
      formdata.append("new_password", password);
      formdata.append("otp", otp);

      const res = await api.post("/Wb/reset_password", formdata);

      if (res.data.status == 0) {
        toast.success(res.data.message);

        localStorage.removeItem("otp");
        localStorage.removeItem("email");

        router.push("/login");
      } else {
        toast.error(res.data.message);
      }

    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#0b1220] border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8">

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center text-white">
          Join Affair{" "}
          <span className={`${playwrite.className} text-orange-500`}>
            Escorts
          </span>
        </h1>

        <p className="text-gray-400 text-center mb-8 text-sm sm:text-base">
          Reset your password
        </p>

        <div className="space-y-5">

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-300">
              New Password
            </label>

            <div className="flex items-center bg-[#111827] border border-slate-600 rounded-lg mt-1 px-3 py-3 focus-within:border-orange-500 transition">
              <FaLock className="text-gray-400 mr-3 text-sm" />

              <input
                type={show ? "text" : "password"}
                placeholder="Enter password"
                className="w-full bg-transparent outline-none text-white placeholder-gray-500 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                onClick={() => setShow(!show)}
                className="cursor-pointer text-gray-400 ml-2"
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-300">
              Confirm Password
            </label>

            <div className="flex items-center bg-[#111827] border border-slate-600 rounded-lg mt-1 px-3 py-3 focus-within:border-orange-500 transition">
              <FaLock className="text-gray-400 mr-3 text-sm" />

              <input
                type={show ? "text" : "password"}
                placeholder="Confirm password"
                className="w-full bg-transparent outline-none text-white placeholder-gray-500 text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <span
                onClick={() => setShow(!show)}
                className="cursor-pointer text-gray-400 ml-2"
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Button */}
          <Button
            loading={loading}
            onClick={doLogin}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl"
          >
            Reset Password
          </Button>

        </div>
      </div>
    </div>
  );
}