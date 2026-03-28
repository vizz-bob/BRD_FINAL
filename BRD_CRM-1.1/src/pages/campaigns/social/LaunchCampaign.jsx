import React, { useState } from "react";
import {
  Send,
  Eye,
  Image,
  Video,
  FileText,
  X,
  CheckCircle,
} from "lucide-react";
import PlatformSelector from "../../../components/campaigns/social/PlatformSelector";
import ContentPreview from "../../../components/campaigns/social/ContentPreview";
import { socialMediaCampaignService } from "../../../services/campaignService";

const LaunchCampaign = () => {
  const [formData, setFormData] = useState({
    campaignTitle: "",
    productSelection: "",
    platforms: [],
    postType: "text",
    messageText: "",
    mediaFile: null,
    postURL: "",
    hashtags: [],
    scheduleDateTime: "",
    scheduleTime: "",
    frequency: "once",
    approver: "",
    targetAudience: [],
  });

  const [hashtagInput, setHashtagInput] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const products = [
    { id: "personal_loan", name: "Personal Loan" },
    { id: "home_loan", name: "Home Loan" },
    { id: "car_loan", name: "Car Loan" },
    { id: "business_loan", name: "Business Loan" },
    { id: "credit_card", name: "Credit Card" },
  ];

  const postTypes = [
    { value: "text", label: "Text Only", icon: FileText },
    { value: "image", label: "Image Post", icon: Image },
    { value: "video", label: "Video Post", icon: Video },
  ];

  const frequencies = [
    { id: "once", name: "Once" },
    { id: "daily", name: "Daily" },
    { id: "weekly", name: "Weekly" },
  ];

  const approvers = [
    { id: "manager_a", name: "Manager A" },
    { id: "manager_b", name: "Manager B" },
    { id: "marketing_head", name: "Marketing Head" },
    { id: "ceo", name: "CEO" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleAddHashtag = () => {
    if (hashtagInput.trim() && !formData.hashtags.includes(hashtagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.trim()],
      }));
      setHashtagInput("");
    }
  };

  const handleRemoveHashtag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((t) => t !== tag),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, mediaFile: file }));
    }
  };

  const handleLaunch = async () => {
    setLoading(true);
    try {
      const payload = new FormData();

      payload.append("campaign_title", formData.campaignTitle);
      payload.append("product", formData.productSelection);
      payload.append("message_text", formData.messageText);
      payload.append("frequency", formData.frequency);
      payload.append("status", "active");

      // hashtags — comma-separated string (model uses TextField)
      payload.append("hashtags", formData.hashtags.join(", "));

      // approver — optional
      if (formData.approver) {
        payload.append("approver", formData.approver);
      }

      // post_url — must have https:// prefix for URLField validation
      if (formData.postURL) {
        const url = formData.postURL.startsWith("http")
          ? formData.postURL
          : `https://${formData.postURL}`;
        payload.append("post_url", url);
      }

      // timing + schedule_datetime — if date/time set, schedule; otherwise launch now
      if (formData.scheduleDateTime && formData.scheduleTime) {
        payload.append("timing", "schedule");
        payload.append(
          "schedule_datetime",
          new Date(`${formData.scheduleDateTime}T${formData.scheduleTime}`).toISOString()
        );
      } else {
        payload.append("timing", "now");
      }

      await socialMediaCampaignService.create(payload);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          campaignTitle: "",
          productSelection: "",
          platforms: [],
          postType: "text",
          messageText: "",
          mediaFile: null,
          postURL: "",
          hashtags: [],
          scheduleDateTime: "",
          scheduleTime: "",
          frequency: "once",
          approver: "",
          targetAudience: [],
        });
      }, 2000);
    } catch (error) {
      console.error("Error launching campaign:", error.response?.data || error);
      alert(
        "Failed to launch campaign:\n" +
          JSON.stringify(error.response?.data || "Unknown error", null, 2)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Campaign Launched!
            </h3>
            <p className="text-gray-600">Your campaign is now active.</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Step 1: Campaign Identity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-indigo-600 mb-4">
            Step 1: Campaign Identity & Targeting
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.campaignTitle}
                onChange={(e) => handleInputChange("campaignTitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Festival Loan Promotion 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.productSelection}
                onChange={(e) => handleInputChange("productSelection", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Selection <span className="text-red-500">*</span>
              </label>
              <PlatformSelector
                selectedPlatforms={formData.platforms}
                onToggle={handlePlatformToggle}
              />
            </div>
          </div>
        </div>

        {/* Step 2: Content Creation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-indigo-600 mb-4">
            Step 2: Content Creation
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {postTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange("postType", type.value)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                        formData.postType === type.value
                          ? "border-indigo-500 bg-indigo-100 text-indigo-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Text <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.messageText}
                onChange={(e) => handleInputChange("messageText", e.target.value)}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Write your social media post caption..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.messageText.length} characters
              </p>
            </div>

            {formData.postType !== "text" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Media <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept={formData.postType === "image" ? "image/*" : "video/*"}
                    onChange={handleFileUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    {formData.mediaFile ? (
                      <div className="text-green-600">
                        <p className="font-medium">{formData.mediaFile.name}</p>
                        <p className="text-sm">Click to change</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <div className="mx-auto w-12 h-12 mb-2">
                          {formData.postType === "image" ? (
                            <Image className="w-full h-full" />
                          ) : (
                            <Video className="w-full h-full" />
                          )}
                        </div>
                        <p className="font-medium">Click to upload</p>
                        <p className="text-sm">
                          {formData.postType === "image"
                            ? "PNG, JPG up to 10MB"
                            : "MP4, MOV up to 100MB"}
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post URL (CTA Link)
              </label>
              <input
                type="text"
                value={formData.postURL}
                onChange={(e) => handleInputChange("postURL", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://yourloansite.com/apply"
              />
              <p className="text-xs text-gray-500 mt-1">
                This link will be tracked for click-through analytics
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hashtags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddHashtag())
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Add hashtag (without #)"
                />
                <button
                  onClick={handleAddHashtag}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveHashtag(tag)}
                      className="ml-2 hover:text-indigo-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Scheduling */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-indigo-600 mb-4">
            Step 3: Scheduling
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date
                </label>
                <input
                  type="date"
                  value={formData.scheduleDateTime}
                  onChange={(e) => handleInputChange("scheduleDateTime", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Time
                </label>
                <input
                  type="time"
                  value={formData.scheduleTime}
                  onChange={(e) => handleInputChange("scheduleTime", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Leave date/time blank to launch immediately.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => handleInputChange("frequency", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {frequencies.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approver
              </label>
              <select
                value={formData.approver}
                onChange={(e) => handleInputChange("approver", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Approver (optional)</option>
                {approvers.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Single Launch Button */}
        <button
          onClick={handleLaunch}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60 text-lg font-semibold"
        >
          <Send className="w-5 h-5" />
          <span>{loading ? "Launching..." : "Launch Campaign"}</span>
        </button>
      </div>

      {/* Preview Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <button
            onClick={() => setPreviewOpen(!previewOpen)}
            className="w-full lg:hidden mb-4 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg"
          >
            <Eye className="w-5 h-5" />
            <span>{previewOpen ? "Hide" : "Show"} Preview</span>
          </button>
          <div className={`${previewOpen ? "block" : "hidden lg:block"}`}>
            <ContentPreview formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchCampaign;



// import React, { useState } from "react";
// import {
//   Save,
//   Send,
//   Eye,
//   Image,
//   Video,
//   FileText,
//   X,
//   CheckCircle,
// } from "lucide-react";
// import PlatformSelector from "../../../components/campaigns/social/PlatformSelector";
// import ContentPreview from "../../../components/campaigns/social/ContentPreview";
// import { socialMediaCampaignService } from "../../../services/campaignService";

// const LaunchCampaign = () => {
//   const [formData, setFormData] = useState({
//     campaignTitle: "",
//     productSelection: "",
//     platforms: [],
//     postType: "text",
//     messageText: "",
//     mediaFile: null,
//     postURL: "",
//     hashtags: [],
//     scheduleDateTime: "",
//     scheduleTime: "",
//     frequency: "once",
//     approver: "",
//     targetAudience: [],
//   });

//   const [hashtagInput, setHashtagInput] = useState("");
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   // IDs must match Django model choice keys exactly
//   const products = [
//     { id: "personal_loan", name: "Personal Loan" },
//     { id: "home_loan", name: "Home Loan" },
//     { id: "car_loan", name: "Car Loan" },
//     { id: "business_loan", name: "Business Loan" },
//     { id: "credit_card", name: "Credit Card" },
//   ];

//   const postTypes = [
//     { value: "text", label: "Text Only", icon: FileText },
//     { value: "image", label: "Image Post", icon: Image },
//     { value: "video", label: "Video Post", icon: Video },
//   ];

//   const frequencies = [
//     { id: "once", name: "Once" },
//     { id: "daily", name: "Daily" },
//     { id: "weekly", name: "Weekly" },
//   ];

//   // IDs must match Django model choice keys exactly
//   const approvers = [
//     { id: "manager_a", name: "Manager A" },
//     { id: "manager_b", name: "Manager B" },
//     { id: "marketing_head", name: "Marketing Head" },
//     { id: "ceo", name: "CEO" },
//   ];

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handlePlatformToggle = (platform) => {
//     setFormData((prev) => ({
//       ...prev,
//       platforms: prev.platforms.includes(platform)
//         ? prev.platforms.filter((p) => p !== platform)
//         : [...prev.platforms, platform],
//     }));
//   };

//   const handleAddHashtag = () => {
//     if (
//       hashtagInput.trim() &&
//       !formData.hashtags.includes(hashtagInput.trim())
//     ) {
//       setFormData((prev) => ({
//         ...prev,
//         hashtags: [...prev.hashtags, hashtagInput.trim()],
//       }));
//       setHashtagInput("");
//     }
//   };

//   const handleRemoveHashtag = (tag) => {
//     setFormData((prev) => ({
//       ...prev,
//       hashtags: prev.hashtags.filter((t) => t !== tag),
//     }));
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, mediaFile: file }));
//     }
//   };

//   // =========================
//   // API Submit
//   // =========================
//   const handleSubmit = async (status) => {
//     setLoading(true);
//     try {
//       const payload = new FormData();

//       payload.append("campaign_title", formData.campaignTitle);
//       payload.append("product", formData.productSelection); // ← 'product' not 'product_selection'
//       payload.append("message_text", formData.messageText);
//       payload.append("timing", "now"); // ← required field
//       payload.append("frequency", formData.frequency);
//       payload.append("status", status); // 'draft' or 'active'

//       // hashtags — comma-separated string, NOT JSON
//       payload.append("hashtags", formData.hashtags.join(", "));

//       // approver — optional, only append if selected
//       if (formData.approver) {
//         payload.append("approver", formData.approver);
//       }

//       // post_url — URLField, must have https:// or leave blank
//       if (formData.postURL) {
//         const url = formData.postURL.startsWith("http")
//           ? formData.postURL
//           : `https://${formData.postURL}`;
//         payload.append("post_url", url);
//       }

//       // schedule_datetime — only if timing is schedule
//       if (formData.scheduleDateTime && formData.scheduleTime) {
//         payload.append(
//           "schedule_datetime",
//           new Date(
//             `${formData.scheduleDateTime}T${formData.scheduleTime}`,
//           ).toISOString(),
//         );
//         // override timing to schedule
//         payload.set("timing", "schedule");
//       }

//       // platforms and target_audience are NOT in the model — don't send them

//       console.log("Submitting:");
//       for (let [k, v] of payload.entries()) console.log(k, v);

//       await socialMediaCampaignService.create(payload);

//       setShowSuccess(true);
//       setTimeout(() => {
//         setShowSuccess(false);
//         setFormData({
//           campaignTitle: "",
//           productSelection: "",
//           platforms: [],
//           postType: "text",
//           messageText: "",
//           mediaFile: null,
//           postURL: "",
//           hashtags: [],
//           scheduleDateTime: "",
//           scheduleTime: "",
//           frequency: "once",
//           approver: "",
//           targetAudience: [],
//         });
//       }, 2000);
//     } catch (error) {
//       console.error(
//         "Error submitting campaign:",
//         error.response?.data || error,
//       );
//       alert(
//         "Failed:\n" +
//           JSON.stringify(error.response?.data || "Unknown", null, 2),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Success Modal */}
//       {showSuccess && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
//             <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//             <h3 className="text-xl font-bold text-gray-900 mb-2">
//               Campaign Submitted!
//             </h3>
//             <p className="text-gray-600">
//               Your campaign has been saved successfully.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Main Form - 2 columns */}
//       <div className="lg:col-span-2 space-y-6">
//         {/* Step 1: Campaign Identity */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-lg font-semibold text-indigo-600 mb-4">
//             Step 1: Campaign Identity & Targeting
//           </h2>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Campaign Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.campaignTitle}
//                 onChange={(e) =>
//                   handleInputChange("campaignTitle", e.target.value)
//                 }
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 placeholder="e.g., Festival Loan Promotion 2025"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Product Selection <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={formData.productSelection}
//                 onChange={(e) =>
//                   handleInputChange("productSelection", e.target.value)
//                 }
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="">Select Product</option>
//                 {products.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Platform Selection <span className="text-red-500">*</span>
//               </label>
//               <PlatformSelector
//                 selectedPlatforms={formData.platforms}
//                 onToggle={handlePlatformToggle}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Step 2: Content Creation */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-lg font-semibold text-indigo-600 mb-4">
//             Step 2: Content Creation
//           </h2>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Post Type <span className="text-red-500">*</span>
//               </label>
//               <div className="grid grid-cols-3 gap-3">
//                 {postTypes.map((type) => {
//                   const Icon = type.icon;
//                   return (
//                     <button
//                       key={type.value}
//                       onClick={() => handleInputChange("postType", type.value)}
//                       className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
//                         formData.postType === type.value
//                           ? "border-indigo-500 bg-indigo-100 text-indigo-600"
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       <Icon className="w-6 h-6 mb-2" />
//                       <span className="text-sm font-medium">{type.label}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Message Text <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 value={formData.messageText}
//                 onChange={(e) =>
//                   handleInputChange("messageText", e.target.value)
//                 }
//                 rows="5"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 placeholder="Write your social media post caption..."
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 {formData.messageText.length} characters
//               </p>
//             </div>

//             {formData.postType !== "text" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Upload Media <span className="text-red-500">*</span>
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                   <input
//                     type="file"
//                     accept={
//                       formData.postType === "image" ? "image/*" : "video/*"
//                     }
//                     onChange={handleFileUpload}
//                     className="hidden"
//                     id="media-upload"
//                   />
//                   <label htmlFor="media-upload" className="cursor-pointer">
//                     {formData.mediaFile ? (
//                       <div className="text-green-600">
//                         <p className="font-medium">{formData.mediaFile.name}</p>
//                         <p className="text-sm">Click to change</p>
//                       </div>
//                     ) : (
//                       <div className="text-gray-500">
//                         <div className="mx-auto w-12 h-12 mb-2">
//                           {formData.postType === "image" ? (
//                             <Image className="w-full h-full" />
//                           ) : (
//                             <Video className="w-full h-full" />
//                           )}
//                         </div>
//                         <p className="font-medium">Click to upload</p>
//                         <p className="text-sm">
//                           {formData.postType === "image"
//                             ? "PNG, JPG up to 10MB"
//                             : "MP4, MOV up to 100MB"}
//                         </p>
//                       </div>
//                     )}
//                   </label>
//                 </div>
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Post URL (CTA Link)
//               </label>
//               <input
//                 type="url"
//                 value={formData.postURL}
//                 onChange={(e) => handleInputChange("postURL", e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 placeholder="https://yourloansite.com/apply"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 This link will be tracked for click-through analytics
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Hashtags
//               </label>
//               <div className="flex space-x-2 mb-2">
//                 <input
//                   type="text"
//                   value={hashtagInput}
//                   onChange={(e) => setHashtagInput(e.target.value)}
//                   onKeyPress={(e) =>
//                     e.key === "Enter" &&
//                     (e.preventDefault(), handleAddHashtag())
//                   }
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Add hashtag (without #)"
//                 />
//                 <button
//                   onClick={handleAddHashtag}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                 >
//                   Add
//                 </button>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {formData.hashtags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
//                   >
//                     #{tag}
//                     <button
//                       onClick={() => handleRemoveHashtag(tag)}
//                       className="ml-2 hover:text-indigo-900"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Step 3: Scheduling & Approval */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-lg font-semibold text-indigo-600 mb-4">
//             Step 3: Scheduling & Approval
//           </h2>

//           <div className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Schedule Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   value={formData.scheduleDateTime}
//                   onChange={(e) =>
//                     handleInputChange("scheduleDateTime", e.target.value)
//                   }
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Schedule Time <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="time"
//                   value={formData.scheduleTime}
//                   onChange={(e) =>
//                     handleInputChange("scheduleTime", e.target.value)
//                   }
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Frequency
//               </label>
//               <select
//                 value={formData.frequency}
//                 onChange={(e) => handleInputChange("frequency", e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 {frequencies.map((f) => (
//                   <option key={f.id} value={f.id}>
//                     {f.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Approver <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={formData.approver}
//                 onChange={(e) => handleInputChange("approver", e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="">Select Approver</option>
//                 {approvers.map((a) => (
//                   <option key={a.id} value={a.id}>
//                     {a.name}
//                   </option>
//                 ))}
//               </select>
//               <p className="text-xs text-gray-500 mt-1">
//                 Campaign will be sent for approval before posting
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex space-x-4">
//           <button
//             onClick={() => handleSubmit("draft")}
//             disabled={loading}
//             className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all active:scale-95 disabled:opacity-60"
//           >
//             <Save className="w-5 h-5" />
//             <span>{loading ? "Saving..." : "Save as Draft"}</span>
//           </button>

//           <button
//             onClick={() => handleSubmit("active")}
//             disabled={loading}
//             className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60"
//           >
//             <Send className="w-5 h-5" />
//             <span>{loading ? "Submitting..." : "Submit for Approval"}</span>
//           </button>
//         </div>
//       </div>

//       {/* Preview Sidebar */}
//       <div className="lg:col-span-1">
//         <div className="sticky top-24">
//           <button
//             onClick={() => setPreviewOpen(!previewOpen)}
//             className="w-full lg:hidden mb-4 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg"
//           >
//             <Eye className="w-5 h-5" />
//             <span>{previewOpen ? "Hide" : "Show"} Preview</span>
//           </button>
//           <div className={`${previewOpen ? "block" : "hidden lg:block"}`}>
//             <ContentPreview formData={formData} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LaunchCampaign;
