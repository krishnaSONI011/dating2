'use client'

import { useEffect, useState } from "react"
import EscortCard from "@/components/ui/AdsCard"
import api from "@/lib/api"
import { getExpiryDate } from "@/lib/DateTimeFormate"

import { 
  FaCrown, FaEdit, FaRedo, FaRegCalendarAlt, 
  FaRocket, FaTrash, FaBullhorn, FaClock 
} from "react-icons/fa"
import Button from "@/components/ui/Button"
import { toast } from "react-toastify"

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
  
        //  instant remove from UI
        setAds(prev => prev.filter(ad => ad.id !== id))
  
      } else {
        toast.error(res.data.message)
      }
  
    } catch(e){
      console.log(e)
    }
  }
  // ===== FILTER =====
  const filteredAds = ads.filter(ad=>{
    if(activeTab === "all") return true
    if(activeTab === "promoted") return ad.is_promoted=="1"
    if(activeTab === "expired") return isExpired(ad.created_at)
    return true
  })

  const promotedCount = ads.filter(a=>a.is_promoted=="1").length
  const expiredCount = ads.filter(a=>isExpired(a.created_at)).length

  return(
    <div className="bg-gray-50 min-h-screen px-10 py-10">

      {/* ===== PAGE HEADER ===== */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          My Ads Dashboard
        </h1>
        <p className="text-gray-500">
          Manage and promote your listings easily
        </p>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-4 gap-6 mb-10">

        <StatCard icon={<FaBullhorn/>} title="Total Ads" value={ads.length}/>
        <StatCard icon={<FaRocket/>} title="Promoted" value={promotedCount}/>
        <StatCard icon={<FaClock/>} title="Expired" value={expiredCount}/>
        <StatCard icon={<FaCrown/>} title="Active" value={ads.length-expiredCount}/>

      </div>

      {/* ===== TABS ===== */}
      <div className="flex gap-6 border-b mb-10">

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

      {/* ===== LOADING ===== */}
      {loading && (
        <div className="text-gray-500">Loading ads...</div>
      )}

      {/* ===== EMPTY ===== */}
      {!loading && filteredAds.length===0 && (
        <div className="bg-white p-10 rounded-xl text-center shadow">
          <p className="text-gray-500">No ads found</p>
        </div>
      )}

      {/* ===== ADS LIST ===== */}
      <div className="grid grid-cols-1 gap-8">

        {filteredAds.map(ad=>{

          const img = ad.images?.length ? ad.images[0] : "/noimage.jpg"
          const expiry = getExpiryDate(ad.created_at,15)
          const expired = isExpired(ad.created_at,15)

          return(
            <div key={ad.id}
              className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition overflow-hidden">

              {/* ===== TOP BAR ===== */}
              <div className="flex justify-between items-center bg-gray-50 px-6 py-3 border-b">

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaRegCalendarAlt/>
                  Expires:
                  <span className={`font-bold ml-2 ${expired?"text-red-600":"text-green-600"}`}>
                    {expiry}
                  </span>
                </div>

                <div className="flex gap-2">

                  {ad.is_promoted=="1" && (
                    <span className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full">
                      <FaCrown size={12}/> Promoted
                    </span>
                  )}

                  {expired && (
                    <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                      Expired
                    </span>
                  )}

                </div>
              </div>

              {/* ===== CARD ===== */}
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

              {/* ===== ACTIONS ===== */}
              <div className="flex justify-between items-center px-6 py-4 border-t">

                <div className="flex gap-3">
                  <ActionBtn icon={<FaEdit/>} label="Edit"/>
                  <Button onClick={()=>deleteMyList(ad.id)} className="p-2 bg-red-500 hover:bg-red-700">Delete</Button>
                </div>

                <div>
                  {ad.is_promoted!="1" && !expired && (
                    <ActionBtn icon={<FaRocket/>} label="Promote" primary/>
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

/* ===== SMALL COMPONENTS ===== */

function TabBtn({label,active,onClick}){
  return(
    <button
      onClick={onClick}
      className={`pb-3 px-2 font-semibold border-b-2 transition
      ${active
        ? "border-red-600 text-red-600"
        : "border-transparent text-gray-500 hover:text-black"}`}
    >
      {label}
    </button>
  )
}

function StatCard({icon,title,value}){
  return(
    <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
      <div className="text-red-600 text-2xl">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
    </div>
  )
}

function ActionBtn({icon,label,primary,danger,dark}){
  let cls="bg-gray-100 hover:bg-gray-200 text-gray-700"
  if(primary) cls="bg-red-600 hover:bg-red-700 text-white"
  if(danger) cls="bg-red-50 text-red-600 hover:bg-red-100"
  if(dark) cls="bg-black text-white hover:bg-gray-900"

  return(
    <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${cls}`}>
      {icon} {label}
    </button>
  )
}