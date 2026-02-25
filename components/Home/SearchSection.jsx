'use client'

import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import Button from "../ui/Button";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SearchSection({ title, banner, subtitle }) {

  const [cities, setCities] = useState([]);
  const [local, setLocal] = useState([]);

  const [search, setSearch] = useState({
    city: '',
    area: '',
    keyword: ''
  });

  const router = useRouter();

  //  SEARCH
  const handleSearch = () => {
    if (!search.city) {
      alert("Select city first");
      return;
    }
    if(search.area === '' && search.city === ''){
      return;
    }
    if(search.city != '' && search.area === ''){
      router.push(`/escorts/${search.city}`);
    }
    if(search.city != '' && search.area != ''){
      router.push(`/escorts/${search.city}/${search.area}`);
    }
    
  };

  //  GET CITIES
  useEffect(() => {
    async function getCity() {
      try {
        const res = await api.post('/Wb/cities_areas');
        if (res?.data?.status == 0) {
          setCities(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getCity();
  }, []);

  //  GET AREAS BY CITY
  useEffect(() => {
    async function getLocalAreas() {
  
      if (!search.city) {
        setLocal([]);
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append('city_slug', search.city);
  
        const res = await api.post('/Wb/get_areas_by_city', formData);
  
        if (res?.data?.status == 0) {
          setLocal(Array.isArray(res.data.data) ? res.data.data : []);
        } else {
          setLocal([]);
        }
  
      } catch (e) {
        console.log(e);
        setLocal([]);
      }
    }
  
    getLocalAreas();
  }, [search.city]);

  return (
    <section className="relative w-full h-[520px] flex items-center justify-center text-white overflow-hidden">

      <img src={banner || "/default-banner.jpg"} alt="bg" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

        <h1 className="text-4xl uppercase md:text-6xl font-bold tracking-wide mb-4">
          {title}
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-10">
          {subtitle}
        </p>

        <div className="bg-[#0f1117]/90 backdrop-blur-xl border border-gray-800 rounded-full p-2 flex flex-col md:flex-row items-center gap-3 md:gap-0 shadow-2xl">

          {/* keyword */}
          <div className="flex items-center gap-3 px-5 py-3 w-full md:w-1/3 border-r border-gray-800">
            <FaSearch className="text-orange-500" />
            <input
              type="text"
              placeholder="Search keywords..."
              value={search.keyword}
              onChange={(e) =>
                setSearch((prev) => ({ ...prev, keyword: e.target.value }))
              }
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          {/* city */}
          <div className="flex items-center gap-3 px-5 py-3 w-full md:w-1/4 border-r border-gray-800">
            <FaMapMarkerAlt className="text-orange-500" />
            <select
              value={search.city}
              onChange={(e) =>
                setSearch((prev) => ({
                  ...prev,
                  city: e.target.value,
                  area: '' // reset area when city changes
                }))
              }
              className="bg-transparent outline-none w-full text-sm"
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* area */}
          <div className="flex items-center gap-3 px-5 py-3 w-full md:w-1/4">
            <FaMapMarkerAlt className="text-orange-500" />
            <select
              value={search.area}
              onChange={(e) =>
                setSearch((prev) => ({ ...prev, area: e.target.value }))
              }
              className="bg-transparent outline-none w-full text-sm"
            >
              <option value="">All Areas</option>
              {local.map((l) => (
                <option key={l.id} value={l.slug}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* button */}
          <div className="w-full md:w-[20%] px-3">
            <Button onClick={handleSearch}>
              Search
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}