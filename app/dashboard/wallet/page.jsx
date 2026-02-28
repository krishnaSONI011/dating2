'use client'

import { useContext, useState } from "react"
import { WalletContext } from "@/context/WalletContext"
import { AuthContext } from "@/context/AuthContext"
import { toast } from "react-toastify"

export default function Wallet() {

  const { balance } = useContext(WalletContext)
  const { user } = useContext(AuthContext)

  const [coins, setCoins] = useState(0)

  const pricePerCoin = 49
  const total = coins * pricePerCoin

  const buildMessage = () => {
    return `Hi 👋

User ID: ${user?.id}
Email: ${user?.email}
Current Balance: ${balance} Coins
Coins Want: ${coins}
Total Pay: ₹${total}

Please confirm payment details.`
  }

  const handleCopy = async () => {
    if (!coins || coins <= 0) {
      toast.error("Enter coin amount")
      return
    }

    try {
      await navigator.clipboard.writeText(buildMessage())
      toast.success("Copied! Send to admin/payment")
    } catch {
      toast.error("Copy failed")
    }
  }

  const handleWhatsApp = () => {
    if (!coins || coins <= 0) {
      toast.error("Enter coin amount")
      return
    }

    const message = encodeURIComponent(buildMessage())

    const phoneNumber = "919876543210" // e.g. 919876543210

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  const handleTelegram = () => {
    if (!coins || coins <= 0) {
      toast.error("Enter coin amount")
      return
    }

    const message = encodeURIComponent(buildMessage())

    const username = "YOUR_TELEGRAM_USERNAME" // without @

    window.open(`https://t.me/${username}?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-950 flex justify-center items-start pt-10 px-4">

      <div className="w-full max-w-xl bg-slate-900 border border-orange-600 rounded-2xl shadow-lg p-6 sm:p-8">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Wallet
        </h1>

        {/* Balance */}
        <div className="bg-black border border-orange-600 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-400 text-sm">Current Balance</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-orange-500 mt-2">
            {balance} Coins
          </h2>
        </div>

        {/* Input */}
        <div className="space-y-4">

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

          {/* Calculation box */}
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

          {/* WhatsApp + Telegram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <button
              onClick={handleWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
            >
              WhatsApp
            </button>

            <button
              onClick={handleTelegram}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Telegram
            </button>

          </div>

        </div>

      </div>
    </div>
  )
}