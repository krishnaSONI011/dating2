'use client'

import HelpSupport from "@/components/ui/HelpSection"
import { AuthContext } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"

export default function DashboardClientLayout({ children }) {

  const { user, isAuthenticated, isLoading } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading dashboard...
      </div>
    )
  }

  if (!user) return null

  return (
    <div>
      {children}
      <HelpSupport />
    </div>
  )
}