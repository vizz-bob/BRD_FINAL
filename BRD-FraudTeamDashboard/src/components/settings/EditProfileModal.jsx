import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import toast from "react-hot-toast";
import { settingsApi } from "../../api/settingsApi";

export default function EditProfileModal({ open, onClose, profile, onSaved }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fullName =
      profile?.full_name ||
      [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");
    setName(fullName || "");
    setEmail(profile?.email || "");
    setPhone(profile?.phone || "");
  }, [open, profile]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const [firstName = "", ...rest] = name.trim().split(/\s+/);
      const lastName = rest.join(" ");

      await settingsApi.updateProfile({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
      });

      await onSaved?.();
      toast.success("Profile updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 sm:mb-6">Edit Profile</h2>

      <div className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3 sm:pt-4">
          <button
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}