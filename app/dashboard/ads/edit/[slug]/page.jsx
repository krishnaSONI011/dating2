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
import { nationalities } from "@/data/Country"

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
        country_code: "",
        city: "",
        local_area: "",
        postal_code: "",
        address: "",
        title: "",
        description: "",
        phone: "",
        teleragm_id: "",
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

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // Strips country code from phone input — handles both +91 and 91 prefix
    const handlePhoneChange = (e) => {
        let val = e.target.value
    
      
        if (val.startsWith('+')) {
            const sortedCodes = [...countryCodes].sort(
                (a, b) => b.code.replace('+', '').length - a.code.replace('+', '').length
            )
            const digits = val.slice(1) // remove leading +
            const matchedCode = sortedCodes.find(c =>
                digits.startsWith(c.code.replace('+', ''))
            )
            if (matchedCode) {
                val = digits.slice(matchedCode.code.replace('+', '').length).trimStart()
            } else {
                val = digits
            }
        }
    
        setForm(prev => ({ ...prev, phone: val }))
    }

    /* ================= FETCH EDIT DATA ================= */
    useEffect(() => {
        if (!slug) return

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

                   
                    
                    let fullMobile = (ads.mobile || "").trim()
                    let code = countryCodes[0]?.code ?? "+91"
                    let phoneNumber = fullMobile

                    // Strip leading + to work with pure digits
                    const mobileDigits = fullMobile.startsWith('+')
                        ? fullMobile.slice(1)
                        : fullMobile

                    // Sort longest code first so +1868 matches before +1
                    const sortedCodes = [...countryCodes].sort(
                        (a, b) => b.code.replace('+', '').length - a.code.replace('+', '').length
                    )

                    const matched = sortedCodes.find(c =>
                        mobileDigits.startsWith(c.code.replace('+', ''))
                    )

                    if (matched) {
                        code = matched.code  // e.g "+91"
                        phoneNumber = mobileDigits.slice(matched.code.replace('+', '').length)
                    }

                    setForm(prev => ({
                        ...prev,
                        id: ads.id,
                        cat_id: ads.cat_id,
                        nick_name: ads.nick_name ?? "",
                        age: ads.age ?? "",
                        ethnicity: ads.ethnicity ?? "",
                        nationality: ads.nationality ?? "",
                        breast: ads.breast ?? "",
                        hair: ads.hair ?? "",
                        body_type: ads.body_type ?? "",
                        email: ads.email ?? "",
                        phone: phoneNumber,   // ✅ clean digits only
                        country_code: code,   // ✅ e.g "+91"
                        city: ads.city,
                        local_area: ads.local_area,
                        address: ads.address ?? "",
                        title: ads.title ?? "",
                        description: ads.description ?? "",
                        teleragm_id: ads.telegram_id ?? ads.teleragm_id ?? "",
                        is_whatsapp: ads.is_whatsapp === "1",
                        is_telegram: ads.is_telegram === "1",
                        services: selectedServiceIds
                    }))

                    setImages(imagesData.map(img => ({
                        file: null,
                        preview: img.img
                    })))

                    /* -------- Fetch Cities + Local Areas -------- */
                    const cityRes = await api.post('/Wb/cities_areas')
                    if (cityRes.data.status == 0) {
                        const cities = cityRes.data.data
                        setCity(cities)

                        const selectedCity = cities.find(c => String(c.id) === String(ads.city))
                        if (selectedCity) {
                            const fdArea = new FormData()
                            fdArea.append("city_slug", selectedCity.slug)
                            const areaRes = await api.post("/Wb/get_areas_by_city", fdArea)

                            if (areaRes.data.status == 0) {
                                const areas = areaRes.data.data
                                setLocal(areas)
                                const area = areas.find(
                                    a => String(a.id ?? a.area_id ?? a.areaId) === String(ads.local_area)
                                )
                                if (area) setLocalAreaName(area.name)
                            }
                        }
                    }
                }

                /* -------- Fetch Categories -------- */
                const catRes = await api.post("/Wb/posts_categories")
                if (catRes.data.status == 0) setCategory(catRes.data.data ?? [])

                /* -------- Fetch Services -------- */
                const serviceRes = await api.get("/Wb/all_services")
                if (serviceRes.data.status == 0) setServices(serviceRes.data.data ?? [])

            } catch (err) {
                console.log(err)
                toast.error("Failed to load ad data")
            }
        }

        fetchAll()
    }, [slug])

    /* ================= GENERATE TITLE ================= */
    function generateTitle() {
        const cat = category.find(c => c.id == form.cat_id)
        const cName = city.find(c => c.id == form.city)
        setForm(prev => ({
            ...prev,
            title: `${prev.age ? prev.age + " yrs" : ""} ${cat?.name || ""} ${prev.nick_name || ""} ${cName?.name ? "in " + cName.name : ""}`.trim()
        }))
    }

    /* ================= TOGGLE SERVICE ================= */
    const toggleService = (id) => {
        setForm(prev => {
            const sid = String(id)
            let updated = [...prev.services].map(String)
            updated = updated.includes(sid) ? updated.filter(x => x !== sid) : [...updated, sid]
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
            fd.append("nick_name", form.nick_name ?? "")
            fd.append("age", form.age)
            fd.append("ethnicity", form.ethnicity ?? "")
            fd.append("nationality", form.nationality ?? "")
            fd.append("breast", form.breast ?? "")
            fd.append("hair", form.hair ?? "")
            fd.append("body_type", form.body_type ?? "")
            fd.append("email", user?.email || "")
            // ✅ Strip + from country_code then concat with phone
            fd.append("mobile", (form.country_code ?? "").replace('+', '') + (form.phone ?? ""))
            fd.append("city", form.city)
            fd.append("local_area", localAreaId)
            fd.append("address", form.address ?? "")
            fd.append("title", form.title)
            fd.append("description", form.description)
            fd.append("telegram_id", form.teleragm_id ?? "")
            fd.append("is_telegram", form.is_telegram ? "1" : "0")
            fd.append("is_whatsapp", form.is_whatsapp ? "1" : "0")

            form.services.forEach(id => {
                fd.append("service[]", id)
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
            } else {
                toast.error(res.data.message)
            }

        } catch (err) {
            console.log(err)
            toast.error("Something went wrong")
        }
    }

    return (
        <>
            <div className="mx-0 md:mx-30">
                <h1 className="text-lg md:text-3xl font-bold my-10">Edit Information</h1>

                {/* ===== LOCATION ===== */}
                <div className="bg-slate-800 rounded border border-(--content-border-color) p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                        <div>
                            <label className="font-bold text-xl">* Select Category</label>
                            <select
                                name="cat_id"
                                value={form.cat_id}
                                onChange={handleChange}
                                disabled
                                className="border w-full bg-slate-900 rounded p-2 mt-2 opacity-60 cursor-not-allowed"
                            >
                                <option value="">Choose Category</option>
                                {category.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="font-bold text-xl">* Select City</label>
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

                        <div>
                            <label className="font-bold text-xl">* Select Local Area</label>
                            <input
                                value={localAreaName}
                                type="text"
                                disabled
                                className="border w-full bg-slate-900 rounded p-2 mt-2 opacity-60 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-xl">Address</label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                type="text"
                                className="border w-full bg-slate-900 rounded p-2 mt-2"
                            />
                        </div>

                    </div>
                </div>

                {/* ===== BASIC INFO ===== */}
                <div className="bg-slate-800 mt-10 rounded border border-(--content-border-color) p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                        <div>
                            <label className="font-bold text-xl">* Age</label>
                            <input
                                name="age"
                                value={form.age}
                                onChange={handleChange}
                                type="text"
                                className="border w-full bg-slate-900 rounded p-2 mt-2"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-xl">Nick Name</label>
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
                        <div>
                            <div className="flex justify-between">
                                <label className="font-bold text-xl">* Title</label>
                                <button
                                    onClick={generateTitle}
                                    className="bg-orange-500/70 p-2 rounded text-white cursor-pointer hover:bg-orange-500"
                                >
                                    Generate the title
                                </button>
                            </div>
                            <textarea
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="border w-full bg-slate-900 rounded p-2 mt-2"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-xl">* Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="border w-full bg-slate-900 rounded p-2 mt-2"
                            />
                        </div>
                    </div>
                </div>

                {/* ===== PROFILE ATTRIBUTES ===== */}
                <div className="bg-slate-800 mt-10 rounded border border-(--content-border-color) p-3">
                    <h2 className="text-2xl font-bold mb-6">Profile Attributes</h2>

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
                        <select
                            className="w-full p-2 bg-slate-900 border rounded"
                            name="nationality"
                            value={form.nationality}
                            onChange={handleChange}
                        >
                            {nationalities.map((item, index) => (
                                <option key={index} value={item.value}>{item.label}</option>
                            ))}
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

                {/* ===== SERVICES ===== */}
                <div className="bg-slate-800 mt-10 rounded border border-(--content-border-color) p-5">
                    <h2 className="text-2xl font-bold mb-1">Services</h2>

                    {services.map(service => (
                        <div key={service.id} className="mb-6">
                            <h3 className="font-semibold text-lg mb-3 text-(--content-border-color)">
                                {service.title}
                            </h3>
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
                                                    : "border-gray-300 bg-slate-900 hover:border-gray-400"
                                                }`}
                                        >
                                            {active && "✕ "}{sub.title}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== IMAGES ===== */}
                <ImageUploader images={images} setImages={setImages} />

                {/* ===== CONTACTS ===== */}
                <div className="bg-slate-800 mt-10 rounded border border-(--content-border-color) p-4">

                    <div className="flex justify-between mb-4">
                        <h2 className="text-2xl font-bold">Your contacts</h2>
                        <span className="text-sm text-gray-500">* Mandatory fields</span>
                    </div>

                    <p className="font-semibold text-(--second-color) mb-4">
                        How would you like to be contacted?
                    </p>

                    {/* contact type */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                            { key: "phone", label: "Only Phone" },
                            { key: "both",  label: "Email and Phone" },
                            { key: "email", label: "Only Email" },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setContactType(key)}
                                className={`border rounded-lg py-3 font-semibold transition
                                    ${contactType === key
                                        ? "border-red-500 bg-red-50 text-red-600"
                                        : "border-gray-300 bg-slate-900"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
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
                                    value={form.email}
                                    readOnly
                                    className="w-full bg-slate-900 py-3 outline-none"
                                    placeholder="Enter email"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Not visible online</p>
                        </div>
                    )}

                    {/* phone */}
                    {(contactType === "phone" || contactType === "both") && (
                        <div className="mb-6">
                            <label className="font-semibold text-(--second-color) block mb-2">
                                Mobile Contact{" "}
                                <span className="text-red-500 text-xs">(enter without country code)</span>
                            </label>
                            <div className="flex items-center border border-gray-700 rounded-lg bg-slate-900 overflow-hidden">

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

                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handlePhoneChange}
                                    type="text"
                                    placeholder="Enter Mobile Number"
                                    className="w-full bg-slate-900 text-white py-3 px-3 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Telegram ID */}
                    <div className="mb-4">
                        <label className="font-semibold text-(--second-color) block mb-2">
                            Telegram User ID
                        </label>
                        <input
                            name="teleragm_id"
                            value={form.teleragm_id}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter Telegram User ID"
                            className="w-full bg-slate-900 border border-gray-700 text-white py-3 px-3 rounded-lg outline-none"
                        />
                    </div>

                    {/* whatsapp & telegram toggles */}
                    <div className="flex gap-6 mt-4">
                        <button
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, is_whatsapp: !prev.is_whatsapp }))}
                            className={`flex items-center gap-2 border px-4 py-2 rounded-lg transition
                                ${form.is_whatsapp
                                    ? "border-green-500 bg-green-50 text-green-600"
                                    : "border-gray-300 bg-slate-900"
                                }`}
                        >
                            <FaWhatsapp /> WhatsApp
                        </button>

                        <button
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, is_telegram: !prev.is_telegram }))}
                            className={`flex items-center gap-2 border px-4 py-2 rounded-lg transition
                                ${form.is_telegram
                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                    : "border-gray-300 bg-slate-900"
                                }`}
                        >
                            <FaTelegram /> Telegram
                        </button>
                    </div>

                </div>

                <div className="flex justify-end mt-8">
                    <Button onClick={handleSave}>
                        Save Changes
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
                        type="button"
                        onClick={() => setValue(opt)}
                        className={`px-5 py-2 rounded border text-sm font-medium transition
                            ${value === opt
                                ? "border-red-500 text-red-600 bg-red-50"
                                : "border-gray-300 text-(--website-text) hover:border-gray-400 bg-slate-900"
                            }`}
                    >
                        {value === opt && "✕ "}{opt}
                    </button>
                ))}
            </div>
        </div>
    )
}