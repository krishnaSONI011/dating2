'use client'
import { useContext, useEffect, useState } from "react"
import { FaPhone, FaWhatsapp, FaTelegram, FaShieldAlt, FaMapMarkerAlt } from "react-icons/fa"
import api from "@/lib/api"
import { useParams } from "next/navigation"
import Breadcrumb from "@/components/ui/Breadcurm"
import Button from "@/components/ui/Button"
import ReusableModal from "@/components/ui/Model"
import { AuthContext } from "@/context/AuthContext"
import { toast } from "react-toastify"

export default function SingleAdPage() {

  const [data, setData] = useState(null)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [description, setDescription] = useState('')
  const [report , setReport] = useState('Fake Profile / Not Matching')

  const params = useParams()
  const slug = params?.singleSlug ?? ""

  const { user } = useContext(AuthContext)

  useEffect(() => {
    if(slug){
      getAd()
    }
  }, [slug])

  async function getAd() {
    try {
      const formData = new FormData()
      formData.append("ads_slug", slug)
      const res = await api.post(`/Wb/ads_edit`, formData)

      if (res.data.status == 0) {
        setData(res.data.data)
      }
    } catch (e) {
      console.log(e)
      toast.error("Failed to load ad")
    } finally {
      setLoading(false)
    }
  }

  async function handelReport(){
    
    if(!description.trim()){
      return toast.error("Please write description")
    }

    try{
      const formData = new FormData()
      formData.append('user_id' ,user?.id )
      formData.append('ads_id' ,data.ads.id )
      formData.append('category' ,report)
      formData.append('description' ,description)

      const res = await api.post(`/Wb/add_report` , formData)

      if(res.data.status == 0){
        toast.success(res.data.message)
        setOpen(false)
        setDescription('')
      }else{
        toast.error(res.data.message)
      }
    }catch(e){
      console.log(e)
      toast.error("Something went wrong")
    }
  }

  if (loading) return <div className="p-20 text-center">Loading...</div>
  if (!data) return <div className="p-20 text-center">Ad not found</div>

  const ad = data.ads
  const images = data.images || []
  const services = data.services || []
  const time = data.time?.[0]

  return (
    <div className=" min-h-screen py-10">
      <Breadcrumb />

      <div className="mt-5 max-w-7xl mx-auto grid grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="col-span-2 space-y-6">

          {/* IMAGE CARD */}
          <div className=" rounded-3xl border border-slate-600 shadow-sm p-5">

            <div className="relative">
            <img
  src={images[active]?.img || "/no-image.png"}
  className="w-full h-[500px] object-contain bg-black rounded-2xl"
/>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActive((active - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full"
                  >‹</button>

                  <button
                    onClick={() => setActive((active + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full"
                  >›</button>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-4 overflow-x-auto">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img.img}
                  onClick={() => setActive(i)}
                  className={`w-24 h-20 object-cover rounded-xl cursor-pointer border-2
                  ${active === i ? "border-red-500" : "border-gray-200"}`}
                />
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="text-white rounded-3xl border border-slate-700 shadow-sm p-7">

            <div className="flex gap-2 mb-3">
              {ad.super_top == "1" && (
                <span className="bg-yellow-500  text-xs px-3 py-1 rounded-full font-semibold">
                  ⭐ Super Top
                </span>
              )}

              {ad.new == "1" && (
                <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  NEW
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-orange-300 mb-2">
              {ad.title}
            </h1>

            <p className=" flex items-center gap-2 mb-6">
              <FaMapMarkerAlt className="text-orange-500" />
              {ad.local_area} , {ad.city_name}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-7">
              <Info label="Age" value={ad.age} />
              <Info label="Ethnicity" value={ad.ethnicity} />
              <Info label="Body" value={ad.body_type} />
              <Info label="Hair" value={ad.hair} />
              <Info label="Nationality" value={ad.nationality} />
              <Info label="Available" value={`${time?.from_time || "-"} - ${time?.to_time || "-"}`} />
            </div>

            <div className="border-t pt-5">
              <h3 className="font-semibold text-lg mb-2">About</h3>
              <p className="text-justify leading-7 text-[15px]">
                {ad.description}
              </p>
            </div>

            {services.length > 0 && (
              <div className="border-t mt-6 pt-5">
                <h3 className="font-semibold text-lg mb-3">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {services.map(s => (
                    <span key={s.id}
                      className="bg-blue-950 border border-orange-400 px-3 py-1 rounded-full text-sm">
                      {s.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CONTACT */}
        <div className="sticky top-24 h-fit">
          <div className=" rounded-3xl border border-slate-700 shadow-lg p-6">

            <h3 className="text-xl font-bold mb-6 text-white">
              Contact Information
            </h3>

            <a href={`tel:${ad.mobile}`}>
              <button className="w-full bg-green-600 text-white py-3 rounded-xl mb-3">
                <FaPhone className="inline mr-2"/> Call Now
              </button>
            </a>

            <a href={`https://wa.me/${ad.mobile}`} target="_blank">
              <button className="w-full bg-[#25D366] text-white py-3 rounded-xl mb-3">
                <FaWhatsapp className="inline mr-2"/> WhatsApp Chat
              </button>
            </a>

            {ad.telegram && (
              <a href={`https://t.me/${ad.telegram}`} target="_blank">
                <button className="w-full bg-blue-500 text-white py-3 rounded-xl mb-4">
                  <FaTelegram className="inline mr-2"/> Telegram
                </button>
              </a>
            )}

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
              <div className="flex gap-3">
                <FaShieldAlt className="text-red-600 mt-1" />
                <div className="text-sm text-red-700">
                  <b>Safety Tips</b>
                  <p className="mt-1">
                    Never pay advance. Always meet safely.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <ReusableModal open={open}>
                <h1 className="text-2xl font-bold">Report This Ad</h1>

                <select 
                  onChange={(e)=> setReport(e.target.value)}  
                  className="w-full border border-slate-500 p-2 rounded mt-5"
                  value={report}
                >
                  <option>Fake Profile / Not Matching</option>
                  <option>Asking Advance Payments</option>
                  <option>Wrong Category / Spam</option>
                </select>

                <textarea 
                  onChange={(e)=> setDescription(e.target.value)} 
                  className="mt-5  w-full border-slate-500 border rounded h-[150px] p-2"
                  placeholder="Write details"
                  value={description}
                />

                <div className="flex gap-2 mt-5">
                  <Button onClick={handelReport}>Submit</Button>
                  <Button onClick={() => setOpen(false)} className="bg-red-500">Cancel</Button>
                </div>
              </ReusableModal>

              <Button onClick={() => setOpen(true)} className="bg-red-500 w-full mt-3">
                Report This Ad
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="bg-blue-950 p-3 rounded-lg">
      <p className="text-orange-300 text-xs">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  )
}