'use client'

import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { countryCodes } from "@/data/country_code";

export default function Setting() {

  const { user, login, token } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [mobileLoading, setMobileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [countryCode, setCountryCode] = useState("+91")
  const [mobile, setMobile] = useState('')

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ================= UPDATE MOBILE ================= */
  async function updateMobile() {
    if (!mobile.trim()) {
      toast.error("Please enter mobile number")
      return
    }
    try {
      setMobileLoading(true)
      const formData = new FormData()
      formData.append("mobile", countryCode.replace('+', '') + mobile.trim())
      const res = await api.post("/Wb/update_mobile", formData)

      if (res.data.status === 0) {
        toast.success(res.data.message || "Mobile updated successfully")
        const updatedUser = { ...user, mobile: countryCode.replace('+', '') + mobile.trim() }
        login(updatedUser, token)
        setMobile('')
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      console.log(e)
      toast.error("Something went wrong")
    } finally {
      setMobileLoading(false)
    }
  }

  /* ================= CHANGE PASSWORD ================= */
  async function changePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match")
      return
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("old_password", currentPassword)
      formData.append("new_password", newPassword)
      const res = await api.post("/Wb/change_password", formData)

      if (res.data.status === 0) {
        toast.success(res.data.message)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      console.log(e)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ===== PROFILE INFO ===== */}
        <div className=" rounded-2xl shadow p-5 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Profile Information</h2>
          {user ? (
            <div className="space-y-3 ">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="font-semibold text-gray-400 sm:w-20">Name</span>
                <span>{user.name}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="font-semibold text-gray-400 sm:w-20">Email</span>
                <span className="break-all">{user.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="font-semibold text-gray-400 sm:w-20">Phone</span>
                <span>{user.mobile}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Loading profile...</p>
          )}
        </div>

        {/* ===== CHANGE MOBILE ===== */}
        <div className="rounded-2xl shadow p-5 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Change Mobile</h2>

          <div className="space-y-4">

            {/* ✅ Fixed: flex-col on mobile, flex-row on sm+ */}
            <div className="flex flex-col sm:flex-row gap-3">

              {/* ✅ Country code — fixed width, doesn't shrink */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className=" px-3 py-3 outline-none border border-(--primary-color) rounded-lg appearance-none w-full sm:w-48 flex-shrink-0"
              >
                {countryCodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.code} ({country.name})
                  </option>
                ))}
              </select>

              {/* ✅ Phone input — takes remaining space */}
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                type="text"
                placeholder="Enter Mobile Number"
                className="flex-1 w-full  border border-(--primary-color)  py-3 px-4 rounded-lg outline-none focus:border-orange-500"
              />

            </div>

            {/* Preview */}
            {mobile && (
              <p className="text-xs text-gray-400">
               
              </p>
            )}

            <Button loading={mobileLoading} onClick={updateMobile}>
              Update Mobile
            </Button>
          </div>
        </div>

        {/* ===== CHANGE PASSWORD ===== */}
        <div className=" rounded-2xl shadow p-5 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Change Password</h2>

          <div className="space-y-4">

            {[
              {
                label: "Current Password",
                value: currentPassword,
                setter: setCurrentPassword,
                show: showCurrent,
                toggle: () => setShowCurrent(!showCurrent),
              },
              {
                label: "New Password",
                value: newPassword,
                setter: setNewPassword,
                show: showNew,
                toggle: () => setShowNew(!showNew),
              },
              {
                label: "Confirm Password",
                value: confirmPassword,
                setter: setConfirmPassword,
                show: showConfirm,
                toggle: () => setShowConfirm(!showConfirm),
              },
            ].map(({ label, value, setter, show, toggle }) => (
              <div key={label}>
                <label className="text-sm font-medium text-gray-300">{label}</label>
                <div className="flex items-center border border-gray-700 rounded-lg px-3 py-2 mt-1  focus-within:border-orange-500">
                  <input
                    type={show ? "text" : "password"}
                    className="w-full outline-none bg-transparent "
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={label}
                  />
                  <span onClick={toggle} className="cursor-pointer text-gray-400 hover:text-white ml-2 flex-shrink-0">
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
            ))}

            <Button loading={loading} onClick={changePassword}>
              Update Password
            </Button>

          </div>
        </div>

      </div>
    </div>
  )
}