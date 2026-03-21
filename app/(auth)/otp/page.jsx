'use client'
import Button from "@/components/ui/Button";
import WebsiteLogo from "@/components/WebsiteLogo";
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
    const type = localStorage.getItem("type");
    const email = localStorage.getItem("email");
    try{
      const formData = new FormData()
      formData.append('email' , email)
      if (type === "register") {
      const res = await api.post(`/Wb/resend_register_otp` , formData)

      if(res.data.status == 0 ){
        toast.success(res.data.message)
      }else{
        toast.error(res.data.message)
      }
    }
    else if (type === "reset_password") {
      const res = await api.post(`/Wb/resend_forgot_otp` , formData)
      if(res.data.status == 0 ){
        toast.success(res.data.message)
      }else{
        toast.error(res.data.message)
      }
    }

    }catch(e){
      console.log(e)
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
    <div className="min-h-screen bg-(--website-background) flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md  border border-(--primary-color) rounded-3xl shadow-2xl p-6 sm:p-8 text-center">

        {/* Heading */}
        {/* <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
          Verify to Join Affair{" "}
          <span className={`${playwrite.className} text-orange-500`}>
            Escorts
          </span>
        </h1> */}
        <div className="my-5 flex justify-center">
          <WebsiteLogo />
        </div>

        <p className="text-(--second-color) mb-8 text-sm sm:text-base">
          Enter the 4 digit OTP sent to your email
        </p>

        {/* OTP Input */}
        <input
          type="text"
          value={otp}
          onChange={handleChange}
          placeholder="Enter OTP"
          className="w-full   text-center text-2xl tracking-[8px] font-bold 
          border border-slate-600 rounded-xl py-4 mb-6 
          focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/30 outline-none"
        />

        {/* Verify Button */}
        <Button
          onClick={VerifyOTP}
          loading={loading}
          className="w-full  py-3 rounded-xl"
        >
          Verify OTP
        </Button>

        {/* Resend */}
        <p className="text-gray-400 text-sm mt-6">
          Didn’t receive code?{" "}
          <button
            onClick={resendEmail}
            className="text-(--second-color) font-semibold hover:underline"
          >
            Resend OTP
          </button>
        </p>

      </div>
    </div>
  );
}