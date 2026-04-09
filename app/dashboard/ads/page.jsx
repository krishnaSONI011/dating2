'use client'

import { useEffect, useState } from "react"
import EscortCard from "@/components/ui/AdsCard"
import api from "@/lib/api"
import { 
  FaCrown, FaEdit, FaRedo, 
  FaRocket, FaClock 
} from "react-icons/fa"
import Button from "@/components/ui/Button"
import { toast } from "react-toastify"
import Link from "next/link"

export default function MyAds(){

  const [ads,setAds] = useState([])
  const [activeTab,setActiveTab] = useState("all")
  const [loading,setLoading] = useState(true)

  const [repostingId,setRepostingId] = useState(null)
  const [showModal,setShowModal] = useState(false)
  const [selectedAd,setSelectedAd] = useState(null)

  useEffect(()=>{ getAds() },[])

  async function getAds(){
    try{
      const res = await api.get("/Wb/get_ads_by_id")
      if(res.data.status == 0){
        setAds(res.data.data)
      }
    }catch(e){ 
      console.log(e) 
    }
    finally{ 
      setLoading(false) 
    }
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

  /* ================= OPEN MODAL ================= */

  function openRepostModal(ad){
    setSelectedAd(ad)
    setShowModal(true)
  }

  /* ================= CONFIRM REPOST ================= */

  async function confirmRepost(){

    if(!selectedAd) return

    try{
      setRepostingId(selectedAd.id)

      const formData = new FormData()
      formData.append("ads_id", selectedAd.id)
      formData.append("total", 1)

      const res = await api.post("/Wb/ads_repost", formData)

      if(res.data.status == 0){
        toast.success(res.data.message || "Ad reposted successfully")
        setShowModal(false)
        getAds()
      }else{
        toast.error(res.data.message || "Repost failed")
      }

    }catch(e){
      console.log(e)
      toast.error("Something went wrong")
    }
    finally{
      setRepostingId(null)
    }
  }

  /* ================= EXPIRY DATE ================= */

  function getExpiryDate(ad, days = 15){
    const base = ad.repost_date 
      ? new Date(ad.repost_date) 
      : new Date(ad.created_at)

    base.setDate(base.getDate() + days)

    return base.toLocaleDateString()
  }

  /* ================= FILTER ================= */

  const filteredAds = ads.filter(ad=>{
    if(activeTab === "all") return true
    if(activeTab === "promoted") return ad.is_promoted == "1"
    if(activeTab === "expired") return ad.is_approved == "0"
    return true
  })

  /* ================= COUNTS ================= */

  const promotedCount = ads.filter(a=>a.is_promoted=="1").length
  const expiredCount = ads.filter(a=>a.is_approved=="0").length
  const activeCount  = ads.filter(a=>a.is_approved=="1").length

  return(
    <div className="bg-(--website-background) min-h-screen px-4 sm:px-10 py-10 ">

      <div className="mb-8">
        <h1 className="text-3xl text-(--second-color) sm:text-4xl font-bold mb-2">
          My Ads Dashboard
        </h1>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<FaRocket/>} title="Total Ads" value={ads.length}/>
        <StatCard icon={<FaCrown/>} title="Promoted" value={promotedCount}/>
        <StatCard icon={<FaClock/>} title="Expired" value={expiredCount}/>
        <StatCard icon={<FaRocket/>} title="Active" value={activeCount}/>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-800 mb-10">
        <TabBtn label={`All Ads (${ads.length})`} active={activeTab==="all"} onClick={()=>setActiveTab("all")} />
        <TabBtn label={`Promoted (${promotedCount})`} active={activeTab==="promoted"} onClick={()=>setActiveTab("promoted")} />
        <TabBtn label={`Expired (${expiredCount})`} active={activeTab==="expired"} onClick={()=>setActiveTab("expired")} />
      </div>

      {loading && <div className="text-gray-400">Loading ads...</div>}

      <div className="grid grid-cols-1 gap-8">

        {filteredAds.map(ad=>{

          const isExpired = ad.is_approved == "0"
          const img = ad.images?.length ? ad.images[0] : "/noimage.jpg"

          return(
            <div key={ad.id}
              className={`bg-(--website-background) border border-(--primary-color) rounded-2xl overflow-hidden 
              ${isExpired ? "opacity-70" : "hover:shadow-xl transition"}`}>

              {/* TOP BAR */}
              <div className="flex justify-between items-center bg-gray-800 px-6 py-3 border-b border-gray-700">

                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">Expires:</span>
                  <span className={`${isExpired ? "text-red-500" : "text-green-400"} font-semibold`}>
                    {getExpiryDate(ad)}
                  </span>
                  {isExpired && (
                    <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold ml-3">
                      EXPIRED
                    </span>
                  )}
                </div>

                {ad.is_promoted=="1" && (
                  <span className="flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                    <FaCrown size={12}/> Promoted
                  </span>
                )}
              </div>

              {/* CARD */}
              <div className="p-5">
                <EscortCard
                  images={ad.images}
                  title={ad.title}
                  desc={ad.description}
                  age={ad.age}
                  country={ad.nationality}
                  location={`${ad.city_name || ""} ${ad.state_name || ""}`}
                  telegram={ad.telegram_id}
                  image={img}
                  is_superTop={ad.super_top=="1"}
                  is_new={ad.new=="1"}
                  highlight={ad.hight_light=="1"}
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between items-center px-6 py-4 border-t border-gray-800">

                <div className="flex gap-3">
                  <Link href={`/dashboard/ads/edit/${ad.slug}`}>
                    <ActionBtn icon={<FaEdit/>} label="Edit"/>
                  </Link>

                  <Button 

                    onClick={()=>deleteMyList(ad.id)} 
                    className="px-4 py-2 bg-red-600 rounded-lg">
                    Delete
                  </Button>
                </div>

                <div>
                  {isExpired && (
                    <button
                      onClick={() => openRepostModal(ad)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-black text-white hover:bg-gray-800"
                    >
                      <FaRedo/> Repost
                    </button>
                  )}

                  {!isExpired && ad.is_promoted!="1" && (
                    <Link href={`/dashboard/ads/promote/${ad.id}`}>
                      <ActionBtn icon={<FaRocket/>} label="Promote" primary/>
                    </Link>
                  )}
                </div>

              </div>

            </div>
          )
        })}
      </div>

      {/* ================= MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700 w-[400px]">

            <h2 className="text-xl font-bold mb-4">
              Confirm Repost
            </h2>

            <p className="text-gray-400 mb-6">
              Are you sure you want to repost this ad?
              <br/>
              <span className="text-red-500 font-semibold">
                This will cost 1 Coin.
              </span>
            </p>

            <div className="flex justify-end gap-4">

              <button
                onClick={()=>setShowModal(false)}
                className="px-4 py-2 border border-gray-600 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmRepost}
                disabled={repostingId}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
              >
                {repostingId ? "Processing..." : "Repost (1 Coin)"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

/* COMPONENTS */

function TabBtn({label,active,onClick}){
  return(
    <button
      onClick={onClick}
      className={`pb-3 px-2 font-semibold border-b-2 transition
      ${active ? "border-(--primary-color) text-(--primary-color)" : "border-transparent "}`}
    >
      {label}
    </button>
  )
}

function StatCard({icon,title,value}){
  return(
    <div className="bg-(--website-background)/40 p-6 rounded-xl border border-(--icons-color) flex items-center gap-4">
      <div className="text-(--icons-color) text-2xl">{icon}</div>
      <div>
        <p className="text-(--second-color) text-sm">{title}</p>
        <h2 className="text-2xl font-bold ">{value}</h2>
      </div>
    </div>
  )
}

function ActionBtn({icon,label,primary}){
  let cls="bg-(--website-background)/20  "
  if(primary) cls="bg-red-600 hover:bg-red-700 text-white"

  return(
    <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${cls}`}>
      {icon} {label}
    </button>
  )
}