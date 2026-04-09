'use client'

import { Playwrite_AT } from "next/font/google"
import Button from "./ui/Button";
import { FaUser, FaCoins, FaBars, FaTimes } from "react-icons/fa";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { WalletContext } from "@/context/WalletContext";
import Link from "next/link";
import WebsiteLogo from "./WebsiteLogo";

const playwrite = Playwrite_AT({
  subsets: ["latin"],
});

export default function Navbar(){

  const { isAuthenticated, logout } = useContext(AuthContext)
  const { balance } = useContext(WalletContext)

  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(false)

  const dropdownRef = useRef(null)

  // close dropdown outside
  useEffect(()=>{
    const handleClickOutside = (e)=>{
      if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return ()=> document.removeEventListener("mousedown", handleClickOutside)
  },[])

  return(
    <header className="w-full bg-(--navbar-color)  border-bs-blue-950  ">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          {/* <h1 className="text-[#e5e7eb] text-xl md:text-2xl font-semibold tracking-wide">
            Affair{" "}
            <span className={`${playwrite.className} text-orange-300`}>
              Escorts
            </span>
          </h1> */}
          <WebsiteLogo />
        </Link>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">

          {/* Wallet */}
          {isAuthenticated && (
            <div className="flex items-center gap-2  px-4 py-2 rounded-full border border-(--navbar-button-color)">
              <FaCoins className="text-(--navbar-button-color)" />
              <span className="font-semibold text-(--navbar-button-color) text-sm">
                {balance}
              </span>
            </div>
          )}

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            {!isAuthenticated ? (
              <Link href="/login">
                <button className="p-2 border border-(--navbar-icon-color) rounded-full text-(--navbar-icon-color)  hover:text-(--navbar-icon-color)">
                  <FaUser />
                </button>
              </Link>
            ) : (
              <>
                <button
                  onClick={()=> setOpen(!open)}
                  className="p-2 border border-(--navbar-icon-color) rounded-full (--navbar-icon-color)  hover:text-(--navbar-icon-color)"
                >
                  <FaUser />
                </button>

                {open && (
                  <div className="absolute overflow-hidden right-0 mt-3 w-44 bg-(--website-background) border border-(--primary-color) rounded-xl shadow-lg z-50">
                    <Link href="/dashboard">
                      <div className="px-4 py-3 text-(--website-text) hover:bg-(--primary-color)/10 text-sm">Dashboard</div>
                    </Link>

                    <Link href="/dashboard/wallet">
                      <div className="px-4 py-3 text-(--website-text) hover:bg-(--primary-color)/10 text-sm">Wallet</div>
                    </Link>

                    <div className="border-t"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 hover:bg-(--primary-color)/10 text-red-500 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* CTA */}
          <Link href={isAuthenticated ? "/dashboard/post-ad" : "/login"}>
            <Button className="px-6 py-2 bg-(--navbar-button-color) text-(--navbar-button-text-color) hover:bg-(--navbar-button-color-hover) hover:text-(--navbar-button-text-color-hover) rounded-full">
              Post Your Ads
            </Button>
          </Link>

        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-xl"
          onClick={()=> setMobile(!mobile)}
        >
          {mobile ? <FaTimes/> : <FaBars/>}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobile && (
        <div className="md:hidden  border-t border-(--primary-color) px-6 py-4 space-y-4">

          {/* Wallet */}
          {isAuthenticated && (
            <div className="flex items-center gap-2  px-4 py-2 rounded-full border border-(--navbar-button-color)">
            <FaCoins className="text-(--navbar-button-color)" />
            <span className="font-semibold text-(--navbar-button-color) text-sm">
              {balance}
            </span>
          </div>
          )}

          {/* Links */}
          {isAuthenticated && (
            <>
              <Link href="/dashboard">
                <div className="py-2 border-b">Dashboard</div>
              </Link>

              <Link href="/dashboard/wallet">
                <div className="py-2 border-b">Wallet</div>
              </Link>
            </>
          )}

          {!isAuthenticated ? (
            <Link href="/login">
              <div className="py-2 border-b">Login</div>
            </Link>
          ) : (
            <button
              onClick={logout}
              className="text-red-500 py-2"
            >
              Logout
            </button>
          )}

          <Link href={isAuthenticated ? "/dashboard/post-ad" : "/login"}>
            <Button className="px-6 py-2 bg-(--navbar-button-color) text-(--navbar-button-text-color) hover:bg-(--navbar-button-color-hover) hover:text-(--navbar-button-text-color-hover) rounded-full">
              Post Your Ads
            </Button>
          </Link>

        </div>
      )}
    </header>
   
  )
}