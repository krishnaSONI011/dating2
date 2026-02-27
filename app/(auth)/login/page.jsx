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
        formdata.append('password' , password)
        const res = await api.post('/Wb/login' , formdata)
        if(res.data.status == 0){
            toast.success(res.data.message)
            login(res.data.data , res.data.data.token)
            router.push('/dashboard')

        }else toast.error(res.data.message)
    }catch(e){
        console.log(e)
    }finally{
        setLoading(false)
    }
  }

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md border border-(--content-border-color) rounded-3xl shadow-2xl p-8">

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
          Join Affair{" "}
          <span className={`${playwrite.className} text-orange-600`}>
            Escorts
          </span>
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Login to your premium account
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
          <div>
            <label className="text-sm font-medium">Password</label>

            <div className="flex items-center border rounded-lg mt-1 px-3 py-2 focus-within:border-orange-600">
              <FaLock className="text-gray-400 mr-2" />

              <input
                type={show ? "text" : "password"}
                placeholder="Enter password"
                className="w-full outline-none"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
              />

              {/* eye icon */}
              <span
                onClick={() => setShow(!show)}
                className="cursor-pointer text-gray-500 ml-2"
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Forgot */}
          <div className="text-right text-sm text-(--second-color) cursor-pointer hover:underline">
           <Link href={'/forgetEmail'}> Forgot password?</Link>
          </div>

          {/* Button */}
        <Button loading={loading} onClick={doLogin}>Login</Button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* Signup */}
          <p className="text-center text-sm text-(--website-text)">
            New here?{" "}
            <Link href={'/signup'}>
            <span className="text-(--second-color) font-semibold cursor-pointer hover:underline">
              Create account
            </span></Link>
          </p>

        </div>
      </div>
    </div>
  );
}
