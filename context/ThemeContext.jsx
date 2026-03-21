'use client'

import api from "@/lib/api"
import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [themeData, setThemeData] = useState(null)

    useEffect(() => {
        async function getThemeContext() {
            try {
                const formData = new FormData()
                formData.append('web_id', 1)
                const res = await api.post('/Wb/websetting_detail', formData)

                if (res.data.status == 0) {
                    const data = res.data.data
                    setThemeData(data)

                    const root = document.documentElement

                    
                    const set = (variable, value) => {
                        if (value && value.trim() !== "") {
                            root.style.setProperty(variable, value)
                        }
                    }

                    set("--primary-color",data.primary_color)
                    set("--second-color",data.second_color)
                    set("--website-background",data.website_background)
                    set("--navbar-color",data.navbar_color)
                    set("--content-border-color",data.content_border_color)
                    set("--text-color",data.text_color)
                    set("--webiste-text",data.webiste_text)  

                    set("--listing-box-background",data.listing_box_background_color)
                    set("--listing-box-highlight",data.listing_box_super_color)
                    set("--listing-box-superTop-color",data.listing_box_highlight_color)

                  
                    if (data.website_background?.trim()) {
                        document.body.style.backgroundColor = data.website_background
                    }
                    if (data.text_color?.trim()) {
                        document.body.style.color = data.text_color
                    } else if (data.webiste_text?.trim()) {
                        document.body.style.color = data.webiste_text
                    }

                } else {
                    toast.error(res.data.message)
                }
            } catch (e) {
                console.log(e)
            }
        }
        getThemeContext()
    }, [])

    return (
        <ThemeContext.Provider value={{ themeData }}>
            {children}
        </ThemeContext.Provider>
    )
}