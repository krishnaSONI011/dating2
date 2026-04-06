'use client'

import api from "@/lib/api";
import { useEffect, useState } from "react";
import { FaWhatsapp, FaTelegramPlane, FaHeadset, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";

export default function HelpSupport() {

  const [contact, setContact] = useState(null)

  useEffect(() => {

    async function getDetails() {
      try {

        const formData = new FormData()
        formData.append('contect_id', 1)

        const res = await api.post('/Wb/contect_detail', formData)

        if (res.data.status === 0) {
          setContact(res.data.data)
        } else {
          toast.error(res.data.message)
        }

      } catch (e) {
        console.log(e)
      }
    }

    getDetails()

  }, []) // ✅ important

  return (
    <div className="w-full bg-(--website-background) p-6">
      <div className="max-w-5xl mx-auto  border border-(--content-border-color) rounded-2xl p-6 shadow-sm">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <FaHeadset className=" text-xl" />
          <h2 className="text-xl font-semibold ">Need help?</h2>
        </div>

        <p className=" mb-6">
          Contact us Monday to Friday, 9:00 am to 4:00 pm.
        </p>

        {/* Contact Options */}
        <div className="flex flex-wrap gap-8">

          {/* WhatsApp */}
          {contact?.is_whatsapp === "1" && (
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2  font-medium hover:scale-105 transition"
            >
              <FaWhatsapp className="text-xl" />
              WhatsApp
            </a>
          )}

          {/* Telegram */}
          {contact?.is_telegram === "1" && (
            <a
              href={`https://t.me/${contact.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium hover:scale-105 transition"
            >
              <FaTelegramPlane className="text-xl" />
              Telegram
            </a>
          )}

          {/* Email */}
          {contact?.is_email === "1" && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2  font-medium hover:scale-105 transition"
            >
              <FaEnvelope className="text-xl" />
              Email
            </a>
          )}

        </div>

      </div>
    </div>
  );
}