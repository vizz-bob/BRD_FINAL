// src/components/SignupVerification.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

export default function SignupVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from signup page (passed via state or stored locally)
  const [userData, setUserData] = useState({
    email: location.state?.email || localStorage.getItem("signup_email") || "",
    mobile_no:
      location.state?.mobile || localStorage.getItem("signup_mobile") || "",
    userId:
      location.state?.userId || localStorage.getItem("signup_userId") || "",
  });

  // Verification states
  const [emailOTP, setEmailOTP] = useState(["", "", "", "", "", ""]);
  const [mobileOTP, setMobileOTP] = useState(["", "", "", "", "", ""]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [isEmailOTPSent, setIsEmailOTPSent] = useState(false);
  const [isMobileOTPSent, setIsMobileOTPSent] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const [mobileResendTimer, setMobileResendTimer] = useState(0);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("email"); // 'email' or 'mobile'

  // Redirect to login if no user data
  useEffect(() => {
    if (!userData.email || !userData.mobile_no) {
      navigate("/login");
    }
  }, [userData, navigate]);

  // Timer for resend OTP
  useEffect(() => {
    if (emailResendTimer > 0) {
      const timer = setTimeout(
        () => setEmailResendTimer(emailResendTimer - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [emailResendTimer]);

  useEffect(() => {
    if (mobileResendTimer > 0) {
      const timer = setTimeout(
        () => setMobileResendTimer(mobileResendTimer - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [mobileResendTimer]);

  // Send OTP to email
  const sendEmailOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("auth/send-email-otp/", {
        email: userData.email,
      });

      setIsEmailOTPSent(true);
      setEmailResendTimer(60); // 60 seconds cooldown
      setSuccessMessage("Email OTP sent successfully");
    } catch (err) {
      setError("Failed to send email OTP. Please try again.");
      console.error("Email OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP to mobile
  const sendMobileOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("auth/send-mobile-otp/", {
        mobile_no: userData.mobile_no,
      });

      setIsMobileOTPSent(true);
      setMobileResendTimer(60); // 60 seconds cooldown
      setSuccessMessage("Mobile OTP sent successfully");
    } catch (err) {
      setError("Failed to send mobile OTP. Please try again.");
      console.error("Mobile OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify email OTP
  const verifyEmailOTP = async () => {
    const otp = emailOTP.join("");
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("auth/verify-email-otp/", {
        email: userData.email,
        otp,
      });

      setIsEmailVerified(true);
      setSuccessMessage("Email verified successfully!");

      // Update user verification status
      await updateUserVerificationStatus("email", true);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error("Email verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify mobile OTP
  const verifyMobileOTP = async () => {
    const otp = mobileOTP.join("");
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("auth/verify-mobile-otp/", {
        mobile_no: userData.mobile_no,
        otp,
      });

      setIsMobileVerified(true);
      setSuccessMessage("Mobile number verified successfully!");

      // Update user verification status
      await updateUserVerificationStatus("mobile", true);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error("Mobile verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user verification status in backend
  const updateUserVerificationStatus = async (type, isVerified) => {
    try {
      const payload = {};
      if (type === "email") payload.is_email_verified = isVerified;
      if (type === "mobile") payload.is_mobile_verified = isVerified;

      await axiosInstance.patch(`users/${userData.userId}/`, payload);
    } catch (err) {
      console.error("Error updating verification status:", err);
    }
  };

  // Handle OTP input change
  const handleOTPChange = (value, index, type) => {
    if (isNaN(value)) return;

    if (type === "email") {
      const newOTP = [...emailOTP];
      newOTP[index] = value;
      setEmailOTP(newOTP);

      // Auto focus next input
      if (value && index < 5) {
        document.getElementById(`email-otp-${index + 1}`).focus();
      }
    } else {
      const newOTP = [...mobileOTP];
      newOTP[index] = value;
      setMobileOTP(newOTP);

      // Auto focus next input
      if (value && index < 5) {
        document.getElementById(`mobile-otp-${index + 1}`).focus();
      }
    }
  };

  // Handle backspace in OTP inputs
  const handleOTPKeyDown = (e, index, type) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      if (type === "email") {
        document.getElementById(`email-otp-${index - 1}`).focus();
      } else {
        document.getElementById(`mobile-otp-${index - 1}`).focus();
      }
    }
  };

  // Redirect to login after successful verification
  useEffect(() => {
    if (isEmailVerified && isMobileVerified) {
      const timer = setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Your account has been verified successfully. Please login.",
          },
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isEmailVerified, isMobileVerified, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-xl sm:rounded-lg sm:px-10">
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 text-center">
              Verify Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              We've sent verification codes to your email and mobile number
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {successMessage}
            </div>
          )}

          {/* Verification Status */}
          <div className="mt-6 flex justify-between">
            <div className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  isEmailVerified ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {isEmailVerified ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <EnvelopeIcon className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                Email
              </span>
            </div>
            <div className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  isMobileVerified ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {isMobileVerified ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <PhoneIcon className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                Mobile
              </span>
            </div>
          </div>

          {/* Verification Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("email")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "email"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Email Verification
              </button>
              <button
                onClick={() => setActiveTab("mobile")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "mobile"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Mobile Verification
              </button>
            </nav>
          </div>

          {/* Email Verification Tab */}
          {activeTab === "email" && (
            <div className="mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  We've sent a verification code to
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {userData.email}
                </p>
              </div>

              {!isEmailOTPSent ? (
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={sendEmailOTP}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="flex justify-between space-x-2">
                    {emailOTP.map((digit, index) => (
                      <input
                        key={index}
                        id={`email-otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOTPChange(e.target.value, index, "email")
                        }
                        onKeyDown={(e) => handleOTPKeyDown(e, index, "email")}
                        className="w-12 h-12 text-center border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={sendEmailOTP}
                      disabled={emailResendTimer > 0 || isLoading}
                    >
                      {emailResendTimer > 0
                        ? `Resend in ${emailResendTimer}s`
                        : "Resend OTP"}
                    </button>
                    <button
                      type="button"
                      className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={verifyEmailOTP}
                      disabled={isLoading || isEmailVerified}
                    >
                      {isEmailVerified ? "Verified" : "Verify"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Verification Tab */}
          {activeTab === "mobile" && (
            <div className="mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  We've sent a verification code to
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {userData.mobile_no}
                </p>
              </div>

              {!isMobileOTPSent ? (
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={sendMobileOTP}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="flex justify-between space-x-2">
                    {mobileOTP.map((digit, index) => (
                      <input
                        key={index}
                        id={`mobile-otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOTPChange(e.target.value, index, "mobile")
                        }
                        onKeyDown={(e) => handleOTPKeyDown(e, index, "mobile")}
                        className="w-12 h-12 text-center border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={sendMobileOTP}
                      disabled={mobileResendTimer > 0 || isLoading}
                    >
                      {mobileResendTimer > 0
                        ? `Resend in ${mobileResendTimer}s`
                        : "Resend OTP"}
                    </button>
                    <button
                      type="button"
                      className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={verifyMobileOTP}
                      disabled={isLoading || isMobileVerified}
                    >
                      {isMobileVerified ? "Verified" : "Verify"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Complete Verification Message */}
          {isEmailVerified && isMobileVerified && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="font-medium">Verification Complete!</p>
                  <p className="text-sm">
                    Your account has been verified successfully. Redirecting to
                    login page...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Skip for now */}
          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => navigate("/login")}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
