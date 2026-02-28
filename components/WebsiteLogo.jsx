'use client'

import { useContext } from "react"
import { ThemeContext } from "@/context/ThemeContext"

export default function WebsiteLogo(){

  const { themeData } = useContext(ThemeContext)

  const logo = themeData?.logo || ""
  const title = themeData?.website_title || "Website"

  return (
    <div className="flex items-center">

      {logo ? (
        <img
          src={logo}
          alt={title}
          className="
            h-10 sm:h-12 md:h-14
            w-auto
            object-contain
            max-w-[180px]
          "
        />
      ) : (
        <span className="text-lg sm:text-xl font-bold text-orange-500">
          {title}
        </span>
      )}

    </div>
  )
}