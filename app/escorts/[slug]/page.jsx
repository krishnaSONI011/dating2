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
  const slug = params?.slug ?? ""
  useEffect(() => {

    async function getListingData() {
      try{
        setLoading(true)

        const res = await api.get(
          `/Wb/get_ads?city_slug=${slug}&page=${currentPage}`
        )
       
        
          
          setListing(res?.data?.data || [])
          setTotalPage(res.data.total_pages)
          
          setHtmlContent(res.data.State_city_area.city.description)
          setCity(res.data.State_city_area.local_area)
          console.log(res.data.State_city_area)
       

      }catch(e){
        console.log(e)
      }finally{
        setLoading(false)
      }
    }

    getListingData()

    window.scrollTo({ top: 0, behavior: "smooth" })

  }, [currentPage ,slug])

  return (
    <div>
 <Breadcrumb />
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading ads...
        </div>
      )}
     
      <div className="mx-2 md:mx-20">
        <div className="mt-10">
        <Alert />
        </div>
        

    
      <div className="grid grid-cols-1 md:grid-cols-4  ">
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