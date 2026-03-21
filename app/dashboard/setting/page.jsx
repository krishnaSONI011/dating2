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

  //  Mobile state
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
      //  Strip + from country code then concat
      formData.append("mobile", countryCode.replace('+', '') + mobile.trim())

      const res = await api.post("/Wb/update_mobile", formData)

      if (res.data.status === 0) {
        toast.success(res.data.message || "Mobile updated successfully")

        // ✅ Update localStorage and AuthContext
        const updatedUser = {
          ...user,
          mobile: countryCode.replace('+', '') + mobile.trim()
        }
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
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ===== PROFILE INFO ===== */}
        <div className="bg-slate-900 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          {user ? (
            <div className="space-y-3 text-white">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.mobile}</p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>

        {/* ===== CHANGE MOBILE ===== */}
        <div className="bg-slate-900 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Change Mobile</h2>

          <div className="space-y-4">
            <div className="flex items-center border border-gray-700 rounded-lg bg-slate-900 overflow-hidden">

              {/*  Country code — now controlled */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-slate-900 text-white px-3 py-3 outline-none border-r border-gray-700 appearance-none"
              >
                {countryCodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.code} ({country.name})
                  </option>
                ))}
              </select>

              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                type="text"
                placeholder="Enter Mobile Number"
                className="w-full bg-slate-900 text-white py-3 px-3 outline-none"
              />
            </div>

            {/*  Shows what number will be saved */}
            {mobile && (
              <p className="text-xs text-gray-400">
                Will save as: <span className="text-orange-400">{countryCode.replace('+', '')}{mobile}</span>
              </p>
            )}

            <Button loading={mobileLoading} onClick={updateMobile}>
              Update Mobile
            </Button>
          </div>
        </div>

        {/* ===== CHANGE PASSWORD ===== */}
        <div className="bg-slate-900 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>

          <div className="space-y-4">

            <div>
              <label className="text-sm text-white font-medium">Current Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                <input
                  type={showCurrent ? "text" : "password"}
                  className="w-full outline-none bg-transparent"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <span onClick={() => setShowCurrent(!showCurrent)} className="cursor-pointer text-gray-500">
                  {showCurrent ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">New Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                <input
                  type={showNew ? "text" : "password"}
                  className="w-full outline-none bg-transparent"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span onClick={() => setShowNew(!showNew)} className="cursor-pointer text-gray-500">
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full outline-none bg-transparent"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span onClick={() => setShowConfirm(!showConfirm)} className="cursor-pointer text-gray-500">
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <Button loading={loading} onClick={changePassword}>
              Update Password
            </Button>

          </div>
        </div>

      </div>
    </div>
  )
}