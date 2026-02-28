'use client'

import { 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaTelegramPlane, 
  FaMapMarkerAlt, 
  FaCheckCircle 
} from "react-icons/fa"
import { useEffect, useState, useContext } from "react"
import { ThemeContext } from "@/context/ThemeContext"

export default function EscortCard({
  images = [],
  title,
  desc,
  age,
  location,
  phone,
  telegram,
  is_whatsapp,
  is_telegram,
  country,
  is_superTop,
  highlight,
  is_new,
}) {

  const { themeData } = useContext(ThemeContext)
  const [activeIndex, setActiveIndex] = useState(0)

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!images || images.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [images])

  /* ================= ACTIONS ================= */
  function handleCall(){
    if(!phone) return
    window.location.href = `tel:${phone}`
  }

  function handleWhatsapp(){
    if(!phone) return
    window.open(`https://wa.me/${phone}`, "_blank")
  }

  function handleTelegram(){
    if(!telegram) return
    window.open(`https://t.me/${telegram}`, "_blank")
  }

  function showButtons(){
    if(is_new || highlight || is_superTop){
      return (
        <div className="flex justify-end gap-2 mt-4">

          <button
            onClick={handleCall}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white"
          >
            <FaPhoneAlt size={12}/>
          </button>

          {is_whatsapp && (
            <button
              onClick={handleWhatsapp}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white"
            >
              <FaWhatsapp size={12}/>
            </button>
          )}

          {is_telegram && (
            <button
              onClick={handleTelegram}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-600 text-white"
            >
              <FaTelegramPlane size={12}/>
            </button>
          )}

        </div>
      )
    }
  }

  return (
    <div
      className={`
      relative rounded-2xl border transition-all duration-300 
      ${highlight 
        ? "border-orange-400 bg-orange-500/30 shadow-[0_0_20px_rgba(253,186,116,0.2)]" 
        : "border-gray-700 bg-gradient-to-r from-[#0f172a] to-[#1e293b]"}
      `}
    >

      {/* SUPER TOP */}
      {is_superTop && (
        <div className="absolute right-3 -top-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold z-30">
          SUPER TOP
        </div>
      )}

      <div className="flex overflow-hidden">

        {/* IMAGE SLIDER */}
        <div className="relative w-[130px] sm:w-[150px] md:w-[180px] h-[200px] sm:h-[220px] md:h-[240px] flex-shrink-0 overflow-hidden rounded-l-2xl">

          {/* NEW Badge */}
          {is_new && (
            <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-2 py-1 rounded-full z-30">
              NEW
            </div>
          )}

          {/* VERIFIED GREEN */}
          <div className="absolute bottom-2 left-2 bg-green-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 z-30 shadow-md">
            <FaCheckCircle size={10}/> Verified
          </div>

          {/* WATERMARK LOGO */}
          {themeData?.logo && (
            <img
              src={themeData.logo}
              alt="Watermark"
              className="
                absolute inset-0 m-auto 
                max-w-[70%] max-h-[70%]
                object-contain
                z-50
                opacity-30
                pointer-events-none
                select-none
              "
            />
          )}

          {/* Smooth Fade Images */}
          {images && images.length > 0 ? (
            images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="card"
                className={`
                  absolute inset-0 w-full h-full object-cover
                  transition-opacity duration-1000 ease-in-out
                  ${index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"}
                `}
              />
            ))
          ) : (
            <img
              src="/noimage.jpg"
              className="w-full h-full object-cover"
              alt="card"
            />
          )}

        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">

          <div>

            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-orange-300 leading-snug">
              {title}
            </h2>

            <p className="text-gray-400 text-xs sm:text-sm mt-2 line-clamp-2">
              {desc}
            </p>

            <div className="hidden sm:flex items-center gap-2 text-gray-400 text-xs mt-3">
              <FaMapMarkerAlt className="text-orange-400 text-xs"/>
              {location}
            </div>

            <div className="hidden sm:flex gap-2 mt-3 flex-wrap text-xs">
              <span className="bg-white/5 border border-gray-600 px-2 py-1 rounded-md">
                Female
              </span>
              <span className="bg-white/5 border border-gray-600 px-2 py-1 rounded-md">
                {age} years
              </span>
              <span className="bg-white/5 border border-gray-600 px-2 py-1 rounded-md">
                {country}
              </span>
            </div>

          </div>

          {showButtons()}

        </div>
      </div>
    </div>
  )
}