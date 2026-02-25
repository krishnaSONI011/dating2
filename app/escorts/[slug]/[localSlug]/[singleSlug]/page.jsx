'use client'
import { useEffect, useState } from "react"
import { FaPhone, FaWhatsapp, FaTelegram, FaShieldAlt, FaMapMarkerAlt } from "react-icons/fa"
import api from "@/lib/api"
import { useParams } from "next/navigation"
import Breadcrumb from "@/components/ui/Breadcurm"
import Button from "@/components/ui/Button"
import ReusableModal from "@/components/ui/Model"

export default function SingleAdPage({id}){

  const [data,setData] = useState(null)
  const [active,setActive] = useState(0)
  const [open , setOpne ] = useState(false)
 const params = useParams();
  const slug = params?.singleSlug ?? ""
  useEffect(()=>{
    getAd()
  },[])

  async function getAd(){
    try{
        const formData = new FormData()
        formData.append("ads_slug" , slug)
      const res = await api.post(`/Wb/ads_edit` , formData) // change endpoint
      if(res.data.status==0){
        setData(res.data.data)
      }
    }catch(e){
      console.log(e)
    }
  }

  if(!data) return <div className="p-20">Loading...</div>

  const ad = data.ads
  const images = data.images || []
  const services = data.services || []
  const time = data.time?.[0]

  return (
    <div className="bg-[#f6f7fb] min-h-screen py-10">
    <Breadcrumb/>
    
    <div className="mt-5 max-w-7xl mx-auto grid grid-cols-3 gap-8">
    
    {/* ================= LEFT ================= */}
    <div className="col-span-2 space-y-6">
    
    {/* ===== IMAGE CARD ===== */}
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5">
    
    <div className="relative group">
    
    <img
      src={images[active]?.img}
      className="w-full h-[500px] object-cover rounded-2xl"
    />
    
    {/* arrows */}
    {images.length > 1 && (
    <>
    <button
    onClick={()=>setActive((active-1+images.length)%images.length)}
    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-10 h-10 rounded-full"
    >‹</button>
    
    <button
    onClick={()=>setActive((active+1)%images.length)}
    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-10 h-10 rounded-full"
    >›</button>
    </>
    )}
    </div>
    
    {/* thumbnails */}
    <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
    {images.map((img,i)=>(
    <img
    key={i}
    src={img.img}
    onClick={()=>setActive(i)}
    className={`w-24 h-20 object-cover rounded-xl cursor-pointer border-2 transition
    ${active===i ? "border-red-500":"border-gray-200 hover:border-gray-400"}`}
    />
    ))}
    </div>
    
    </div>
    
    
    {/* ===== DETAILS ===== */}
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-7">
    
    {/* badges */}
    <div className="flex gap-2 mb-3">
    {ad.super_top=="1" && (
    <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
    ⭐ Super Top
    </span>
    )}
    
    {ad.new=="1" && (
    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
    NEW
    </span>
    )}
    </div>
    
    <h1 className="text-3xl font-bold text-gray-800 mb-2">
    {ad.title}
    </h1>
    
    <p className="text-gray-500 flex items-center gap-2 mb-6">
    <FaMapMarkerAlt className="text-red-500"/>
    {ad.local_area} , {ad.city_name}
    </p>
    
    {/* profile grid */}
    <div className="grid grid-cols-3 gap-4 mb-7">
    
    <Info label="Age" value={ad.age}/>
    <Info label="Ethnicity" value={ad.ethnicity}/>
    <Info label="Body" value={ad.body_type}/>
    <Info label="Hair" value={ad.hair}/>
    <Info label="Nationality" value={ad.nationality}/>
    <Info label="Available" value={`${time?.from_time} - ${time?.to_time}`}/>
    
    </div>
    
    {/* description */}
    <div className="border-t pt-5">
    <h3 className="font-semibold text-lg mb-2">About</h3>
    
    <p className="text-gray-700 leading-7 text-[15px]">
    {ad.description}
    </p>
    </div>
    
    {/* services */}
    {services.length>0 && (
    <div className="border-t mt-6 pt-5">
    <h3 className="font-semibold text-lg mb-3">Services</h3>
    
    <div className="flex flex-wrap gap-2">
    {services.map(s=>(
    <span key={s.id}
    className="bg-gray-100 border border-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-200">
    {s.title}
    </span>
    ))}
    </div>
    </div>
    )}
    
    </div>
    </div>
    
    
    {/* ================= RIGHT CONTACT ================= */}
    <div className="sticky top-24 h-fit">
    
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6">
    
    <h3 className="text-xl font-bold mb-6 text-gray-800">
    Contact Information
    </h3>
    
    {/* call */}
    <a href={`tel:${ad.mobile}`}>
    <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold mb-3 shadow">
    <FaPhone/> Call Now
    </button>
    </a>
    
    {/* whatsapp */}
    <a href={`https://wa.me/91${ad.mobile}`} target="_blank">
    <button className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3 rounded-xl font-semibold mb-3 shadow">
    <FaWhatsapp/> WhatsApp Chat
    </button>
    </a>
    
    {/* telegram */}
    <button className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold mb-4 shadow">
    <FaTelegram/> Telegram
    </button>
    
    {/* safety box */}
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
    
    <div className="flex gap-3">
    <FaShieldAlt className="text-red-600 mt-1"/>
    
    <div className="text-sm text-red-700">
    <b>Safety Tips</b>
    <p className="mt-1">
    Never pay advance to anyone.  
    Always meet safely in public place.
    </p>
    </div>
    
    
    </div>
    </div>
    <div className="mt-5">
        <ReusableModal open={open}  >
            <h1 className="text-3xl font-bold">Report This Ad !</h1>
            <select className="w-full bg-gray-200 p-2 border border-gray-500 rounded mt-5">
                <option value="">Fake Profile / Not Matching</option>
                <option value="">Asking Advance Payments</option>
                <option value="">Wrong Category / Sapm</option>
            </select>
            <textarea name="" id="" className="mt-5 bg-gray-200 w-full  rounded h-[200px] p-2" placeholder="Write the detail Description"></textarea>
            <div className="flex gap-2 mt-5">
                <Button>Submit</Button>
                <Button onClick={()=> setOpne(false)} className="bg-red-500 hover:bg-red-600">Cancel</Button>
            </div>
        </ReusableModal>
        <Button onClick={()=> setOpne(true)} className="bg-red-500 hover:bg-red-700">Report This ad</Button>
    </div>
    </div>
    </div>
    
    </div>
    </div>
    )
}

function Info({label,value}){
  return(
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  )
}