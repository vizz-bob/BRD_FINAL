// src/utils/buildVoiceCampaignPayload.js

export const buildVoiceCampaignPayload = (formData) => {
  const payload = new FormData();

  payload.append("campaign_title", formData.campaignTitle);
  payload.append("product", formData.product);

  payload.append(
    "target_audience",
    JSON.stringify(formData.targetAudience || [])
  );

  payload.append("voice_source", formData.voiceSource);

  if (formData.voiceSource === "upload" && formData.audioFile) {
    payload.append("audio_file", formData.audioFile);
  }

  if (formData.voiceSource === "tts") {
    payload.append("tts_text", formData.ttsText);
    payload.append("tts_voice", formData.ttsVoice || "default");
  }

  payload.append("timing", formData.timing);

  if (formData.timing === "schedule") {
    payload.append("schedule_datetime", formData.scheduleDateTime);
  }

  payload.append("retry_attempts", formData.retryAttempts || 0);
  payload.append("ivr_tracking", formData.ivrTracking || false);

  return payload;
};
