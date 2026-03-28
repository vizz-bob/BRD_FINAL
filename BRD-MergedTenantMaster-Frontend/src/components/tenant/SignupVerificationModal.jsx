import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupVerificationModal = ({ isOpen, onClose, userContact }) => {
  const [step, setStep] = useState('select'); // 'select', 'otp', 'email'
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Handle OTP Input Change
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const verifyOTP = () => {
    const finalOtp = otp.join("");
    // Backend logic call here
    if (finalOtp === "123456") { // Mock check
      navigate('/login');
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">✕</button>

        {/* STEP 1: Selection */}
        {step === 'select' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Verify Your Account</h2>
            <p className="text-gray-600 mb-6">How would you like to receive your verification code?</p>
            <div className="space-y-4">
              <button 
                onClick={() => setStep('otp')}
                className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Verify via Mobile Number
              </button>
              <button 
                onClick={() => setStep('email')}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Verify via Email Address
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: OTP Input */}
        {step === 'otp' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Mobile Verification</h2>
            <p className="text-gray-500 mb-6">Enter the 6-digit code sent to your phone</p>
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 border-2 rounded-lg text-center text-xl font-bold focus:border-blue-500 outline-none"
                  value={data}
                  onChange={e => handleOtpChange(e.target, index)}
                  onFocus={e => e.target.select()}
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button 
              onClick={verifyOTP}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
            >
              Verify & Proceed
            </button>
            <button onClick={() => setStep('select')} className="mt-4 text-sm text-blue-600 underline">Go Back</button>
          </div>
        )}

        {/* STEP 3: Email Sent */}
        {step === 'email' && (
          <div className="text-center">
            <div className="mb-4 text-5xl">📧</div>
            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to your inbox. Please click the link to verify your account.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
            >
              I've Verified, Go to Login
            </button>
            <p className="mt-4 text-sm text-gray-400">Didn't get the email? <span className="text-blue-600 cursor-pointer">Resend</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupVerificationModal;
