import { useState, useEffect } from "react";
import { CameraIcon, ShieldCheckIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", role: "", phone: "", department: "", location: "", bio: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({ emailNotifications: false, pushNotifications: false, smsNotifications: false, weeklyReports: false });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const savedAvatar = localStorage.getItem("profile_avatar");
        if (savedAvatar) setAvatar(savedAvatar);
        const userData = localStorage.getItem("user_data");
        if (userData) {
          const p = JSON.parse(userData);
          setFormData((prev) => ({ ...prev, name: p.name || "", email: p.email || "", role: p.role || "" }));
        }
        const profileData = localStorage.getItem("extended_profile_data");
        if (profileData) {
          const p = JSON.parse(profileData);
          setFormData((prev) => ({ ...prev, phone: p.phone || "", department: p.department || "", location: p.location || "", bio: p.bio || "" }));
        }
        const notifData = localStorage.getItem("notification_settings");
        if (notifData) setNotificationSettings(JSON.parse(notifData));
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };
  const handlePasswordChange = (e) => { const { name, value } = e.target; setPasswordData((prev) => ({ ...prev, [name]: value })); };
  const handleNotificationChange = (e) => { const { name, checked } = e.target; setNotificationSettings((prev) => ({ ...prev, [name]: checked })); };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setAvatar(result);
        localStorage.setItem("profile_avatar", result);
        window.dispatchEvent(new Event("profile-avatar-updated"));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem("user_data", JSON.stringify({ name: formData.name, email: formData.email, role: formData.role }));
    localStorage.setItem("extended_profile_data", JSON.stringify({ phone: formData.phone, department: formData.department, location: formData.location, bio: formData.bio }));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) { alert("Passwords do not match!"); return; }
    alert("Password updated successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordSection(false);
  };

  const handleSaveNotifications = () => {
    localStorage.setItem("notification_settings", JSON.stringify(notificationSettings));
    alert("Notification settings updated successfully!");
  };

  const inputBase = (disabled) =>
    `w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition ${disabled ? "bg-gray-50 text-gray-500 cursor-default" : "bg-white"}`;

  const Toggle = ({ name, checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
    </label>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600 text-sm">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition shrink-0">
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-base sm:text-xl font-semibold text-gray-900">Profile Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-6 space-y-4 sm:space-y-6">

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary-600 text-white flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xl sm:text-2xl font-bold">
                    {formData.name ? formData.name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U"}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer hover:bg-gray-100 transition">
                <CameraIcon className="h-4 w-4 text-gray-600" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{formData.name || "User Name"}</h2>
              <p className="text-gray-500 text-sm">{formData.role || "Role not specified"}</p>
              <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">Active</span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Verified</span>
              </div>
            </div>
            <div className="shrink-0">
              <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition">
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", name: "name", type: "text", placeholder: "Enter your full name" },
              { label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
              { label: "Phone Number", name: "phone", type: "tel", placeholder: "Enter your phone number" },
              { label: "Department", name: "department", type: "text", placeholder: "Enter your department" },
              { label: "Location", name: "location", type: "text", placeholder: "Enter your location" },
              { label: "Role", name: "role", type: "text", placeholder: "Enter your role" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type={type} name={name} value={formData[name]} onChange={handleInputChange} disabled={!isEditing} placeholder={placeholder} className={inputBase(!isEditing)} />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleInputChange} disabled={!isEditing} rows={3} placeholder="Tell us about yourself" className={`${inputBase(!isEditing)} resize-none`} />
          </div>
          {isEditing && (
            <div className="mt-5 flex justify-end">
              <button onClick={handleSaveProfile} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition">Save Changes</button>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
          <button onClick={() => setShowPasswordSection(!showPasswordSection)} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium transition">
            <ShieldCheckIcon className="h-5 w-5" /> Change Password
          </button>
          {showPasswordSection && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[{ label: "Current Password", name: "currentPassword" }, { label: "New Password", name: "newPassword" }, { label: "Confirm New Password", name: "confirmPassword" }].map(({ label, name }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type="password" name={name} value={passwordData[name]} onChange={handlePasswordChange} placeholder="••••••••" className={inputBase(false)} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={handlePasswordUpdate} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition">Update Password</button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
          <div className="space-y-4 divide-y divide-gray-100">
            {[
              { name: "emailNotifications", title: "Email Notifications", desc: "Receive notifications via email" },
              { name: "pushNotifications", title: "Push Notifications", desc: "Receive push notifications in browser" },
              { name: "smsNotifications", title: "SMS Notifications", desc: "Receive notifications via SMS" },
              { name: "weeklyReports", title: "Weekly Reports", desc: "Receive weekly summary reports" },
            ].map(({ name, title, desc }, i) => (
              <div key={name} className={`flex items-center justify-between gap-4 ${i > 0 ? "pt-4" : ""}`}>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{title}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{desc}</p>
                </div>
                <Toggle name={name} checked={notificationSettings[name]} onChange={handleNotificationChange} />
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <button onClick={handleSaveNotifications} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition">Save Notification Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
