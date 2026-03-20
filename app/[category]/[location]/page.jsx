'use client'

import PageContent from "@/components/Home/PageContent";
import CardShower from "@/components/search/CardSower";
import PopularArea from "@/components/search/PopularArea";
import Alert from "@/components/ui/Alert";
import Breadcrumb from "@/components/ui/Breadcurm";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Search(){

  const [list, setListing] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [htmlContent , setHtmlContent] = useState('')
  const [city , setCity] = useState([])

  const [metaData, setMetaData] = useState({
    title: "",
    description: "",
    keyword : ""
  })

  const params = useParams();
  const slug = params?.location ?? ""
  const slug2 = params?.category ?? ''

  useEffect(() => {

    async function getListingData() {
      try {

        setLoading(true)

        const formData = new FormData()
        formData.append("cat_slug", slug2)
        formData.append("city_slug", slug)

        const res = await api.post("/Wb/pages", formData)

        const response = res?.data

        setListing(response?.data?.ads || [])
        setTotalPage(response?.total_pages || 0)

        const pageData = response?.data?.pages?.find(
          (v) => v.city_slug === slug && v.cat_slug === slug2
        )

        setHtmlContent(pageData?.description || "")

        //  Set meta data
        setMetaData({
          title: pageData?.meta_title || `${slug2} in ${slug}`,
          description: pageData?.meta_description ,
          keyword : pageData?.keyword

        })

        setCity(response?.city_area?.local_area || [])

      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }

    getListingData()

    window.scrollTo({ top: 0, behavior: "smooth" })

  }, [currentPage, slug, slug2])


  /* ================= META TAG HANDLER ================= */

  useEffect(() => {

    if (!metaData?.title) return

    const timer = setTimeout(() => {

      // Title
      document.title = metaData.title

      // Description
      let meta = document.querySelector("meta[name='description']")

      if (!meta) {
        meta = document.createElement("meta")
        meta.name = "description"
        document.head.appendChild(meta)
      }

      meta.setAttribute("content", metaData.description)
      let metaKeywords = document.querySelector("meta[name='keywords']");
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", metaData.keyword); 

    }, 200)

    return () => clearTimeout(timer)

  }, [metaData])


  return (
    <div>

      <Breadcrumb />

      <div className="mx-2 md:mx-20">

        <div className="mt-10">
          <Alert />
        </div>

        {loading && (
          <div className="text-center py-10 text-gray-500">
            Loading ads...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4">

          <div className="col-span-3">
            <CardShower
              slug={slug}
              items={list}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>

          <div className="mx-5 mt-10">
            <PopularArea areas={city} slug={slug}/>
          </div>

        </div>

        <div>
          <PageContent html={htmlContent}/>
        </div>

      </div>

    </div>
  )
}