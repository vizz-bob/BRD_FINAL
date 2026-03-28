import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150");

  useEffect(() => {
    if (user) {
      setUsername(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name: username, email };
    login(updatedUser);
    alert("Profile updated successfully!");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setShowPassword(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="p-3 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Edit Profile
          </h1>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="w-full xs:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-sm sm:text-base"
          >
            {showPassword ? "Cancel" : "Change Password"}
          </button>
        </div>

        {showPassword ? (
          <div className="space-y-4 max-w-lg">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition text-sm sm:text-base"
              >
                Update Password
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-md"
                />
                <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 sm:p-2 cursor-pointer">
                  <input type="file" className="hidden" onChange={handleImageChange} />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15.232 5.232l3.536 3.536M6.5 21.036H3v-3.5L14.732 5.232a2.5 2.5 0 113.536 3.536z" />
                  </svg>
                </label>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{username}</h2>
                <p className="text-sm sm:text-base text-gray-600 break-all">{email}</p>
              </div>
            </div>

            {/* Organization Details */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg shadow-inner">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                Organization Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">Organization Name</p>
                  <p className="text-sm sm:text-base text-gray-700">Fintech Solutions Inc.</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">Organization Address</p>
                  <p className="text-sm sm:text-base text-gray-700">
                    123 Finance Street, Suite 456, Money City, 78910
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">Contact Number</p>
                  <p className="text-sm sm:text-base text-gray-700">+1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">Email</p>
                  <p className="text-sm sm:text-base text-gray-700 break-all">
                    contact@fintechsolutions.com
                  </p>
                </div>
              </div>
            </div>

            {/* User Details Form */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg shadow-inner">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                User Details
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label
                    className="block text-xs sm:text-sm text-gray-500 font-medium mb-1"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs sm:text-sm text-gray-500 font-medium mb-1"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">Role</p>
                  <p className="text-sm sm:text-base text-gray-700">Valuation Supervisor</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">Department</p>
                  <p className="text-sm sm:text-base text-gray-700">IT</p>
                </div>
                <div className="sm:col-span-2 flex justify-start">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition text-sm sm:text-base"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;