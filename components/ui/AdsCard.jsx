'use client'

import { FaPhoneAlt, FaWhatsapp, FaTelegramPlane, FaMapMarkerAlt, FaHeart } from "react-icons/fa"

export default function EscortCard({
  id,
  image,
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

  function showCards(){
    if(is_new || highlight || is_superTop){
      return  <div className="flex justify-end gap-3 mt-6">

      <button
        onClick={handleCall}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
      >
        <FaPhoneAlt/>
      </button>
      {
        is_whatsapp &&  <button
        onClick={handleWhatsapp}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
      >
        <FaWhatsapp/>
      </button>
      }
     {
      is_telegram && <button
      onClick={handleTelegram}
      className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-lg"
    >
      <FaTelegramPlane/>
    </button>
     }

      

    </div>
    }
  }
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
      relative rounded-3xl  border transition-all duration-300
      
      ${highlight 
        ? "border-orange-300 bg-orange-100/30 shadow-[0_0_25px_rgba(253,186,116,0.3)]" 
        : "border-gray-700 bg-gradient-to-r from-[#0f172a] to-[#1e293b]"}
      `}
    >

      {/* SUPER TOP */}
      {is_superTop && (
        <div className="absolute right-4 z- -top-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold z-50">
          SUPER TOP
        </div>
      )}

      <div className="flex overflow-hidden h-[320]">

        {/* IMAGE */}
        <div className="relative h-[420] rounded-tl    w-[180px] md:w-[220px]  flex-shrink-0 ">

          {is_new && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full z-20">
              NEW
            </div>
          )}

          {/* views badge */}
         

          <img
            src={image || "/noimage.jpg"}
            className="w-full h-full object-cover rounded-bl-3xl rounded-tl-3xl"
          />
        </div>

        {/* RIGHT */}
        <div className="flex-1 p-5 flex flex-col justify-between">

          {/* title */}
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-orange-300 leading-snug">
              {title}
            </h2>

            <p className="text-gray-300 text-sm mt-2 line-clamp-2">
              {desc}
            </p>

            {/* location */}
            <div className="flex items-center gap-2 text-gray-400 mt-4">
              <FaMapMarkerAlt className="text-orange-400"/>
              {location}
            </div>

            {/* tags */}
            <div className="flex gap-3 mt-4 flex-wrap">
              <span className="bg-white/5 border border-gray-600 px-3 py-1 rounded-lg text-xs">
                Female
              </span>
              <span className="bg-white/5 border border-gray-600 px-3 py-1 rounded-lg text-xs">
                {age}y
              </span>
              <span className="bg-white/5 border border-gray-600 px-3 py-1 rounded-lg text-xs">
                {country}
              </span>
            </div>
          </div>

          {/* bottom buttons */}
          {
           showCards()
          }
         
        </div>
      </div>
    </div>
  )
}