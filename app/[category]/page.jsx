'use client'

import api from "@/lib/api"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import ListingLayout from "./ListingLayout"
import PageLayout from "./pageLayout"

export default function Pages() {

  const params = useParams()
  const slug = params.category ?? ""

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [layout, setLayout] = useState(false)

  useEffect(() => {
    if (!slug) return

    async function getDetails() {
      try {
        setLoading(true)
        setError(false)

        const formData = new FormData()
        formData.append("legal_slug", slug)

        const res = await api.post("/Wb/legal_page_detail", formData)

        if (res.data.status == 0) {
          if (res.data.is_category == 1) {
            setLayout(true)
          }
          setData(res.data) //  always set data on success
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

  }, [slug]) 

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

  /* ================= LAYOUT ================= */
  // ✅ Bug 3 fixed: data is guaranteed to exist here
  if (layout) {
    return (
      <ListingLayout
        slug={'xyz'}
        list={data.ads}
        currentPage={1}
        totalPages={data.totalPages}
        city={data.post_categories}
        is_category={data.is_category == 1 ? true : false}
      />
    )
  }

  return <PageLayout title={data.data.title} description={data.data.description} />
}