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

                    // Helper: only set CSS variable if value exists
                    const set = (variable, value) => {
                        if (value && String(value).trim() !== "") {
                            root.style.setProperty(variable, value)
                        }
                    }

                    // =========================
                    // MAIN THEME COLORS
                    // =========================
                    set("--primary-color", data.primary_color)
                    set("--second-color", data.second_color)
                    set("--website-background", data.website_background)
                    set("--navbar-color", data.navbar_color)
                    set("--footer-color", data.footer_color)
                    set("--content-border-color", data.content_border_color)
                    set("--text-color", data.text_color)
                    set("--webiste-text", data.website_text || data.webiste_text)

                    // =========================
                    // BUTTON COLORS
                    // =========================
                    set("--button-color", data.button_color)
                    set("--button-text", data.button_text)
                    set("--button-hover-color", data.button_hover_color)
                    set("--button-hover-text", data.button_hover_text)

                    // =========================
                    // NAVBAR BUTTON / ICON COLORS
                    // =========================
                    set("--navbar-button-color", data.navbar_button_color)
                    set("--navbar-icon-color", data.navbar_icon_color)
                    set("--navbar-button-text-color", data.navbar_button_text_color)
                    set("--navbar-button-text-color-hover", data.navbar_button_text_color_hover)
                    set("--navbar-button-color-hover", data.navbar_button_color_hover)

                    // =========================
                    // BALANCE BOX COLORS
                    // =========================
                    set("--balance-box-text", data.balance_box_text)
                    set("--balance-box-border", data.balance_box_border)

                    // =========================
                    // BREADCRUMB COLORS
                    // =========================
                    set("--breadcrum-color", data.breadcrum_color)
                    set("--breadcrum-hover", data.breadcrum_hover)
                    set("--breadcrum-active", data.breadcrum_active)

                    // =========================
                    // ICONS
                    // =========================
                    set("--icons-color", data.icons_color)

                    // =========================
                    // LISTING BOX COLORS
                    // =========================
                    set("--listing-box-background", data.listing_box_background || data.listing_box_background_color)
                    set("--listing-box-heading", data.listing_box_heading)
                    set("--listing-box-highlight", data.listing_box_highlight || data.listing_box_highlight_color)
                    set("--listing-box-superTop-color", data.listing_box_superTop_color || data.listing_box_super_color)
                    set("--listing-box-superTop-text-color", data.listing_box_superTop_text_color)
                    set("--listing-box-border", data.listing_box_border)

                    // =========================
                    // PAGINATION COLORS
                    // =========================
                    set("--pageig-border", data.pageig_border)
                    set("--pageig-active-color", data.pageig_active_color)
                    set("--pageig-active-color-text", data.pageig_active_color_text)
                    set("--pageig-color", data.pageig_color)
                    set("--pageig-text", data.pageig_text)

                    // =========================
                    // AREA / LOCATION COLORS
                    // =========================
                    set("--area-bg", data.area_bg)
                    set("--area-text", data.area_text)
                    set("--area-link", data.area_link)

                    // =========================
                    // APPLY BODY COLORS
                    // =========================
                    if (data.website_background?.trim()) {
                        document.body.style.backgroundColor = data.website_background
                    }

                    if (data.text_color?.trim()) {
                        document.body.style.color = data.text_color
                    } else if ((data.website_text || data.webiste_text)?.trim()) {
                        document.body.style.color = data.website_text || data.webiste_text
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