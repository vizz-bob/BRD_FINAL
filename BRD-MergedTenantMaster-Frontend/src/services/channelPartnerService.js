import axiosInstance from "../utils/axiosInstance";

// Helper function to convert frontend data to backend format
const formatForBackend = (data) => {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    mobile_number: data.mobileNumber,
    email: data.email,
    role_type: data.role_type.toUpperCase(), // Convert to uppercase
    partner_type: data.partnerType,
    company_name: data.companyName || null,
    gstin: data.gstin || null,
    pan_number: data.pan,
    address_line_1: data.address1,
    address_line_2: data.address2 || null,
    country: data.country,
    state: data.state,
    city: data.city,
    pincode: data.pincode,
    status: data.status,
    document_verification_completed: data.isVerified
  };
};

// Helper function to convert backend data to frontend format
const formatForFrontend = (data) => {
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    mobileNumber: data.mobile_number,
    email: data.email,
    role_type: data.role_type,
    partnerType: data.partner_type,
    companyName: data.company_name || '',
    gstin: data.gstin || '',
    pan: data.pan_number,
    address1: data.address_line_1,
    address2: data.address_line_2 || '',
    country: data.country,
    state: data.state,
    city: data.city,
    pincode: data.pincode,
    status: data.status,
    isVerified: data.document_verification_completed,
    created_at: data.created_at
  };
};

export const partnerAPI = {
  getAll: async () => {
    const res = await axiosInstance.get("channel_partners/channel-partners/");
    return res.data.map(formatForFrontend);
  },

  create: async (data) => {
    const payload = formatForBackend(data);
    const res = await axiosInstance.post("channel_partners/channel-partners/", payload);
    return formatForFrontend(res.data);
  },

  update: async (id, data) => {
    const payload = formatForBackend(data);
    const res = await axiosInstance.put(`channel_partners/channel-partners/${id}/`, payload);
    return formatForFrontend(res.data);
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`channel_partners/channel-partners/${id}/`);
    return res.data;
  },
};

export const locationAPI = {
  getCountries: () => axiosInstance.get("locations/countries/").then(res => res.data),
  getStates: (countryName) => axiosInstance.get(`locations/states/?country=${countryName}`).then(res => res.data),
  getCities: (stateName) => axiosInstance.get(`locations/cities/?state=${stateName}`).then(res => res.data),
};
