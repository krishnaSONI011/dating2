"use client";
import { useState } from "react";
import Link from "next/link";
import { Playwrite_AT } from "next/font/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const playwrite = Playwrite_AT({ subsets: ["latin"] });

export default function Signup() {
  const router = useRouter()
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [email , setEmail] = useState('')
 
  // password checks
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasLength = password.length >= 8;

  const isValid = hasLower && hasUpper && hasNumber && hasLength && agree; 
  async function handelSignup() {
    try{
        const formData= new FormData()
        formData.append("email" , email)
        formData.append("password" , password)
        formData.append("confirm_password" , password)
        const res = await api.post(`/Wb/register` , formData)
        if(res.data.status == 0){
            toast.success(res.data.message)
            localStorage.setItem("email" , email)
            localStorage.setItem('type' , 'register')
            router.push('/otp')
        }else toast.error(res.data.message)
    }catch(e){
        console.log(e)
    }
  }
  return (
    <div className="min-h-screen bg-(--website-background) flex justify-center py-14 px-4">
      <div className="w-full max-w-lg border border-(--content-border-color) p-5 rounded" >

        {/* Heading */}
        <h1 className="text-4xl font-bold mb-2">
          Join Affair{" "}
          <span className={`${playwrite.className} text-orange-600`}>
            Escorts
          </span>
        </h1>

        {/* login link */}
        
        {/* Email */}
        <label className="font-medium">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          className="w-full mt-2 mb-6 p-3 rounded-xl border focus:border-orange-600 outline-none"
        />

        {/* Password */}
        <label className="font-medium">Password</label>
        <div className="relative mt-2">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border focus:border-orange-600 outline-none"
          />
          <span
            onClick={() => setShow(!show)}
            className="absolute right-4 top-3.5 text-gray-500 cursor-pointer"
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Password rules */}
        <div className="bg-slate-900 rounded-xl p-5 mt-6 text-sm">
          <p className="font-semibold mb-2">Your password must include:</p>
          <ul className="space-y-1">
            <li className={hasLower ? "text-green-600" : "text-gray-400"}>
              ✔ One lowercase letter
            </li>
            <li className={hasUpper ? "text-green-600" : "text-gray-400"}>
              ✔ One uppercase letter
            </li>
            <li className={hasNumber ? "text-green-600" : "text-gray-400"}>
              ✔ One number
            </li>
            <li className={hasLength ? "text-green-600" : "text-gray-400"}>
              ✔ Minimum 8 characters
            </li>
          </ul>
        </div>

        {/* Toggle 1 */}
        <div className="flex gap-4 mt-6">
          <div
            onClick={() => setAgree(!agree)}
            className={`w-12 h-6 rounded-full cursor-pointer transition ${
              agree ? "bg-orange-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow transform transition ${
                agree ? "translate-x-6" : ""
              }`}
            ></div>
          </div>

          <p className="text-sm ">
            <span className="font-semibold text-(--second-color)"><Link href={'/term-and-condition'}>Terms & Privacy Policy</Link></span><br />
            I agree to Terms & Privacy Policy
          </p>
        </div>

        {/* Toggle 2 */}
        <div className="flex gap-4 mt-5">
          <div
            onClick={() => setMarketing(!marketing)}
            className={`w-12 h-6 rounded-full cursor-pointer transition ${
              marketing ? "bg-orange-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow transform transition ${
                marketing ? "translate-x-6" : ""
              }`}
            ></div>
          </div>

          <p className="text-sm ">
            <span className="font-semibold text-(--second-color)"><Link href={'/cookie-policy'}>Cookie Policy</Link></span><br />
            I agree to Cookie Policy
          </p>
        </div>

        {/* Signup button */}
        {/* <button
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-bold text-lg mt-8 transition ${
            isValid
              ? "bg-orange-600 hover:bg-[#e63a00] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
         
        </button> */}
        <Button onClick={handelSignup} disabled={!isValid} className={`w-full py-4 rounded-xl font-bold text-lg mt-8 transition ${
            isValid
              ? "bg-orange-600 hover:bg-[#e63a00] text-white"
              : "bg-gray-300   text-gray-500 cursor-not-allowed"
          }`}>
 SIGN UP
        </Button>
        <p className="text-gray-500 mb-8 mt-5 text-center">
          Already have account?{" "}
          <Link href="/login" className="text-orange-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}
