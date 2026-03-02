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

  const pricePerCoin = 49
  const total = coins * pricePerCoin

  /* ================= LOAD CONTACT SETTINGS ================= */

  useEffect(() => {

    async function fetchContact() {
      try {

        const fd = new FormData()
        fd.append("contect_id", 1)

        const res = await api.post("/Wb/contect_detail", fd)

        if (res.data.status === 0) {
          setContact(res.data.data)
        }

      } catch (err) {
        console.log(err)
      }
    }

    fetchContact()

  }, [])


  /* ================= BUILD MESSAGE ================= */

  const buildMessage = () => {
    return `Hi 👋

User ID: ${user?.id}
Email: ${user?.email}
Current Balance: ${balance} Coins
Coins Want: ${coins}
Total Pay: ₹${total}

Please confirm payment details.`
  }


  /* ================= COMMON VALIDATION ================= */

  const validate = () => {
    if (!coins || coins <= 0) {
      toast.error("Enter coin amount")
      return false
    }
    return true
  }


  /* ================= COPY ================= */

  const handleCopy = async () => {

    if (!validate()) return

    try {
      await navigator.clipboard.writeText(buildMessage())
      toast.success("Copied! Send to admin")
    } catch {
      toast.error("Copy failed")
    }
  }


  /* ================= WHATSAPP ================= */

  const handleWhatsApp = () => {

    if (!validate()) return
    if (!contact?.whatsapp) return

    const message = encodeURIComponent(buildMessage())
    window.open(
      `https://wa.me/${contact.whatsapp}?text=${message}`,
      "_blank"
    )
  }


  /* ================= TELEGRAM ================= */

  const handleTelegram = () => {

    if (!validate()) return
    if (!contact?.telegram) return

    const message = encodeURIComponent(buildMessage())
    window.open(
      `https://t.me/${contact.telegram}?text=${message}`,
      "_blank"
    )
  }


  return (
    <div className="min-h-screen bg-gray-950 flex justify-center items-start pt-10 px-4">

      <div className="w-full max-w-xl bg-slate-900 border border-orange-600 rounded-2xl shadow-lg p-6 sm:p-8">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">
          Wallet
        </h1>

        {/* Balance */}
        <div className="bg-black border border-orange-600 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-400 text-sm">Current Balance</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-orange-500 mt-2">
            {balance} Coins
          </h2>
        </div>

        <div className="space-y-4">

          {/* Coin Input */}
          <div>
            <label className="text-sm text-gray-400">Enter Coins</label>
            <input
              type="number"
              value={coins}
              onChange={(e) => setCoins(Number(e.target.value))}
              placeholder="Enter coins"
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 mt-1 outline-none focus:border-orange-500"
            />
          </div>

          {/* Total */}
          <div className="bg-gray-800 rounded-xl p-5 text-center">
            <p className="text-gray-400 text-sm">
              1 Coin = ₹49
            </p>
            <p className="text-lg sm:text-xl font-semibold mt-2 text-orange-400">
              Total: ₹{total}
            </p>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Copy Payment Details
          </button>

          {/* Dynamic Contact Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {contact?.is_whatsapp === "1" && (
              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
              >
                WhatsApp
              </button>
            )}

            {contact?.is_telegram === "1" && (
              <button
                onClick={handleTelegram}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Telegram
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}