import { useState, useRef, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  DocumentTextIcon,
  ChevronDownIcon,
  CheckIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

const FormLabel = ({ children, required }) => (
  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 ml-0.5 select-none">
    {children}
    {required && <span className="text-rose-500 ml-1">*</span>}
  </label>
);

const InputBox = ({ value, onChange, placeholder, icon: Icon, ...props }) => (
  <div className="relative flex items-center group">
    {Icon && (
      <div className="absolute left-0 pl-4 flex items-center pointer-events-none z-10 text-slate-400 group-focus-within:text-primary-500 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
    )}
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-white border border-slate-300 text-slate-800 font-bold text-sm rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 hover:border-slate-400 block p-3.5 shadow-sm transition-all outline-none placeholder:text-slate-300 ${Icon ? "pl-11" : ""}`}
      {...props}
    />
  </div>
);

const TextareaBox = ({ value, onChange, placeholder, icon: Icon, ...props }) => (
  <div className="relative flex group">
    {Icon && (
      <div className="absolute left-0 top-3.5 pl-4 flex items-start pointer-events-none z-10 text-slate-400 group-focus-within:text-primary-500 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
    )}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
      className={`w-full bg-white border border-slate-300 text-slate-800 font-bold text-sm rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 hover:border-slate-400 block p-3.5 shadow-sm transition-all outline-none placeholder:text-slate-300 resize-none ${Icon ? "pl-11" : ""}`}
      {...props}
    />
  </div>
);

const MultiSelectDropdown = ({ options, selectedIds, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (id) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];
    onChange(newSelected);
  };

  const getLabel = (id) => options.find((o) => o.id === id)?.name || id;

  return (
    <div className="relative group" ref={wrapperRef}>
      <div
        className="w-full bg-white border border-slate-300 text-slate-800 font-bold text-sm rounded-xl focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-600 hover:border-slate-400 min-h-[48px] p-2 flex flex-wrap gap-2 items-center cursor-pointer transition-all shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedIds.length === 0 ? (
          <span className="text-slate-300 pl-2 select-none font-medium">{placeholder}</span>
        ) : (
          selectedIds.map((id) => (
            <span key={id} className="bg-primary-50 text-primary-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-primary-100 flex items-center gap-1">
              {getLabel(id)}
              <span
                className="cursor-pointer hover:text-primary-900 bg-primary-100 rounded-full w-4 h-4 flex items-center justify-center"
                onClick={(e) => { e.stopPropagation(); toggleOption(id); }}
              >×</span>
            </span>
          ))
        )}
        <div className="ml-auto pr-2 text-slate-400">
          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fade-in p-1">
          {options.length > 0 ? options.map((option) => (
            <div
              key={option.id}
              className={`px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors rounded-lg ${selectedIds.includes(option.id) ? "bg-primary-50/50" : ""}`}
              onClick={() => toggleOption(option.id)}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedIds.includes(option.id) ? "bg-primary-600 border-primary-600" : "border-slate-300 bg-white"}`}>
                {selectedIds.includes(option.id) && <CheckIcon className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className={`text-sm font-bold ${selectedIds.includes(option.id) ? "text-primary-700" : "text-slate-600"}`}>
                {option.name}
              </span>
            </div>
          )) : (
            <div className="px-4 py-3 text-sm text-slate-400 text-center">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default function AddBusiness() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    business_name: "",
    pan_number: "",
    cin: "",
    gstin: "",
    registered_address: "",
    mapped_products: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("product/");
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setProducts(data.map((p) => ({ id: p.id, name: p.product_name })));
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    if (!form.business_name || !form.pan_number || !form.gstin) {
      alert("Business Name, PAN and GSTIN are required");
      return;
    }
    setLoading(true);
    const payload = {
      business_name: form.business_name,
      pan_number: form.pan_number,
      gstin: form.gstin,
      cin: form.cin || null,
      registered_address: form.registered_address,
      mapped_products: form.mapped_products,
    };
    try {
      await axiosInstance.post("businesses/create/", payload);
      alert("Business added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to add business. Check PAN/GSTIN uniqueness.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto min-h-screen bg-slate-50 font-sans">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter mb-2">Add New Business</h1>
          <p className="text-slate-500 text-base md:text-lg font-medium">Register a new business entity under your tenant account.</p>
        </div>
      </div>

      <div className="max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 px-6 md:px-10 py-6 md:py-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm shrink-0">
            <BuildingOffice2Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-800">Business Details</h3>
            <p className="text-sm text-slate-400 font-medium">Please provide official registration details.</p>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-8 md:space-y-10">
          {/* Section 1 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">1</span>
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Identity & Registration</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-4">
              <div className="col-span-1 md:col-span-2">
                <FormLabel required>Business Name</FormLabel>
                <InputBox
                  value={form.business_name}
                  onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                  placeholder="Alpha Global Solutions Pvt Ltd"
                />
              </div>
              <div>
                <FormLabel required>PAN Number</FormLabel>
                <InputBox
                  value={form.pan_number}
                  onChange={(e) => setForm({ ...form, pan_number: e.target.value.toUpperCase() })}
                  maxLength={10}
                />
              </div>
              <div>
                <FormLabel>CIN</FormLabel>
                <InputBox
                  placeholder="U12345MH2023PTC123456"
                  value={form.cin}
                  onChange={(e) => setForm({ ...form, cin: e.target.value.toUpperCase() })}
                  icon={DocumentTextIcon}
                  maxLength={21}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <FormLabel required>GSTIN</FormLabel>
                <InputBox
                  value={form.gstin}
                  onChange={e => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                  maxLength={15}
                />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">2</span>
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Location & Products</h4>
            </div>
            <div className="grid grid-cols-1 gap-6 pl-0 md:pl-4">
              <div>
                <FormLabel>Registered Address</FormLabel>
                <TextareaBox
                  value={form.registered_address}
                  onChange={e => setForm({ ...form, registered_address: e.target.value })}
                />
              </div>
              <div>
                <FormLabel>Mapped Loan Products</FormLabel>
                <MultiSelectDropdown
                  options={products}
                  selectedIds={form.mapped_products}
                  onChange={val => setForm({ ...form, mapped_products: val })}
                  placeholder="Select applicable products"
                />
                <p className="text-[10px] text-slate-400 mt-2 ml-1 font-medium">* Select products this business is authorized to offer.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 md:px-10 py-6 md:py-8 border-t border-slate-200 flex flex-wrap justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-6 md:px-8 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200 transition-all uppercase tracking-widest text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 md:px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs flex items-center gap-2"
          >
            {loading ? "Registering..." : "Register Business"}
          </button>
        </div>
      </div>
    </div>
  );
}