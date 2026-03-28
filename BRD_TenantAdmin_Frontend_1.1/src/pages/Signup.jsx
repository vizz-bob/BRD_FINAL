import { useState, useEffect, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [contactPerson, setContactPerson] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [businessName, setBusinessName] = useState("");
  const [cin, setCin] = useState("");
  const [pan, setPan] = useState("");
  const [gstin, setGstin] = useState("");
  const [usersCount, setUsersCount] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [loanProduct, setLoanProduct] = useState([]);
  const [loanProductOptions, setLoanProductOptions] = useState([]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("product/");
        setLoanProductOptions(res.data);
      } catch (err) {
        console.error("Error loading products", err);
      }
    };
    fetchProducts();
  }, []);

  const FieldError = ({ error }) => {
    if (!error) return null;
    return <div className="mt-1 text-sm text-red-600">{error}</div>;
  };

  const inputBase =
    "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition";
  const inputError = "border-red-300 focus:ring-red-300";

  const validators = {
    contact_person: (v) => {
      if (!v) return "Contact person is required";
      if (v.trim().length < 3) return "Minimum 3 characters required";
      if (!/^[a-zA-Z ]+$/.test(v)) return "Only letters allowed";
      return null;
    },
    mobile_no: (v) => {
      if (!v) return "Mobile number is required";
      if (!/^[6-9]\d{9}$/.test(v)) return "Enter valid 10-digit mobile number";
      return null;
    },
    email: (v) => {
      if (!v) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email format";
      return null;
    },
    address: (v) => {
      if (!v) return "Address is required";
      if (v.trim().length < 10) return "Address too short";
      return null;
    },
    city: (v) => {
      if (!v) return "City is required";
      if (v.trim().length < 2) return "City name too short";
      return null;
    },
    pincode: (v) => {
      if (!v) return "Pincode is required";
      if (!/^\d{6}$/.test(v)) return "Enter valid 6-digit pincode";
      return null;
    },
    state: (v) => {
      if (!v) return "State is required";
      if (v.trim().length < 2) return "State name too short";
      return null;
    },
    country: (v) => {
      if (!v) return "Country is required";
      if (v.trim().length < 2) return "Country name too short";
      return null;
    },
    name: (v) => {
      if (!v) return "Business name is required";
      if (v.trim().length < 3) return "Minimum 3 characters required";
      if (!/^[a-zA-Z0-9 .&-]+$/.test(v)) return "Invalid characters used";
      return null;
    },
    cin: (v) => {
      if (!v) return "CIN is required";
      if (!/^[A-Z]{3}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(v))
        return "Invalid CIN format (e.g., ABC1234DEF567890)";
      return null;
    },
    pan: (v) => {
      if (!v) return "PAN is required";
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v))
        return "Invalid PAN format (e.g., ABCDE1234F)";
      return null;
    },
    gstin: (v) => {
      if (!v) return "GSTIN is required";
      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]{1}[0-9A-Z]{1}[0-9]{1}$/.test(v))
        return "Invalid GSTIN format";
      return null;
    },
    users_count: (v) => {
      if (!v) return "Number of users is required";
      if (isNaN(v) || parseInt(v) < 1) return "Enter a valid number of users";
      return null;
    },
    subscription_type: (v) => {
      if (!v) return "Subscription type is required";
      return null;
    },
    loan_product: (v) => {
      if (!v || v.length === 0) return "At least one loan product is required";
      return null;
    },
    password: (v) => {
      if (!v) return "Password is required";
      if (v.length < 8) return "Minimum 8 characters required";
      if (!/[A-Z]/.test(v)) return "At least one uppercase letter required";
      if (!/[a-z]/.test(v)) return "At least one lowercase letter required";
      if (!/\d/.test(v)) return "At least one number required";
      return null;
    },
  };

  const doSignup = async () => {
    setGlobalError(null);
    setStatus(null);
    setFormErrors({});
    setIsSubmitting(true);

    const errors = {};
    errors.contact_person = validators.contact_person(contactPerson);
    errors.mobile_no = validators.mobile_no(mobile);
    errors.email = validators.email(email);
    errors.address = validators.address(address);
    errors.city = validators.city(city);
    errors.pincode = validators.pincode(pincode);
    errors.state = validators.state(state);
    errors.country = validators.country(country);
    errors.name = validators.name(businessName);
    errors.cin = validators.cin(cin);
    errors.pan = validators.pan(pan);
    errors.gstin = validators.gstin(gstin);
    errors.users_count = validators.users_count(usersCount);
    errors.subscription_type = validators.subscription_type(subscriptionType);
    errors.loan_product = validators.loan_product(loanProduct);
    errors.password = validators.password(password);
    if (password !== confirm) errors.confirm = "Passwords do not match";

    Object.keys(errors).forEach((key) => errors[key] === null && delete errors[key]);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axiosInstance.post("tenant/signup/", {
        name: businessName.trim(),
        email: email.trim().toLowerCase(),
        password,
        mobile_no: mobile,
        address: address.trim(),
        contact_person: contactPerson.trim(),
        loan_product: loanProduct,
        city, state, country, pincode,
        cin: cin.trim(),
        pan: pan.trim(),
        gstin: gstin.trim(),
        users_count: parseInt(usersCount),
        subscription_type: subscriptionType,
      });

      localStorage.setItem("signup_email", email.trim().toLowerCase());
      localStorage.setItem("signup_mobile", mobile);
      localStorage.setItem("signup_userId", response.data.id || response.data.user_id || response.data.tenant_id);
      setStatus("Account created successfully! Redirecting to verification...");

      setTimeout(() => {
        navigate("/verify", {
          state: {
            email: email.trim().toLowerCase(),
            mobile,
            userId: response.data.id || response.data.user_id || response.data.tenant_id,
          },
        });
      }, 1500);
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        const fieldErrors = {};
        Object.keys(data).forEach((key) => {
          fieldErrors[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
        });
        setFormErrors(fieldErrors);
      } else {
        setGlobalError(data?.detail || "Signup failed. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!country) { setStatesList([]); return; }
    // fetchStates();
  }, [country]);

  useEffect(() => {
    if (!state) { setCitiesList([]); return; }
    // fetchCities();
  }, [state]);

  /* ── Multi-select dropdown ── */
  const MultiSelectDropdown = ({ options, selected, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
      function handleClickOutside(event) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target))
          setIsOpen(false);
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (value) => {
      const newSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      onChange(newSelected);
    };

    return (
      <div className="relative" ref={wrapperRef}>
        <div
          className="w-full bg-white border border-gray-300 rounded-lg min-h-[44px] p-2 flex flex-wrap gap-1.5 items-center cursor-pointer hover:border-primary-400 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected.length === 0 ? (
            <span className="text-gray-400 text-sm pl-2 select-none">{placeholder}</span>
          ) : (
            selected.map((item) => (
              <span
                key={item}
                className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold border border-blue-200 flex items-center gap-1"
              >
                {item}
                <span
                  className="cursor-pointer hover:text-blue-900 leading-none"
                  onClick={(e) => { e.stopPropagation(); toggleOption(item); }}
                >
                  ×
                </span>
              </span>
            ))
          )}
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-56 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.id || option.product_name}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                onClick={() => toggleOption(option.product_name)}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                  selected.includes(option.product_name) ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"
                }`}>
                  {selected.includes(option.product_name) && (
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{option.product_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ── Reusable labeled field ── */
  const Label = ({ htmlFor, children, required }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );

  /* ── Section header ── */
  const SectionHeader = ({ title }) => (
    <h3 className="text-base md:text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200 mb-4">
      {title}
    </h3>
  );

  return (
    // Outer: px-4 on mobile, scales up; py gives breathing room top/bottom
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">

      {/* Card container: full width on mobile, max 3xl on desktop */}
      <div className="w-full mx-auto sm:max-w-2xl lg:max-w-3xl">
        <div className="bg-white shadow-lg rounded-xl p-5 sm:p-8 md:p-10">

          {/* ── Header ── */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
              <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Join us today and get started with your business journey
            </p>
          </div>

          {/* ── Global alerts ── */}
          {globalError && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {globalError}
            </div>
          )}
          {status && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {status}
            </div>
          )}

          {/* ══════════════════════════════════════
              PERSONAL INFORMATION
          ══════════════════════════════════════ */}
          <div className="mb-8">
            <SectionHeader title="Personal Information" />
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-5">

              {/* Contact Person */}
              <div>
                <Label htmlFor="contact_person" required>Contact Person</Label>
                <input
                  id="contact_person" name="contact_person" type="text"
                  placeholder="Owner / Manager Name"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className={`${inputBase} ${formErrors.contact_person ? inputError : ""}`}
                />
                <FieldError error={formErrors.contact_person} />
              </div>

              {/* Mobile */}
              <div>
                <Label htmlFor="mobile" required>Mobile Number</Label>
                <input
                  id="mobile" name="mobile" type="tel"
                  maxLength={10} inputMode="numeric" pattern="[6-9]{1}[0-9]{9}"
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className={`${inputBase} ${formErrors.mobile_no ? inputError : ""}`}
                />
                <FieldError error={formErrors.mobile_no} />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" required>Email</Label>
                <input
                  id="email" name="email" type="email" autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputBase} ${formErrors.email ? inputError : ""}`}
                />
                <FieldError error={formErrors.email} />
              </div>

              {/* Address — full width */}
              <div className="sm:col-span-2">
                <Label htmlFor="address" required>Address</Label>
                <textarea
                  id="address" name="address" rows={3}
                  placeholder="Full business address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`${inputBase} resize-none ${formErrors.address ? inputError : ""}`}
                />
                <FieldError error={formErrors.address} />
              </div>

              {/* Country */}
              <div>
                <Label htmlFor="country" required>Country</Label>
                <input
                  id="country" type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={`${inputBase} ${formErrors.country ? inputError : ""}`}
                />
                <FieldError error={formErrors.country} />
              </div>

              {/* State */}
              <div>
                <Label htmlFor="state" required>State</Label>
                <input
                  id="state" type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`${inputBase} ${formErrors.state ? inputError : ""}`}
                />
                <FieldError error={formErrors.state} />
              </div>

              {/* City */}
              <div>
                <Label htmlFor="city" required>City</Label>
                <input
                  id="city" type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`${inputBase} ${formErrors.city ? inputError : ""}`}
                />
                <FieldError error={formErrors.city} />
              </div>

              {/* Pincode */}
              <div>
                <Label htmlFor="pincode" required>Pincode</Label>
                <input
                  id="pincode" name="pincode" type="text"
                  maxLength={6} inputMode="numeric" placeholder="110001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className={`${inputBase} ${formErrors.pincode ? inputError : ""}`}
                />
                <FieldError error={formErrors.pincode} />
              </div>

            </div>
          </div>

          {/* ══════════════════════════════════════
              BUSINESS INFORMATION
          ══════════════════════════════════════ */}
          <div className="mb-8">
            <SectionHeader title="Business Information" />
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-5">

              {/* Business Name — full width */}
              <div className="sm:col-span-2">
                <Label htmlFor="name" required>Business Name</Label>
                <input
                  id="name" name="name" type="text"
                  placeholder="e.g. ABC Finance Pvt Ltd"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={`${inputBase} ${formErrors.name ? inputError : ""}`}
                />
                <FieldError error={formErrors.name} />
              </div>

              {/* Loan Products — full width */}
              <div className="sm:col-span-2">
                <Label htmlFor="loan_product" required>Loan Products</Label>
                <MultiSelectDropdown
                  options={loanProductOptions}
                  selected={loanProduct}
                  onChange={(val) => setLoanProduct(val)}
                  placeholder="Select products (e.g. Personal Loan, Micro Loan)"
                />
                <FieldError error={formErrors.loan_product} />
              </div>

              {/* CIN */}
              <div>
                <Label htmlFor="cin" required>CIN</Label>
                <input
                  id="cin" name="cin" type="text"
                  placeholder="Corporate Identification Number"
                  value={cin}
                  onChange={(e) => setCin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  className={`${inputBase} ${formErrors.cin ? inputError : ""}`}
                />
                <FieldError error={formErrors.cin} />
              </div>

              {/* PAN */}
              <div>
                <Label htmlFor="pan" required>PAN</Label>
                <input
                  id="pan" name="pan" type="text"
                  placeholder="Permanent Account Number"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  className={`${inputBase} ${formErrors.pan ? inputError : ""}`}
                />
                <FieldError error={formErrors.pan} />
              </div>

              {/* GSTIN */}
              <div>
                <Label htmlFor="gstin" required>GSTIN</Label>
                <input
                  id="gstin" name="gstin" type="text"
                  placeholder="GST Identification Number"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  className={`${inputBase} ${formErrors.gstin ? inputError : ""}`}
                />
                <FieldError error={formErrors.gstin} />
              </div>

              {/* Users Count */}
              <div>
                <Label htmlFor="users_count" required>No. of Users / Clients</Label>
                <input
                  id="users_count" name="users_count" type="number" min="1"
                  placeholder="Estimated number of users"
                  value={usersCount}
                  onChange={(e) => setUsersCount(e.target.value)}
                  className={`${inputBase} ${formErrors.users_count ? inputError : ""}`}
                />
                <FieldError error={formErrors.users_count} />
              </div>

              {/* Subscription Type */}
              <div className="sm:col-span-2">
                <Label htmlFor="subscription_type" required>Subscription Type</Label>
                <select
                  id="subscription_type" name="subscription_type"
                  value={subscriptionType}
                  onChange={(e) => setSubscriptionType(e.target.value)}
                  className={`${inputBase} bg-white ${formErrors.subscription_type ? inputError : ""}`}
                >
                  <option value="">Select subscription type</option>
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                <FieldError error={formErrors.subscription_type} />
              </div>

            </div>
          </div>

          {/* ══════════════════════════════════════
              ACCOUNT INFORMATION
          ══════════════════════════════════════ */}
          <div className="mb-8">
            <SectionHeader title="Account Information" />
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-5">

              {/* Password */}
              <div>
                <Label htmlFor="password" required>Password</Label>
                <input
                  id="password" name="password" type="password" autoComplete="new-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputBase} ${formErrors.password ? inputError : ""}`}
                />
                <FieldError error={formErrors.password} />
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirm_password" required>Confirm Password</Label>
                <input
                  id="confirm_password" name="confirm_password" type="password"
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`${inputBase} ${formErrors.confirm ? inputError : ""}`}
                />
                <FieldError error={formErrors.confirm} />
              </div>

            </div>
          </div>

          {/* ── Submit ── */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={doSignup}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account…
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* ── Login link ── */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </p>

          {/* ── Terms ── */}
          <p className="mt-4 text-center text-xs text-gray-400">
            By signing up, you agree to our{" "}
            <a href="#" className="text-primary-600 hover:text-primary-500">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
          </p>

        </div>
      </div>
    </div>
  );
}