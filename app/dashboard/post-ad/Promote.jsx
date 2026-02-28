'use client'
import { useState, useEffect, useContext } from "react"
import Button from "@/components/ui/Button"
import EscortCard from "@/components/ui/AdsCard"
import { WalletContext } from "@/context/WalletContext"
import { toast } from "react-toastify"
import api from "@/lib/api"
import { AuthContext } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function Promote({ prevStep ,form , images }) {

  const [timeSlot, setTimeSlot] = useState("")
  const [fromTime , setFromtime] = useState("")
  const [toTime  , setToTime ] = useState("")
  const [days, setDays] = useState(1)
  const [boost, setBoost] = useState(3)
  const { balance } = useContext(WalletContext)
  const [superTop, setSuperTop] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const [tagNew, setTagNew] = useState(false)
  const [allInOne, setAllInOne] = useState(false)
  const { user } = useContext(AuthContext)
  const router = useRouter()
  //  pricing
  const slotPrice = 2
  const boostPrice = 1

  let total = 0

  if (timeSlot) {
    total = (slotPrice * days) + (boostPrice * boost)
  }

  //  price logic
  if (allInOne) {
    total += 9
  } else {
    if (superTop) total += 5
    if (highlight) total += 2
    if (tagNew) total += 2
  }

  //  ALL IN ONE CLICK
  const handleAllInOne = () => {
    const newVal = !allInOne
    setAllInOne(newVal)

    if (newVal) {
      setSuperTop(true)
      setHighlight(true)
      setTagNew(true)
    } else {
      setSuperTop(false)
      setHighlight(false)
      setTagNew(false)
    }
  }
  async function postWithout(){
    if(balance < 1){
        return toast.error("Insufficient balance")
      }
      try{
        const formData = new FormData()
    
        formData.append("cat_id", form.cat_id)
        formData.append("name", form.name)
        formData.append("nick_name", form.nick_name)
        formData.append("age", form.age)
        formData.append("ethnicity", form.ethnicity)
        formData.append("nationality", form.nationality)
        formData.append("breast", form.breast)
        formData.append("hair", form.hair)
        formData.append("is_telegram", form.is_telegram)
        formData.append("is_whatsapp", form.is_whatsapp)
        formData.append("hair", form.hair)
        formData.append("body_type", form.body_type)
        formData.append("email", user?.email)
        formData.append("gender", form.gender)
        formData.append("mobile", form.phone)
        formData.append("state", form.state)
        formData.append("city", form.city)
        formData.append("local_area", form.local_area)
        formData.append("postal_code", form.postal_code)
        formData.append("address", form.address)
        formData.append("title", form.title)
        formData.append("description", form.description)
        formData.append("total", 1)
    
        // services
        form.services?.forEach((s)=>{
          formData.append("service[]", s)
        })
    
        // images if exist
        images?.forEach((img)=>{
          formData.append("img[]", img.file)
        })
        
    
        const res = await api.post('/Wb/ads', formData)
    
        if(res.data.status == 0){
    
          toast.success(res.data.message)
          router.push('/dashboard/')
    
        }else{
          toast.error(res.data.message)
        }
    
      }catch(e){
        console.log(e)
        toast.error("Something went wrong")
      }

  }
  async function publishWithMoney(){

    if(balance < total){
      return toast.error("Insufficient balance")
    }
  
    try{
      const formData = new FormData()
  
      formData.append("cat_id", form.cat_id)
      formData.append("name", form.name)
      formData.append("nick_name", form.nick_name)
      formData.append("age", form.age)
      formData.append("ethnicity", form.ethnicity)
      formData.append("nationality", form.nationality)
      formData.append("breast", form.breast)
      formData.append("hair", form.hair)
      formData.append("is_telegram", form.is_telegram)
        formData.append("is_whatsapp", form.is_whatsapp)
      formData.append("body_type", form.body_type)
      formData.append("email", user?.email)
      formData.append("gender", form.gender)
      formData.append("mobile", form.mobile)
      formData.append("state", form.state)
      formData.append("city", form.city)
      formData.append("local_area", form.local_area)
      formData.append("postal_code", form.postal_code)
      formData.append("address", form.address)
      formData.append("title", form.title)
      formData.append("description", form.description)
      formData.append("total", total)
  
      // services
      form.services?.forEach((s)=>{
        formData.append("service[]", s)
      })
  
      // images if exist
      images?.forEach((img)=>{
        formData.append("img[]", img.file)
      })
      
  
      const res = await api.post('/Wb/ads', formData)
  
      if(res.data.status == 0){
        const sup = superTop ? "1" : "0"
        const high = highlight ? "1" : "0"
        const n = tagNew ? "1" : "0"
        const boostData = new FormData()
        boostData.append("ads_id", res.data.data.ads.id)
        boostData.append("from_time", fromTime)
        boostData.append("to_time", toTime)
        boostData.append("super_top", sup  )
        boostData.append("hight_light", high )
        boostData.append("new", n )
        boostData.append("all_upgrade", allInOne )
        boostData.append("days", days)
        boostData.append("boost_times", boost)
        boostData.append("total", total)
  
        const boostRes = await api.post(`/Wb/bost_plan`, boostData)
  
        if(boostRes.data.status == 0){
          toast.success("Ad Published & Boosted ")
          router.push('/dashboard/')
        }else{
          toast.error(boostRes.data.message)
        }
       
  
      }else{
        toast.error(res.data.message)
      }
  
    }catch(e){
      console.log(e)
      toast.error("Something went wrong")
    }
  }

  //  if user manually change
  useEffect(() => {
    if (superTop && highlight && tagNew) {
      setAllInOne(true)
    } else {
      setAllInOne(false)
    }
  }, [superTop, highlight, tagNew])

  return (
    <div className="max-w-7xl mx-auto mt-10 grid grid-cols-3 gap-8">

      {/* ================= LEFT ================= */}
      <div className="col-span-2 bg-(--website-background) p-8 rounded-2xl border shadow-sm border-(--content-border-color)">

        <h2 className="text-3xl font-bold mb-6">Promote Your Ad</h2>

        {/* PREVIEW */}
        {/* <div className="mb-10">
          <h3 className="font-semibold mb-3">Ad Preview</h3>
          <EscortCard
            age={form.age}
            title={form.title}
            image={images?.[0]?.preview}
            desc={form.description}
            is_superTop={superTop}
            is_new={tagNew}
            highlight={highlight}
            location={form.local_area + ','+ form.city}
          />
        </div> */}

        {/* TIME SLOT */}
        <h3 className="text-xl font-semibold mb-4">Choose promotion time</h3>

        <div className="grid grid-cols-2 gap-4 mb-10">
  {[
    { id: "morning", label: "Morning", from: "06:00", to: "12:00" },
    { id: "afternoon", label: "Afternoon", from: "12:00", to: "18:00" },
    { id: "evening", label: "Evening", from: "18:00", to: "00:00" },
    { id: "night", label: "Night", from: "00:00", to: "06:00" },
  ].map(slot => (
    <button
      key={slot.id}
      onClick={() => {
        setTimeSlot(slot.id)
        setFromtime(slot.from)
        setToTime(slot.to)
      }}
      className={`border rounded-xl p-5 text-left transition font-semibold
      ${timeSlot === slot.id
        ? "border-red-500 bg-red-50 text-red-600"
        : "border-gray-300 hover:border-gray-400"}`}
    >
      <div>{slot.label}</div>
      <div className="text-sm text-gray-500">
        {slot.from} - {slot.to}
      </div>
    </button>
  ))}
</div>

        {/* AFTER SLOT */}
        {timeSlot && (
          <>
            {/* DAYS */}
            <h3 className="text-xl font-semibold mb-4">Select days</h3>

            <div className="flex gap-4 mb-8">
              {[1, 3, 7].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-6 py-3 rounded-xl border font-semibold
                  ${days === d
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-300"}`}
                >
                  {d} Day{d > 1 && "s"}
                </button>
              ))}
            </div>

            {/* BOOST */}
            <h3 className="text-xl font-semibold mb-4">
              Contribution increase
            </h3>

            <div className="flex gap-4 mb-10">
              {[3, 6].map(b => (
                <button
                  key={b}
                  onClick={() => setBoost(b)}
                  className={`px-6 py-3 rounded-xl border font-semibold
                  ${boost === b
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-300"}`}
                >
                  {b} Boosts
                </button>
              ))}
            </div>

            {/* STAND OUT */}
            <h2 className="text-2xl font-bold mb-6 text-(--second-color)">
              Make your ad stand out
            </h2>

            <StandCard
              title="Super Top"
              desc="Get more visibility with top placement."
              price="+ Rs 200 (5 Coins)"
              active={superTop}
              setActive={setSuperTop}
            />

            <StandCard
              title="Highlight"
              desc="Colored background for your ad."
              price="+ Rs 80 (2 Coins)"
              active={highlight}
              setActive={setHighlight}
            />

            <StandCard
              title="Tag New"
              desc="Add NEW label to listing."
              price="+ Rs 80 (2 Coins)"
              active={tagNew}
              setActive={setTagNew}
            />

            <StandCard
              title=" All in One"
              desc="Super Top + Highlight + New tag"
              price="+ Rs 360 (9 Coins)"
              active={allInOne}
              setActive={handleAllInOne}
              highlightAll
            />
          </>
        )}

        <div className="mt-10">
          <Button onClick={prevStep}>← Back</Button>
        </div>

      </div>

      {/* ================= RIGHT SUMMARY ================= */}
      <div className="sticky top-24 h-fit">

        <div className="bg-(--website-background) border border-gray-200 rounded-2xl p-7 shadow-xl">

          <h3 className="text-xl font-bold mb-6">Promotions Summary</h3>

          {!timeSlot && (
            <p className="">Select time slot first</p>
          )}

          {timeSlot && (
            <>
              <div className="space-y-3 ">
                <div className="flex justify-between">
                  <span>Time Slot</span>
                  <b className="capitalize">{timeSlot}</b>
                </div>

                <div className="flex justify-between">
                  <span>Days</span>
                  <b>{days}</b>
                </div>

                <div className="flex justify-between">
                  <span>Boost</span>
                  <b>{boost}</b>
                </div>
              </div>

              <div className="h-px bg-(--website-background) my-5" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Total Coin</span>
                <span className="text-3xl font-bold text-red-600">
                   {total}
                </span>
              </div>

              <Button onClick={publishWithMoney} className="w-full bg-red-600 hover:bg-red-700 text-lg py-3 mb-3">
                Buy & Publish
              </Button>

             
            </>
          )}
           {/* WITHOUT PROMOTION */}
           <div className="bg-salte-900 border border-(--content-border-color)rounded-xl p-4 text-center mt-4">
                <p className="text-sm text-(--second-color) mb-2">
                  Don’t want promotion?
                </p>

                <p className="font-semibold mb-3">
                  Publish normally for{" "}
                  <span className="text-red-600">1 Coin</span>
                </p>

                <Button onClick={postWithout} className="w-full bg-black hover:bg-gray-900 text-white">
                  Publish Without Promotion
                </Button>
              </div>
        </div>
      </div>
    </div>
  )
}

function StandCard({ title, desc, price, active, setActive, highlightAll=false }) {
  return (
    <div className="border border-(--content-border-color) rounded-2xl p-6 mb-6 flex justify-between items-center">

      <div className="max-w-[70%]">
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-(--webiste-text) text-sm mb-2">{desc}</p>

        {highlightAll && (
          <div className="flex gap-2 mb-2">
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Super</span>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Highlight</span>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">New</span>
          </div>
        )}

        <p className="font-semibold text-(--second-color)">{price}</p>
      </div>

      {/* toggle */}
      <div
        onClick={() => setActive(!active)}
        className={`w-20 h-10 flex items-center rounded-full px-1 cursor-pointer
        ${active ? "bg-red-600" : "bg-gray-300"}`}
      >
        <div
          className={`bg-white w-8 h-8 rounded-full shadow-md transform transition flex items-center justify-center text-xs font-bold
          ${active ? "translate-x-10 text-red-600" : "text-gray-500"}`}
        >
          {active ? "YES" : "NO"}
        </div>
      </div>
    </div>
  )
}