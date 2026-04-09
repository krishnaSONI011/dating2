'use client'
import { useState, useEffect, useContext } from "react"
import Button from "@/components/ui/Button"
import EscortCard from "@/components/ui/AdsCard"
import { WalletContext } from "@/context/WalletContext"
import { toast } from "react-toastify"
import api from "@/lib/api"
import { AuthContext } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function Promote({ prevStep, form, images }) {

  const [timeSlot, setTimeSlot] = useState("")
  const [fromTime, setFromtime] = useState("")
  const [toTime, setToTime] = useState("")
  const [buyLoading, setBuyLoading] = useState(false)
  const [days, setDays] = useState(null)
  const [boost, setBoost] = useState(null)
  const { balance } = useContext(WalletContext)
  const [superTop, setSuperTop] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const [tagNew, setTagNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [allInOne, setAllInOne] = useState(false)
  const { user } = useContext(AuthContext)
  const [previewImages, setPreviewImages] = useState([])
  const [contact, setContact] = useState(null)
  const [rechargeCoins, setRechargeCoins] = useState(0)
  const [freeLoading, setFreeLoading] = useState(false)

  const [pricing, setPricing] = useState({
    superTop: 0,
    tagNew: 0,
    highlight: 0,
    slot1: 0,
    slot2: 0,
    slot3: 0,
    slot4: 0,
    day1: 0,
    day3: 0,
    day7: 0,
    boost3: 0,
    boost6: 0,
    pricePerCoin: 49,
  })

  const rechargeTotal = rechargeCoins * pricing.pricePerCoin
  const router = useRouter()

  const slotPriceMap = {
    night:     pricing.slot1,
    morning:   pricing.slot2,
    afternoon: pricing.slot3,
    evening:   pricing.slot4,
  }

  const dayPriceMap = {
    1: pricing.day1,
    3: pricing.day3,
    7: pricing.day7,
  }

  const boostPriceMap = {
    3: pricing.boost3,
    6: pricing.boost6,
  }

  // ✅ Check if user selected any promotion option
  const hasSlotSelection = timeSlot && days 
  const hasStandoutSelection = superTop || highlight || tagNew || allInOne

  // ✅ total: slot section only counts if all 3 selected
  let total = 0
  if (hasSlotSelection) {
    total = (slotPriceMap[timeSlot] || 0) + (dayPriceMap[days] || 0) + (boostPriceMap[boost] || 0)
  }
  if (allInOne) {
    total += pricing.superTop + pricing.tagNew + pricing.highlight
  } else {
    if (superTop) total += pricing.superTop
    if (highlight) total += pricing.highlight
    if (tagNew) total += pricing.tagNew
  }

  //  Can publish if either slot OR standout is selected
  const canPublish = hasSlotSelection || hasStandoutSelection

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

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await api.post("/Wb/get_pricing")
        if (res.data.status == 0) {
          const data = res.data.data ?? []
          const find = (title) =>
            Number(data.find((p) => p.title.trim().toLowerCase() === title.toLowerCase())?.coins ?? 0)

          setPricing({
            superTop:     find("Super Top"),
            tagNew:       find("New"),
            highlight:    find("High Light"),
            slot1:        find("First Time Slot"),
            slot2:        find("Second Time Slot"),
            slot3:        find("Third Time Slot"),
            slot4:        find("Fourth Time Slot"),
            day1:         find("1 Day"),
            day3:         find("3 Days"),
            day7:         find("7 Days"),
            boost3:       find("3 Time Boost"),
            boost6:       find("6 Time Boost"),
            pricePerCoin: find("Price per coin") || 49,
          })
        }
      } catch (e) {
        console.log("Pricing fetch error:", e)
      }
    }
    loadPricing()
  }, [])

  useEffect(() => {
    async function loadContact() {
      try {
        const fd = new FormData()
        fd.append("contect_id", 1)
        const res = await api.post("/Wb/contect_detail", fd)
        if (res.data.status === 0) setContact(res.data.data)
      } catch (e) {
        console.log(e)
      }
    }
    loadContact()
  }, [])

  const buildRechargeMessage = () => {
    return `Hi 
  
User ID: ${user?.id}
Email: ${user?.email}
Mobile: ${form.country_code}${form.phone}

Current Wallet Balance: ${balance} Coins
Coins Want To Buy: ${rechargeCoins}
Total Amount: ₹${rechargeTotal}

Please share payment details.`
  }

  const handleRechargeWhatsApp = () => {
    if (!rechargeCoins || rechargeCoins <= 0) return toast.error("Enter coins amount")
    if (!contact?.whatsapp) return toast.error("WhatsApp not available")
    const message = encodeURIComponent(buildRechargeMessage())
    window.open(`https://wa.me/${contact.whatsapp}?text=${message}`, "_blank")
  }

  async function postWithout() {
    if (balance < 1) return toast.error("Insufficient balance")
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("cat_id", form.cat_id)
      formData.append("name", form.name)
      formData.append("nick_name", form.nick_name)
      formData.append("age", form.age)
      formData.append("ethnicity", form.ethnicity)
      formData.append("nationality", form.nationality)
      formData.append("breast", form.breast)
      formData.append("hair", form.hair)
      formData.append("is_telegram", form.is_telegram ? "1" : "0")
      formData.append("is_whatsapp", form.is_whatsapp ? "1" : "0")
      formData.append("telegram_id", form.teleragm_id ?? "")
      formData.append("body_type", form.body_type)
      formData.append("email", user?.email)
      formData.append("gender", form.gender)
      formData.append("mobile", form.country_code + form.phone)
      formData.append("state", form.state)
      formData.append("city", form.city)
      formData.append("local_area", form.local_area)
      formData.append("postal_code", form.postal_code)
      formData.append("address", form.address)
      formData.append("title", form.title)
      formData.append("description", form.description)
      formData.append("total", 1)
      form.services?.forEach((s) => formData.append("service[]", s))
      images?.forEach((img) => formData.append("img[]", img.file))

      const res = await api.post('/Wb/ads', formData)
      if (res.data.status == 0) {
        toast.success(res.data.message)
        router.replace('/dashboard')
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      console.log(e)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function publishWithMoney() {
    const noBoost =
  timeSlot &&
  days &&
  !boost &&
  !superTop &&
  !highlight &&
  !tagNew &&
  !allInOne
    ? "1"
    : "0"
    //  Fixed: only require slot+days+boost if user chose a slot
    if (timeSlot && (!days )) {
      return toast.error("Please select days and boost count for the time slot")
    }
    if (!canPublish) return toast.error("Please select at least one promotion option")
    if (balance < total) return toast.error("Insufficient balance")

    try {
      setBuyLoading(true)
      const formData = new FormData()
      formData.append("cat_id", form.cat_id)
      formData.append("name", form.name)
      formData.append("nick_name", form.nick_name)
      formData.append("age", form.age)
      formData.append("ethnicity", form.ethnicity)
      formData.append("nationality", form.nationality)
      formData.append("breast", form.breast)
      formData.append("hair", form.hair)
      formData.append("body_type", form.body_type)
      formData.append("email", user?.email)
      formData.append("gender", form.gender)
      formData.append("telegram_id", form.teleragm_id ?? "")
      formData.append("is_telegram", form.is_telegram ? "1" : "0")
      formData.append("is_whatsapp", form.is_whatsapp ? "1" : "0")
      formData.append("mobile", form.country_code + form.phone)
      formData.append("state", form.state)
      formData.append("city", form.city)
      formData.append("local_area", form.local_area)
      formData.append("postal_code", form.postal_code)
      formData.append("address", form.address)
      formData.append("title", form.title)
      formData.append("description", form.description)
      formData.append("total", total)
      form.services?.forEach((s) => formData.append("service[]", s))
      images?.forEach((img) => formData.append("img[]", img.file))

      const res = await api.post('/Wb/ads', formData)

      if (res.data.status == 0) {
        const boostData = new FormData()
        boostData.append("ads_id", res.data.data.ads.id)
        boostData.append("from_time", fromTime)
        boostData.append("to_time", toTime)
        boostData.append("super_top", superTop ? "1" : "0")
        boostData.append("hight_light", highlight ? "1" : "0")
        boostData.append("new", tagNew ? "1" : "0")
        boostData.append("noboost", noBoost)
        boostData.append("all_upgrade", allInOne ? "1" : "0")
        boostData.append("days", days ?? "0")
        boostData.append("boost_times", boost ?? "0")
        boostData.append("total", total)

        const boostRes = await api.post('/Wb/bost_plan', boostData)

        if (boostRes.data.status == 0) {
          toast.success("Ad Published & Boosted!")
          router.replace('/dashboard')
        } else {
          toast.error(boostRes.data.message)
        }
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      console.log(e)
      toast.error("Something went wrong")
    } finally {
      setBuyLoading(false)
    }
  }

  useEffect(() => {
    if (superTop && highlight && tagNew) setAllInOne(true)
    else setAllInOne(false)
  }, [superTop, highlight, tagNew])

  useEffect(() => {
    if (!images || images.length === 0) { setPreviewImages([]); return }
    const urls = images.map((img) => {
      if (typeof img === "string") return img
      if (img.file) return URL.createObjectURL(img.file)
      return ""
    })
    setPreviewImages(urls)
  }, [images])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6 md:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

      {/* ================= LEFT ================= */}
      <div className="lg:col-span-2 bg-(--website-background) p-4 md:p-6 lg:p-8 rounded-2xl border shadow-sm border-(--primary-color)">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">Promote Your Ad</h2>

        {/* PREVIEW */}
        <div className="mb-10">
          <h3 className="font-semibold mb-3">Ad Preview</h3>
          <EscortCard
            age={form.age}
            title={form.title}
            images={previewImages}
            desc={form.description}
            telegram={form.telegram_id}
            is_superTop={superTop}
            is_new={tagNew}
            country={form.nationality}
            highlight={highlight}
            location={form.local_area + "," + form.city}
          />
        </div>

        {/* TIME SLOT */}
        <h3 className="text-lg md:text-xl font-semibold mb-2">Choose promotion time</h3>
        {/* Optional label */}
        <p className="text-sm text-gray-400 mb-4">Optional — skip if you only want Super Top / Highlight / New</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
           
            { id: "morning",   label: "Morning",   from: "06:00:01", to: "12:00:00", display: "06:00 - 12:00", priceKey: "slot2" },
            
            { id: "afternoon", label: "Afternoon", from: "12:00:01", to: "18:00:00", display: "12:00 - 18:00", priceKey: "slot3" },
            { id: "evening",   label: "Evening",   from: "18:00:01", to: "23:59:58", display: "18:00 - 23:59", priceKey: "slot4" },
            { id: "night",     label: "Night",     from: "23:59:59", to: "06:00:00", display: "23:59 - 06:00", priceKey: "slot1" },
          ].map(slot => (
            <button
              key={slot.id}
              onClick={() => {
                if (timeSlot === slot.id) {
                  setTimeSlot(""); setFromtime(""); setToTime("")
                  setDays(null); setBoost(null)
                } else {
                  setTimeSlot(slot.id); setFromtime(slot.from); setToTime(slot.to)
                }
              }}
              className={`border rounded-xl p-4 md:p-5 text-left transition font-semibold
              ${timeSlot === slot.id ? "border-red-500 bg-red-50 text-red-600" : "border-gray-300 hover:border-gray-400"}`}
            >
              <div>{slot.label}</div>
              <div className="text-sm text-gray-500">{slot.display}</div>
              <div className="text-xs mt-1 font-semibold text-(--second-color)">{pricing[slot.priceKey]} Coins</div>
            </button>
          ))}
        </div>

        {/* DAYS + BOOST — only show if slot selected */}
        {timeSlot && (
          <>
            <h3 className="text-lg md:text-xl font-semibold mb-4">Select days</h3>
            <div className="flex flex-wrap gap-3 md:gap-4 mb-8">
              {[
                { d: 1, priceKey: "day1" },
                { d: 3, priceKey: "day3" },
                { d: 7, priceKey: "day7" },
              ].map(({ d, priceKey }) => (
                <button
                  key={d}
                  onClick={() => setDays(days === d ? null : d)}
                  className={`px-5 py-2 md:px-6 md:py-3 rounded-xl border font-semibold transition
                  ${days === d ? "border-red-500 bg-red-50 text-red-600" : "border-gray-300 hover:border-gray-400"}`}
                >
                  <div>{d} Day{d > 1 && "s"}</div>
                  <div className="text-xs font-semibold text-(--second-color)">{pricing[priceKey]} Coins</div>
                </button>
              ))}
            </div>

            <h3 className="text-lg md:text-xl font-semibold mb-4">Contribution increase</h3>
<div className="flex flex-wrap gap-3 md:gap-4 mb-10">
  {[
    { b: 3, priceKey: "boost3" },
    { b: 6, priceKey: "boost6" },
  ].map(({ b, priceKey }) => (
    <button
      key={b}
      onClick={() => {
        if (boost === b) {
          // ✅ deselect → reset superTop too
          setBoost(null)
          setSuperTop(false)
        } else {
          // ✅ select → auto enable superTop
          setBoost(b)
          setSuperTop(true)
        }
      }}
      className={`px-5 py-2 md:px-6 md:py-3 rounded-xl border font-semibold transition
      ${boost === b ? "border-red-500 bg-red-50 text-red-600" : "border-gray-300 hover:border-gray-400"}`}
    >
      <div>{b} Boosts</div>
      <div className="text-xs font-semibold text-(--second-color)">{pricing[priceKey]} Coins</div>
    </button>
  ))}
</div>
          </>
        )}

        {/* ================= STAND OUT — always visible ================= */}
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-(--second-color)">
          Make your ad stand out
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          {timeSlot
            ? "These are locked to ON when boost is selected"
            : "Select any option to promote without a time slot"}
        </p>

        <StandCard
  title="Super Top"
  desc="Get more visibility with top placement."
  price={`${pricing.superTop} Coins`}
  active={superTop}
  locked={false}
  setActive={(val) => {
    setSuperTop(val)

    if (val) {
      // ✅ Super Top ON hua to auto 3 Boost select
      setBoost(3)

      // agar days select nahi hai to default 1 day kar do
      if (!days) setDays(1)

      // agar time slot select nahi hai to default morning kar do
      if (!timeSlot) {
        setTimeSlot("morning")
        setFromtime("06:00:01")
        setToTime("12:00:00")
      }
    } else {
      // ❌ Super Top OFF hua to boost bhi hata do
      setBoost(null)
    }
  }}
/>
<StandCard
  title="Highlight"
  desc="Colored background for your ad."
  price={`${pricing.highlight} Coins`}
  active={highlight}
  setActive={(val) => setHighlight(val)}  // ✅ free to toggle
/>
<StandCard
  title="Tag New"
  desc="Add NEW label to listing."
  price={`${pricing.tagNew} Coins`}
  active={tagNew}
  setActive={(val) => setTagNew(val)}  // ✅ free to toggle
/>
<StandCard
  title="All in One"
  desc="Super Top + Highlight + New tag"
  price={`${pricing.superTop + pricing.tagNew + pricing.highlight} Coins`}
  active={allInOne}
  setActive={(val) => handleAllInOne()}  // ✅ free to toggle
  highlightAll
/>

        <div className="mt-10">
          <Button className="bg-(--button-color) hover:bg-(--button-hover-color) text-(--button-text) hover:text-(--button-hover-text)" onClick={prevStep}>← Back</Button>
        </div>

      </div>

      {/* ================= RIGHT SUMMARY ================= */}
      <div className="lg:sticky lg:top-24 h-fit">
        <div className="bg-(--website-background) border border-gray-200 rounded-2xl p-5 md:p-7 shadow-xl">

          <h3 className="text-lg md:text-xl font-bold mb-6">Promotions Summary</h3>

          {/* ✅ Show message only if nothing selected at all */}
          {!canPublish && (
            <p className="text-gray-400 text-sm mb-4">
              Select a time slot or at least one stand-out option
            </p>
          )}

          <div className="space-y-3 text-sm">

            {timeSlot && (
              <div className="flex justify-between">
                <span>Time Slot</span>
                <b className="capitalize">{timeSlot} ({slotPriceMap[timeSlot]} coins)</b>
              </div>
            )}
            {days && (
              <div className="flex justify-between">
                <span>Days</span>
                <b>{days} day{days > 1 ? "s" : ""} ({dayPriceMap[days]} coins)</b>
              </div>
            )}
            {boost && (
              <div className="flex justify-between">
                <span>Boost</span>
                <b>{boost} boosts ({boostPriceMap[boost]} coins)</b>
              </div>
            )}
            {superTop && !allInOne && (
              <div className="flex justify-between">
                <span>Super Top</span>
                <b>{pricing.superTop} coins</b>
              </div>
            )}
            {highlight && !allInOne && (
              <div className="flex justify-between">
                <span>Highlight</span>
                <b>{pricing.highlight} coins</b>
              </div>
            )}
            {tagNew && !allInOne && (
              <div className="flex justify-between">
                <span>Tag New</span>
                <b>{pricing.tagNew} coins</b>
              </div>
            )}
            {allInOne && (
              <div className="flex justify-between">
                <span>All in One</span>
                <b>{pricing.superTop + pricing.tagNew + pricing.highlight} coins</b>
              </div>
            )}
          </div>

          {canPublish && (
            <>
              <div className="h-px bg-gray-700 my-5" />
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Total Coins</span>
                <span className="text-2xl md:text-3xl font-bold text-red-600">{total}</span>
              </div>

              <Button
                loading={buyLoading}
                onClick={publishWithMoney}
                className="w-full bg-red-600 hover:bg-red-700 text-lg py-3 mb-4"
                disabled={buyLoading}
              >
                Buy & Publish
              </Button>
            </>
          )}

          {/* WALLET RECHARGE */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 mt-6">
            <h4 className="text-lg font-bold mb-4">Recharge Wallet</h4>
            <p className="text-sm text-gray-400 mb-3">1 Coin = ₹{pricing.pricePerCoin}</p>
            <input
              type="number"
              value={rechargeCoins}
              onChange={(e) => setRechargeCoins(Number(e.target.value))}
              placeholder="Enter coins"
              className="w-full bg-black border border-gray-600 rounded-lg px-4 py-3 mb-4 outline-none focus:border-red-500"
            />
            {rechargeCoins > 0 && (
              <div className="flex justify-between mb-4">
                <span>Total Amount</span>
                <span className="font-bold text-red-600">₹{rechargeTotal}</span>
              </div>
            )}
            {contact?.is_whatsapp === "1" && (
              <Button
                onClick={handleRechargeWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Recharge via WhatsApp
              </Button>
            )}
            {contact?.is_email === "1" && (
              <a
                href={`mailto:${contact.email}?subject=Wallet Recharge Request&body=${encodeURIComponent(buildRechargeMessage())}`}
                className="block text-center mt-3 text-blue-400 text-sm"
              >
                Or Send via Email
              </a>
            )}
          </div>

          {/* WITHOUT PROMOTION */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 text-center mt-6">
            <p className="text-sm text-gray-400 mb-2">Don't want promotion?</p>
            <p className="font-semibold mb-4">
              Publish normally for <span className="text-red-600 ml-1">1 Coin</span>
            </p>
            <Button loading={loading} onClick={postWithout} className="w-full bg-(--button-color) hover:bg-(--button-hover-color) text-(--button-text) hover:text-(--button-hover-text)">
              Publish Without Promotion
            </Button>
          </div>

        </div>
      </div>

    </div>
  )
}

// ✅ Added locked prop
function StandCard({ title, desc, price, active, setActive, highlightAll = false, locked = false }) {
  return (
    <div className={`border border-(--primary-color) rounded-2xl p-6 mb-6 flex justify-between items-center
      ${locked ? "opacity-60" : ""}`}
    >
      <div className="max-w-[70%]">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold">{title}</h3>
          {/*Show locked badge when boost is selected */}
          {locked && (
            <span className="text-[10px] bg-(--button-color) text-(--button-text) px-2 py-0.5 rounded-full">
              Included in boost
            </span>
          )}
        </div>
        <p className="text-sm mb-2">{desc}</p>
        {highlightAll && (
          <div className="flex gap-2 mb-2">
            <span className="bg-(--button-color) text-white text-xs px-2 py-1 rounded">Super</span>
            <span className="bg-(--button-color) text-white text-xs px-2 py-1 rounded">Highlight</span>
            <span className="bg-(--button-color) text-white text-xs px-2 py-1 rounded">New</span>
          </div>
        )}
        <p className="font-semibold text-(--second-color)">{price}</p>
      </div>

      <div
        onClick={() => !locked && setActive(!active)}
        className={`w-20 h-10 flex items-center rounded-full px-1 transition
          ${locked ? "cursor-not-allowed bg-(--button-color)" : "cursor-pointer " + (active ? "bg-(--button-color)" : "bg-gray-300")}`}
      >
        <div
          className={`bg-white w-8 h-8 rounded-full shadow-md transform transition flex items-center justify-center text-xs font-bold
          ${locked ? "translate-x-10 " : active ? "translate-x-10 text-(--second-color)" : "text-gray-500"}`}
        >
          {locked ? "ON" : active ? "YES" : "NO"}
        </div>
      </div>
    </div>
  )
}