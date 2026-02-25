'use client'

import CityWise from "@/components/Home/CityWise";
import PageContent from "@/components/Home/PageContent";
import SearchSection from "@/components/Home/SearchSection";
import TopSearches from "@/components/Home/TopSearch";
import ReusableModal from "@/components/ui/Model";
import api from "@/lib/api";
import { Playwrite_AT } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
const playwrite = Playwrite_AT({
  subsets: ["latin"],
});
export default function Home() {

  const [homeData, setHomeData] = useState(null)
  const [open, setOpen] = useState(false)

  // ---------------- GET HOME DATA ----------------
  useEffect(() => {
    async function getHomeData() {
      try {
        const formdata = new FormData()
        formdata.append("content_id", 1)

        const res = await api.post('Wb/content_detail', formdata)

        if (res.data.status == 0) {
          setHomeData(res.data.data)
        }

      } catch (e) {
        console.log(e)
      }
    }
    getHomeData()
  }, [])

  // ---------------- AGE MODAL LOGIC ----------------
  useEffect(() => {
    const accepted = localStorage.getItem("ageAccepted");

    if (!accepted) {
      setOpen(true);
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("ageAccepted", "yes");
    setOpen(false);
  }

  const handleDecline = () => {
    window.location.href = "https://google.com";
  }

  return (
    <>
      <SearchSection
        title={homeData?.home_title1}
        banner={homeData?.home_banner}
        subtitle={homeData?.home_title2}
      />

      <CityWise title={homeData?.explore_title} />
      <TopSearches />
      <PageContent html={homeData?.description} />

      {/*  AGE MODAL */}
      <ReusableModal open={open}>
  <div className="flex flex-col items-center">

    {/* icon circle */}
    <h1 className="text-5xl mb-5 font-semibold tracking-wide cursor-pointer">
            Affair{" "}
            <span className={`${playwrite.className} text-[#ff4000]`}>
              Escorts
            </span>
          </h1>
    {/* title */}
    <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4">
      Please read the following notice<br/>before you continue
    </h2>

    {/* desc */}
    <p className="text-gray-600 max-w-xl mb-4">
      I confirm that I am 18 or above and acknowledge my consent to access
      mature content, including explicit texts and image.
    </p>

    <p className="text-gray-600 mb-6">
      I have reviewed and agree to abide by the
      <Link href={'#'}>
      <span className="text-red-600 font-semibold ml-1">
        TERMS AND CONDITIONS
      </span>
      </Link>
    </p>

    {/* accept */}
    <button
      onClick={handleAccept}
      className="bg-red-700 hover:bg-red-800 text-white px-12 py-4 rounded-xl text-lg font-semibold mb-4"
    >
      ACCEPT
    </button>

    {/* decline */}
    <button
      onClick={handleDecline}
      className="text-red-600 text-lg font-semibold"
    >
      DECLINE
    </button>

  </div>
</ReusableModal>
    </>
  );
}