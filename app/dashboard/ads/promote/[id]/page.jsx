'use client'
import { useState, useEffect, useContext } from "react"
import Button from "@/components/ui/Button"
import { WalletContext } from "@/context/WalletContext"
import { toast } from "react-toastify"
import api from "@/lib/api"
import { AuthContext } from "@/context/AuthContext"
import { useParams, useRouter } from "next/navigation"

export default function Promote({ prevStep, form, images }) {

  const [timeSlot, setTimeSlot] = useState("")
  const [fromTime, setFromtime] = useState("")
  const [toTime, setToTime] = useState("")
  const [days, setDays] = useState(null)
  const [boost, setBoost] = useState(null)
  const { balance } = useContext(WalletContext)
  const [loading, setLoading] = useState(false)
  const [superTop, setSuperTop] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const [tagNew, setTagNew] = useState(false)
  const [allInOne, setAllInOne] = useState(false)
  const params = useParams()
  const slug = params?.id ?? ""
  const { user } = useContext(AuthContext)
  const router = useRouter()

  // ✅ Pricing state from API
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

  // ✅ Fetch pricing
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

  // ✅ Price maps
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

  // ✅ Dynamic total
  let total = 0
  if (timeSlot && days && boost) {
    total = (slotPriceMap[timeSlot] || 0) + (dayPriceMap[days] || 0) + (boostPriceMap[boost] || 0)
  }
  if (allInOne) {
    total += pricing.superTop + pricing.tagNew + pricing.highlight
  } else {
    if (superTop) total += pricing.superTop
    if (highlight) total += pricing.highlight
    if (tagNew) total += pricing.tagNew
  }

  // ✅ Can publish check
  const hasSlotSelection = timeSlot && days && boost
  const hasStandoutSelection = superTop || highlight || tagNew || allInOne
  const canPublish = hasSlotSelection || hasStandoutSelection

  const handleAllInOne = () => {
    const newVal = !allInOne
    setAllInOne(newVal)
    setSuperTop(newVal)
    setHighlight(newVal)
    setTagNew(newVal)
  }

  async function publishWithMoney() {
    if (timeSlot && (!days || !boost)) return toast.error("Please select days and boost")
    if (!canPublish) return toast.error("Please select at least one promotion option")
    if (balance < total) return toast.error("Insufficient balance")

    try {
      setLoading(true)

      const boostData = new FormData()
      boostData.append("ads_id", slug)
      boostData.append("from_time", fromTime)
      boostData.append("to_time", toTime)
      boostData.append("super_top", superTop ? "1" : "0")
      boostData.append("hight_light", highlight ? "1" : "0")
      boostData.append("new", tagNew ? "1" : "0")
      boostData.append("all_upgrade", allInOne ? "1" : "0")
      boostData.append("days", days ?? "0")
      boostData.append("boost_times", boost ?? "0")
      boostData.append("total", total)

      const boostRes = await api.post(`/Wb/bost_plan`, boostData)

      if (boostRes.data.status == 0) {
        toast.success("Ad Boosted Successfully!")
        router.replace('/dashboard')
      } else {
        toast.error(boostRes.data.message)
      }

    } catch (e) {
      console.log(e)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (superTop && highlight && tagNew) setAllInOne(true)
    else setAllInOne(false)
  }, [superTop, highlight, tagNew])

  return (
    <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* ================= LEFT ================= */}
      <div className="lg:col-span-2 bg-(--website-background) p-6 md:p-8 rounded-2xl border shadow-sm border-(--content-border-color)">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">Promote Your Ad</h2>

        {/* TIME SLOT */}
        <h3 className="text-lg md:text-xl font-semibold mb-2">Choose promotion time</h3>
        <p className="text-sm text-gray-400 mb-4">Optional — skip if you only want Super Top / Highlight / New</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            { id: "night",     label: "Night",     from: "23:59:59", to: "06:00:00", display: "23:59 - 06:00", priceKey: "slot1" },
            { id: "morning",   label: "Morning",   from: "06:00:01", to: "12:00:00", display: "06:00 - 12:00", priceKey: "slot2" },
            { id: "afternoon", label: "Afternoon", from: "12:00:01", to: "18:00:00", display: "12:00 - 18:00", priceKey: "slot3" },
            { id: "evening",   label: "Evening",   from: "18:00:01", to: "23:59:58", display: "18:00 - 23:59", priceKey: "slot4" },
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
              ${timeSlot === slot.id
                ? "border-red-500 bg-red-50 text-red-600"
                : "border-gray-300 hover:border-gray-400"}`}
            >
              <div>{slot.label}</div>
              <div className="text-sm text-gray-500">{slot.display}</div>
              {/* ✅ Dynamic price */}
              <div className="text-xs mt-1 font-semibold text-orange-500">
                {pricing[slot.priceKey]} Coins
              </div>
            </button>
          ))}
        </div>

        {/* DAYS + BOOST */}
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
                  ${days === d
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-gray-300 hover:border-gray-400"}`}
                >
                  <div>{d} Day{d > 1 && "s"}</div>
                  <div className="text-xs font-semibold text-orange-500">{pricing[priceKey]} Coins</div>
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
                      setBoost(null)
                      setSuperTop(false)
                    } else {
                      setBoost(b)
                      setSuperTop(true)
                    }
                  }}
                  className={`px-5 py-2 md:px-6 md:py-3 rounded-xl border font-semibold transition
                  ${boost === b
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-gray-300 hover:border-gray-400"}`}
                >
                  <div>{b} Boosts</div>
                  <div className="text-xs font-semibold text-orange-500">{pricing[priceKey]} Coins</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* STAND OUT — always visible */}
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-(--second-color)">
          Make your ad stand out
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Select any option to promote your ad
        </p>

        <StandCard
          title="Super Top"
          desc="Get more visibility with top placement."
          price={`${pricing.superTop} Coins`}
          active={superTop}
          locked={!!boost}
          setActive={(val) => { if (boost) return; setSuperTop(val) }}
        />
        <StandCard
          title="Highlight"
          desc="Colored background for your ad."
          price={`${pricing.highlight} Coins`}
          active={highlight}
          setActive={(val) => setHighlight(val)}
        />
        <StandCard
          title="Tag New"
          desc="Add NEW label to listing."
          price={`${pricing.tagNew} Coins`}
          active={tagNew}
          setActive={(val) => setTagNew(val)}
        />
        <StandCard
          title="All in One"
          desc="Super Top + Highlight + New tag"
          price={`${pricing.superTop + pricing.tagNew + pricing.highlight} Coins`}
          active={allInOne}
          setActive={() => handleAllInOne()}
          highlightAll
        />

      </div>

      {/* ================= RIGHT SUMMARY ================= */}
      <div className="lg:sticky lg:top-24 h-fit">
        <div className="bg-(--website-background) border border-gray-200 rounded-2xl p-5 md:p-7 shadow-xl">

          <h3 className="text-lg md:text-xl font-bold mb-6">Promotions Summary</h3>

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
                loading={loading}
                onClick={publishWithMoney}
                className="w-full bg-red-600 hover:bg-red-700 text-lg py-3 mb-3"
                disabled={loading}
              >
                Buy & Publish
              </Button>
            </>
          )}

        </div>
      </div>

    </div>
  )
}

// ✅ locked prop added
function StandCard({ title, desc, price, active, setActive, highlightAll = false, locked = false }) {
  return (
    <div className={`border border-(--content-border-color) rounded-2xl p-6 mb-6 flex justify-between items-center
      ${locked ? "opacity-60" : ""}`}
    >
      <div className="max-w-[70%]">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold">{title}</h3>
          {locked && (
            <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full">
              Included in boost
            </span>
          )}
        </div>
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

      <div
        onClick={() => !locked && setActive(!active)}
        className={`w-20 h-10 flex items-center rounded-full px-1 transition
          ${locked
            ? "cursor-not-allowed bg-orange-500"
            : "cursor-pointer " + (active ? "bg-red-600" : "bg-gray-300")
          }`}
      >
        <div
          className={`bg-white w-8 h-8 rounded-full shadow-md transform transition flex items-center justify-center text-xs font-bold
          ${locked
            ? "translate-x-10 text-orange-500"
            : active ? "translate-x-10 text-red-600" : "text-gray-500"
          }`}
        >
          {locked ? "ON" : active ? "YES" : "NO"}
        </div>
      </div>
    </div>
  )
}