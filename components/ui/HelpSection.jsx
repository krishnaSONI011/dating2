'use client'

import { FaWhatsapp, FaTelegramPlane, FaHeadset, FaEnvelope } from "react-icons/fa";

export default function HelpSupport() {
  return (
    <div className="w-full bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <FaHeadset className="text-gray-600 text-xl" />
          <h2 className="text-xl font-semibold text-gray-800">Need help?</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Contact us through our service channels, from{" "}
          <span className="font-semibold">Monday to Friday</span>, from{" "}
          <span className="font-semibold">9:00 am to 4:00 pm</span>.
        </p>

        {/* Contact Options */}
        <div className="flex flex-wrap gap-8">

          {/* WhatsApp */}
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            className="flex items-center gap-2 text-red-500 font-medium hover:scale-105 transition"
          >
            <FaWhatsapp className="text-xl" />
            WhatsApp
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/yourusername"
            target="_blank"
            className="flex items-center gap-2 text-red-500 font-medium hover:scale-105 transition"
          >
            <FaTelegramPlane className="text-xl" />
            Telegram
          </a>

          {/* Email */}
          <a
            href="mailto:support@yourdomain.com"
            className="flex items-center gap-2 text-red-500 font-medium hover:scale-105 transition"
          >
            <FaEnvelope className="text-xl" />
            Email
          </a>

        </div>
      </div>
    </div>
  );
}