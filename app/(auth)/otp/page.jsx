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
    const [type , setType]= useState('')
    const [loading ,setLoading] = useState(false)
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;

    // allow only numbers & max 6 digits
    if (!/^[0-9]*$/.test(value)) return;
    if (value.length > 4) return;

    setOtp(value);
  };
  useEffect(()=>{
    const emails = localStorage.getItem("email")
    setType( localStorage.getItem('getType'))
    if(!emails) router.push('/login')
    setEmail(emails)
  },[router ,email])
 
  async function resendEmail(){
    try{
      const formData = new FormData()
      formData.append('email' , email)
      const res = await api.post(`/Wb/resend_register_otp` , formData)
      if(res.data.status == 1 ){
        toast.success(res.data.message)
      }else toast.error(res.data.message)
    }catch(e){
      console.log(e)
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
  
      // 🔥 register otp verify
      if (type === "register") {
  
        const res = await api.post("/Wb/verify_otp", formData);
  
        if (res.data.status == 0) {
          toast.success(res.data.message);
  
          // clear local storage
          localStorage.removeItem("type");
          localStorage.removeItem("email");
  
          router.push("/login");
        } else {
          toast.error(res.data.message);
        }
      }
  
      // 🔥 reset password otp verify
      else if (type === "reset_password") {
  
        const res = await api.post("/Wb/verify_forgot_otp", formData);
  
        if (res.data.status == 0) {
          toast.success(res.data.message);
  
          // save otp for reset password page
          localStorage.setItem("otp", otp);
  
          router.push("/reset-password");
        } else {
          toast.error(res.data.message);
        }
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

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl p-8 text-center">

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-2">
          Verify to Join Affair{" "}
          <span className={`${playwrite.className} text-orange-600`}>
            Escorts
          </span>
        </h1>

        <p className="text-gray-500 mb-8">
          Enter the 6 digit OTP sent to your email/phone
        </p>

        {/* Single OTP input */}
        <input
          type="text"
          value={otp}
          onChange={handleChange}
          placeholder="Enter OTP"
          className="w-full text-center text-2xl tracking-[10px] font-bold border rounded-xl py-4 mb-6
          focus:border-orange-600 focus:ring-2 focus:ring-orange-600/30 outline-none"
        />

        {/* Verify */}
       
        <Button onClick={VerifyOTP} loading={loading}>
        Verify OTP
        </Button>

        {/* resend */}
        <p className="text-gray-500 text-sm mt-6">
          Didn’t receive code?{" "}

          <button onClick={resendEmail} className="text-orange-600 font-semibold cursor-pointer hover:underline">
            Resend OTP
          </button>
        </p>

      </div>
    </div>
  );
}
