'use client'

import { useEffect, useState } from "react"
import EscortCard from "@/components/ui/AdsCard"
import api from "@/lib/api"
import { getExpiryDate } from "@/lib/DateTimeFormate"
import { 
  FaCrown, FaEdit, FaRedo, FaRegCalendarAlt, 
  FaRocket, FaClock 
} from "react-icons/fa"
import Button from "@/components/ui/Button"
import { toast } from "react-toastify"
import Link from "next/link"

export default function MyAds(){

  const [ads,setAds] = useState([])
  const [activeTab,setActiveTab] = useState("all")
  const [loading,setLoading] = useState(true)

  function isExpired(createdAt, days = 15){
    const d = new Date(createdAt)
    d.setDate(d.getDate() + days)
    return new Date() > d
  }

  useEffect(()=>{ getAds() },[])

  async function getAds(){
    try{
      const res = await api.get("/Wb/get_ads_by_id")
      if(res.data.status === 0){
        setAds(res.data.data)
      }
    }catch(e){ console.log(e) }
    finally{ setLoading(false) }
  }

  async function deleteMyList(id){
    try{
      const formData = new FormData()
      formData.append('ads_id', id)

      const res = await api.post('/Wb/ads_delete', formData)

      if(res.data.status == 0){
        toast.success(res.data.message)
        setAds(prev => prev.filter(ad => ad.id !== id))
      } else {
        toast.error(res.data.message)
      }
    } catch(e){
      console.log(e)
    }
  }

  const filteredAds = ads.filter(ad=>{
    if(activeTab === "all") return true
    if(activeTab === "promoted") return ad.is_promoted=="1"
    if(activeTab === "expired") return isExpired(ad.created_at)
    return true
  })

  const promotedCount = ads.filter(a=>a.is_promoted=="1").length
  const expiredCount = ads.filter(a=>isExpired(a.created_at)).length

  return(
    <div className="bg-gray-950 min-h-screen px-4 sm:px-10 py-10 text-white">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          My Ads Dashboard
        </h1>
        <p className="text-gray-400">
          Manage and promote your listings easily
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<FaRocket/>} title="Total Ads" value={ads.length}/>
        <StatCard icon={<FaCrown/>} title="Promoted" value={promotedCount}/>
        <StatCard icon={<FaClock/>} title="Expired" value={expiredCount}/>
        <StatCard icon={<FaRocket/>} title="Active" value={ads.length-expiredCount}/>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-800 mb-10 overflow-x-auto">
        <TabBtn
          label={`All Ads (${ads.length})`}
          active={activeTab==="all"}
          onClick={()=>setActiveTab("all")}
        />
        <TabBtn
          label={`Promoted (${promotedCount})`}
          active={activeTab==="promoted"}
          onClick={()=>setActiveTab("promoted")}
        />
        <TabBtn
          label={`Expired (${expiredCount})`}
          active={activeTab==="expired"}
          onClick={()=>setActiveTab("expired")}
        />
      </div>

      {loading && <div className="text-gray-400">Loading ads...</div>}

      {!loading && filteredAds.length===0 && (
        <div className="bg-gray-900 p-10 rounded-xl text-center border border-gray-800">
          <p className="text-gray-400">No ads found</p>
        </div>
      )}

      {/* ADS */}
      <div className="grid grid-cols-1 gap-8">

        {filteredAds.map(ad=>{

          const img = ad.images?.length ? ad.images[0] : "/noimage.jpg"
          const expiry = getExpiryDate(ad.created_at,15)
          const expired = isExpired(ad.created_at,15)

          return(
            <div key={ad.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow hover:shadow-xl transition overflow-hidden">

              {/* TOP BAR */}
              <div className="flex justify-between items-center bg-gray-800 px-6 py-3 border-b border-gray-700">

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaRegCalendarAlt/>
                  Expires:
                  <span className={`font-bold ml-2 ${expired?"text-red-500":"text-green-400"}`}>
                    {expiry}
                  </span>
                </div>

                <div className="flex gap-2">

                  {ad.is_promoted=="1" && (
                    <button  className="flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                      <FaCrown size={12}/> Promoted
                    </button>
                  )}

                  {expired && (
                    <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                      Expired
                    </span>
                  )}

                </div>
              </div>

              {/* CARD */}
              <div className="p-5">
                <EscortCard
                  title={ad.title}
                  desc={ad.description}
                  age={ad.age}
                  location={`${ad.city_name || ""} ${ad.state_name || ""}`}
                  image={img}
                  is_superTop={ad.super_top=="1"}
                  is_new={ad.new=="1"}
                  highlight={ad.hight_light=="1"}
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between items-center px-6 py-4 border-t border-gray-800">

                <div className="flex gap-3">
                  {/* <ActionBtn icon={<FaEdit/>} label="Edit"/> */}
                  <Button 
                    onClick={()=>deleteMyList(ad.id)} 
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                    Delete
                  </Button>
                </div>

                <div>
                  {ad.is_promoted!="1" && !expired && (
                    <Link href={`/dashboard/ads/promote/${ad.id}`}>
                    <ActionBtn icon={<FaRocket/>} label="Promote" primary/>
                    </Link>
                  )}
                  {expired && (
                    <ActionBtn icon={<FaRedo/>} label="Repost" dark/>
                  )}
                </div>

              </div>

            </div>
          )
        })}

      </div>
    </div>
  )
}

/* COMPONENTS */

function TabBtn({label,active,onClick}){
  return(
    <button
      onClick={onClick}
      className={`pb-3 px-2 font-semibold border-b-2 transition whitespace-nowrap
      ${active
        ? "border-red-600 text-red-500"
        : "border-transparent text-gray-400 hover:text-white"}`}
    >
      {label}
    </button>
  )
}

function StatCard({icon,title,value}){
  return(
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex items-center gap-4">
      <div className="text-red-500 text-2xl">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-white">{value}</h2>
      </div>
    </div>
  )
}

function ActionBtn({icon,label,primary,dark}){
  let cls="bg-gray-800 hover:bg-gray-700 text-gray-300"
  if(primary) cls="bg-red-600 hover:bg-red-700 text-white"
  if(dark) cls="bg-black text-white hover:bg-gray-800"

  return(
    <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${cls}`}>
      {icon} {label}
    </button>
  )
}