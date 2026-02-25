'use client'

import Button from "@/components/ui/Button"
import ImageUploader from "@/components/ui/ImageUploader"
import { AuthContext } from "@/context/AuthContext"
import api from "@/lib/api"
import { useContext, useEffect, useState } from "react"
import { FaEnvelope, FaTelegram, FaWhatsapp } from "react-icons/fa"

export default function Adinformation({ form, setForm, handleChange, nextStep, setImages, images ,services,setServices}) {
    const { user } = useContext(AuthContext)
    const [ethnicity, setEthnicity] = useState("")
    const [category, setCategory] = useState([])
    const [city, setCity] = useState([])
    const [local, setLocal] = useState([])
    const [breast, setBreast] = useState("")
    const [hair, setHair] = useState("")
    const [bodyType, setBodyType] = useState("")
    
    const [selected, setSelected] = useState([]) // store selected sub_service ids
    const [contactType, setContactType] = useState("phone")
    const [email, setEmail] = useState(user?.email ?? "")
    const [whatsapp, setWhatsapp] = useState(false)
    const [telegram, setTelegram] = useState(false)

    useEffect(() => {
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
        getCity()
        fetchServices()
        getCategory()
    }, [])

    function generateTitle() {

        const cat = category.find(c => c.id == form.cat_id)
        const cName = city.find((c)=> c.id === form.city)
        setForm(prev => ({
            ...prev,
            title: `${prev.age ? prev.age + " yrs" : ""} ${cat?.name || ""} ${prev.nick_name || ""} ${cName.name ? "in " + cName.name : ""}`
        }))
    }

    useEffect(() => {
        async function getLocalAreas() {

            if (!form.city) {
                setLocal([]);
                return;
            }

            try {
                const sl = city.find((c)=> c.id === form.city)
                const formData = new FormData();
                formData.append('city_slug', sl.slug);

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
    }, [form.city]);
    // toggle select
    const toggleService = (id) => {
        setForm(prev => {
      
          let arr = prev.services || []
      
          if(arr.includes(id)){
            arr = arr.filter(x => x !== id)
          }else{
            arr = [...arr, id]
          }
      
          return {
            ...prev,
            services: arr
          }
        })
      }

    const handleNext = () => {
        if (
            !form.cat_id ||
            !form.city ||
            !form.local_area ||
            !form.age ||
            !form.nick_name ||
            !form.title ||
            !form.description
        ) {
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
            <div className="mx-30">
                <h1 className="text-3xl font-bold my-10">Informaition</h1>
                {/* Ads Informaition */}
                <div className="bg-gray-100 rounded border border-gray-200 p-3">
                    <div className="grid grid-cols-2 gap-3">
                        {/* category */}
                        <div>
                            <label htmlFor="" className="font-bold text-xl">* Select Category</label><br />
                            <select
                                name="cat_id"
                                value={form.cat_id}
                                onChange={handleChange}
                                className="border w-full bg-white rounded p-2 mt-2"
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
                            <label htmlFor="" className="font-bold text-xl">* Select City</label><br />
                            <select
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="border w-full bg-white rounded p-2 mt-2"
                            >
                                <option value="">Choose City</option>
                                {city.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* local Area */}
                        <div>
                            <label htmlFor="" className="font-bold text-xl">* Select Local Area</label><br />
                            <select
                                name="local_area"
                                value={form.local_area}
                                onChange={handleChange}
                                className="border w-full bg-white rounded p-2 mt-2"
                            >
                                <option value="">Choose Area</option>
                                {local.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* postal code */}
                        <div>
                            <label htmlFor="" className="font-bold text-xl">Postal Code</label><br />
                            <input
                                name="postal_code"
                                value={form.postal_code}
                                onChange={handleChange}
                                type="text"
                                className="border w-full bg-white rounded p-2 mt-2"
                            />
                        </div>


                    </div>
                    <div className="grid grid-cols-1 mt-5">
                        {/* address */}
                        <div>
                            <label htmlFor="" className="font-bold text-xl">Address</label><br />
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                type="text"
                                className="border w-full bg-white rounded p-2 mt-2"
                            />
                        </div>
                    </div>


                </div>
                <div className="bg-gray-100 mt-8 rounded border border-gray-200 p-3">
                    <div className="grid grid-cols-2 gap-3">
                        {/* category */}
                        <div>
                            <label htmlFor="" className="font-bold text-xl">* Age</label><br />
                            <input
                                name="age"
                                value={form.age}
                                onChange={handleChange}
                                type="text"
                                className="border w-full bg-white rounded p-2 mt-2"
                            />
                        </div>
                        {/* city */}
                        <div>
                            <label htmlFor="" className="font-bold text-xl">* Nick Name</label><br />
                            <input
                                name="nick_name"
                                value={form.nick_name}
                                onChange={handleChange}
                                type="text"
                                className="border w-full bg-white rounded p-2 mt-2"
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
                                className="border w-full bg-white rounded p-2 mt-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold text-xl">* Description</label><br />
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="border w-full bg-white rounded p-2 mt-2"
                            />
                        </div>
                    </div>


                </div>
                <div className="bg-gray-100 mt-8 rounded border border-gray-200 p-6">

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
                        <label className="font-semibold text-lg text-gray-700 block mb-2">
                            Nationality
                        </label>
                        <select className="w-full p-2 bg-gray-100 border rounded" name="nationality"
                        value={form.nationality}
                            onChange={handleChange}
                        >

<option value="">  Select nationality
</option>

 

    <option value="🇦🇱 Albanian">
    🇦🇱 Albanian</option>

 

    <option value="🇺🇸 American">
    🇺🇸 American</option>

 

    <option value="🇸🇦 Arabic">
    🇸🇦 Arabic</option>

 

    <option value="🇦🇷 Argentinian">
    🇦🇷 Argentinian</option>

 

    <option value="🇦🇺 Australian">
    🇦🇺 Australian</option>

 

    <option value="🇦🇹 Austrian">
    🇦🇹 Austrian</option>

 

    <option value="🇧🇩 Bangladeshi">
    🇧🇩 Bangladeshi</option>

 

    <option value="🇧🇪 Belgian">
    🇧🇪 Belgian</option>

 

    <option value="🇧🇴 Bolivian">
    🇧🇴 Bolivian</option>

 

    <option value="🇧🇦 Bosnian">
    🇧🇦 Bosnian</option>

 

    <option value="🇧🇷 Brazilian">
    🇧🇷 Brazilian</option>

 

    <option value="🇧🇬 Bulgarian">
    🇧🇬 Bulgarian</option>

 

    <option value="🇨🇦 Canadian">
    🇨🇦 Canadian</option>

 

    <option value="🇨🇱 Chilean">
    🇨🇱 Chilean</option>

 

    <option value="🇨🇳 Chinese">
    🇨🇳 Chinese</option>

 

    <option value="🇨🇴 Colombian">
    🇨🇴 Colombian</option>

 

    <option value="🇨🇷 Costa Rican">
    🇨🇷 Costa Rican</option>

 

    <option value="🇭🇷 Croatian">
    🇭🇷 Croatian</option>

 

    <option value="🇨🇺 Cuban">
    🇨🇺 Cuban</option>

 

    <option value="🇨🇿 Czech">
    🇨🇿 Czech</option>

 

    <option value="🇩🇰 Danish">
    🇩🇰 Danish</option>

 

    <option value="🇩🇴 Dominican">
    🇩🇴 Dominican</option>

 

    <option value="🇳🇱 Dutch">
    🇳🇱 Dutch</option>

 

    <option value="🇪🇨 Ecuadorian">
    🇪🇨 Ecuadorian</option>

 

    <option value="🇬🇧 English">
    🇬🇧 English</option>

 

    <option value="🇪🇪 Estonian">
    🇪🇪 Estonian</option>

 

    <option value="🇵🇭 Filipino">
    🇵🇭 Filipino</option>

 

    <option value="🇫🇮 Finnish">
    🇫🇮 Finnish</option>

 

    <option value="🇫🇷 French">
    🇫🇷 French</option>

 

    <option value="🇩🇪 German">
    🇩🇪 German</option>

 

    <option value="🇬🇷 Greek">
    🇬🇷 Greek</option>

 

    <option value="🇬🇹 Guatemalan">
    🇬🇹 Guatemalan</option>

 

    <option value="🇭🇹 Haitian">
    🇭🇹 Haitian</option>

 

    <option value="🇭🇳 Honduran">
    🇭🇳 Honduran</option>

 

    <option value="🇭🇺 Hungarian">
    🇭🇺 Hungarian</option>

 

    <option value="🇮🇳 Indian">
    🇮🇳 Indian</option>

 

    <option value="🇮🇩 Indonesian">
    🇮🇩 Indonesian</option>

 

    <option value="🇮🇪 Irish">
    🇮🇪 Irish</option>

 

    <option value="🇮🇹 Italian">
    🇮🇹 Italian</option>

 

    <option value="🇯🇲 Jamaican">
    🇯🇲 Jamaican</option>

 

    <option value="🇯🇵 Japanese">
    🇯🇵 Japanese</option>

 

    <option value="🇰🇪 Kenyan">
    🇰🇪 Kenyan</option>

 

    <option value="🇱🇻 Latvian">
    🇱🇻 Latvian</option>

 

    <option value="🇱🇹 Lithuanian">
    🇱🇹 Lithuanian</option>

 

    <option value="🇲🇾 Malaysian">
    🇲🇾 Malaysian</option>

 

    <option value="🇲🇻 Maldivian">
    🇲🇻 Maldivian</option>

 

    <option value="🇲🇽 Mexican">
    🇲🇽 Mexican</option>

 

    <option value="🇲🇩 Moldovan">
    🇲🇩 Moldovan</option>

 

    <option value="🇲🇦 Moroccan">
    🇲🇦 Moroccan</option>

 

    <option value="🇳🇿 New Zealander">
    🇳🇿 New Zealander</option>

 

    <option value="🇳🇮 Nicaraguan">
    🇳🇮 Nicaraguan</option>

 

    <option value="🇳🇬 Nigerian">
    🇳🇬 Nigerian</option>

 

    <option value="🇳🇴 Norwegian">
    🇳🇴 Norwegian</option>

 

    <option value="🇵🇰 Pakistani">
    🇵🇰 Pakistani</option>

 

    <option value="🇵🇦 Panamanian">
    🇵🇦 Panamanian</option>

 

    <option value="🇵🇾 Paraguayan">
    🇵🇾 Paraguayan</option>

 

    <option value="🇵🇪 Peruvian">
    🇵🇪 Peruvian</option>

 

    <option value="🇵🇱 Polish">
    🇵🇱 Polish</option>

 

    <option value="🇵🇹 Portuguese">
    🇵🇹 Portuguese</option>

 

    <option value="🇷🇴 Romanian">
    🇷🇴 Romanian</option>

 

    <option value="🇷🇺 Russian">
    🇷🇺 Russian</option>

 

    <option value=" 🇸🇳 Senegalese">
    🇸🇳 Senegalese</option>

 

    <option value="🇷🇸 Serbian">
    🇷🇸 Serbian</option>

 

    <option value="🇸🇬 Singaporean">
    🇸🇬 Singaporean</option>

 

    <option value=" 🇿🇦 South African">
    🇿🇦 South African</option>

 

    <option value=" 🇪🇸 Spanish">
    🇪🇸 Spanish</option>

 

    <option value="🇸🇪 Swedish">
    🇸🇪 Swedish</option>

 

    <option value="🇨🇭 Swiss">
    🇨🇭 Swiss</option>

 

    <option value=" 🇹🇭 Thai">
    🇹🇭 Thai</option>

 

    <option value="  🇹🇳 Tunisian">
    🇹🇳 Tunisian</option>

 

    <option value="🇹🇷 Turkish">
    🇹🇷 Turkish</option>

 

    <option value=" 🇺🇦 Ukrainian">
    🇺🇦 Ukrainian</option>

 

    <option value=" 🇺🇾 Uruguayan">
    🇺🇾 Uruguayan</option>

 

    <option value="🇻🇪 Venezuelan">
    🇻🇪 Venezuelan</option>

 

    <option value="🇻🇳 Vietnamese">
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
                <div className="bg-gray-100 mt-8 rounded border border-gray-200 p-6">

                    <h2 className="text-2xl font-bold mb-1">Services</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Tags are only visible on promoted ads.
                    </p>

                    {services.map(service => (
                        <div key={service.id} className="mb-6">

                            {/* main service title */}
                            <h3 className="font-semibold text-lg mb-3 text-gray-700">
                                {service.title}
                            </h3>

                            {/* sub services */}
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
      : "border-gray-300 text-gray-600 bg-white hover:border-gray-400"
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
                <div className="bg-gray-100 mt-8 rounded border border-gray-200 p-6">

                    {/* title */}
                    <div className="flex justify-between mb-4">
                        <h2 className="text-2xl font-bold">Your contacts</h2>
                        <span className="text-sm text-gray-500">* Mandatory fields</span>
                    </div>

                    <p className="font-semibold text-gray-700 mb-4">
                        How would you like to be contacted?
                    </p>

                    {/* contact type buttons */}
                    <div className="grid grid-cols-3 gap-4 mb-6">

                        <button
                            onClick={() => setContactType("phone")}
                            className={`border rounded-lg py-3 font-semibold transition
          ${contactType === "phone"
                                    ? "border-red-500 bg-red-50 text-red-600"
                                    : "border-gray-300 bg-white"}
          `}
                        >
                            Only Phone
                        </button>

                        <button
                            onClick={() => setContactType("both")}
                            className={`border rounded-lg py-3 font-semibold transition
          ${contactType === "both"
                                    ? "border-red-500 bg-red-50 text-red-600"
                                    : "border-gray-300 bg-white"}
          `}
                        >
                            Email and Phone
                        </button>

                        <button
                            onClick={() => setContactType("email")}
                            className={`border rounded-lg py-3 font-semibold transition
          ${contactType === "email"
                                    ? "border-red-500 bg-red-50 text-red-600"
                                    : "border-gray-300 bg-white"}
          `}
                        >
                            Only Email
                        </button>

                    </div>

                    {/* email */}
                    {(contactType === "email" || contactType === "both") && (
                        <div className="mb-6">
                            <label className="font-semibold text-gray-700 block mb-2">
                                Email address
                            </label>

                            <div className="flex items-center border rounded-lg bg-white px-3">
                                <FaEnvelope className="text-gray-400 mr-2" />
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="w-full py-3 outline-none"
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
                            <label className="font-semibold text-gray-700 block mb-2">
                                Telephone Contact
                            </label>

                            <div className="flex items-center border rounded-lg bg-white px-3">
                                <span className="mr-2">🇮🇳</span>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full py-3 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* whatsapp & telegram */}
                    <div className="flex gap-6 mt-4">

                        <button
                            onClick={() => setWhatsapp(!whatsapp)}
                            className={`flex items-center gap-2 border px-4 py-2 rounded-lg transition
            ${whatsapp ? "border-green-500 bg-green-50 text-green-600" : "border-gray-300 bg-white"}
          `}
                        >
                            <FaWhatsapp />
                            WhatsApp
                        </button>

                        <button
                            onClick={() => setTelegram(!telegram)}
                            className={`flex items-center gap-2 border px-4 py-2 rounded-lg transition
            ${telegram ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-300 bg-white"}
          `}
                        >
                            <FaTelegram />
                            Telegram
                        </button>

                    </div>

                </div>
                <div className="flex justify-end mt-8">
                    <Button
                        onClick={handleNext}
                        className=""
                    >
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
            <h3 className="font-semibold text-lg mb-3 text-gray-700">{title}</h3>

            <div className="flex flex-wrap gap-3">
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => setValue(opt)}
                        className={`px-5 py-2 rounded border text-sm font-medium transition
                ${value === opt
                                ? "border-red-500 text-red-600 bg-red-50"
                                : "border-gray-300 text-gray-600 hover:border-gray-400 bg-white"
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