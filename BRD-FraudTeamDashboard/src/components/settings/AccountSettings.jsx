import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EditProfileModal from "./EditProfileModal";
import { settingsApi } from "../../api/settingsApi";

export default function AccountSettings() {
  const [editOpen, setEditOpen] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const loadProfile = async () => {
    try {
      const data = await settingsApi.getProfile();
      setProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        full_name: data.full_name || "",
      });
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const fullName =
    profile.full_name ||
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    "-";

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
      <h2 className="text-base sm:text-lg font-semibold mb-4">Account</h2>

      <div className="flex flex-col gap-1.5 mb-4 text-sm">
        <p><span className="font-medium">Name:</span> {fullName}</p>
        <p className="break-words"><span className="font-medium">Email:</span> {profile.email || "-"}</p>
        <p><span className="font-medium">Phone:</span> {profile.phone || "-"}</p>
      </div>

      <button
        onClick={() => setEditOpen(true)}
        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
      >
        Edit Profile
      </button>

      {/* Modal */}
      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onSaved={loadProfile}
      />
    </div>
  );
}