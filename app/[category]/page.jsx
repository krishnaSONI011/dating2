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
  const [metaData , setMetaData] = useState({
    title : '',
    description : '',
    keywords : ''
  })
  const [error, setError] = useState(false)
  const [layout, setLayout] = useState(false)
  const [des , setDes] = useState('')

  useEffect(() => {

    if (!metaData?.title) return;
  
    const timer = setTimeout(() => {
  
      // Title
      document.title = metaData.title;
  
      // Description
      let meta = document.querySelector("meta[name='description']");
  
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
  
      meta.setAttribute("content", metaData.description);
      let metaKeywords = document.querySelector("meta[name='keywords']");
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", metaData.keywords); 
    }, 200); // delay in milliseconds
  
    return () => clearTimeout(timer);
  
  }, [metaData]);
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
            const cate_data = res.data.post_categories.find((c)=> c.slug === slug)
            setMetaData({
             title : cate_data.meta_title,
             description : cate_data.meta_description,
              keywords : cate_data.keyword
            })
            setDes(cate_data.description)
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
  //  Bug 3 fixed: data is guaranteed to exist here
  if (layout) {
    return (
      <ListingLayout
        slug={'xyz'}
        list={data.ads}
        currentPage={1}
        totalPages={data.totalPages}
        city={data.post_categories}
        is_category={data.is_category == 1 ? true : false}
        htmlContent={des}
      />
    )
  }

  return <PageLayout title={data.data.title} description={data.data.description} />
}