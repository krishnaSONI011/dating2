'use client'

import { useContext } from "react"
import { ThemeContext } from "@/context/ThemeContext"

export default function WebsiteLogo({ width = 200 }) {

  const { themeData } = useContext(ThemeContext)

  const logo = themeData?.logo || ""
  const title = themeData?.title || "Website"

  return (
    <div className="flex items-center">

      {logo ? (
        <img
          src={logo}
          alt={title}
          style={{ maxWidth: `${width}px` }}
          className="
            h-10 sm:h-12 md:h-14
            w-auto
            object-contain
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