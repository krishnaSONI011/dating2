'use client'
import { useContext, useState } from "react";
import { Playwrite_AT } from "next/font/google";
import { FaEnvelope } from "react-icons/fa";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const playwrite = Playwrite_AT({
  subsets: ["latin"],
});

export default function Login() {

  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [loading , setLoading ] = useState(false)
  const router = useRouter()

  async function doLogin(){
    try{
        setLoading(true)
        const formdata = new FormData()
        formdata.append("email" , email)

        const res = await api.post('/Wb/forgot_password' , formdata)

        if(res.data.status == 0){
            toast.success(res.data.message)
            localStorage.setItem('email' , email)
            localStorage.setItem('type' , 'reset_password')
            router.push('/otp')
        }else{
          toast.error(res.data.message)
        }

    }catch(e){
        toast.error("Something went wrong")
    }finally{
        setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-[#0b1220] border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8">

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center text-white">
          Join Affair{" "}
          <span className={`${playwrite.className} text-orange-500`}>
            Escorts
          </span>
        </h1>

        <p className="text-gray-400 text-center mb-8 text-sm sm:text-base">
          Reset Password with your Email
        </p>

        <div className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-300">
              Email
            </label>

            <div className="flex items-center bg-[#111827] border border-slate-600 rounded-lg mt-1 px-3 py-3 focus-within:border-orange-500 transition">

              <FaEnvelope className="text-gray-400 mr-3 text-sm" />

              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full bg-transparent outline-none text-white placeholder-gray-500 text-sm"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Button */}
          <Button 
            loading={loading} 
            onClick={doLogin}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl"
          >
            Send Verification Code
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-[1px] bg-slate-700"></div>
            <span className="text-gray-500 text-xs sm:text-sm">OR</span>
            <div className="flex-1 h-[1px] bg-slate-700"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400">
            Want to login again?{" "}
            <Link href={'/login'}>
              <span className="text-orange-500 font-semibold cursor-pointer hover:underline">
                Login
              </span>
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}