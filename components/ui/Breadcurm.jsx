'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaHome, FaChevronRight } from "react-icons/fa"

export default function Breadcrumb() {

  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(x => x)

  return (
    <div className="w-full bg-gradient-to-r from-[#0b1220] to-[#0e1a2f]">
      <div className="max-w-7xl mx-auto px-6 py-5">

        <div className="flex items-center gap-3 text-lg">

          {/* Home Icon */}
          <Link
            href="/"
            className="text-gray-400 hover:text-orange-300 transition"
          >
            <FaHome className="text-xl" />
          </Link>

          {pathSegments.map((segment, index) => {

            const href = "/" + pathSegments.slice(0, index + 1).join("/")
            const isLast = index === pathSegments.length - 1

            return (
              <div key={index} className="flex items-center gap-3">

                {/* Arrow */}
                <FaChevronRight className="text-gray-500 text-sm" />

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