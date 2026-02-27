'use client'
import { useContext, useState } from "react";
import { Playwrite_AT } from "next/font/google";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
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
  const {login} = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false); 
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

        }else toast.error(res.data.message)
    }catch(e){
        console.log(e)
    }finally{
        setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
          Join Affair{" "}
          <span className={`${playwrite.className} text-orange-600`}>
            Escorts
          </span>
        </h1>

        <p className="text-gray-500 text-center mb-8">
         Reset Password with the Email
        </p>

        <div className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2 focus-within:border-orange-600">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full outline-none"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password with eye */}
         
          {/* Forgot */}
          
          {/* Button */}
        <Button loading={loading} onClick={doLogin}>Send Verification Code</Button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* Signup */}
          <p className="text-center text-sm text-gray-600">
            lets login again ?{" "}
            <Link href={'/signup'}>
            <span className="text-orange-600 font-semibold cursor-pointer hover:underline">
              login
            </span></Link>
          </p>

        </div>
      </div>
    </div>
  );
}
