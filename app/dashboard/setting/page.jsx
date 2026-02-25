'use client'

import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Setting() {

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  //  Change Password Function
  async function changePassword() {

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password not match");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("old_password", currentPassword);
      formData.append("new_password", newPassword);

      const res = await api.post("/Wb/change_password", formData);

      if (res.data.status === 0) {
        toast.success(res.data.message);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.data.message);
      }

    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-4xl mx-auto space-y-8">

        {/* 👤 Profile Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>

          {user ? (
            <div className="space-y-3 text-gray-700">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>

        {/* 🔐 Change Password Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>

          <div className="space-y-4">

            {/* Current Password */}
            <div>
              <label className="text-sm font-medium">Current Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                <input
                  type={showCurrent ? "text" : "password"}
                  className="w-full outline-none"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="cursor-pointer text-gray-500"
                >
                  {showCurrent ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm font-medium">New Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                <input
                  type={showNew ? "text" : "password"}
                  className="w-full outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowNew(!showNew)}
                  className="cursor-pointer text-gray-500"
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="cursor-pointer text-gray-500"
                >
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
  );
}