'use client'

import { FaExclamationTriangle } from "react-icons/fa";

export default function AgeAlert() {
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="w-[95%] md:w-[85%] bg-yellow-100 border border-yellow-300 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
        
        {/* icon */}
        <div className="text-yellow-600 text-2xl mt-1">
          <FaExclamationTriangle />
        </div>

        {/* text */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Attention: Profile verification!
          </h2>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Please verify your Profile to access the features of your private area.
          </p>
        </div>

      </div>
    </div>
  );
}
