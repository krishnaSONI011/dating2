'use client'

import { useContext, useState } from "react";
import { WalletContext } from "@/context/WalletContext";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function Wallet(){

  const { balance } = useContext(WalletContext)
  const { user } = useContext(AuthContext)

  const [coins, setCoins] = useState(0)

  const pricePerCoin = 49
  const total = coins * pricePerCoin

  const handleCopy = async () => {
    if (!coins || coins <= 0) {
      toast.error("Enter coin amount")
      return
    }

    const text = `
User ID: ${user?.id}
Wallet Balance: ${balance}
Coins Want: ${coins}
Total Pay: ₹${total}
    `

    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied! Send to admin/payment")
    } catch {
      toast.error("Copy failed")
    }
  }

  return(
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-10">

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Wallet
        </h1>

        {/* Balance */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-500 text-sm">Current Balance</p>
          <h2 className="text-4xl font-bold text-orange-500 mt-2">
            {balance} Coins
          </h2>
        </div>

        {/* Input */}
        <div className="space-y-4">

          <div>
            <label className="text-sm text-gray-600">Enter Coins</label>
            <input
              type="number"
              value={coins}
              onChange={(e)=> setCoins(Number(e.target.value))}
              placeholder="Enter coins"
              className="w-full border rounded-lg px-4 py-3 mt-1 outline-none focus:border-orange-500"
            />
          </div>

          {/* Calculation box */}
          <div className="bg-gray-100 rounded-xl p-5 text-center">
            <p className="text-gray-600 text-sm">
              1 Coin = ₹49
            </p>

            <p className="text-xl font-semibold mt-2">
              Total: ₹{total}
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleCopy}
            className="w-full bg-[#ff4000] hover:bg-[#e63900] text-white font-semibold py-3 rounded-xl transition"
          >
            Copy Payment Details
          </button>

        </div>

      </div>
    </div>
  )
}