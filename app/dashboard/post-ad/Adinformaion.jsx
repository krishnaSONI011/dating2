'use client'

import Button from "@/components/ui/Button"
import ImageUploader from "@/components/ui/ImageUploader"
import { AuthContext } from "@/context/AuthContext"
import api from "@/lib/api"
import { useContext, useEffect, useState } from "react"
import { FaEnvelope, FaTelegram, FaWhatsapp } from "react-icons/fa"
import { countryCodes } from "@/data/country_code"
import { useParams } from "next/navigation"
import { nationalities } from "@/data/Country"

export default function Adinformation({ form, setForm, handleChange, nextStep, setImages, images, services, setServices }) {

    const { user } = useContext(AuthContext)
    const [category, setCategory] = useState([])
    const [city, setCity] = useState([])
    const params = useParams()
    const [local, setLocal] = useState([])
    const [contactType, setContactType] = useState("phone")
    const email = user?.email ?? ""

    useEffect(() => {
        async function fetchServices() {
            try {
                const res = await api.get("/Wb/all_services")
                if (res.data.status == 0) setServices(res.data.data)
            } catch (err) {
                console.log(err)
            }
        }

        async function getCategory() {
            try {
                const res = await api.post('/Wb/posts_categories')
                if (res.data.status == 0) setCategory(res.data.data)
            } catch (e) {
                console.log(e)
            }
        }

        async function getCity() {
            try {
                const res = await api.post('/Wb/cities_areas')
                if (res.data.status == 0) setCity(res.data.data)
            } catch (e) {
                console.log(e)
            }
        }

        getCity()
        fetchServices()
        getCategory()
    }, [])

    // ✅ Bug 2 fixed: null check on cName before accessing .name
    function generateTitle() {
        const cat = category.find(c => c.id == form.cat_id)
        const cName = city.find((c) => c.id === form.city)
        setForm(prev => ({
            ...prev,
            title: `${prev.age ? prev.age + " yrs" : ""} ${cat?.name || ""} ${prev.nick_name || ""} ${cName?.name ? "in " + cName.name : ""}`.trim()
        }))
    }

    useEffect(() => {
        async function getLocalAreas() {
            if (!form.city) {
                setLocal([])
                return
            }
            try {
                const sl = city.find((c) => c.id === form.city)
                if (!sl?.slug) return
                const formData = new FormData()
                formData.append('city_slug', sl.slug)
                const res = await api.post('/Wb/get_areas_by_city', formData)
                if (res?.data?.status == 0) {
                    setLocal(Array.isArray(res.data.data) ? res.data.data : [])
                } else {
                    setLocal([])
                }
            } catch (e) {
                console.log(e)
                setLocal([])
            }
        }
        getLocalAreas()
    }, [form.city])

    const toggleService = (id) => {
        setForm(prev => {
            let arr = prev.services || []
            arr = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]
            return { ...prev, services: arr }
        })
    }

    // ✅ Bug 1 fixed: strip any country code prefix from phone input
    const handlePhoneChange = (e) => {
        let val = e.target.value

        // Remove leading + and digits that match a country code if typed together
        const matchedCode = countryCodes.find(c => val.startsWith(c.code))
        if (matchedCode) {
            val = val.slice(matchedCode.code.length).trimStart()
        }

        // Also strip a bare leading + if no code matched
        if (val.startsWith('+')) {
            val = val.replace(/^\+\d{1,3}\s?/, '')
        }

        setForm(prev => ({ ...prev, phone: val }))
    }

    const handleNext = () => {
        if (!form.cat_id || !form.city || !form.local_area || !form.age || !form.title || !form.description) {
            alert("Please fill all mandatory fields marked with *.")
            return
        }
        if ((contactType === "phone" || contactType === "both") && !form.phone) {
            alert("Please enter your phone number.")
            return
        }
        nextStep()
    }

    return (
        <>
            <div className="mx-0 md:mx-30">
                <h1 className="text-lg md:text-3xl font-bold my-10">Information</h1>

                {/* ===== LOCATION ===== */}
                <div className="bg-slate-800 rounded border border-(--content-border-color) p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                        <div>
                            <label className="font-bold text-xl">* Select Category</label>
                            <select
                                name="cat_id"
                                value={form.cat_id}
                                onChange={handleChange}
                                className="border w-full bg-slate-900 rounded p-2 mt-2"
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
                                className="border w-full bg-slate-900 rounded p-2 mt-2"
                            >
                                <option value="">Choose City</option>
                                {city.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="font-bold text-xl">* Select Local Area</label>
                            <select
                                name="local_area"
                                value={form.local_area}
                                onChange={handleChange}
                                className="border w-full bg-slate-900 rounded p-2 mt-2"
                            >
                                <option value="">Choose Area</option>
                                {local.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
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
                                    const active = form.services?.includes(sub.id)
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
                                    value={email}
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
                                Mobile Contact <span className="text-red-500 text-xs">(enter without country code ex : +91)</span>
                            </label>
                            <div className="flex items-center border border-gray-700 rounded-lg bg-slate-900 overflow-hidden">

                                {/* ✅ Country code dropdown */}
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

                                {/* ✅ Bug 1 fixed: use handlePhoneChange to strip prefix */}
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

                    {/* ✅ Bug 3 fixed: telegram input always visible, not inside phone block */}
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
                    <Button onClick={handleNext}>
                        Next → Promote Ad
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