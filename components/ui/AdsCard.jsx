'use client'

import { FaPhoneAlt, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

export default function EscortCard({
  id,
  image,
  title,
  desc,
  age,
  location,
  phone,
  telegram,
  is_superTop,
  highlight,
  is_new,
}) {

  function handleCall(){
    if(!phone) return alert("Number not available")
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

  return (
    <div
      className={`
      relative rounded-2xl border 
      ${highlight 
        ? "border-yellow-400 bg-yellow-50 shadow-xl" 
        : "border-gray-200 bg-white"}
      `}
    >

      {/* SUPER TOP badge */}
      {is_superTop && (
        <div className="absolute right-0 -top-2 bg-red-600 text-white px-4 py-1 text-xs font-bold rounded-full z-20">
          SUPER TOP
        </div>
      )}

      {/* ALWAYS CARD VIEW */}
      <div className="flex items-stretch">

        {/* IMAGE LEFT (FIXED) */}
        <div className="relative w-[140px] sm:w-[170px] md:w-[200px] flex-shrink-0 overflow-hidden rounded-l-2xl">

          {/* NEW badge */}
          {is_new && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full z-20">
              NEW
            </div>
          )}

          {/* image */}
          <div
            className="w-full h-full min-h-[180px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${image || "/noimage.jpg"})`,
            }}
          />

          {/* watermark */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-white/40 text-xl font-bold rotate-[-20deg]">
              AFFAIR ESCORTS
            </span>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">

          <div>
            <h2 className="text-sm md:text-xl font-bold text-gray-800 uppercase">
              {title}
            </h2>

            <p className="text-gray-600 text-sm mt-2 line-clamp-2 md:line-clamp-3">
              {desc}
            </p>

            <div className="flex gap-6 mt-3 text-sm font-semibold text-gray-700">
              <div>{age} Years</div>
              <div>{location}</div>
            </div>
          </div>

          {/* buttons */}
          {is_superTop && (
            <div className="flex gap-3 mt-4 justify-end">
              
              <button 
                onClick={handleCall}
                className="bg-red-500 hover:bg-red-600 text-white p-3 md:p-4 rounded-xl">
                <FaPhoneAlt />
              </button>

              <button 
                onClick={handleWhatsapp}
                className="bg-green-500 hover:bg-green-600 text-white p-3 md:p-4 rounded-xl">
                <FaWhatsapp />
              </button>

              <button 
                onClick={handleTelegram}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 md:p-4 rounded-xl">
                <FaTelegramPlane />
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}