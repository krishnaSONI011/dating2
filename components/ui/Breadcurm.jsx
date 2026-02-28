'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaHome, FaChevronRight } from "react-icons/fa"

export default function Breadcrumb() {

  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(x => x)

  return (
    <div className="w-full bg-gradient-to-r from-[#0b1220] to-[#0e1a2f]">

      <div className="max-w-7xl mx-auto 
                      px-4 sm:px-6 lg:px-8 
                      py-3 sm:py-4 lg:py-6">

        <div className="flex items-center 
                        gap-2 sm:gap-3 lg:gap-4 
                        text-sm sm:text-base md:text-lg lg:text-xl 
                        overflow-x-auto whitespace-nowrap">

          {/* Home */}
          <Link
            href="/"
            className="text-gray-400 hover:text-orange-300 transition flex items-center"
          >
            <FaHome className="text-base sm:text-lg md:text-xl lg:text-2xl" />
          </Link>

          {pathSegments.map((segment, index) => {

            const href = "/" + pathSegments.slice(0, index + 1).join("/")
            const isLast = index === pathSegments.length - 1

            return (
              <div key={index} className="flex items-center gap-2 sm:gap-3">

                {/* Arrow */}
                <FaChevronRight className="text-gray-500 
                                           text-xs sm:text-sm md:text-base lg:text-lg" />

                {isLast ? (
                  <span className="text-white font-medium capitalize">
                    {segment.replace(/-/g, " ")}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-orange-300 transition capitalize"
                  >
                    {segment.replace(/-/g, " ")}
                  </Link>
                )}

              </div>
            )
          })}

        </div>

      </div>
    </div>
  )
}