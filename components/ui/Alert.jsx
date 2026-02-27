"use client"

import { useState } from "react";
import {
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function Alert(){

  const [isExpanded, setIsExpanded] = useState(false);

  return(
    <div className="rounded-xl border border-red-500 bg-[#ef4444]/30 p-4 sm:p-5 mb-6 shadow-sm">

      {/* top row */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">

        <div className="flex items-start gap-3 flex-1">

          {/* icon */}
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
            <FaExclamationTriangle className="text-white text-lg"/>
          </div>

          {/* text */}
          <div>
            <h3 className="text-white font-bold text-lg uppercase">
              Scam Alert: Never Pay Advance
            </h3>

            <p className="text-white text-sm mt-1">
              Always meet first. Pay only after face-to-face meeting.
            </p>
          </div>

        </div>

        {/* toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white text-sm font-semibold transition"
        >
          Safety Tips
          {isExpanded ? <FaChevronUp/> : <FaChevronDown/>}
        </button>

      </div>

      {/* expanded section */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-red-200">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* wrong */}
            <div className="bg-red-100 border border-red-200 rounded-lg p-4 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm">✕</div>
              <p className="text-sm text-gray-700">
                <b>Never</b> pay advance booking amount.
              </p>
            </div>

            <div className="bg-red-100 border border-red-200 rounded-lg p-4 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm">✕</div>
              <p className="text-sm text-gray-700">
                <b>Never</b> send money via UPI/online.
              </p>
            </div>

            {/* correct */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">✓</div>
              <p className="text-sm text-gray-700">
                Pay only after meeting in person.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">✓</div>
              <p className="text-sm text-gray-700">
                Verify photos match the person.
              </p>
            </div>

          </div>

          {/* footer */}
          <div className="mt-6 pt-4 border-t border-dashed border-gray-200 text-center">
            <p className="text-sm text-white">
              Got scammed? Report at{" "}
              <a href="mailto:help@affairescorts.com" className="text-red-500 font-semibold">
                help@affairescorts.com
              </a>
            </p>
          </div>

        </div>
      )}

    </div>
  )
}