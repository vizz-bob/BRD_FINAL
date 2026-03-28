import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import ProfileDropdown from "../settings/ProfileDropdown";
import ProfileModal from "../profile/ProfileModal";
import { authApi } from "../../api/authApi";

export default function Header({ onOpenSidebar }) {
  const [modalOpen, setModalOpen] = useState(false);

  // Parse user from local storage
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [user, setUser] = useState({
    name: savedUser.fullName || "User",
    email: savedUser.email || "",
  });

  return (
    <>
      {/* HEADER */}
      <div className="bg-white shadow-sm px-4 sm:px-6 lg:px-8 py-3 sm:py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger in header */}
            <button
              onClick={onOpenSidebar}
              className="md:hidden p-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              <HiMenu className="text-2xl" />
            </button>

            {/* Title Block */}
            <div className="min-w-0">
              <h1 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                Fraud Team Dashboard
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                Fraud Risk Monitoring & Analysis
              </p>
            </div>
          </div>

          {/* Profile Menu */}
          <div className="shrink-0">
            <ProfileDropdown
              user={user}
              onLogout={async () => {
                await authApi.logout();
                window.location.href = "/login";
              }}
              onEditProfile={() => setModalOpen(true)}
            />
          </div>

        </div>
      </div>

      {/* PROFILE MODAL */}
      <ProfileModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={user}
        onSave={setUser}
      />
    </>
  );
}