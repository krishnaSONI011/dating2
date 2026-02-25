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

export default function Login() {

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
  }, []);

  async function doLogin() {
    try {
      const otp = localStorage.getItem("otp");
      const email = localStorage.getItem("email");

      if (!otp || !email) {
        toast.error("Session expired, login again");
        router.push("/login");
        return;
      }

      // 👉 password match check
      if (password !== confirmPassword) {
        toast.error("Password and Confirm Password not match");
        return;
      }

      setLoading(true);

      const formdata = new FormData();
      formdata.append("email", email);
      formdata.append("new_password", password);
      formdata.append("otp", otp);

      const res = await api.post("/Wb/reset_password", formdata);

      if (res.data.status == 0) {
        toast.success(res.data.message);

        // 👉 remove from localStorage
        localStorage.removeItem("otp");
        localStorage.removeItem("email");

        router.push("/login");
      } else {
        toast.error(res.data.message);
      }

    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
          Join Affair{" "}
          <span className={`${playwrite.className} text-[#ff4000]`}>
            Escorts
          </span>
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Reset your password
        </p>

        <div className="space-y-5">

          {/* Password */}
          <div>
            <label className="text-sm font-medium">New Password</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />

              <input
                type={show ? "text" : "password"}
                placeholder="Enter password"
                className="w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                onClick={() => setShow(!show)}
                className="cursor-pointer text-gray-500 ml-2"
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />

              <input
                type={show ? "text" : "password"}
                placeholder="Confirm password"
                className="w-full outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <span
                onClick={() => setShow(!show)}
                className="cursor-pointer text-gray-500 ml-2"
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <Button loading={loading} onClick={doLogin}>
            Reset Password
          </Button>

        </div>
      </div>
    </div>
  );
}