'use client'

import api from "@/lib/api"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Pages() {

  const params = useParams()
  const slug = params.category ?? ""

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return

    async function getDetails() {
      try {
        setLoading(true)
        setError(false)

        const formData = new FormData()
        formData.append("legal_slug", slug)

        const res = await api.post("/Wb/legal_page_detail", formData)

        if (res.data.status === 0) {
          setData(res.data.data)
        } else {
          setError(true)
        }

      } catch (e) {
        console.log(e)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    getDetails()

  }, [])

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Loading...
      </div>
    )
  }

  /* ================= ERROR ================= */
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Page not found
      </div>
    )
  }

  /* ================= PAGE ================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">

      {/* 🔥 HERO 30vh */}
      <div className="h-[30vh] flex items-center justify-center bg-[#0b1220] border-b border-slate-700">

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-400 text-center px-4">
          {data.title}
        </h1>

      </div>

      {/* 🔥 DESCRIPTION */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">

        <div
          className="prose prose-invert max-w-none text-gray-300 leading-8"
          dangerouslySetInnerHTML={{
            __html: data?.description ?? ""
          }}
        />

      </div>

    </div>
  )
}