'use client'
import { Playwrite_AT } from "next/font/google"
import Link from "next/link"
import { FaHandPaper } from "react-icons/fa"
import Button from "./ui/Button"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import WebsiteLogo from "./WebsiteLogo"

const playwrite = Playwrite_AT({
  subsets: ["latin"],
})

export default function Footer() {

  const router = useRouter()

  const [city, setCity] = useState([])
  const [footerData, setFooterData] = useState(null)

  /* ================= CITIES ================= */
  useEffect(() => {
    async function getCity() {
      try {
        const res = await api.post(`/Wb/all_cities`)
        if (res.data.status == 0) {
          setCity(res.data.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    getCity()
  }, [])

  /* ================= FOOTER DETAILS ================= */
  useEffect(() => {
    async function getFooterDetails() {
      try {
        const formData = new FormData()
        formData.append("footer_id", 1)

        const res = await api.post("/Wb/footer_detail", formData)

        if (res.data.status === 0) {
          setFooterData(res.data.data)
        }

      } catch (e) {
        console.log(e)
      }
    }

    getFooterDetails()
  }, [])

  return (
    <footer className="w-full bg-[#05060a] text-gray-300 pt-16 pb-10 border-t border-gray-800">

      <div className="max-w-7xl mx-auto px-6">

        {/* ===== TOP ===== */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-12">

          {/* Logo + badges */}
          <div>

            <WebsiteLogo />

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

            {/* DMCA Image (Dynamic) */}
            {footerData?.img && (
              <div className="mt-5 w-fit">
                <Link href={"#"}>
                  <img
                    src={footerData.img}
                    alt="DMCA"
                    className="h-8 max-w-[140px] object-contain"
                  />
                </Link>
              </div>
            )}

          </div>

          {/* About (Dynamic Description) */}
          <p className="text-gray-400 leading-relaxed max-w-xl">
            {footerData?.description ||
              "Premium advertising platform for verified independent listings. We connect service providers with clients in a secure and professional environment."
            }
          </p>

        </div>

        {/* divider */}
        <div className="border-t border-gray-800 mb-10"></div>

        {/* ===== LINKS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          <div>
            <h3 className="text-white font-semibold mb-4">LEGAL</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-orange-300 cursor-pointer"><Link href={'/2257-exemption'}>2257 Exemption</Link></li>
              <li className="hover:text-orange-300 cursor-pointer"><Link href={'/term-and-condition'}>Terms of Service</Link></li>
              <li className="hover:text-orange-300 cursor-pointer"><Link href={'/disclaimer'}>Disclaimer</Link></li>
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
              <li className="hover:text-orange-300 cursor-pointer"><Link href={'/privacy-policy'}>Privacy Policy</Link></li>
              <li className="hover:text-orange-300 cursor-pointer"><Link href={'/cookie-policy'}>Cookie Policy</Link></li>
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
            <select
              onChange={(e)=>{router.push(`/escorts/${e.target.value}`)}}
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-orange-300"
            >
              <option>Select city</option>
              {city.map((c)=>(
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* ===== COPYRIGHT (Dynamic) ===== */}
        <div className="text-center text-gray-500 text-sm mt-10">
           {footerData?.copy_right || "Affair Escorts"}.
         
        </div>

      </div>

      {/* Back To Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-full shadow-lg"
      >
        ↑
      </button>

    </footer>
  )
}