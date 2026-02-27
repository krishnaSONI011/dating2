'use client'
import { useEffect, useState } from "react";
import ImageCard from "../ui/ImageCard";
import api from "@/lib/api";
import Link from "next/link";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  
  subsets: ["latin"],
  weight : [ "600"]
})

export default function CityWise({title}){
    const [topCity ,setTopCity] = useState([])

    useEffect(()=>{
        async function getTopCity() {
            try{
                const res = await api.post("/Wb/top_cities")
                if(res.data.status == 0){
                    setTopCity(res.data.data)
                }
            }catch(e){
                console.log(e)
            }
        }
        getTopCity()
    },[])
    return( 

        <>
        <div className="mx-5 md:container md:mx-auto py-8 md:py-12 md:px-4 px-0 popular-locations-section">
        <h1 className={`mb-8 sm:mb-12 md:mb-14 text-center font-serif text-2xl sm:text-3xl md:text-4xl lg:text-3xl text-orange-200 font-bold px-2 ${poppins.className} font-bold`}>{title}</h1>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 md:px-10 px-0">
            {
                topCity.map((city)=>(
                    <Link  key={city.id} href={`/escorts/${city.slug}`}>
                    <ImageCard count={city.ads_count} image={city.image} city={city.name} state={city.state_name}/></Link>
                ))
            }
               
        </div>
        </div>
        
        </>
    )
}