'use client'

import Button from "@/components/ui/Button"
import ImageUploader from "@/components/ui/ImageUploader"
import { AuthContext } from "@/context/AuthContext"
import api from "@/lib/api"
import { useContext, useEffect, useState } from "react"
import { FaEnvelope, FaTelegram, FaWhatsapp } from "react-icons/fa"
import { countryCodes } from "@/data/country_code"
import { useParams } from "next/navigation"
import { toast } from "react-toastify"

export default function EditAdinformation() {

    const { user } = useContext(AuthContext)
    const params = useParams()
    const [localAreaName, setLocalAreaName] = useState("")
    const slug = params?.slug || ""

    const [form, setForm] = useState({
        id: '',
        cat_id: "",
        name: "",
        nick_name: "",
        age: "",
        ethnicity: "",
        nationality: "",
        breast: "",
        hair: "",
        body_type: "",
        email: user?.email || "",
        mobile: "",
        state: "",
        country_code: "91",
        city: "",
        local_area: "",
        postal_code: "",
        address: "",
        title: "",
        description: "",
        phone: "",
        is_whatsapp: false,
        is_telegram: false,
        services: []
    })

    const [category, setCategory] = useState([])
    const [city, setCity] = useState([])
    const [local, setLocal] = useState([])
    const [services, setServices] = useState([])
    const [images, setImages] = useState([])
    const [contactType, setContactType] = useState("phone")

    const localAreaSelectValue = (() => {
        const raw = form.local_area
        if (!raw) return ""
        const getId = (a) => a?.id ?? a?.area_id ?? a?.areaId
        const matchById = local.find(a => String(getId(a)) === String(raw))
        if (matchById) return String(getId(matchById))
        const matchByNameOrSlug = local.find(a => a.name === raw || a.slug === raw)
        if (matchByNameOrSlug) return String(getId(matchByNameOrSlug))
        return String(raw)
    })()

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
   
    /* ================= FETCH EDIT DATA ================= */

    // useEffect(() => {

    //     if (!slug) return
    //     async function fetchServices() {
    //         try {
    //             const res = await api.get("/Wb/all_services")

    //             if (res.data.status == 0) {
    //                 setServices(res.data.data)
    //             }
    //         } catch (err) {
    //             console.log(err)
    //         }
    //     }
    //     async function getCategory() {
    //         try {
    //             const res = await api.post('/Wb/posts_categories')
    //             if (res.data.status == 0) {
    //                 setCategory(res.data.data)
    //             }
    //         } catch (e) {
    //             console.log(e)
    //         }
    //     }
    //     async function getCity() {
    //         try {
    //             const res = await api.post('/Wb/cities_areas')
    //             if (res.data.status == 0) {
    //                 setCity(res.data.data)
    //             }
    //         } catch (e) {
    //             console.log(e)
    //         }
    //     }

    //     async function fetchAll() {

    //         try {

    //             /* -------- Fetch Ad Data -------- */
    //             const fd = new FormData()
    //             fd.append("ads_slug", slug)

    //             const res = await api.post("/Wb/ads_edit", fd)

    //             if (res.data.status == 0) {

    //                 const ads = res.data.data.ads
    //                 const servicesData = res.data.data.services || []
    //                 const imagesData = res.data.data.images || []

    //                 // API returns selected sub-service IDs inside services[].title (as strings like "4","6")
    //                 const selectedServiceIds = servicesData.map(s => String(s.title))

    //                 /* -------- Split country code + phone -------- */
    //                 let fullMobile = ads.mobile || ""
    //                 let code = "91"
    //                 let phoneNumber = fullMobile

    //                 if (fullMobile.startsWith("91")) {
    //                     code = "91"
    //                     phoneNumber = fullMobile.slice(2)
    //                 }

    //                 setForm(prev => ({
    //                     ...prev,
    //                     id: ads.id,
    //                     cat_id: ads.cat_id,
    //                     nick_name: ads.nick_name,
    //                     age: ads.age,
    //                     ethnicity: ads.ethnicity,
    //                     nationality: ads.nationality,
    //                     breast: ads.breast,
    //                     hair: ads.hair,
    //                     body_type: ads.body_type,
    //                     email: ads.email,
    //                     phone: phoneNumber,
    //                     country_code: code,
    //                     city: ads.city,
    //                     local_area: ads.local_area,
    //                     address: ads.address,
    //                     title: ads.title,
    //                     description: ads.description,
    //                     is_whatsapp: ads.is_whatsapp === "1",
    //                     is_telegram: ads.is_telegram === "1",
    //                     services: selectedServiceIds
    //                 }))

    //                 // shape images for ImageUploader ({ file, preview })
    //                 setImages(imagesData.map(img => ({
    //                     file: null,
    //                     preview: img.img
    //                 })))
    //             }

    //             /* -------- Fetch Categories -------- */
    //             const catRes = await api.post("/Wb/posts_categories")
    //             if (catRes.data.status == 0) {
    //                 setCategory(catRes.data.data)
    //             }

    //             /* -------- Fetch Cities -------- */
    //            // fetch local areas immediately
    //            const cityRes = await api.post('/Wb/cities_areas')

    //            if (cityRes.data.status == 0 ) {
               
    //              const cities = cityRes.data.data
    //              setCity(cities)
               
    //              const selectedCity = await cities.find(c => String(c.id) === String(form.city))
               
    //              if (selectedCity) {
               
    //                const fdArea = new FormData()
    //                fdArea.append("city_slug", selectedCity.slug)
               
    //                const areaRes = await api.post("/Wb/get_areas_by_city", fdArea)
    //                  console.log(areaRes)
    //                if (areaRes.data.status == 0) {
               
    //                  const areas = areaRes.data.data
    //                  setLocal(areas)
               
    //                  const area = await areas.find(
    //                    a => String(a.id ?? a.area_id ?? a.areaId) === String(form.local_area)
    //                  )
    //                  console.log("asdfas",area)
               
    //                  if (area) {
    //                    setLocalAreaName(area.name)
    //                  }
               
    //                }
    //              }
    //            }

    //             /* -------- Fetch Services -------- */
    //             const serviceRes = await api.get("/Wb/all_services")
    //             if (serviceRes.data.status == 0) {
    //                 setServices(serviceRes.data.data)
    //             }

    //         } catch (err) {
    //             console.log(err)
    //         }
    //     }
    //     fetchServices()
    //     getCategory()
    //     fetchAll()
    //     getCity()

    // }, [slug])
    useEffect(() => {

        if (!slug) return
    
        async function fetchServices() {
            try {
                const res = await api.get("/Wb/all_services")
    
                if (res.data.status == 0) {
                    setServices(res.data.data)
                }
            } catch (err) {
                console.log(err)
            }
        }
    
        async function getCategory() {
            try {
                const res = await api.post('/Wb/posts_categories')
                if (res.data.status == 0) {
                    setCategory(res.data.data)
                }
            } catch (e) {
                console.log(e)
            }
        }
    
        async function getCity() {
            try {
                const res = await api.post('/Wb/cities_areas')
                if (res.data.status == 0) {
                    setCity(res.data.data)
                }
            } catch (e) {
                console.log(e)
            }
        }
    
        async function fetchAll() {
    
            try {
    
                /* -------- Fetch Ad Data -------- */
                const fd = new FormData()
                fd.append("ads_slug", slug)
    
                const res = await api.post("/Wb/ads_edit", fd)
    
                if (res.data.status == 0) {
    
                    const ads = res.data.data.ads
                    const servicesData = res.data.data.services || []
                    const imagesData = res.data.data.images || []
    
                    const selectedServiceIds = servicesData.map(s => String(s.title))
    
                    let fullMobile = ads.mobile || ""
                    let code = "91"
                    let phoneNumber = fullMobile
    
                    if (fullMobile.startsWith("91")) {
                        code = "91"
                        phoneNumber = fullMobile.slice(2)
                    }
    
                    setForm(prev => ({
                        ...prev,
                        id: ads.id,
                        cat_id: ads.cat_id,
                        nick_name: ads.nick_name,
                        age: ads.age,
                        ethnicity: ads.ethnicity,
                        nationality: ads.nationality,
                        breast: ads.breast,
                        hair: ads.hair,
                        body_type: ads.body_type,
                        email: ads.email,
                        phone: phoneNumber,
                        country_code: code,
                        city: ads.city,
                        local_area: ads.local_area,
                        address: ads.address,
                        title: ads.title,
                        description: ads.description,
                        is_whatsapp: ads.is_whatsapp === "1",
                        is_telegram: ads.is_telegram === "1",
                        services: selectedServiceIds
                    }))
    
                    setImages(imagesData.map(img => ({
                        file: null,
                        preview: img.img
                    })))
    
                    /* -------- Fetch Cities -------- */
                    const cityRes = await api.post('/Wb/cities_areas')
    
                    if (cityRes.data.status == 0) {
    
                        const cities = cityRes.data.data
                        setCity(cities)
    
                        // FIX: form.city ki jagah ads.city use karo
                        const selectedCity = cities.find(c => String(c.id) === String(ads.city))
    
                        if (selectedCity) {
    
                            const fdArea = new FormData()
                            fdArea.append("city_slug", selectedCity.slug)
    
                            const areaRes = await api.post("/Wb/get_areas_by_city", fdArea)
    
                            console.log("AREA API:", areaRes)
    
                            if (areaRes.data.status == 0) {
    
                                const areas = areaRes.data.data
                                setLocal(areas)
    
                                // FIX: form.local_area ki jagah ads.local_area
                                const area = areas.find(
                                    a => String(a.id ?? a.area_id ?? a.areaId) === String(ads.local_area)
                                )
    
                                console.log("FOUND AREA:", area)
    
                                if (area) {
                                    setLocalAreaName(area.name)
                                }
                            }
                        }
                    }
                }
    
                /* -------- Fetch Categories -------- */
                const catRes = await api.post("/Wb/posts_categories")
                if (catRes.data.status == 0) {
                    setCategory(catRes.data.data)
                }
    
                /* -------- Fetch Services -------- */
                const serviceRes = await api.get("/Wb/all_services")
                if (serviceRes.data.status == 0) {
                    setServices(serviceRes.data.data)
                }
    
            } catch (err) {
                console.log(err)
            }
        }
    
        fetchServices()
        getCategory()
        getCity()
        fetchAll()
    
    }, [slug])
   
    function generateTitle() {

        const cat = category.find(c => c.id == form.cat_id)
        const cName = city.find(c => c.id === form.city)

        const parts = [
            prev.age ? `${prev.age} yrs` : "",
            cat?.name || "",
            prev.nick_name || "",
            cName?.name ? `in ${cName.name}` : ""
        ].filter(Boolean)

        setForm(prev => ({
            ...prev,
            title: parts.join(" ")
        }))
    }
    /* ================= LOCAL AREAS ================= */
    useEffect(() => {

        if (!form.city) return

        async function getLocalAreas() {

            const selectedCity = city.find(c => c.id == form.city)

            if (!selectedCity) return

            const fd = new FormData()
            fd.append("city_slug", selectedCity.slug)

            const res = await api.post("/Wb/get_areas_by_city", fd)

            if (res.data.status === 0) {
                setLocal(res.data.data)
            }
        }

        getLocalAreas()

    }, [form.city, city])

    /* ================= TOGGLE SERVICE ================= */

    const toggleService = (id) => {
        setForm(prev => {

            const sid = String(id)
            let updated = [...prev.services].map(String)

            if (updated.includes(sid)) {
                updated = updated.filter(x => x !== sid)
            } else {
                updated.push(sid)
            }

            return { ...prev, services: updated }
        })
    }

    /* ================= SAVE ================= */

    async function handleSave() {

        try {

            const fd = new FormData()

            const localAreaId = (() => {
                const raw = form.local_area
                if (!raw) return ""
                const getId = (a) => a?.id ?? a?.area_id ?? a?.areaId
                const matchById = local.find(a => String(getId(a)) === String(raw))
                if (matchById) return String(getId(matchById))
                const matchByNameOrSlug = local.find(a => a.name === raw || a.slug === raw)
                if (matchByNameOrSlug) return String(getId(matchByNameOrSlug))
                return String(raw)
            })()

            fd.append("ads_id", form.id)
            fd.append("cat_id", form.cat_id)
            fd.append("nick_name", form.nick_name)
            fd.append("age", form.age)
            fd.append("ethnicity", form.ethnicity)
            fd.append("nationality", form.nationality)
            fd.append("breast", form.breast)
            fd.append("hair", form.hair)
            fd.append("body_type", form.body_type)
            fd.append("email", user?.email || "")
            fd.append("mobile", form.country_code + form.phone)
            fd.append("city", form.city)
            fd.append("local_area", localAreaId)
            fd.append("address", form.address)
            fd.append("title", form.title)
            fd.append("description", form.description)
            fd.append("is_telegram", form.is_telegram ? "1" : "0")
            fd.append("is_whatsapp", form.is_whatsapp ? "1" : "0")

            // send selected service NAMES instead of IDs
        const allSubServices = services.flatMap(s => s.sub_services || [])
        form.services.forEach(id => {
            const sub = allSubServices.find(ss => String(ss.id) === String(id))
                if (sub?.title) {
                    fd.append("service[]", sub.title)
                }
            })

            images.forEach(img => {
                if (img?.file) {
                    fd.append("img[]", img.file)
                } else if (img?.preview) {
                    fd.append("old_images[]", img.preview)
                }
            })

            const res = await api.post("/Wb/ads_update", fd)

            if (res.data.status === 0) {
                toast.success(res.data.message)
            }

        } catch (err) {
            console.log(err)
            toast.error("Something went wrong")
        }
    }
 
    
    return (
        <>
            <div className="mx-0 md:mx-30">
                <h1 className="text-3xl font-bold my-10">Informaition</h1>
                {/* Ads Informaition */}
                <div className="bg-slate-800 rounded border border-(--content-border-color) p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                        {/* category */}
                        <div>
                            <label className="font-bold text-xl">* Select Category</label><br />
                            <select
                                name="cat_id"
                                value={form.cat_id}
                                onChange={handleChange}
                                disabled
                                className="border w-full bg-slate-900 rounded p-2 mt-2 opacity-60 cursor-not-allowed"
                            >
                                <option value="">Choose Category</option>
                                {category.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* city */}
                        <div>
                            <label className="font-bold text-xl">* Select City</label><br />
                            <select
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                disabled
                                className="border w-full bg-slate-900 rounded p-2 mt-2 opacity-60 cursor-not-allowed"
                            >
                                <option value="">Choose City</option>
                                {city.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* local Area */}
                        <div>
                            <label className="font-bold text-xl">* Select Local Area</label><br />
                            {/* <select
                                name="local_area"
                                value={localAreaSelectValue}
                                onChange={handleChange}
                                disabled
                                className="border w-full bg-slate-900 rounded p-2 mt-2 opacity-60 cursor-not-allowed"
                            >
                                <option value="">Choose Area</option>
                                {local.map((c) => (
                                    <option key={c.id ?? c.area_id ?? c.areaId} value={c.id ?? c.area_id ?? c.areaId}>{c.name}</option>
                                ))}
                            </select> */}
                             <input
                                name="local_area"
                                value={localAreaName}
                                onChange={handleChange}
                                type="text"
                                disabled
                                className="border w-full bg-slate-900 rounded p-2 mt-2 opacity-60 cursor-not-allowed"
                            />
                        </div>

                        {/* address */}
                        <div>
                            <label className="font-bold text-xl">Address</label><br />
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                type="text"
                                disabled
                                className="border w-full bg-slate-900 rounded p-2 mt-2 opacity-60 cursor-not-allowed"
                            />
                        </div>

                    </div>
                    <div className="grid grid-cols-1 mt-5">
                        {/* address */}

                    </div>


                </div>
                <div className="bg-slate-800 mt-10 rounded border border-(--content-border-color) p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2  gap-3">
                        {/* category */}
                        <div>
                            <label htmlFor="" className="font-bold text-xl">* Age</label><br />
                            <input
                                name="age"
                                value={form.age}
                                onChange={handleChange}
                                type="text"
                                className="border w-full bg-slate-900 rounded p-2 mt-2"
                            />
                        </div>
                        {/* city */}
                        <div>
                            <label htmlFor="" className="font-bold text-xl"> Nick Name</label><br />
                            <input
                                name="nick_name"
                                value={form.nick_name}
                                onChange={handleChange}
                                type="text"
                                className="border w-full bg-slate-900 rounded p-2 mt-2"
                            />
                        </div>



                    </div>
                    <div className="grid grid-cols-1 mt-5">
                        {/* address */}
                        <div>
                            <div className="flex justify-between">
                                <label htmlFor="" className="font-bold text-xl">* Title</label><br />
                                <button onClick={generateTitle} className="bg-orange-500/70 p-2 rounded text-white cursor-pointer hover:bg-orange-500">Generate the title</button>
                            </div>

                            <textarea
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="border  w-full bg-slate-900 rounded p-2 mt-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold text-xl">* Description</label><br />
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="border  w-full bg-slate-900 rounded p-2 mt-2"
                            />
                        </div>
                    </div>


                </div>
                <div className="bg-slate-800 mt-10 rounded border border-(--content-border-color) p-3">

                    <h2 className="text-2xl font-bold mb-6">
                        Profile Attributes
                    </h2>

                    <TagGroup
                        title="Ethnicity"
                        options={["African", "Indian", "Asian", "Arab"]}
                        value={form.ethnicity}
                        setValue={(val) => setForm(prev => ({ ...prev, ethnicity: val }))}
                    />

                    <div className="mb-6">
                        <label className="font-semibold text-lg text-(--content-border-color) block mb-2">
                            Nationality
                        </label>
                        <select className="w-full p-2 bg-slate-900 border rounded" name="nationality"
                            value={form.nationality}
                            onChange={handleChange}
                        >

                            <option value="">  Select nationality
                            </option>



                            <option value="Albanian">
                                🇦🇱 Albanian</option>



                            <option value="American">
                                🇺🇸 American</option>



                            <option value="Arabic">
                                🇸🇦 Arabic</option>



                            <option value="Argentinian">
                                🇦🇷 Argentinian</option>



                            <option value="Australian">
                                🇦🇺 Australian</option>



                            <option value="Austrian">
                                🇦🇹 Austrian</option>



                            <option value="Bangladeshi">
                                🇧🇩 Bangladeshi</option>



                            <option value="Belgian">
                                🇧🇪 Belgian</option>



                            <option value="Bolivian">
                                🇧🇴 Bolivian</option>



                            <option value="Bosnian">
                                🇧🇦 Bosnian</option>



                            <option value="Brazilian">
                                🇧🇷 Brazilian</option>



                            <option value="Bulgarian">
                                🇧🇬 Bulgarian</option>



                            <option value="Canadian">
                                🇨🇦 Canadian</option>



                            <option value="Chilean">
                                🇨🇱 Chilean</option>



                            <option value="Chinese">
                                🇨🇳 Chinese</option>



                            <option value="Colombian">
                                🇨🇴 Colombian</option>



                            <option value="Costa Rican">
                                🇨🇷 Costa Rican</option>



                            <option value="Croatian">
                                🇭🇷 Croatian</option>



                            <option value="Cuban">
                                🇨🇺 Cuban</option>



                            <option value="Czech">
                                🇨🇿 Czech</option>



                            <option value="Danish">
                                🇩🇰 Danish</option>



                            <option value="Dominican">
                                🇩🇴 Dominican</option>



                            <option value=" Dutch">
                                🇳🇱 Dutch</option>



                            <option value="Ecuadorian">
                                🇪🇨 Ecuadorian</option>



                            <option value="English">
                                🇬🇧 English</option>



                            <option value="Estonian">
                                🇪🇪 Estonian</option>



                            <option value="Filipino">
                                🇵🇭 Filipino</option>



                            <option value="Finnish">
                                🇫🇮 Finnish</option>



                            <option value="French">
                                🇫🇷 French</option>



                            <option value="German">
                                🇩🇪 German</option>



                            <option value=" Greek">
                                🇬🇷 Greek</option>



                            <option value="Guatemalan">
                                🇬🇹 Guatemalan</option>



                            <option value="Haitian">
                                🇭🇹 Haitian</option>



                            <option value="Honduran">
                                🇭🇳 Honduran</option>



                            <option value="Hungarian">
                                🇭🇺 Hungarian</option>



                            <option value="Indian">
                                🇮🇳 Indian</option>



                            <option value="Indonesian">
                                🇮🇩 Indonesian</option>



                            <option value="Irish">
                                🇮🇪 Irish</option>



                            <option value="Italian">
                                🇮🇹 Italian</option>



                            <option value="Jamaican">
                                🇯🇲 Jamaican</option>



                            <option value="Japanese">
                                🇯🇵 Japanese</option>



                            <option value="Kenyan">
                                🇰🇪 Kenyan</option>



                            <option value="Latvian">
                                🇱🇻 Latvian</option>



                            <option value="Lithuanian">
                                🇱🇹 Lithuanian</option>



                            <option value="Malaysian">
                                🇲🇾 Malaysian</option>



                            <option value="Maldivian">
                                🇲🇻 Maldivian</option>



                            <option value="Mexican">
                                🇲🇽 Mexican</option>



                            <option value="Moldovan">
                                🇲🇩 Moldovan</option>



                            <option value="Moroccan">
                                🇲🇦 Moroccan</option>



                            <option value="New Zealander">
                                🇳🇿 New Zealander</option>



                            <option value="Nicaraguan">
                                🇳🇮 Nicaraguan</option>



                            <option value="Nigerian">
                                🇳🇬 Nigerian</option>



                            <option value="Norwegian">
                                🇳🇴 Norwegian</option>



                            <option value="Pakistani">
                                🇵🇰 Pakistani</option>



                            <option value="Panamanian">
                                🇵🇦 Panamanian</option>



                            <option value="Paraguayan">
                                🇵🇾 Paraguayan</option>



                            <option value="Peruvian">
                                🇵🇪 Peruvian</option>



                            <option value="Polish">
                                🇵🇱 Polish</option>



                            <option value="Portuguese">
                                🇵🇹 Portuguese</option>



                            <option value="Romanian">
                                🇷🇴 Romanian</option>



                            <option value="Russian">
                                🇷🇺 Russian</option>



                            <option value="Senegalese">
                                🇸🇳 Senegalese</option>



                            <option value="Serbian">
                                🇷🇸 Serbian</option>



                            <option value="Singaporean">
                                🇸🇬 Singaporean</option>



                            <option value="South African">
                                🇿🇦 South African</option>



                            <option value="Spanish">
                                🇪🇸 Spanish</option>



                            <option value="Swedish">
                                🇸🇪 Swedish</option>



                            <option value="Swiss">
                                🇨🇭 Swiss</option>



                            <option value=" Thai">
                                🇹🇭 Thai</option>



                            <option value="Tunisian">
                                🇹🇳 Tunisian</option>



                            <option value="Turkish">
                                🇹🇷 Turkish</option>



                            <option value="Ukrainian">
                                🇺🇦 Ukrainian</option>



                            <option value="Uruguayan">
                                🇺🇾 Uruguayan</option>



                            <option value="Venezuelan">
                                🇻🇪 Venezuelan</option>



                            <option value="Vietnamese">
                                🇻🇳 Vietnamese</option>


                        </select>
                    </div>

                    <TagGroup
                        title="Breast"
                        options={["Natural", "Busty"]}
                        value={form.breast}
                        setValue={(val) => setForm(prev => ({ ...prev, breast: val }))}
                    />

                    <TagGroup
                        title="Hair"
                        options={["Black", "Brown", "Blonde"]}
                        value={form.hair}
                        setValue={(val) => setForm(prev => ({ ...prev, hair: val }))}
                    />

                    <TagGroup
                        title="Body Type"
                        options={["Slim", "Curvy", "Athletic"]}
                        value={form.body_type}
                        setValue={(val) => setForm(prev => ({ ...prev, body_type: val }))}
                    />
                </div>
                <div className="bg-slate-800 mt-10 rounded border border-(--content-border-color) p-5">

                    <h2 className="text-2xl font-bold mb-1">Services</h2>


                    {services.map(service => (
                        <div key={service.id} className="mb-6">

                            {/* main service title */}
                            <h3 className="font-semibold text-lg mb-3 text-(--content-border-color)">
                                {service.title}
                            </h3>

                            {/* sub services */}
                            <div className="flex flex-wrap gap-3">

                            {service.sub_services.map(sub => {

                                const active = form.services?.map(String)?.includes(String(sub.id))

                                    return (
                                        <button
                                            key={sub.id}
                                            type="button"
                                        onClick={() => toggleService(sub.id)}
                                            className={`px-5 py-2 rounded-full border text-sm font-medium transition
    ${active
                                                    ? "border-red-500 text-red-600 bg-red-50"
                                                    : "border-gray-300  bg-slate-900 hover:border-gray-400"
                                                }`}
                                        >
                                            {active && "✕ "}
                                            {sub.title}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                </div>
                <ImageUploader images={images} setImages={setImages} />
                <div className="bg-slate-800 mt-10 rounded border border-(--content-border-color) p-4">

                    {/* title */}
                    <div className="flex justify-between mb-4">
                        <h2 className="text-2xl font-bold">Your contacts</h2>
                        <span className="text-sm text-gray-500">* Mandatory fields</span>
                    </div>

                    <p className="font-semibold text-(--second-color) mb-4">
                        How would you like to be contacted?
                    </p>

                    {/* contact type buttons */}
                    <div className="grid grid-cols-3 gap-4 mb-6">

                        <button
                            onClick={() => setContactType("phone")}
                            className={`border rounded-lg py-3 font-semibold transition
          ${contactType === "phone"
                                    ? "border-red-500 bg-red-40 text-red-600"
                                    : "border-gray-300 bg-slate-900"}
          `}
                        >
                            Only Phone
                        </button>

                        <button
                            onClick={() => setContactType("both")}
                            className={`border rounded-lg py-3 font-semibold transition
          ${contactType === "both"
                                    ? "border-red-500 bg-red-50 text-red-600"
                                    : "border-gray-300 bg-slate-900"}
          `}
                        >
                            Email and Phone
                        </button>

                        <button
                            onClick={() => setContactType("email")}
                            className={`border rounded-lg py-3 font-semibold transition
          ${contactType === "email"
                                    ? "border-red-500 bg-red-50 text-red-600"
                                    : "border-gray-300 bg-slate-900"}
          `}
                        >
                            Only Email
                        </button>

                    </div>

                    {/* email */}
                    {(contactType === "email" || contactType === "both") && (
                        <div className="mb-6">
                            <label className="font-semibold text-(--second-color) block mb-2">
                                Email address
                            </label>

                            <div className="flex items-center border rounded-lg bg-slate-900 px-3">
                                <FaEnvelope className="text-(--second-color) mr-2" />
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="w-full bg-slate-900 py-3 outline-none"
                                    placeholder="Enter email"
                                />
                            </div>

                            <p className="text-xs text-gray-400 mt-1">
                                Not visible online
                            </p>
                        </div>
                    )}

                    {/* phone */}
                    {(contactType === "phone" || contactType === "both") && (
                        <div className="mb-6">
                            <label className="font-semibold text-(--second-color) block mb-2">
                                Telephone Contact
                            </label>

                            <div className="flex items-center border border-gray-700 rounded-lg bg-slate-900 overflow-hidden">

                                {/* Country Code Select */}
                                <select
                                    name="country_code"
                                    value={form.country_code}
                                    onChange={handleChange}
                                    className="bg-slate-900 text-white px-3 py-3 outline-none border-r border-gray-700 appearance-none"
                                >
                                    {countryCodes.map((country, index) => (
                                        <option key={index} value={country.code}>
                                            {country.code} ({country.name})
                                        </option>
                                    ))}
                                </select>

                                {/* Phone Input */}
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter phone number"
                                    className="w-full bg-slate-900 text-white py-3 px-3 outline-none"
                                />

                            </div>
                        </div>
                    )}

                    {/* whatsapp & telegram */}
                    <div className="flex gap-6 mt-4">

                        <button
                            type="button"
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    is_whatsapp: !prev.is_whatsapp,
                                }))
                            }
                            className={`flex items-center gap-2 border px-4 py-2 rounded-lg transition
    ${form.is_whatsapp
                                    ? "border-green-500 bg-green-50 text-green-600"
                                    : "border-gray-300 bg-slate-900"}
  `}
                        >
                            <FaWhatsapp />
                            WhatsApp
                        </button>

                        <button
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    is_telegram: !prev.is_telegram,
                                }))
                            }
                            className={`flex items-center gap-2 border px-4 py-2 rounded-lg transition
            ${form.is_telegram ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-300 bg-slate-900"}
          `}
                        >
                            <FaTelegram />
                            Telegram
                        </button>

                    </div>

                </div>
                <div className="flex justify-end mt-8">
                    <Button
                        onClick={handleSave}
                        className=""
                    >
                        Save
                    </Button>
                </div>
            </div>


        </>
    )
}

function TagGroup({ title, options, value, setValue }) {
    return (
        <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-(--content-border-color)">{title}</h3>

            <div className="flex flex-wrap gap-3">
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => setValue(opt)}
                        className={`px-5 py-2 rounded border text-sm font-medium transition
                ${value === opt
                                ? "border-red-500 text-red-600 bg-red-50"
                                : "border-gray-300 text-(--website-text) hover:border-gray-400 bg-slate-900"
                            }
              `}
                    >
                        {value === opt && "✕ "} {opt}
                    </button>
                ))}
            </div>
        </div>

    );
}