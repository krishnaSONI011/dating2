'use client'

import { AuthContext } from "@/context/AuthContext"
import { useContext, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AgeAlert from "@/components/Warning"
import { FaBullhorn, FaCoins, FaCog, FaUserCheck, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa"
import ReusableModal from "@/components/ui/Model"
import Button from "@/components/ui/Button"
import api from "@/lib/api"

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, updateUser } = useContext(AuthContext)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const intervalRef = useRef(null)

  // ✅ Poll verification status every 3 seconds if not verified
  useEffect(() => {
    if (!user?.id) return

    // ✅ If already verified — don't poll at all
    if (user?.is_verified == 1) return

    async function checkVerificationStatus() {
      try {
        const res = await api.get(`Wb/get_varified_status?user_id=${user.id}`)

        if (res.data.status == 0) {
          const data = res.data.data

          // ✅ If status changed — update context + localStorage
          if (
            String(data.is_verified)  !== String(user.is_verified) ||
            String(data.is_approved)  !== String(user.is_approved)
          ) {
            updateUser({
              is_verified:      data.is_verified,
              is_approved:      data.is_approved,
              rejection_reason: data.rejection_reason ?? null,
            })
          }

          // ✅ If verified — stop polling
          if (data.is_verified == 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
          }
        }
      } catch (e) {
        console.log("Verification poll error:", e)
      }
    }

    // Start polling every 3 seconds
    intervalRef.current = setInterval(checkVerificationStatus, 3000)

    // Also check immediately on mount
    checkVerificationStatus()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [user?.id, user?.is_verified])

  useEffect(() => {
    if (user?.is_verified == 0 && user?.is_approved == 0) setOpen(true)
  }, [user?.is_verified, user?.is_approved])

  function showCard() {
    if (user?.is_verified == 1) return <VerifiedCard />
    if (user?.is_verified == 0 && user?.is_approved == 2 && user?.rejection_reason != null) {
      return <RejectedCard reason={user.rejection_reason} />
    }
    if (user?.is_verified == 0 && user?.is_approved == 1) return <PendingCard />
    return <StartVerificationCard />
  }

  return (
    <div className="min-h-screen bg-(--website-background)">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {user?.is_verified === 1 && <AgeAlert />}

        <h1 className="text-3xl font-bold text-(--second-color) mt-8 mb-6">
          Dashboard
        </h1>

        <ReusableModal open={open}>
          <h1 className="text-3xl font-bold">Please Verify First!</h1>
          <p className="mt-5">We must ensure that everyone who posts is a legal person.</p>
          <Button onClick={() => router.push('/dashboard/verification')} className="mt-5">
            Start Verification
          </Button>
          <Button onClick={() => setOpen(false)} className="bg-red-500 mt-5 hover:bg-red-700">
            I'll do it later
          </Button>
        </ReusableModal>

        <div className="my-10 text-xl">
          <h1 className="font-bold">Welcome to your Account</h1>
          <span className="mt-4">{user?.email}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link href="/dashboard/ads">
            <Card name="Ads" icon={<FaBullhorn />} />
          </Link>
          <Link href="/dashboard/wallet">
            <Card name="Coins" icon={<FaCoins />} />
          </Link>
          <Link href="/dashboard/setting">
            <Card name="Settings" icon={<FaCog />} />
          </Link>
        </div>

        <div className="mt-5">
          {showCard()}
        </div>

      </div>
    </div>
  )
}

function Card({ name, icon }) {
  return (
    <div className="bg-(--website-background)/30 border border-(--primary-color) rounded-2xl h-[180px] flex flex-col justify-center items-center shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="text-4xl text-(--primary-color) mb-3">{icon}</div>
      <div className="text-xl font-semibold text-(--primary-color)">{name}</div>
    </div>
  )
}

function StartVerificationCard() {
  return (
    <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg hover:shadow-2xl transition duration-300">
      <div className="flex items-center gap-4 md:gap-5">
        <div className="bg-white/20 p-3 md:p-4 rounded-xl text-white text-2xl md:text-3xl">
          <FaUserCheck />
        </div>
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-white">Start Verification</h2>
          <p className="text-white/90 text-sm md:text-base mt-1">
            Complete your verification to unlock all features
          </p>
        </div>
      </div>
      <Link href="/dashboard/verification" className="w-full md:w-auto">
        <button className="w-full md:w-auto bg-white text-orange-600 font-semibold px-5 md:px-6 py-3 rounded-xl hover:bg-gray-100 transition">
          Verify Now →
        </button>
      </Link>
    </div>
  )
}

function VerifiedCard() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="bg-green-500 text-white p-3 md:p-4 rounded-xl text-xl md:text-2xl">
          <FaCheckCircle />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-green-700">Verified Account</h2>
          <p className="text-green-600 text-sm mt-1">
            Your age verification is completed successfully.
          </p>
        </div>
      </div>
      <div className="bg-green-500 text-white px-4 md:px-5 py-2 rounded-lg text-sm font-semibold">
        Verified ✓
      </div>
    </div>
  )
}

function RejectedCard({ reason }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="bg-red-500 text-white p-3 md:p-4 rounded-xl text-xl md:text-2xl">
          <FaTimesCircle />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-red-700">Verification Rejected</h2>
          <p className="text-red-600 text-sm mt-1">{reason}</p>
        </div>
      </div>
      <Link href="/dashboard/verification" className="w-full md:w-auto">
        <button className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition">
          Re-upload Documents
        </button>
      </Link>
    </div>
  )
}

function PendingCard() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="bg-yellow-500 text-white p-3 md:p-4 rounded-xl text-xl md:text-2xl">
          <FaClock />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-yellow-700">Verification Pending</h2>
          <p className="text-yellow-600 text-sm mt-1">
            Your documents are under review. This may take 24 hours.
          </p>
        </div>
      </div>
      <div className="bg-yellow-500 text-white px-4 md:px-5 py-2 rounded-lg text-sm font-semibold">
        Pending
      </div>
    </div>
  )
}