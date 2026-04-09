'use client'

import { useContext, useState, useEffect } from "react"
import { WalletContext } from "@/context/WalletContext"
import { AuthContext } from "@/context/AuthContext"
import api from "@/lib/api"
import { toast } from "react-toastify"

export default function Wallet() {

  const { balance } = useContext(WalletContext)
  const { user } = useContext(AuthContext)

  const [coins, setCoins] = useState(0)
  const [contact, setContact] = useState(null)
  const [payment, setPayment] = useState(null)
  const [plans, setPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)

  const pricePerCoin = 49
  const total = selectedPlan ? Number(selectedPlan.price) : coins * pricePerCoin

  /* ================= LOAD CONTACT ================= */
  useEffect(() => {
    async function fetchContact() {
      try {
        const fd = new FormData()
        fd.append("contect_id", "1")
        const res = await api.post("/Wb/contect_detail", fd)
        if (res.data.status === 0) setContact(res.data.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchContact()
  }, [])

  /* ================= LOAD PAYMENT ================= */
  useEffect(() => {
    async function fetchPayment() {
      try {
        const fd = new FormData()
        fd.append("payment_id", "1")
        const res = await api.post("/Wb/payments_detail", fd)
        if (res.data.status == 0 && res.data.data.status == "1") {
          setPayment(res.data.data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchPayment()
  }, [])

  /* ================= LOAD PLANS ================= */
  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await api.post("/Wb/plan")
        if (res.data.status == "0") {
          setPlans(res.data.data ?? [])
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchPlans()
  }, [])

  /* ================= MESSAGE ================= */
  const buildMessage = () => {
    return `Hi Olyvva,

User ID: ${user?.id}
Email: ${user?.email}
Current Balance: ${balance} Coins
Coins Want: ${coins}
Plan: ${selectedPlan ? selectedPlan.title : "Custom"}
Total Pay: ₹${total}

Please confirm payment details.`
  }

  const validate = () => {
    if (!coins || coins <= 0) {
      toast.error("Enter coin amount or select a plan")
      return false
    }
    return true
  }

  const handleCopy = async () => {
    if (!validate()) return
    await navigator.clipboard.writeText(buildMessage())
    toast.success("Copied! Send to admin")
  }

  const handleWhatsApp = () => {
    if (!validate()) return
    if (!contact?.whatsapp) return
    const message = encodeURIComponent(buildMessage())
    window.open(`https://wa.me/${contact.whatsapp}?text=${message}`, "_blank")
  }

  const handleTelegram = () => {
    if (!validate()) return
    if (!contact?.telegram) return
    const message = encodeURIComponent(buildMessage())
    window.open(`https://t.me/${contact.telegram}?text=${message}`, "_blank")
  }

  const handleEmail = () => {
    if (!validate()) return
    if (!contact?.email) return
    window.location.href = `mailto:${contact.email}?subject=Wallet Recharge&body=${encodeURIComponent(buildMessage())}`
  }

  // ✅ Click same plan again = deselect, else select
  const handleSelectPlan = (plan) => {
    if (selectedPlan?.id === plan.id) {
      setSelectedPlan(null)
      setCoins(0)
      return
    }
    setCoins(Number(plan.coins))
    setSelectedPlan(plan)
    toast.success(`Selected: ${plan.title}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ✅ Manual coin input clears selected plan
  const handleCoinsChange = (e) => {
    setCoins(Number(e.target.value))
    setSelectedPlan(null)
  }

  // ✅ Clear selected plan
  const handleClearPlan = () => {
    setSelectedPlan(null)
    setCoins(0)
  }

  return (
    <div className="min-h-screen bg-(--website-background) px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">

        {/* ================= WALLET CARD ================= */}
        <div className="bg-(--website-background) border border-(--primary-color) rounded-2xl p-6 sm:p-8">

          <h1 className="text-2xl sm:text-3xl font-bold  text-center mb-6">
            Wallet
          </h1>

          <div className=" border border-(--primary-color) rounded-xl p-6 text-center mb-8">
            <p className="text-gray-400 text-sm">Current Balance</p>
            <h2 className="text-3xl font-bold text-(--second-color) mt-2">
              {balance} Coins
            </h2>
          </div>

          <div className={`grid grid-cols-1 ${payment ? "md:grid-cols-2" : "max-w-md mx-auto"} gap-8`}>

            {/* LEFT SIDE */}
            <div className="space-y-4">

              <div>
                <label className="text-sm ">Enter Coins</label>
                <input
                  type="number"
                  value={coins}
                  onChange={handleCoinsChange}
                  className="w-full  border border-(--primary-color)  rounded-lg px-4 py-3 mt-1 focus:border-(--primary-color) outline-none"
                />
              </div>

              {/* ✅ Selected plan badge with Clear button */}
              {selectedPlan && (
                <div className=" border border-(--primary-color) rounded-lg px-4 py-2 text-sm text-(--second-color) flex items-center justify-between">
                  <span>Plan: <span className="font-semibold">{selectedPlan.title}</span></span>
                  <button
                    onClick={handleClearPlan}
                    className="text-(--second-color) hover:text-white text-xs ml-3 underline"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className=" rounded-xl p-5 text-center">
                <p className=" text-sm">
                  {selectedPlan ? "Plan Price" : `1 Coin = ₹${pricePerCoin}`}
                </p>
                <p className="text-lg font-semibold mt-2 text-(--second-color)">
                  Total: ₹{total}
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="w-full bg-(--button-color) hover:bg-(--button-hover-color) text-(--button-text) hover:text-(--button-hover-text) font-semibold py-3 rounded-xl transition"
              >
                Copy Payment Details
              </button>

              {/* ================= CONTACT BUTTONS ================= */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {contact?.is_whatsapp === "1" && contact?.whatsapp && (
                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
                  >
                    WhatsApp
                  </button>
                )}

                {contact?.is_telegram === "1" && contact?.telegram && (
                  <button
                    onClick={handleTelegram}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Telegram
                  </button>
                )}

                {contact?.is_email === "1" && contact?.email && (
                  <button
                    onClick={handleEmail}
                    className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Email
                  </button>
                )}

              </div>
            </div>

            {/* RIGHT SIDE - PAYMENT INFO */}
            {payment && (
              <div className=" border border-gray-700 rounded-xl p-6 space-y-5">

                <h2 className="text-xl font-semibold text-(--second-color) mb-4">
                  Payment Information
                </h2>

                {payment.qr && (
                  <div className="flex justify-center">
                    <img
                      src={payment.qr}
                      alt="QR"
                      className="w-40 h-40 object-contain rounded-lg border border-(--primary-color)"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className=" p-4 rounded-lg border border-(--primary-color)">
                    <p className="">UPI ID</p>
                    <p className="font-semibold break-all">{payment.upi}</p>
                  </div>
                  <div className="border border-(--primary-color) p-4 rounded-lg">
                    <p className="">IFSC</p>
                    <p className="font-semibold">{payment.ifsc}</p>
                  </div>
                  <div className="border border-(--primary-color) p-4 rounded-lg sm:col-span-2">
                    <p className="">Account Number</p>
                    <p className="font-semibold break-all">{payment.account_no}</p>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* ================= PRICING PLANS ================= */}
        {plans.length > 0 && (
          <div className=" border border-(--primary-color) rounded-2xl p-6 sm:p-8">

            <h2 className="text-2xl font-bold  text-center mb-6">
              Choose a Plan
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan)}
                  className={`cursor-pointer rounded-xl border p-5 space-y-3 transition hover:border-(--second-color) 
                    ${selectedPlan?.id === plan.id
                      ? "border-(--primary-color) "
                      : "border-gray-700 "
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className=" font-semibold text-lg">{plan.title}</h3>
                    {selectedPlan?.id === plan.id && (
                      <span className="text-xs bg-(--button-color) hover:bg-(--button-hover-color) text-(--button-text) hover:text-(--button-hover-text) px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="flex items-end justify-between">
                    <p className="text-(--second-color) text-2xl font-bold">
                      {plan.coins}
                      <span className="text-sm text-gray-400 ml-1">Coins</span>
                    </p>
                    <p className="text-white text-xl font-semibold">
                      ₹{Number(plan.price).toFixed(0)}
                    </p>
                  </div>

                  {/* ✅ Button label changes based on selection */}
                  <button className={`w-full text-sm font-semibold py-2 rounded-lg transition
                    ${selectedPlan?.id === plan.id
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-(--button-color) hover:bg-(--button-hover-color) text-(--button-text) hover:text-(--button-hover-text)"
                    }`}>
                    {selectedPlan?.id === plan.id ? "Deselect" : "Select Plan"}
                  </button>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}