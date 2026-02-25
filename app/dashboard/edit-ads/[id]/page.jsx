'use client'
import { useState, useContext, useEffect } from "react";


import { AuthContext } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Adinformation from "../../post-ad/Adinformaion";
import Promote from "../../post-ad/Promote";

export default function PostAds(){

  const { user } = useContext(AuthContext);
  const params = useParams();   // edit id
  const editId = params?.id;

  const [step, setStep] = useState(1);
  const [loading,setLoading] = useState(false)

  const [form, setForm] = useState({
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
    city: "",
    local_area: "",
    postal_code: "",
    address: "",
    title: "",
    description: "",
    phone:""
  });

  const [images, setImages] = useState([])
  const [services , setServices] = useState([])

  const handleChange = (e)=>{
    setForm({...form, [e.target.name]: e.target.value})
  }

  // 🔥 EDIT MODE FETCH
  useEffect(()=>{
    if(!editId) return;

    async function fetchAd(){
      try{

        setLoading(true)
        const formData = new FormData()
        formData.append('ads_id' , editId)
        const res = await api.post(`/Wb/ads_edit` , formData)

        const ad = res.data.ad

        setForm({
          ...form,
          ...ad
        })

        setImages(ad.images || [])
        setServices(ad.services || [])

      }catch(err){
        console.log(err)
      }finally{
        setLoading(false)
      }
    }

    fetchAd()
  },[editId])

  if(loading){
    return <div className="p-10 text-center">Loading ad...</div>
  }

  return(
    <>
      {step === 1 && (
        <Adinformation 
          form={form}
          setForm={setForm}
          handleChange={handleChange}
          nextStep={()=> setStep(2)}
          images={images}
          setImages={setImages}
          setServices={setServices}
          services={services}
          editId={editId}   // 🔥 pass edit id
        />
      )}

      {step === 2 && (
        <Promote
          form={form}
          prevStep={()=> setStep(1)}
          images={images}
          editId={editId}   // 🔥 pass edit id
        />
      )}
    </>
  )
}