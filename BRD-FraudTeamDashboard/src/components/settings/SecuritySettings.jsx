import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { settingsApi } from "../../api/settingsApi";

export default function SecuritySettings() {
  const [email, setEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const loadCurrentProfile = async () => {
      try {
        const profile = await settingsApi.getProfile();
        const profileEmail = profile?.email || "";
        setEmail(profileEmail);
        setCurrentEmail(profileEmail);
      } catch {
        // Keep form usable even if profile fetch fails
      }
    };

    loadCurrentProfile();
  }, []);

  const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data?.detail) {
      return data.detail;
    }

    if (data?.email) {
      return Array.isArray(data.email) ? data.email[0] : data.email;
    }

    if (data?.non_field_errors?.[0]) {
      return data.non_field_errors[0];
    }

    return fallback;
  };

  const handleUpdateEmail = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Please enter an email");
      return;
    }

    if (normalizedEmail === (currentEmail || "").trim().toLowerCase()) {
      toast("Email is already up to date");
      return;
    }

    try {
      setUpdatingEmail(true);
      await settingsApi.updateEmail(normalizedEmail);
      setCurrentEmail(normalizedEmail);
      setEmail(normalizedEmail);
      toast.success("Email updated");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update email"));
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!pw1 || !pw2) {
      toast.error("Please fill both password fields");
      return;
    }
    if (pw1 !== pw2) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setUpdatingPassword(true);
      await settingsApi.updatePassword(pw1, pw2);
      toast.success("Password updated");
      setPw1("");
      setPw2("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update password"));
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 sm:p-6 space-y-6 sm:space-y-8">
      <h2 className="text-base sm:text-lg font-semibold">Security Settings</h2>

      {/* Update Email */}
      <div className="space-y-3">
        <p className="font-medium text-sm">Change Email</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:w-1/2">
          <input
            type="email"
            className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition p-2 flex-1 text-sm"
            placeholder="Enter new email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleUpdateEmail}
            disabled={updatingEmail}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm"
          >
            {updatingEmail ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      {/* Update Password */}
      <div className="space-y-3">
        <p className="font-medium text-sm">Change Password</p>
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
          <input
            type="password"
            className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition p-2 text-sm"
            placeholder="New password"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
          />
          <input
            type="password"
            className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition p-2 text-sm"
            placeholder="Confirm password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />
          <button
            onClick={handleUpdatePassword}
            disabled={updatingPassword}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm"
          >
            {updatingPassword ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}