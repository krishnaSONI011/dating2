'use client'
import { Playwrite_AT } from "next/font/google"
import Link from "next/link"
import { FaHandPaper } from "react-icons/fa"
import Button from "./ui/Button"
import { useContext, useEffect, useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import WebsiteLogo from "./WebsiteLogo"
import { AuthContext } from "@/context/AuthContext";
const playwrite = Playwrite_AT({
  subsets: ["latin"],
})

export default function Footer() {
const { isAuthenticated, logout } = useContext(AuthContext)
  const router = useRouter()
  const [legalPages, setLegalPages] = useState([])
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
/* ================= LEGAL PAGES ================= */
useEffect(() => {
  async function getLegalPages() {
    try {
      const res = await api.post("/Wb/legal_pages_by_footer_cat")

      if (res.data.status == "0") {
        setLegalPages(res.data.data)
      }

    } catch (e) {
      console.log(e)
    }
  }

  getLegalPages()
}, [])
  return (
    <footer className="w-full bg-(--navbar-color)  pt-16 pb-10 border-t border-gray-800">

      <div className="max-w-7xl mx-auto px-6">

        {/* ===== TOP ===== */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-12">

          {/* Logo + badges */}
          <div>

            <WebsiteLogo />

            {/* adult badge */}
            <div className="mb-4 mt-5">
            <span className="inline-flex items-center gap-2 border border-gray-700 px-4 py-2 rounded-lg text-md font-semibold">
  <svg
    width="30"
    height="30"
    viewBox="0 0 47 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M-0.00317383 0.0963287V17.1546H5.18948V10.2293H5.9828C6.45968 10.2293 6.79388 10.4709 7.04412 10.6518L7.0646 10.6667C7.26654 10.8125 7.53338 11.2134 7.64156 11.3956L10.7427 17.1546H16.5845C15.695 15.4172 13.916 11.9788 13.7718 11.7601C13.6437 11.5659 13.0145 10.6302 12.5097 10.2657C12.0946 9.96606 11.4938 9.73338 11.18 9.64732C11.1769 9.64742 11.1755 9.64698 11.1755 9.64607L11.18 9.64732C11.2186 9.64598 11.5126 9.55944 12.4736 9.20868C13.9521 8.66902 14.6012 7.42266 14.9257 6.73012C15.1853 6.17609 15.2142 5.05345 15.2142 4.32446H20.479V17.1546H25.6716V4.25156H32.7394L27.9795 17.1546H33.2442L34.0375 14.3116H40.0235L40.889 17.1546H46.298L39.9514 0.0963287H-0.00317383ZM35.1915 10.6667L37.0666 4.54315L38.9417 10.6667H35.1915ZM5.18948 3.52257V7.02171H7.64156C7.93004 7.02171 8.83155 6.87592 9.33639 6.58432C9.84123 6.29273 10.0215 5.49084 10.0215 5.19924C10.0215 4.90765 9.91335 4.39736 9.44457 3.95996C9.06954 3.61005 8.00216 3.52257 7.64156 3.52257H5.18948Z"
      fill="currentColor"
    />
  </svg>
  <span>RESTRICTED TO ADULTS</span>
</span>
            </div>

            {/* trafficking */}
            <Link href={'https://trafficking.help/in/ '} target="_blank">
            <div className="inline-flex items-center gap-3  text-xs  py-3 rounded-xl">
              <div className="w-10 h-10 flex items-center justify-center bg-red-600 rounded-full text-sm text-white">
                <FaHandPaper/>
              </div>
              <span className="font-semibold text-red-500 tracking-wide">
                STOP HUMAN TRAFFICKING
              </span>
            </div>
            </Link>

            {/* DMCA Image (Dynamic) */}
            {/* {footerData?.img && (
              <div className="mt-5 w-fit">
                <Link href={"#"}>
                  <img
                    src={footerData.img}
                    alt="DMCA"
                    className="h-8 max-w-[140px] object-contain"
                  />
                </Link>
              </div>
            )} */}
{/* DMCA HTML (Dynamic) */}
{footerData?.link && (
  <div
    className="mt-5 w-fit"
    dangerouslySetInnerHTML={{ __html: footerData.link }}
  />
)}
          </div>

          {/* About (Dynamic Description) */}
          <p className=" leading-relaxed max-w-xl">
            {footerData?.description ||
              "Premium advertising platform for verified independent listings. We connect service providers with clients in a secure and professional environment."
            }
          </p>

        </div>

        {/* divider */}
        <div className="border-t border-gray-800 mb-10"></div>

        {/* ===== LINKS ===== */}
        {/* ===== DYNAMIC FOOTER LINKS ===== */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-10">

{legalPages.map((cat) => (
  <div key={cat.category_id}>
    <h3 className="text-(--second-color) font-semibold mb-4">
      {cat.category_name.toUpperCase()}
    </h3>

    <ul className="space-y-2 ">
      {cat.pages.map((page) => (
        <li key={page.id} className="hover:text-(--primary-color) cursor-pointer">
          <Link href={`/${page.slug}`}>
            {page.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
))}

</div>

        {/* ===== BOTTOM CARD ===== */}
        <div className="mt-14  border border-(--primary-color) rounded-2xl p-6 grid md:grid-cols-2 gap-6 items-center" style={{
          borderWidth: "3px"
        }}>

          <div>
            <h3 className=" font-semibold mb-3">GROW YOUR BUSINESS</h3>
            {
              !isAuthenticated &&<Link href={'/login'}>
              <Button className="bg-(--navbar-button-color) hover:bg-(--navbar-button-color-hover) text-(--navbar-button-text-color) hover:text-(--navbar-button-text-color-hover)">POST YOUR ADS</Button>
              </Link>
              
            }
            {
              isAuthenticated && <Link href={'/dashboard/post-ad'}>
              <Button className="bg-(--navbar-button-color) hover:bg-(--navbar-button-color-hover) text-(--navbar-button-text-color) hover:text-(--navbar-button-text-color-hover)">POST YOUR ADS</Button>
              </Link>
            }
            
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">QUICK LOCATION ACCESS</h3>
            <select
              onChange={(e)=>{router.push(`/escorts/${e.target.value}`)}}
              className="w-full  border border-gray-700 rounded-xl px-4 py-3 outline-none   bg-(--website-background) focus:border-(--primary-color)"
            >
              <option>Select city</option>
              {city.map((c)=>(
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* ===== COPYRIGHT (Dynamic) ===== */}
        <div className="text-center text-(--website-text) text-sm mt-10">
           {footerData?.copy_right || "Olvva"}
         
        </div>

      </div>

      {/* Back To Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-(--button-color) hover:bg-(--button-hover-color)  text-(--button-text-color) px-5 hovet:text-(--button-text-hover-color) py-3 rounded-full shadow-lg"
      >
        ↑
      </button>

    </footer>
  )
}