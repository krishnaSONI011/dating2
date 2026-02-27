'use client'


import api from "@/lib/api"
import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

export const ThemeContext = createContext()


export const ThemeProvider = ({children}) => {
    const [themeData , setThemeData] = useState([])
    useEffect(()=>{
        async function  getThemeContext(){
            try{
                const formData = new FormData()
                formData.append('web_id' , 1)
                const res = await api.post('/Wb/websetting_detail' , formData)
                if(res.data.status == 0){
                    setThemeData(res.data.data)
                }else{
                    toast.error(res.data.message)
                }
            }catch(e){
                console.log(e)
            }
        }
        getThemeContext()
    },[])
    return(
        <ThemeContext.Provider value={{
            themeData
        }}>
            {children}
        </ThemeContext.Provider>
    )
}