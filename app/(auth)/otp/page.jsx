'use client'
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { Playwrite_AT } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const playwrite = Playwrite_AT({
  subsets: ["latin"],
});

export default function OTPPage() {

  const router = useRouter()
  const [email ,setEmail] = useState('')
  const [loading ,setLoading] = useState(false)
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;

    if (!/^[0-9]*$/.test(value)) return;
    if (value.length > 4) return;

    setOtp(value);
  };

  useEffect(()=>{
    const emails = localStorage.getItem("email")
    if(!emails) router.push('/login')
    setEmail(emails)
  },[router])

  async function resendEmail(){
    try{
      const formData = new FormData()
      formData.append('email' , email)
      const res = await api.post(`/Wb/resend_register_otp` , formData)

      if(res.data.status == 1 ){
        toast.success(res.data.message)
      }else{
        toast.error(res.data.message)
      }

    }catch(e){
      toast.error("Something went wrong")
    }
  }

  async function VerifyOTP() {

    const type = localStorage.getItem("type");
    const email = localStorage.getItem("email");

    if (!type || !email) {
      toast.error("Session expired");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("email", email);
      formData.append("otp", otp);

      if (type === "register") {

        const res = await api.post("/Wb/verify_otp", formData);

        if (res.data.status == 0) {
          toast.success(res.data.message);
          localStorage.removeItem("type");
          localStorage.removeItem("email");
          router.push("/login");
        } else {
          toast.error(res.data.message);
        }
      }

      else if (type === "reset_password") {

        const res = await api.post("/Wb/verify_forgot_otp", formData);

        if (res.data.status == 0) {
          toast.success(res.data.message);
          localStorage.setItem("otp", otp);
          router.push("/reset-password");
        } else {
          toast.error(res.data.message);
        }
      }

    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-[#0b1220] border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 text-center">

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
          Verify to Join Affair{" "}
          <span className={`${playwrite.className} text-orange-500`}>
            Escorts
          </span>
        </h1>

        <p className="text-gray-400 mb-8 text-sm sm:text-base">
          Enter the 4 digit OTP sent to your email
        </p>

        {/* OTP Input */}
        <input
          type="text"
          value={otp}
          onChange={handleChange}
          placeholder="Enter OTP"
          className="w-full bg-[#111827] text-white text-center text-2xl tracking-[8px] font-bold 
          border border-slate-600 rounded-xl py-4 mb-6 
          focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none"
        />

        {/* Verify Button */}
        <Button
          onClick={VerifyOTP}
          loading={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl"
        >
          Verify OTP
        </Button>

        {/* Resend */}
        <p className="text-gray-400 text-sm mt-6">
          Didn’t receive code?{" "}
          <button
            onClick={resendEmail}
            className="text-orange-500 font-semibold hover:underline"
          >
            Resend OTP
          </button>
        </p>

      </div>
    </div>
  );
}