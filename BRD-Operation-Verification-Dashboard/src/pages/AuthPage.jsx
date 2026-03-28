import React, { useState } from 'react';
import { CheckCircle, MapPin } from 'lucide-react';
import SignIn from '../components/Auth/SignIn';
import SignUp from '../components/Auth/SignUp';

const AuthPage = ({ onSignIn, onSignUp }) => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl flex flex-col-reverse md:flex-row gap-8 items-center">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            Verification Portal
          </h1>
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8">
            Streamline KYC, document verification, and field operations with real-time tracking and analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center md:items-start justify-center md:justify-start text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-600" size={18} />
              <span>Real-time SLA Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-600" size={18} />
              <span>Geo-tagged Visits</span>
            </div>
          </div>
        </div>
        <div className="w-full max-w-md">
          {showSignUp ? (
            <SignUp onSwitch={() => setShowSignUp(false)} onSignUp={onSignUp} />
          ) : (
            <SignIn onSwitch={() => setShowSignUp(true)} onSignIn={onSignIn} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;