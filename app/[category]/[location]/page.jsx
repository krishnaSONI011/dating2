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
    
        // get correct page content
        const pageData = response?.data?.pages?.find(
          (v) => v.city_slug === slug && v.cat_slug === slug2
        )
    
        setHtmlContent(pageData?.description || "")
    
        // set local areas
        setCity(response?.city_area?.local_area || [])
    
        console.log(response?.city_area)
    
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }

    getListingData()

    window.scrollTo({ top: 0, behavior: "smooth" })

  }, [currentPage, slug, slug2])
 
  return (
      <div>
   <Breadcrumb />
        
       
        <div className=" mx-2 md:mx-20">
          <div className="mt-10">
          <Alert />
          </div>
          
          {loading && (
          <div className="text-center py-10 text-gray-500">
            Loading ads...
          </div>
        )}
      
        <div className=" grid grid-cols-1 md:grid-cols-4  ">
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