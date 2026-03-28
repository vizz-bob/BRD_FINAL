import React, { useState } from "react";
import {
  User,
  Users,
  MapPin,
  Bell,
  Settings,
  Link,
  Mail,
  Phone,
  Globe,
  Shield,
  Database,
  MessageSquare,
  Zap,
  ChevronRight,
  Check,
  X,
  Save,
  RefreshCw,
  AlertCircle,
  Info,
  Wifi,
  Smartphone,
  Clock,
  Calendar,
  Filter,
  Search,
  Edit,
  Trash2,
  Plus,
  ToggleLeft,
  ToggleRight,
  Volume2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Download,
  Upload,
  FileText,
  UserPlus,
  UserCheck,
  UserX,
  MoreVertical,
  ChevronDown,
  LogOut,
  HelpCircle,
  CreditCard,
  Key,
  Fingerprint,
  Monitor,
  Tablet,
  HardDrive,
  Cloud,
  Server,
  Cpu,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  // ── Integrated State ──────────────────────────────────────────
  const [profileData, setProfileData] = useState({
    name: "", email: "", phone: "", role: "Sales Executive",
    avatar: "", bio: "", timezone: "Asia/Kolkata", language: "English"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: true, sms: true, push: true, whatsapp: true, desktop: true,
    leadAssigned: true, leadUpdated: true, applicationSubmitted: true,
    paymentReceived: true, followUpReminder: true, weeklyReport: true,
    monthlyIncentive: true
  });

  const [availability, setAvailability] = useState({
    monday: { active: true, from: "09:00", to: "18:00" },
    tuesday: { active: true, from: "09:00", to: "18:00" },
    wednesday: { active: true, from: "09:00", to: "18:00" },
    thursday: { active: true, from: "09:00", to: "18:00" },
    friday: { active: true, from: "09:00", to: "18:00" },
    saturday: { active: false, from: "", to: "" },
    sunday: { active: false, from: "", to: "" },
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordChange, setPasswordChange] = useState({ current: "", new: "", confirm: "" });
  const [activeTab, setActiveTab] = useState("profile");

  const [teamMembers, setTeamMembers] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "Sales Executive" });
  const [newTerritory, setNewTerritory] = useState({ name: "", pincode: "", assignedTo: "" });
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTerritory, setShowAddTerritory] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ lastSync: "", status: "" });

  const [integrations, setIntegrations] = useState([]);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  const [availableIntegrations] = useState([
    { name: "Zoho CRM", type: "CRM", description: "Complete CRM solution for sales teams" },
    { name: "Salesforce", type: "CRM", description: "World's #1 CRM platform" },
    { name: "Microsoft Teams", type: "Communication", description: "Team collaboration and communication" },
    { name: "Slack", type: "Communication", description: "Business communication platform" },
    { name: "Dropbox", type: "Storage", description: "Secure cloud storage solution" },
  ]);

  const [generalSettings, setGeneralSettings] = useState({
    dateFormat: "dd/mm/yyyy", currency: "INR", autoSave: true,
    autoSaveInterval: 30, defaultView: "dashboard", itemsPerPage: 25,
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareAnalyticsData: true, marketingCommunications: false,
  });

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [activeSection, setActiveSection] = useState("profile");
  const [showToastNotification, setShowToastNotification] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // ── Methods ──────────────────────────────────────────

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToastNotification(true);
    setTimeout(() => { setShowToastNotification(false); }, 3000);
  };

  React.useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      const { settingsService } = await import("../services/settings.js");
      const [
        profileRes, notifRes, availRes,
        terriRes, integRes, genRes, privRes, teamRes
      ] = await Promise.all([
        settingsService.getProfile().catch(() => ({})),
        settingsService.getNotificationPrefs().catch(() => ({})),
        settingsService.getAvailability().catch(() => []),
        settingsService.getTerritories().catch(() => []),
        settingsService.getIntegrations().catch(() => []),
        settingsService.getGeneralSettings().catch(() => ({})),
        settingsService.getPrivacySettings().catch(() => ({})),
        settingsService.getTeamMembers().catch(() => [])
      ]);

      if (profileRes.id) {
        setProfileData({
          name: profileRes.full_name || profileRes.first_name || "",
          first_name: profileRes.first_name,
          last_name: profileRes.last_name,
          email: profileRes.email,
          phone: profileRes.phone,
          role: profileRes.role,
          avatar: profileRes.avatar_initials,
          bio: profileRes.bio,
          timezone: profileRes.timezone,
          language: profileRes.language,
        });
      }

      if (notifRes.id) {
        setNotificationSettings({
          email: notifRes.email ?? true, sms: notifRes.sms ?? true, push: notifRes.push ?? true,
          whatsapp: notifRes.whatsapp ?? true, desktop: notifRes.desktop ?? true,
          leadAssigned: notifRes.lead_assigned ?? true, leadUpdated: notifRes.lead_updated ?? true,
          applicationSubmitted: notifRes.application_submitted ?? true,
          paymentReceived: notifRes.payment_received ?? true, followUpReminder: notifRes.follow_up_reminder ?? true,
          weeklyReport: notifRes.weekly_report ?? true, monthlyIncentive: notifRes.monthly_incentive ?? true,
        });
      }

      if (Array.isArray(availRes) && availRes.length > 0) {
        const availMap = {};
        availRes.forEach(d => {
          availMap[d.day.toLowerCase()] = {
            active: d.active,
            from: d.from_time ? d.from_time.substring(0, 5) : "",
            to: d.to_time ? d.to_time.substring(0, 5) : ""
          };
        });
        setAvailability(prev => ({ ...prev, ...availMap }));
      }

      if (Array.isArray(terriRes)) {
        setTerritories(terriRes.map(t => ({
          ...t,
          assignedTo: t.assigned_to_name || "Unassigned"
        })));
      }
      if (Array.isArray(teamRes)) setTeamMembers(teamRes);
      if (Array.isArray(integRes)) setIntegrations(integRes);

      if (genRes.id) {
        setGeneralSettings({
          dateFormat: genRes.date_format, currency: genRes.currency,
          autoSave: genRes.auto_save, autoSaveInterval: genRes.auto_save_interval,
          defaultView: genRes.default_view, itemsPerPage: genRes.items_per_page
        });
      }

      if (privRes.id) {
        setPrivacySettings({
          shareAnalyticsData: privRes.share_analytics_data,
          marketingCommunications: privRes.marketing_communications,
        });
      }

    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const { settingsService } = await import("../services/settings.js");
      const parts = profileData.name.split(" ");
      const first_name = parts[0] || "";
      const last_name = parts.slice(1).join(" ") || "";

      const payload = {
        user: { first_name, last_name },
        phone: profileData.phone, role: profileData.role,
        bio: profileData.bio, timezone: profileData.timezone, language: profileData.language,
      };

      await settingsService.updateProfile(payload);
      showToast("Profile updated successfully", "success");
    } catch (err) { showToast("Error updating profile", "error"); }
  };

  const handleNotificationChange = (key, value) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveNotifications = async () => {
    try {
      const { settingsService } = await import("../services/settings.js");
      await settingsService.updateNotificationPrefs({
        email: notificationSettings.email, sms: notificationSettings.sms, push: notificationSettings.push,
        whatsapp: notificationSettings.whatsapp, desktop: notificationSettings.desktop,
        lead_assigned: notificationSettings.leadAssigned, lead_updated: notificationSettings.leadUpdated,
        application_submitted: notificationSettings.applicationSubmitted,
        payment_received: notificationSettings.paymentReceived, follow_up_reminder: notificationSettings.followUpReminder,
        weekly_report: notificationSettings.weeklyReport, monthly_incentive: notificationSettings.monthlyIncentive,
      });
      showToast("Notification preferences updated", "success");
    } catch (err) { showToast("Error saving notifications", "error"); }
  };

  const handleAvailabilityChange = (day, field, value) => {
    setAvailability((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const saveAvailability = async () => {
    try {
      const { settingsService } = await import("../services/settings.js");
      for (const day of Object.keys(availability)) {
        await settingsService.updateAvailability({
          day, active: availability[day].active,
          from_time: availability[day].from || null, to_time: availability[day].to || null
        });
      }
      showToast("Availability updated", "success");
    } catch (err) { showToast("Error saving availability", "error"); }
  };

  const handlePasswordChange = async () => {
    if (passwordChange.new !== passwordChange.confirm) {
      return showToast("Passwords do not match", "error");
    }
    try {
      const { settingsService } = await import("../services/settings.js");
      await settingsService.changePassword({
        current_password: passwordChange.current,
        new_password: passwordChange.new, confirm_password: passwordChange.confirm
      });
      showToast("Password changed successfully", "success");
      setPasswordChange({ current: "", new: "", confirm: "" });
    } catch (err) { showToast("Failed to change password", "error"); }
  };

  const handleTwoFactorToggle = async () => {
    try {
      const { settingsService } = await import("../services/settings.js");
      const resp = await settingsService.toggleTwoFactor(!twoFactorEnabled);
      setTwoFactorEnabled(resp.enabled);
      showToast(`Two-factor authentication ${resp.enabled ? "enabled" : "disabled"}`, "success");
    } catch (err) { showToast("Failed to toggle 2FA", "error"); }
  };

  const handleAddTeamMember = async () => {
    if (!newMember.name || !newMember.email) return showToast("Please fill all required fields", "error");
    try {
      const { settingsService } = await import("../services/settings.js");
      const member = await settingsService.createTeamMember(newMember);
      setTeamMembers(prev => [...prev, member]);
      setNewMember({ name: "", email: "", role: "Sales Executive" });
      setShowAddMember(false);
      showToast("Team member added", "success");
    } catch (err) { showToast("Failed to add team member", "error"); }
  };

  const handleRemoveTeamMember = async (id) => {
    try {
      const { settingsService } = await import("../services/settings.js");
      await settingsService.deleteTeamMember(id);
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      showToast("Team member removed", "info");
    } catch (err) { showToast("Failed to remove team member", "error"); }
  };

  const handleAddTerritory = async () => {
    if (!newTerritory.name || !newTerritory.pincode) return showToast("Please fill all fields", "error");
    try {
      const { settingsService } = await import("../services/settings.js");
      const terr = await settingsService.createTerritory(newTerritory);
      setTerritories(prev => [...prev, { ...terr, assignedTo: terr.assigned_to_name || "Unassigned" }]);
      setNewTerritory({ name: "", pincode: "", assignedTo: "" });
      setShowAddTerritory(false);
      showToast("Territory added successfully", "success");
    } catch (err) { showToast("Failed to add territory", "error"); }
  };

  const handleRemoveTerritory = async (id) => {
    try {
      const { settingsService } = await import("../services/settings.js");
      await settingsService.deleteTerritory(id);
      setTerritories(prev => prev.filter(t => t.id !== id));
      showToast("Territory removed", "info");
    } catch (err) { showToast("Failed to remove territory", "error"); }
  };

  const handleAssignTerritory = async (id, memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;
    try {
      const { settingsService } = await import("../services/settings.js");
      const updated = await settingsService.assignTerritory(id, memberId);
      setTerritories(prev => prev.map(t => t.id === id ? { ...updated, assignedTo: updated.assigned_to_name || "Unassigned" } : t));
      showToast("Territory assigned successfully", "success");
    } catch (err) { showToast("Failed to assign territory", "error"); }
  };

  const handleIntegrationToggle = async (id) => {
    try {
      const { settingsService } = await import("../services/settings.js");
      const updated = await settingsService.toggleIntegration(id);
      setIntegrations(prev => prev.map(i => i.id === id ? updated : i));
      showToast(`${updated.name} ${updated.status}`, "info");
    } catch (err) { showToast("Failed to toggle integration", "error"); }
  };

  const handleIntegrationSettings = (id) => {
    setSelectedIntegration(integrations.find(i => i.id === id));
    setShowIntegrationModal(true);
  };

  const handleIntegrationSettingsSave = async () => {
    try {
      const { settingsService } = await import("../services/settings.js");
      const updated = await settingsService.updateIntegration(selectedIntegration.id, { settings: selectedIntegration.settings });
      setIntegrations(prev => prev.map(i => i.id === updated.id ? updated : i));
      setShowIntegrationModal(false);
      showToast("Integration settings saved", "success");
    } catch (err) { showToast("Failed to save integration settings", "error"); }
  };

  const handleAddIntegration = async (name) => {
    try {
      const { settingsService } = await import("../services/settings.js");
      const integType = availableIntegrations.find(i => i.name === name)?.type || "Other";
      const created = await settingsService.createIntegration({ name, integration_type: integType });
      setIntegrations(prev => [...prev, created]);
      setShowAddIntegration(false);
      showToast(`${name} added`, "success");
    } catch (err) { showToast("Failed to add integration", "error"); }
  };

  const handleSyncNow = async (id) => {
    try {
      const { settingsService } = await import("../services/settings.js");
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, last_sync: "Syncing..." } : i));
      await settingsService.syncIntegration(id);
      fetchSettingsData();
      showToast("Sync completed", "success");
    } catch (err) { showToast("Failed to sync", "error"); }
  };

  const handleGeneralSettingChange = (key, value) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveGeneralSettings = async () => {
    try {
      const { settingsService } = await import("../services/settings.js");
      await settingsService.updateGeneralSettings({
        date_format: generalSettings.dateFormat, currency: generalSettings.currency,
        auto_save: generalSettings.autoSave, auto_save_interval: generalSettings.autoSaveInterval,
        default_view: generalSettings.defaultView, items_per_page: generalSettings.itemsPerPage
      });
      showToast("General settings saved", "success");
    } catch (err) { showToast("Error saving general settings", "error"); }
  };

  const handlePrivacySettingChange = (key, value) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const savePrivacySettings = async () => {
    try {
      const { settingsService } = await import("../services/settings.js");
      await settingsService.updatePrivacySettings({
        share_analytics_data: privacySettings.shareAnalyticsData,
        marketing_communications: privacySettings.marketingCommunications,
      });
      showToast("Privacy settings saved", "success");
    } catch (err) { showToast("Error saving privacy", "error"); }
  };

  const [isExportingLeads, setIsExportingLeads] = useState(false);
  const [isExportingReports, setIsExportingReports] = useState(false);

  const handleExportLeads = async () => {
    setIsExportingLeads(true);
    showToast("Preparing leads export...", "info");
    try {
      const { settingsService } = await import("../services/settings.js");
      const blob = await settingsService.exportLeads();
      const url = window.URL.createObjectURL(new Blob([blob], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "leads_export.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast("Leads exported successfully!", "success");
    } catch (err) {
      showToast("Failed to export leads. Please try again.", "error");
    } finally {
      setIsExportingLeads(false);
    }
  };

  const handleExportReports = async () => {
    setIsExportingReports(true);
    showToast("Preparing reports export...", "info");
    try {
      const { settingsService } = await import("../services/settings.js");
      const blob = await settingsService.exportReports();
      const url = window.URL.createObjectURL(new Blob([blob], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reports_export.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast("Reports exported successfully!", "success");
    } catch (err) {
      showToast("Failed to export reports. Please try again.", "error");
    } finally {
      setIsExportingReports(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteAccountConfirm !== "DELETE") return showToast("Please type DELETE to confirm", "error");
    setIsDeletingAccount(true);
    try {
      const { settingsService } = await import("../services/settings.js");
      await settingsService.deleteAccount("DELETE");
      localStorage.clear();
      showToast("Account deleted successfully.", "success");
      setTimeout(() => { window.location.href = "/login"; }, 2000);
    } catch (error) {
      showToast("Failed to delete account.", "error");
      setIsDeletingAccount(false);
    }
  };

  const handleSaveAllSettings = async () => {
    if (activeSection === "profile") {
      await handleProfileUpdate();
      await saveNotifications();
      await saveAvailability();
    } else if (activeSection === "general") {
      await saveGeneralSettings();
      await savePrivacySettings();
    }
  };


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-brand-blue" />
            <h1 className="text-xl font-semibold text-brand-navy">Settings</h1>
          </div>
          <button
            onClick={handleSaveAllSettings}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex overflow-x-auto no-scrollbar space-x-8 px-6">
          <button
            onClick={() => setActiveSection("profile")}
            className={`py-4 border-b-2 transition-colors ${activeSection === "profile"
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
          >
            Profile Preferences
          </button>
          <button
            onClick={() => setActiveSection("team")}
            className={`py-4 border-b-2 transition-colors ${activeSection === "team"
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
          >
            Team & Territory
          </button>
          <button
            onClick={() => setActiveSection("integrations")}
            className={`py-4 border-b-2 transition-colors ${activeSection === "integrations"
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
          >
            Integrations
          </button>
          <button
            onClick={() => setActiveSection("general")}
            className={`py-4 border-b-2 transition-colors ${activeSection === "general"
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
          >
            General
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="p-6">
        {/* Profile Preferences Section */}
        {activeSection === "profile" && (
          <div className="space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Role
                    </label>
                    <select
                      value={profileData.role}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                    >
                      <option>Sales Executive</option>
                      <option>Relationship Manager</option>
                      <option>Team Lead</option>
                      <option>Regional Manager</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Timezone
                      </label>
                      <select
                        value={profileData.timezone}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            timezone: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                      >
                        <option>Asia/Kolkata</option>
                        <option>Asia/Dubai</option>
                        <option>Europe/London</option>
                        <option>America/New_York</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Language
                      </label>
                      <select
                        value={profileData.language}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            language: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Marathi</option>
                        <option>Tamil</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleProfileUpdate}
                    className="w-full px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Update Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium text-slate-700 mb-3">
                      Notification Channels
                    </h3>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.email}
                          onChange={() =>
                            handleNotificationChange(
                              "email",
                              !notificationSettings.email
                            )
                          }
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Email Notifications
                          </p>
                          <p className="text-xs text-slate-500">
                            Receive updates via email
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.sms}
                          onChange={() =>
                            handleNotificationChange(
                              "sms",
                              !notificationSettings.sms
                            )
                          }
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            SMS Alerts
                          </p>
                          <p className="text-xs text-slate-500">
                            Get SMS notifications
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.push}
                          onChange={() =>
                            handleNotificationChange(
                              "push",
                              !notificationSettings.push
                            )
                          }
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Push Notifications
                          </p>
                          <p className="text-xs text-slate-500">
                            Browser/app notifications
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.whatsapp}
                          onChange={() =>
                            handleNotificationChange(
                              "whatsapp",
                              !notificationSettings.whatsapp
                            )
                          }
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            WhatsApp Messages
                          </p>
                          <p className="text-xs text-slate-500">
                            Updates via WhatsApp
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-slate-700 mb-3">
                      Notification Types
                    </h3>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.leadAssigned}
                          onChange={() =>
                            handleNotificationChange(
                              "leadAssigned",
                              !notificationSettings.leadAssigned
                            )
                          }
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Lead Assigned
                          </p>
                          <p className="text-xs text-slate-500">
                            When a lead is assigned to you
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.leadUpdated}
                          onChange={() =>
                            handleNotificationChange(
                              "leadUpdated",
                              !notificationSettings.leadUpdated
                            )
                          }
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Lead Updated
                          </p>
                          <p className="text-xs text-slate-500">
                            When a lead status changes
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.applicationSubmitted}
                          onChange={() =>
                            handleNotificationChange(
                              "applicationSubmitted",
                              !notificationSettings.applicationSubmitted
                            )
                          }
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Application Submitted
                          </p>
                          <p className="text-xs text-slate-500">
                            When a new application is submitted
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.paymentReceived}
                          onChange={() =>
                            handleNotificationChange(
                              "paymentReceived",
                              !notificationSettings.paymentReceived
                            )
                          }
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Payment Received
                          </p>
                          <p className="text-xs text-slate-500">
                            When a payment is received
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.followUpReminder}
                          onChange={() =>
                            handleNotificationChange(
                              "followUpReminder",
                              !notificationSettings.followUpReminder
                            )
                          }
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Follow-up Reminders
                          </p>
                          <p className="text-xs text-slate-500">
                            Reminders for follow-ups
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weeklyReport}
                          onChange={() =>
                            handleNotificationChange(
                              "weeklyReport",
                              !notificationSettings.weeklyReport
                            )
                          }
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Weekly Report
                          </p>
                          <p className="text-xs text-slate-500">
                            Weekly performance reports
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.monthlyIncentive}
                          onChange={() =>
                            handleNotificationChange(
                              "monthlyIncentive",
                              !notificationSettings.monthlyIncentive
                            )
                          }
                          className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Monthly Incentive
                          </p>
                          <p className="text-xs text-slate-500">
                            Monthly incentive statements
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Settings */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Availability Settings
              </h2>

              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Set your working hours for each day of week
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(availability).map(([day, settings]) => (
                    <div
                      key={day}
                      className="border border-slate-200 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-slate-700 capitalize">
                          {day}
                        </h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.active}
                            onChange={() =>
                              handleAvailabilityChange(
                                day,
                                "active",
                                !settings.active
                              )
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-10 h-6 rounded-full transition-colors ${settings.active ? "bg-brand-blue" : "bg-slate-300"
                              }`}
                          >
                            <span
                              className={`inline-block w-4 h-4 rounded-full bg-white transform transition-transform ${settings.active
                                ? "translate-x-5"
                                : "translate-x-1"
                                }`}
                            />
                          </div>
                        </label>
                      </div>

                      {settings.active && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">
                              From
                            </label>
                            <input
                              type="time"
                              value={settings.from}
                              onChange={(e) =>
                                handleAvailabilityChange(
                                  day,
                                  "from",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-600 mb-1">
                              To
                            </label>
                            <input
                              type="time"
                              value={settings.to}
                              onChange={(e) =>
                                handleAvailabilityChange(
                                  day,
                                  "to",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-slate-700 mb-3">
                    Two-Factor Authentication
                  </h3>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Enable 2FA
                      </p>
                      <p className="text-xs text-slate-500">
                        Add an extra layer of security
                      </p>
                    </div>
                    <button
                      onClick={handleTwoFactorToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactorEnabled ? "bg-brand-blue" : "bg-slate-300"
                        }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 rounded-full bg-white transform transition-transform ${twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                      />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-slate-700 mb-3">
                    Change Password
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordChange.current}
                        onChange={(e) =>
                          setPasswordChange((prev) => ({
                            ...prev,
                            current: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordChange.new}
                        onChange={(e) =>
                          setPasswordChange((prev) => ({
                            ...prev,
                            new: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordChange.confirm}
                        onChange={(e) =>
                          setPasswordChange((prev) => ({
                            ...prev,
                            confirm: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                      />
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      className="w-full px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team & Territory Section */}
        {activeSection === "team" && (
          <div className="space-y-6">
            {/* Team Members */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-brand-navy flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </h2>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="px-3 py-1.5 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 transition-colors flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Member
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left p-3 text-sm font-medium text-slate-700">
                        Name
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">
                        Email
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">
                        Role
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">
                        Status
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="border-b border-slate-100">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-xs font-medium text-brand-blue">
                              {member.avatar}
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {member.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {member.email}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {member.role}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${member.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-800"
                              }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-slate-400 hover:text-brand-blue transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveTeamMember(member.id)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Team Member Modal */}
            {showAddMember && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold text-brand-navy mb-4">
                    Add Team Member
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newMember.name}
                        onChange={(e) =>
                          setNewMember((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newMember.email}
                        onChange={(e) =>
                          setNewMember((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Role
                      </label>
                      <select
                        value={newMember.role}
                        onChange={(e) =>
                          setNewMember((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                      >
                        <option>Sales Executive</option>
                        <option>Relationship Manager</option>
                        <option>Team Lead</option>
                        <option>Regional Manager</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleAddTeamMember}
                      className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors"
                    >
                      Add Member
                    </button>
                    <button
                      onClick={() => setShowAddMember(false)}
                      className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Territory Management */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-brand-navy flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Territory Management
                </h2>
                <button
                  onClick={() => setShowAddTerritory(true)}
                  className="px-3 py-1.5 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Territory
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left p-3 text-sm font-medium text-slate-700">
                        Territory Name
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">
                        Pincode Range
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">
                        Assigned To
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">
                        Lead Count
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {territories.map((territory) => (
                      <tr
                        key={territory.id}
                        className="border-b border-slate-100"
                      >
                        <td className="p-3 text-sm font-medium text-slate-700">
                          {territory.name}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {territory.pincode}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {territory.assignedTo}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {territory.leadCount}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-slate-400 hover:text-brand-blue transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveTerritory(territory.id)
                              }
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Last sync:{" "}
                  <span className="font-medium">{syncStatus.lastSync}</span>
                </div>
                <button
                  onClick={() => {
                    setSyncStatus((prev) => ({ ...prev, status: "syncing" }));
                    setTimeout(() => {
                      setSyncStatus({
                        lastSync: new Date().toLocaleString(),
                        status: "success",
                      });
                      showToast("CRM hierarchy synced successfully", "success");
                    }, 3000);
                  }}
                  className="px-3 py-1.5 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Sync CRM Hierarchy
                </button>
              </div>
            </div>

            {/* Add Territory Modal */}
            {showAddTerritory && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold text-brand-navy mb-4">
                    Add Territory
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Territory Name
                      </label>
                      <input
                        type="text"
                        value={newTerritory.name}
                        onChange={(e) =>
                          setNewTerritory((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Pincode Range
                      </label>
                      <input
                        type="text"
                        value={newTerritory.pincode}
                        onChange={(e) =>
                          setNewTerritory((prev) => ({
                            ...prev,
                            pincode: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Assign To
                      </label>
                      <select
                        value={newTerritory.assignedTo}
                        onChange={(e) =>
                          setNewTerritory((prev) => ({
                            ...prev,
                            assignedTo: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                      >
                        <option value="">Select team member</option>
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.name}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleAddTerritory}
                      className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors"
                    >
                      Add Territory
                    </button>
                    <button
                      onClick={() => setShowAddTerritory(false)}
                      className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Integrations Section */}
        {activeSection === "integrations" && (
          <div className="space-y-6">
            {/* Connected Integrations */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-brand-navy flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Connected Integrations
                </h2>
                <button
                  onClick={() => setShowAddIntegration(true)}
                  className="px-3 py-1.5 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Integration
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="border border-slate-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-md font-medium text-slate-700">
                        {integration.name}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${integration.status === "connected"
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-800"
                          }`}
                      >
                        {integration.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-slate-500 mb-1">
                        Type: {integration.type}
                      </p>
                      <p className="text-xs text-slate-500 mb-1">
                        Last sync: {integration.lastSync}
                      </p>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-slate-500 mb-1">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleIntegrationToggle(integration.id)}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${integration.status === "connected"
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          : "bg-brand-blue text-white hover:bg-brand-blue/90"
                          }`}
                      >
                        {integration.status === "connected"
                          ? "Disconnect"
                          : "Connect"}
                      </button>

                      <button
                        onClick={() =>
                          handleIntegrationSettings(integration.id)
                        }
                        className="p-1 text-slate-400 hover:text-brand-blue transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration Settings Modal */}
            {showIntegrationModal && selectedIntegration && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-brand-navy">
                      {selectedIntegration.name} Settings
                    </h3>
                    <button
                      onClick={() => setShowIntegrationModal(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {selectedIntegration.type === "CRM" && (
                      <div>
                        <h4 className="text-md font-medium text-slate-700 mb-3">
                          Sync Settings
                        </h4>

                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedIntegration.settings.autoSync}
                              onChange={(e) =>
                                setSelectedIntegration((prev) => ({
                                  ...prev,
                                  settings: {
                                    ...prev.settings,
                                    autoSync: e.target.checked,
                                  },
                                }))
                              }
                              className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                            />
                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                Auto Sync
                              </p>
                              <p className="text-xs text-slate-500">
                                Automatically sync data
                              </p>
                            </div>
                          </label>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Sync Interval
                            </label>
                            <select
                              value={selectedIntegration.settings.syncInterval}
                              onChange={(e) =>
                                setSelectedIntegration((prev) => ({
                                  ...prev,
                                  settings: {
                                    ...prev.settings,
                                    syncInterval: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                            >
                              <option value="5 min">5 minutes</option>
                              <option value="15 min">15 minutes</option>
                              <option value="30 min">30 minutes</option>
                              <option value="1 hour">1 hour</option>
                              <option value="manual">Manual</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Data Types
                            </label>
                            <div className="space-y-2">
                              {["leads", "contacts", "deals", "activities"].map(
                                (type) => (
                                  <label
                                    key={type}
                                    className="flex items-center gap-3 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedIntegration.settings.dataTypes?.includes(
                                          type
                                        ) || false
                                      }
                                      onChange={(e) => {
                                        const updatedDataTypes = e.target
                                          .checked
                                          ? [
                                            ...(selectedIntegration.settings
                                              .dataTypes || []),
                                            type,
                                          ]
                                          : (
                                            selectedIntegration.settings
                                              .dataTypes || []
                                          ).filter((t) => t !== type);

                                        setSelectedIntegration((prev) => ({
                                          ...prev,
                                          settings: {
                                            ...prev.settings,
                                            dataTypes: updatedDataTypes,
                                          },
                                        }));
                                      }}
                                      className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                                    />
                                    <span className="text-sm font-medium text-slate-700 capitalize">
                                      {type}
                                    </span>
                                  </label>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedIntegration.type === "Communication" && (
                      <div>
                        <h4 className="text-md font-medium text-slate-700 mb-3">
                          Communication Settings
                        </h4>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Sender ID
                            </label>
                            <input
                              type="text"
                              value={selectedIntegration.settings.senderId}
                              onChange={(e) =>
                                setSelectedIntegration((prev) => ({
                                  ...prev,
                                  settings: {
                                    ...prev.settings,
                                    senderId: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                            />
                          </div>

                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedIntegration.settings.useWhatsApp}
                              onChange={(e) =>
                                setSelectedIntegration((prev) => ({
                                  ...prev,
                                  settings: {
                                    ...prev.settings,
                                    useWhatsApp: e.target.checked,
                                  },
                                }))
                              }
                              className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                            />
                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                Use WhatsApp
                              </p>
                              <p className="text-xs text-slate-500">
                                Send messages via WhatsApp
                              </p>
                            </div>
                          </label>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Default Region
                            </label>
                            <select
                              value={selectedIntegration.settings.defaultRegion}
                              onChange={(e) =>
                                setSelectedIntegration((prev) => ({
                                  ...prev,
                                  settings: {
                                    ...prev.settings,
                                    defaultRegion: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                            >
                              <option value="Mumbai">Mumbai</option>
                              <option value="Delhi">Delhi</option>
                              <option value="Bangalore">Bangalore</option>
                              <option value="Chennai">Chennai</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedIntegration.type === "Storage" && (
                      <div>
                        <h4 className="text-md font-medium text-slate-700 mb-3">
                          Storage Settings
                        </h4>

                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedIntegration.settings.autoBackup}
                              onChange={(e) =>
                                setSelectedIntegration((prev) => ({
                                  ...prev,
                                  settings: {
                                    ...prev.settings,
                                    autoBackup: e.target.checked,
                                  },
                                }))
                              }
                              className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                            />
                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                Auto Backup
                              </p>
                              <p className="text-xs text-slate-500">
                                Automatically backup files
                              </p>
                            </div>
                          </label>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Backup Interval
                            </label>
                            <select
                              value={
                                selectedIntegration.settings.backupInterval
                              }
                              onChange={(e) =>
                                setSelectedIntegration((prev) => ({
                                  ...prev,
                                  settings: {
                                    ...prev.settings,
                                    backupInterval: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                            >
                              <option value="hourly">Hourly</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Storage Usage
                            </label>
                            <div className="bg-slate-100 rounded-lg p-3">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-600">
                                  Used:{" "}
                                  {selectedIntegration.settings.storageUsed}
                                </span>
                                <span className="text-sm text-slate-600">
                                  Limit:{" "}
                                  {selectedIntegration.settings.storageLimit}
                                </span>
                              </div>
                              <div className="w-full bg-slate-300 rounded-full h-2">
                                <div
                                  className="bg-brand-blue h-2 rounded-full"
                                  style={{
                                    width: `${(parseInt(
                                      selectedIntegration.settings.storageUsed
                                    ) /
                                      parseInt(
                                        selectedIntegration.settings
                                          .storageLimit
                                      )) *
                                      100
                                      }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <button
                      onClick={() => {
                        handleSyncNow(selectedIntegration.id);
                        setShowIntegrationModal(false);
                      }}
                      className="px-3 py-1.5 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Sync Now
                    </button>

                    <button
                      onClick={handleIntegrationSettingsSave}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Integration Modal */}
            {showAddIntegration && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold text-brand-navy mb-4">
                    Add Integration
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Select Integration
                      </label>
                      <select
                        onChange={(e) => handleAddIntegration(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                      >
                        <option value="">Select an integration</option>
                        {availableIntegrations.map((integration) => (
                          <option
                            key={integration.name}
                            value={integration.name}
                          >
                            {integration.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setShowAddIntegration(false)}
                      className="w-full px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* General Section */}
        {activeSection === "general" && (
          <div className="space-y-6">
            {/* Display Settings */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Display Settings
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Date Format
                    </label>
                    <select
                      value={generalSettings.dateFormat}
                      onChange={(e) =>
                        handleGeneralSettingChange("dateFormat", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                    >
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) =>
                        handleGeneralSettingChange("currency", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Settings */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Application Settings
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generalSettings.autoSave}
                    onChange={() =>
                      handleGeneralSettingChange(
                        "autoSave",
                        !generalSettings.autoSave
                      )
                    }
                    className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Auto Save
                    </p>
                    <p className="text-xs text-slate-500">
                      Automatically save changes
                    </p>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Auto Save Interval (seconds)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={generalSettings.autoSaveInterval}
                    onChange={(e) =>
                      handleGeneralSettingChange(
                        "autoSaveInterval",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Default View
                  </label>
                  <select
                    value={generalSettings.defaultView}
                    onChange={(e) =>
                      handleGeneralSettingChange("defaultView", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="pipeline">Pipeline</option>
                    <option value="leads">Leads</option>
                    <option value="reports">Reports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Items Per Page
                  </label>
                  <select
                    value={generalSettings.itemsPerPage}
                    onChange={(e) =>
                      handleGeneralSettingChange(
                        "itemsPerPage",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data & Privacy
              </h2>

              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-slate-700 mb-3">
                    Data Export
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleExportLeads}
                      disabled={isExportingLeads}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isExportingLeads ? (
                        <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {isExportingLeads ? "Exporting..." : "Export Leads"}
                    </button>

                    <button
                      onClick={handleExportReports}
                      disabled={isExportingReports}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isExportingReports ? (
                        <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {isExportingReports ? "Exporting..." : "Export Reports"}
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 mt-4">
                  <h3 className="text-md font-medium text-slate-700 mb-3">
                    Privacy Settings
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.shareAnalyticsData}
                        onChange={() =>
                          handlePrivacySettingChange(
                            "shareAnalyticsData",
                            !privacySettings.shareAnalyticsData
                          )
                        }
                        className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          Share Analytics Data
                        </p>
                        <p className="text-xs text-slate-500">
                          Help improve our services
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.marketingCommunications}
                        onChange={() =>
                          handlePrivacySettingChange(
                            "marketingCommunications",
                            !privacySettings.marketingCommunications
                          )
                        }
                        className="w-4 h-4 text-brand-blue focus:ring-brand-blue/50 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          Marketing Communications
                        </p>
                        <p className="text-xs text-slate-500">
                          Receive product updates
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setShowDeleteAccountModal(true)}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Account Confirmation Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-navy">
                  Delete Account
                </h3>
                <p className="text-sm text-slate-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-sm text-slate-700">
                Deleting your account will permanently remove:
              </p>
              <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                <li>All your personal data</li>
                <li>Team memberships and permissions</li>
                <li>Territory assignments</li>
                <li>Activity history and logs</li>
                <li>Integration settings</li>
              </ul>
              <p className="text-sm text-slate-700 font-medium">
                Type "DELETE" below to confirm:
              </p>
              <input
                type="text"
                value={deleteAccountConfirm}
                onChange={(e) => setDeleteAccountConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={
                  deleteAccountConfirm !== "DELETE" || isDeletingAccount
                }
                className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${deleteAccountConfirm === "DELETE" && !isDeletingAccount
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
              >
                {isDeletingAccount ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeleteAccountConfirm("");
                }}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToastNotification && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${toastType === "success"
            ? "bg-green-500 text-white"
            : toastType === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
            }`}
        >
          {toastType === "success" && <CheckCircle className="h-5 w-5" />}
          {toastType === "error" && <XCircle className="h-5 w-5" />}
          {toastType === "info" && <AlertCircle className="h-5 w-5" />}
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
