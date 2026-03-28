import React, { useState } from "react";
import LaunchDialerCampaign from "./LaunchDialerCampaign";
import { dialerCampaignService } from "../../../services/campaignService";

const CampaignWrapper = () => {
  const steps = ["Campaign Info", "Dialer Setup", "Scheduling"];

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    campaign_title: "",
    product: "",
    target_audience: [],
    country: "",
    state: "",
    city: "",
    dialer_type: "",
    retry_attempts: "",
    agent_assignment: [],
    call_script: null,
    timing: "now",
    scheduled_time: "",
    auto_schedule: false,
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNext = (step) => setCurrentStep(step);
  const handlePrevious = (step) => setCurrentStep(step);

  // // Backend choice maps
  // const PRODUCT_MAP = {
  //   "home-loan": "home_loan",
  //   "personal-loan": "personal_loan",
  //   "business-loan": "business_loan",
  //   "car-loan": "car_loan",
  //   "education-loan": "education_loan",
  // };

  // const TARGET_AUDIENCE_MAP = {
  //   "warm-leads": "warm_leads",
  //   "cold-leads": "cold_leads",
  //   "hot-leads": "hot_leads",
  // };

  // // Allowed agent keys from backend
  // const ALLOWED_AGENTS = ["a1", "a2", "a3"]; // update based on Django AGENT_CHOICES

  const handleLaunch = async () => {
    setErrors({});

    if (formData.timing === "schedule" && !formData.scheduled_time) {
      setErrors({ scheduled_time: "Please select a scheduled date & time" });
      return;
    }

    if (!formData.call_script) {
      setErrors({ call_script: "Please upload a call script file" });
      return;
    }

    try {
      const payload = new FormData();

      // Simple string fields (names must match Django model exactly)
      payload.append("campaign_title", formData.campaign_title);
      payload.append("country", formData.country);
      payload.append("state", formData.state);
      payload.append("city", formData.city);
      payload.append("dialer_type", formData.dialer_type);
      payload.append("retry_attempts", formData.retry_attempts);
      payload.append("timing", formData.timing);

      // Map product to backend value
      // const PRODUCT_MAP = {
      //   "home-loan": "home_loan",
      //   "personal-loan": "personal_loan",
      //   "business-loan": "business_loan",
      //   "car-loan": "car_loan",
      //   "education-loan": "education_loan",
      // };

      payload.append("product", formData.product);

      // target_audience — append each value separately (MultiSelectField)
      (formData.target_audience || []).forEach((ta) =>
        payload.append("target_audience", ta),
      );

      // agent_assignment — append each separately (MultiSelectField)
      (formData.agent_assignment || []).forEach((agent) =>
        payload.append("agent_assignment", agent),
      );

      // call_script file
      if (formData.call_script instanceof File) {
        payload.append("call_script", formData.call_script);
      }

      // ✅ Correct Django field name: schedule_datetime (not scheduled_time)
      if (formData.timing === "schedule" && formData.scheduled_time) {
        payload.append(
          "schedule_datetime",
          new Date(formData.scheduled_time).toISOString(),
        );
      }

      // ✅ Correct Django field name: auto_schedule_followups (not auto_schedule)
      payload.append(
        "auto_schedule_followups",
        formData.auto_schedule ? "true" : "false",
      );

      const res = await dialerCampaignService.create(payload);
      await dialerCampaignService.launch(res.data.id); // ← add this line
      console.log("Campaign created:", res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setCurrentStep(1);
        setFormData({
          campaign_title: "",
          product: "",
          target_audience: [],
          country: "",
          state: "",
          city: "",
          dialer_type: "",
          retry_attempts: "",
          agent_assignment: [],
          call_script: null,
          timing: "now",
          scheduled_time: "",
          auto_schedule: false,
        });
      }, 3000);
    } catch (err) {
      console.error("Error creating campaign:", err.response?.data || err);
      setErrors(err.response?.data || { general: "Something went wrong" });
    }
  };

  return (
    <LaunchDialerCampaign
      currentStep={currentStep}
      steps={steps}
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      handleLaunch={handleLaunch}
      showSuccess={showSuccess}
    />
  );
};

export default CampaignWrapper;
