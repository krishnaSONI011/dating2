'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function TopSearches() {

  const router = useRouter()
  const [tags, setTags] = useState([])

  useEffect(() => {
    async function getTags() {
      try {
        const formData = new FormData()

        // 👇 agar tum category/city bhejna chaho to yaha append karo
        // formData.append("cat_slug", "call-girl")
        // formData.append("city_slug", "mumbai")

        const res = await api.post("/Wb/pages", formData)

        const pages = res?.data?.data?.pages || []

        setTags(pages)

      } catch (e) {
        console.log(e)
      }
    }

    getTags()
  }, [])

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">

        {/* Heading */}
        <h2 className={`mb-8 text-center text-3xl text-orange-200 font-bold ${poppins.className}`}>
          Top Search
        </h2>

        {/* Dynamic Tags */}
        <div className="flex flex-wrap justify-center gap-3">

          {tags.map((item) => (

            <span
              key={item.id}
              onClick={() => {

                // dynamic route build
                const category = item.cat_slug
                const city = item.city_slug

                router.push(`/${category}/escorts/${city}`)
              }}
              className="rounded-xl hover:bg-orange-600 hover:scale-105 bg-orange-600/70 px-5 py-2 text-sm text-white transition cursor-pointer"
            >
              {item.title}
            </span>

          ))}

        </div>

      </div>
    </section>
  )
}