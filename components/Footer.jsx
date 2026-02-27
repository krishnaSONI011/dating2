'use client'
import { Playwrite_AT } from "next/font/google"
import Link from "next/link"
import { FaHandPaper } from "react-icons/fa"
import Button from "./ui/Button"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

const playwrite = Playwrite_AT({
  subsets: ["latin"],
})

export default function Footer() {
  const router = useRouter()
  const [city , setCity] = useState([])

  useEffect(()=> {
     async function getCity(){
      try{
        const res = await api.post(`/Wb/all_cities`)
        if(res.data.status == 0){
          setCity(res.data.data)
        }
      }catch(e){
        console.log(e)
      }
     }
     getCity()
  },[])
  return (
    <footer className="w-full bg-[#05060a] text-gray-300 pt-16 pb-10 border-t border-gray-800">

      <div className="max-w-7xl mx-auto px-6">

        {/* ===== TOP ===== */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-12">

          {/* Logo + badges */}
          <div>
            <h1 className="text-3xl font-semibold mb-4 text-white">
              Affair{" "}
              <span className={`${playwrite.className} text-orange-300`}>
                Escorts
              </span>
            </h1>

            {/* adult badge */}
            <div className="mb-4">
              <span className="inline-block border border-gray-700 bg-[#0b0c12] px-4 py-2 rounded-lg text-xs font-semibold text-gray-300">
                RESTRICTED TO ADULTS
              </span>
            </div>

            {/* trafficking */}
            <div className="inline-flex items-center gap-3 border border-red-500/40 bg-red-500/10 px-5 py-3 rounded-xl">
              <div className="w-10 h-10 flex items-center justify-center bg-red-600 rounded-full text-white">
                <FaHandPaper/>
              </div>
              <span className="font-semibold text-red-500 tracking-wide">
                STOP HUMAN TRAFFICKING
              </span>
            </div>

            {/* dmca */}
            <div className="mt-5 w-fit">
              <Link className={'w-fit'} href={"#"}>
             
              <img src="/dmca.png" className="h-8"/>
              </Link>
            </div>
          </div>

          {/* about */}
          <p className="text-gray-400 leading-relaxed max-w-xl">
            Premium advertising platform for verified independent listings.
            We connect service providers with clients in a secure and professional
            environment.
          </p>

        </div>

        {/* divider */}
        <div className="border-t border-gray-800 mb-10"></div>

        {/* ===== LINKS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          <div>
            <h3 className="text-white font-semibold mb-4">LEGAL</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-orange-300 cursor-pointer">2257 Exemption</li>
              <li className="hover:text-orange-300 cursor-pointer">Terms of Service</li>
              <li className="hover:text-orange-300 cursor-pointer">Disclaimer</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">SUPPORT</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-orange-300 cursor-pointer">Contact Us</li>
              <li className="hover:text-orange-300 cursor-pointer">Help & FAQ</li>
              <li className="hover:text-orange-300 cursor-pointer">Sitemap</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">SECURITY</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-orange-300 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-orange-300 cursor-pointer">Cookie Policy</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">COMPANY</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-orange-300 cursor-pointer">About Us</li>
              <li className="hover:text-orange-300 cursor-pointer">Latest Blog</li>
            </ul>
          </div>

        </div>

        {/* ===== BOTTOM CARD ===== */}
        <div className="mt-14 bg-gradient-to-r from-[#0c0d14] to-[#11121a] border border-gray-800 rounded-2xl p-6 grid md:grid-cols-2 gap-6 items-center">

          <div>
            <h3 className="text-white font-semibold mb-3">GROW YOUR BUSINESS</h3>
            <Button>POST YOUR ADS</Button>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">QUICK LOCATION ACCESS</h3>
            <select onChange={(e)=>{router.push(`/escorts/${e.target.value}`)}} className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-orange-300">
              <option>Select city</option>
              {
                city.map((c)=>(
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))
              }
            </select>
            {/* <input
              placeholder="Select City..."
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-orange-300"
            /> */}
          </div>

        </div>

        {/* bottom */}
        <div className="text-center text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} Affair Escorts. All rights reserved.
        </div>

      </div>

      {/* back to top */}
      <button
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-full shadow-lg"
>
  ↑
</button>

    </footer>
  )
}