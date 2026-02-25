'use client'
import { useEffect, useState } from "react";
import ImageCard from "../ui/ImageCard";
import api from "@/lib/api";
import Link from "next/link";


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
        <div className="mt-10">
        <h1 className="mb-8 sm:mb-12 md:mb-14 text-center font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black px-2">{title}</h1>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 px-10">
            {
                topCity.map((city)=>(
                    <Link  key={city.id} href={`/escorts/${city.slug}`}>
                    <ImageCard image={city.image} city={city.name} state={city.state_name}/></Link>
                ))
            }
               
        </div>
        </div>
        
        </>
    )
}