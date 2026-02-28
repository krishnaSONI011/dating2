'use client'
import { useState, useContext } from "react";
import Adinformation from "./Adinformaion";
import Promote from "./Promote";
import { AuthContext } from "@/context/AuthContext";

export default function PostAds(){

  const { user } = useContext(AuthContext);

  const [step, setStep] = useState(1);

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
    is_whatsapp: false,
    is_telegram: false,
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

        />
      )}

      {step === 2 && (
        <Promote 
          form={form}
          prevStep={()=> setStep(1)}
          images={images}
        />
      )}
    </>
  )
}