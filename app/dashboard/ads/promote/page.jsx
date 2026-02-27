'use client'
import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";
import Promote from "../../post-ad/Promote";


export default function NewPromote(){
    const {user} = useContext(AuthContext)
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
    return(
        <>
         <Promote 
                  form={form}
                  prevStep={()=> setStep(1)}
                  images={images}
                />
        </>
    )
}