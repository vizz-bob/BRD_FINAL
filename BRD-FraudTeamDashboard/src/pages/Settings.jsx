import AccountSettings from "../components/settings/AccountSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import RolesAndPermissions from "../components/settings/RolesAndPermission";
import TeamManagement from "../components/settings/TeamManagement";
import DepartmentManagement from "../components/settings/DepartmentManagement";

export default function Settings() {
  return (
    <div className="space-y-5 sm:space-y-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-700">Settings</h2>
      <AccountSettings />
      <NotificationSettings />
      <SecuritySettings />
      <DepartmentManagement />
      <TeamManagement />
      <RolesAndPermissions />
    </div>
  );
}