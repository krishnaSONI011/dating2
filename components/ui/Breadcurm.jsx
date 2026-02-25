'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb(){

  const pathname = usePathname()

  // split path
  const pathSegments = pathname.split("/").filter(x => x)

  return (
    <div className="w-full bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3">

        <div className="flex items-center flex-wrap text-sm">

          {/* Home */}
          <Link href="/" className="text-gray-500 hover:text-orange-500 font-medium">
            Home
          </Link>

          {pathSegments.map((segment, index) => {

            const href = "/" + pathSegments.slice(0, index + 1).join("/")
            const isLast = index === pathSegments.length - 1

            return (
              <span key={index} className="flex items-center">

                <span className="mx-2 text-gray-400">/</span>

                {isLast ? (
                  <span className="text-gray-800 font-semibold capitalize">
                    {segment.replace("-", " ")}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="text-gray-500 hover:text-orange-500 capitalize"
                  >
                    {segment.replace("-", " ")}
                  </Link>
                )}

              </span>
            )
          })}

        </div>
      </div>
    </div>
  )
}