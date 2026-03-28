import React, { useState } from "react";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
// import campaignService from "../../../services/campaignService";
import { emailCampaignService } from "../../../services/campaignService";

const LaunchCampaign = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    campaign_type: "email", // dialer / email / sms
    // Step 1
    campaign_title: "",
    product: "",
    agent_assignment: [],

    // Step 2
    call_script: "",
    subject: "",
    preview_text: "",
    sender_email: "",
    sender_name: "",

    // Step 3
    timing: "",
    schedule_datetime: "",
    frequency: "",

    tracking_enabled: false,
    utm_parameters: false,
    click_tracking: false,
  });

  const [errors, setErrors] = useState({});

  // Step validation
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.campaign_title.trim())
        newErrors.campaign_title = "Required";
      if (!formData.product.trim()) newErrors.product = "Required";
      if (!formData.agent_assignment.length)
        newErrors.agent_assignment = "Required";
    }

    if (currentStep === 2) {
      if (!formData.call_script.trim()) newErrors.call_script = "Required";
      if (formData.campaign_type === "email") {
        if (!formData.subject.trim()) newErrors.subject = "Required";
        if (!formData.sender_email.trim()) newErrors.sender_email = "Required";
        if (!formData.sender_name.trim()) newErrors.sender_name = "Required";
      }
    }

    if (currentStep === 3) {
      if (!formData.timing.trim()) newErrors.timing = "Required";
      if (formData.timing === "schedule" && !formData.schedule_datetime)
        newErrors.schedule_datetime = "Required";

      if (!formData.frequency.trim()) newErrors.frequency = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // const handleSubmit = async () => {
  //   if (!validateStep()) return;

  //   setLoading(true);

  //   try {
  //     let response;
  //     const payload = { ...formData };

  //     // Remove fields not needed by API
  //     delete payload.campaign_type;

  //     switch (formData.campaign_type) {
  //       case "dialer":
  //         // For dialer, using multipart/form-data
  //         const formDataObj = new FormData();
  //         Object.keys(payload).forEach((key) => {
  //           if (Array.isArray(payload[key])) {
  //             payload[key].forEach((item) => formDataObj.append(key, item));
  //           } else {
  //             formDataObj.append(key, payload[key]);
  //           }
  //         });
  //         response = await campaignService.createEmailCampaign(formDataObj);
  //         break;

  //       case "email":
  //         response = await campaignService.createEmailCampaign(payload);
  //         break;

  //       case "sms":
  //         response = await campaignService.createSmsCampaign(payload);
  //         break;

  //       default:
  //         throw new Error("Unknown campaign type");
  //     }

  //     console.log("Campaign created successfully:", response.data);
  //     alert("Campaign launched successfully!");
  //     // Optionally reset form
  //     setFormData({
  //       campaign_type: "dialer",
  //       campaign_title: "",
  //       product: "",
  //       agent_assignment: [],
  //       call_script: "",
  //       subject: "",
  //       preview_text: "",
  //       sender_email: "",
  //       sender_name: "",
  //       timing: "",
  //       scheduleDateTime: "",
  //       frequency: "",
  //     });
  //     setCurrentStep(1);
  //   } catch (error) {
  //     console.error("Failed to create campaign:", error.response || error.message);
  //     alert("Failed to launch campaign.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);

    try {
      const payload = new FormData();

      payload.append("campaign_title", formData.campaign_title);
      payload.append("product", formData.product);
      payload.append("timing", formData.timing);
      payload.append("frequency", formData.frequency || "once");

      // Map agent_assignment to target_audience for email campaign
      (formData.agent_assignment || []).forEach((a) =>
        payload.append("target_audience", a),
      );

      // Email-specific fields
      payload.append("subject_line", formData.subject); // Django field name
      payload.append("sender_email", formData.sender_email);
      payload.append("sender_name", formData.sender_name || "");
      payload.append("preview_text", formData.preview_text || "");
      payload.append(
        "email_template",
        formData.call_script || "professional_blue",
      );

      // Tracking toggles
      payload.append(
        "email_open_tracking",
        formData.tracking_enabled ? "true" : "false",
      );
      payload.append(
        "utm_parameters",
        formData.utm_parameters ? "true" : "false",
      );
      payload.append(
        "click_tracking",
        formData.click_tracking ? "true" : "false",
      );

      // Scheduled datetime
      if (formData.timing === "schedule" && formData.schedule_datetime) {
        payload.append(
          "schedule_datetime",
          new Date(formData.schedule_datetime).toISOString(),
        );
      }

      // Attachments
      if (formData.attachments?.length) {
        formData.attachments.forEach((f) =>
          payload.append("attachment", f.file),
        );
      }

      const res = await emailCampaignService.create(payload);
      await emailCampaignService.launch(res.data.id);

      alert("Campaign launched successfully!");
      setCurrentStep(1);
      setFormData({
        campaign_type: "email",
        campaign_title: "",
        product: "",
        agent_assignment: [],
        call_script: "",
        subject: "",
        preview_text: "",
        sender_email: "",
        sender_name: "",
        timing: "",
        schedule_datetime: "",
        frequency: "",
        tracking_enabled: false,
        utm_parameters: false,
        click_tracking: false,
      });
    } catch (error) {
      console.error(
        "Failed to create campaign:",
        error.response?.data || error.message,
      );
      alert("Failed to launch campaign.");
    } finally {
      setLoading(false);
    }
  };

  const stepProps = { formData, setFormData, errors };

  return (
    <div className="p-6">
      {currentStep === 1 && <StepOne {...stepProps} />}
      {currentStep === 2 && <StepTwo {...stepProps} />}
      {currentStep === 3 && <StepThree {...stepProps} />}

      <div className="mt-6 flex justify-between">
        {currentStep > 1 && (
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={handleBack}
          >
            Back
          </button>
        )}
        {currentStep < 3 && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleNext}
          >
            Next
          </button>
        )}
        {currentStep === 3 && (
          <button
            className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600"}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Launching..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LaunchCampaign;
