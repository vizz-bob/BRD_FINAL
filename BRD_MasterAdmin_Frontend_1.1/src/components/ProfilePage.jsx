import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiMail, FiPhone, FiCamera, FiLock } from "react-icons/fi";
import MainLayout from "../layout/MainLayout";
import axiosInstance from "../utils/axiosInstance";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [twoFA, setTwoFA] = useState({ qr: "", enabled: false });
  const [loginActivity, setLoginActivity] = useState([]);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const fetchUser = async () => {
    try {
      const { data } = await axiosInstance.get("/users/me/");
      setUser(data);
      setTwoFA({ qr: "", enabled: data.is_2fa_enabled });
      setLoading(false);

      // ✅ ensure header always has data
    localStorage.setItem("currentUser", JSON.stringify(data));
    window.dispatchEvent(new Event("profile-updated"));
    } catch (err) {
      console.error(err);
      setMsg("Failed to fetch user data");
      setLoading(false);
    }
  };

  const fetchLoginActivity = async () => {
    setLoadingActivity(true);
    try {
      const { data } = await axiosInstance.get("/users/login-activity/");
      setLoginActivity(
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      );
    } catch (err) {
      console.error(err);
      setMsg("Failed to fetch login activity");
    } finally {
      setLoadingActivity(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchLoginActivity();
  }, []);

  useEffect(() => {
    if (!msg) return;
    const timer = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(timer);
  }, [msg]);

  if (loading)
    return (
      <MainLayout>
        <p className="p-6 text-gray-700">Loading profile...</p>
      </MainLayout>
    );

  if (!user)
    return (
      <MainLayout>
        <p className="p-6 text-red-500">No user data found.</p>
      </MainLayout>
    );

  const handleProfileChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUser({ ...user, avatar: file });
    setAvatarPreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    const formData = new FormData();
    formData.append("first_name", user.first_name);
    formData.append("last_name", user.last_name);
    formData.append("email", user.email);
    formData.append("phone", user.phone);
    if (user.avatar) formData.append("avatar", user.avatar);

    
    try {
      const { data } = await axiosInstance.put("/users/me/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(data);
      setAvatarPreview(null);
      // after successful profile update
      localStorage.setItem("currentUser", JSON.stringify(data));
  
      // trigger header refresh in same tab
      window.dispatchEvent(new Event("profile-updated"));
      setMsg("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMsg("Failed to update profile");
    }
  };

  const handlePasswordSubmit = async () => {
    const { old_password, new_password, confirm_password } = passwordData;
    if (!old_password || !new_password || !confirm_password) {
      setMsg("Please fill all password fields");
      return;
    }
    if (new_password !== confirm_password) {
      setMsg("New passwords do not match");
      return;
    }

    try {
      await axiosInstance.post("/users/change-password/", {
        old_password,
        new_password,
      });
      setMsg("Password updated successfully!");
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setMsg(err.response?.data?.old_password || "Password update failed");
    }
  };

  const handleEnable2FA = async () => {
    try {
      const { data } = await axiosInstance.get("/users/2fa/setup/");
      setTwoFA({ ...twoFA, qr: data.qr_code });
      setShow2FAModal(true);
    } catch (err) {
      console.error(err);
      setMsg("Failed to setup 2FA");
    }
  };

  const handleVerify2FA = async () => {
    try {
      await axiosInstance.post("/users/2fa/verify/", { code: twoFACode });
      setTwoFA({ qr: "", enabled: true });
      setTwoFACode("");
      setShow2FAModal(false);
      setMsg("2FA enabled successfully!");
    } catch (err) {
      setMsg("Invalid 2FA code");
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm("Disable Two-Factor Authentication?")) return;
    try {
      await axiosInstance.post("/users/2fa/disable/");
      setTwoFA({ qr: "", enabled: false });
      setMsg("2FA disabled successfully!");
    } catch {
      setMsg("Failed to disable 2FA");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/users/users/${user.id}/`);
      setMsg("Account deleted!");
      setTimeout(() => (window.location.href = "/login"), 800);
    } catch {
      setMsg("Failed to delete account");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all"
          >
            <FiArrowLeft className="text-gray-700 text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
            <p className="text-gray-500 text-sm">
              Manage your personal details & account preferences
            </p>
          </div>
        </div>

        {msg && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            {msg}
          </div>
        )}

        {/* Profile Photo */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 transition-all hover:shadow-xl">
          <div className="relative group">
            <img
              src={
                avatarPreview ||
                user.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-28 h-28 rounded-full object-cover shadow-md"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
              <FiCamera className="text-white text-2xl" />
              <input
                type="file"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-500 text-sm">{user.role}</p>
          </div>
        </div>

        {/* PERSONAL INFO */}
        <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="first_name"
              value={user.first_name}
              onChange={handleProfileChange}
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="last_name"
              value={user.last_name}
              onChange={handleProfileChange}
              placeholder="Last Name"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="flex items-center px-4 rounded-xl bg-gray-100">
              <FiMail className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleProfileChange}
                className="w-full py-3 bg-transparent outline-none"
              />
            </div>

            <div className="flex items-center px-4 rounded-xl bg-gray-100">
              <FiPhone className="text-gray-500 mr-2" />
              <input
                type="number"
                name="phone"
                value={user.phone}
                onChange={handleProfileChange}
                className="w-full py-3 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* PROFILE SAVE BUTTON — CORRECT UX */}
          <div className="flex justify-end mt-6">
            <button
              onClick={saveProfile}
              className="px-6 py-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 text-white shadow hover:opacity-90 transition"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Change Password
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center rounded-xl px-3 bg-gray-50 shadow-inner">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Old Password"
                name="old_password"
                value={passwordData.old_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    old_password: e.target.value,
                  })
                }
                className="w-full py-2 outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center rounded-xl px-3 bg-gray-50 shadow-inner">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="New Password"
                name="new_password"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password: e.target.value,
                  })
                }
                className="w-full py-2 outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center rounded-xl px-3 bg-gray-50 shadow-inner">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirm_password: e.target.value,
                  })
                }
                className="w-full py-2 outline-none bg-transparent"
              />
            </div>
          </div>
          <button
            onClick={handlePasswordSubmit}
            className="mt-4 px-6 py-2 bg-linear-to-r from-green-500 to-green-400 text-white rounded-xl hover:from-green-600 hover:to-green-500 transition-all shadow-md"
          >
            Update Password
          </button>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 transition-all hover:shadow-xl">
          <div className="flex justify-between items-center">
            <span className="font-medium">Two-Factor Authentication</span>
            {!twoFA.enabled ? (
              <button
                onClick={handleEnable2FA}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
              >
                Enable
              </button>
            ) : (
              <button
                onClick={handleDisable2FA}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
              >
                Disable
              </button>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Login Activity</span>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all"
            >
              View
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Delete Account</span>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
            >
              Delete
            </button>
          </div>
        </div>

        {/* 2FA Modal */}
        {twoFA.qr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-[380px] p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Enable Two-Factor Authentication
              </h3>

              <p className="text-sm text-gray-500">
                Scan the QR code using Google Authenticator or Authy.
              </p>

              <img
                src={twoFA.qr}
                alt="QR Code"
                className="mx-auto w-40 h-40 rounded-lg"
              />

              <input
                type="text"
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setTwoFA({ ...twoFA, code: e.target.value })}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setTwoFA({ qr: "", enabled: false })}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleVerify2FA(twoFA.code)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Activity Modal */}
        {/* Login Activity Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-[420px] max-h-[75vh] flex flex-col">
              {/* HEADER */}
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  Login Activity
                </h3>
                <p className="text-sm text-gray-500">
                  Recent attempts to access your account
                </p>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {loadingActivity ? (
                  <p className="text-center text-gray-400 text-sm">
                    Loading activity...
                  </p>
                ) : loginActivity.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm">
                    No login activity found.
                  </p>
                ) : (
                  loginActivity.map((log, i) => {
                    const success = log.successful;

                    return (
                      <div
                        key={i}
                        className={`rounded-2xl p-4 shadow-sm ${
                          success ? "bg-green-50" : "bg-red-50"
                        }`}
                      >
                        {/* TITLE */}
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm font-semibold ${
                              success ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {success
                              ? "Successful login"
                              : "Failed login attempt"}
                          </span>

                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>

                        {/* DETAILS */}
                        <div className="mt-2 text-sm text-gray-700 space-y-1">
                          <p>
                            <span className="font-medium">Device:</span>{" "}
                            {log.user_agent
                              ? log.user_agent.split("(")[0]
                              : "Unknown device"}
                          </p>

                          <p>
                            <span className="font-medium">Location:</span>{" "}
                            {log.ip_address
                              ? "Approximate location detected"
                              : "Unknown"}
                          </p>
                        </div>

                        {!success && (
                          <div className="mt-3 text-xs text-red-600">
                            ⚠ If this wasn’t you, change your password
                            immediately.
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* FOOTER */}
              <div className="p-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
