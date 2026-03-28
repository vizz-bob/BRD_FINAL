// ─────────────────────────────────────────────────────────────────
//  services/resourceService.js
//  API service layer for Resources & Resource Categories module.
//
//  Django models : Resource, ResourceCategory
//  ViewSets      : ResourceViewSet, ResourceCategoryViewSet
//  Endpoints     :
//    /resources/            (ResourceViewSet)
//    /resource-categories/  (ResourceCategoryViewSet)
//
//  Fields covered:
//    ResourceCategory : name, type (GUIDE|TRAINING|FORM|SUPPORT|QUICK)
//    Resource         : category (FK), title, file_type (PDF|DOCX|VIDEO|LINK),
//                       file, external_link, file_size, duration,
//                       downloads, created_at
// ─────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ══════════════════════════════════════════════
//  AUTH HELPERS
// ══════════════════════════════════════════════

const getAuthToken = () => localStorage.getItem("authToken");

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

/**
 * Build headers.
 * @param {boolean} isFormData - skip Content-Type for file uploads
 */
const getHeaders = (isFormData = false) => {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Token ${token}`;
  const csrf = getCookie("csrftoken");
  if (csrf) headers["X-CSRFToken"] = csrf;
  return headers;
};

// ══════════════════════════════════════════════
//  CORE FETCH WRAPPER
// ══════════════════════════════════════════════

/**
 * @param {string}           endpoint  - e.g. "/resources/"
 * @param {string}           method    - GET | POST | PUT | PATCH | DELETE
 * @param {object|FormData}  body      - request payload
 * @returns {Promise<any>}
 */
const request = async (endpoint, method = "GET", body = null) => {
  const isFormData = body instanceof FormData;

  const config = {
    method,
    headers: getHeaders(isFormData),
    credentials: "include",
  };

  if (body) config.body = isFormData ? body : JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
    return;
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.detail || `Request failed: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// ══════════════════════════════════════════════
//  CONSTANTS
//  Mirror Django model choices exactly
// ══════════════════════════════════════════════

/** ResourceCategory.CATEGORY_CHOICES */
export const CATEGORY_TYPES = {
  GUIDE: "GUIDE",
  TRAINING: "TRAINING",
  FORM: "FORM",
  SUPPORT: "SUPPORT",
  QUICK: "QUICK",
};

/** Resource.FILE_TYPE_CHOICES */
export const FILE_TYPES = {
  PDF: "PDF",
  DOCX: "DOCX",
  VIDEO: "VIDEO",
  LINK: "LINK",
};

// ══════════════════════════════════════════════
//  RESOURCE CATEGORY SERVICE
//  All CRUD operations for /resource-categories/
//
//  ResourceCategory model fields:
//    name : string
//    type : GUIDE | TRAINING | FORM | SUPPORT | QUICK
// ══════════════════════════════════════════════

export const resourceCategoryService = {

  // ── READ ────────────────────────────────────

  /**
   * Get all resource categories.
   * GET /resource-categories/
   *
   * @param {object} params - optional filters:
   *   {
   *     type : string,  // "GUIDE" | "TRAINING" | "FORM" | "SUPPORT" | "QUICK"
   *   }
   *
   * @example
   *   resourceCategoryService.getAll({ type: "GUIDE" })
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/resource-categories/${query ? `?${query}` : ""}`);
  },

  /**
   * Get a single resource category by ID.
   * GET /resource-categories/:id/
   *
   * @param {number} id
   */
  getById: (id) => request(`/resource-categories/${id}/`),

  /**
   * Get all categories of a specific type.
   * GET /resource-categories/?type=:type
   *
   * @param {string} type - one of CATEGORY_TYPES values
   *
   * @example
   *   resourceCategoryService.getByType(CATEGORY_TYPES.TRAINING)
   */
  getByType: (type) => request(`/resource-categories/?type=${type}`),

  // ── CREATE ──────────────────────────────────

  /**
   * Create a new resource category.
   * POST /resource-categories/
   *
   * @param {object} data - {
   *   name : string,  // required
   *   type : string,  // required — "GUIDE"|"TRAINING"|"FORM"|"SUPPORT"|"QUICK"
   * }
   *
   * @example
   *   resourceCategoryService.create({
   *     name: "Loan Product Guides",
   *     type: CATEGORY_TYPES.GUIDE,
   *   });
   */
  create: (data) => request("/resource-categories/", "POST", data),

  // ── UPDATE ──────────────────────────────────

  /**
   * Full update of a category.
   * PUT /resource-categories/:id/
   *
   * @param {number} id
   * @param {object} data - { name, type }
   */
  update: (id, data) => request(`/resource-categories/${id}/`, "PUT", data),

  /**
   * Partial update of a category.
   * PATCH /resource-categories/:id/
   *
   * @param {number} id
   * @param {object} fields
   *
   * @example
   *   resourceCategoryService.patch(2, { name: "Updated Guide Name" })
   */
  patch: (id, fields) => request(`/resource-categories/${id}/`, "PATCH", fields),

  // ── DELETE ──────────────────────────────────

  /**
   * Delete a resource category.
   * Note: Deleting a category will CASCADE delete all its resources.
   * DELETE /resource-categories/:id/
   *
   * @param {number} id
   */
  delete: (id) => request(`/resource-categories/${id}/`, "DELETE"),

  // ── HELPERS ─────────────────────────────────

  /**
   * Get human-readable label for a category type.
   * @param {string} type
   * @returns {string}
   *
   * @example
   *   resourceCategoryService.getTypeLabel("GUIDE")
   *   // → "Product Guides"
   */
  getTypeLabel: (type) => {
    const labels = {
      GUIDE: "Product Guides",
      TRAINING: "Training Materials",
      FORM: "Forms & Templates",
      SUPPORT: "Support & Help",
      QUICK: "Quick Links",
    };
    return labels[type] || type;
  },
};

// ══════════════════════════════════════════════
//  RESOURCE SERVICE
//  All CRUD operations for /resources/
//
//  Resource model fields:
//    category      : FK → ResourceCategory
//    title         : string
//    file_type     : PDF | DOCX | VIDEO | LINK
//    file          : FileField (upload_to="resources/files/")
//    external_link : URLField (for LINK type)
//    file_size     : string (e.g. "2.4 MB")
//    duration      : string (e.g. "12 mins", for VIDEO)
//    downloads     : int (auto-tracked)
//    created_at    : datetime (auto, read-only)
// ══════════════════════════════════════════════

export const resourceService = {

  // ── READ ────────────────────────────────────

  /**
   * Get all resources.
   * GET /resources/
   *
   * @param {object} params - optional filters:
   *   {
   *     category  : number,  // category ID
   *     file_type : string,  // "PDF" | "DOCX" | "VIDEO" | "LINK"
   *   }
   *
   * @example
   *   resourceService.getAll({ file_type: "VIDEO" })
   *   resourceService.getAll({ category: 3, file_type: "PDF" })
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/resources/${query ? `?${query}` : ""}`);
  },

  /**
   * Get a single resource by ID.
   * GET /resources/:id/
   *
   * @param {number} id
   */
  getById: (id) => request(`/resources/${id}/`),

  /**
   * Get all resources in a specific category.
   * GET /resources/?category=:categoryId
   *
   * @param {number} categoryId
   *
   * @example
   *   resourceService.getByCategory(4)
   */
  getByCategory: (categoryId) => request(`/resources/?category=${categoryId}`),

  /**
   * Get all resources of a specific file type.
   * GET /resources/?file_type=:fileType
   *
   * @param {string} fileType - one of FILE_TYPES values
   *
   * @example
   *   resourceService.getByFileType(FILE_TYPES.PDF)
   */
  getByFileType: (fileType) => request(`/resources/?file_type=${fileType}`),

  /**
   * Get all PDF resources.
   * GET /resources/?file_type=PDF
   */
  getPDFs: () => request(`/resources/?file_type=${FILE_TYPES.PDF}`),

  /**
   * Get all video resources.
   * GET /resources/?file_type=VIDEO
   */
  getVideos: () => request(`/resources/?file_type=${FILE_TYPES.VIDEO}`),

  /**
   * Get all external link resources.
   * GET /resources/?file_type=LINK
   */
  getLinks: () => request(`/resources/?file_type=${FILE_TYPES.LINK}`),

  // ── CREATE ──────────────────────────────────

  /**
   * Create a resource WITHOUT a file (e.g. external link or metadata only).
   * POST /resources/
   *
   * @param {object} data - {
   *   category      : number,  // required — category ID
   *   title         : string,  // required
   *   file_type     : string,  // required — "PDF"|"DOCX"|"VIDEO"|"LINK"
   *   external_link?: string,  // required if file_type is "LINK"
   *   file_size?    : string,  // e.g. "2.4 MB"
   *   duration?     : string,  // e.g. "12 mins" (for VIDEO)
   * }
   *
   * @example
   *   resourceService.create({
   *     category: 2,
   *     title: "Loan Application Guide",
   *     file_type: FILE_TYPES.LINK,
   *     external_link: "https://example.com/guide",
   *   });
   */
  create: (data) => request("/resources/", "POST", data),

  /**
   * Create a resource WITH a file upload.
   * Uses FormData — handles PDF, DOCX, VIDEO files.
   * POST /resources/
   *
   * @param {object} data - {
   *   category   : number,   // required
   *   title      : string,   // required
   *   file_type  : string,   // required — "PDF" | "DOCX" | "VIDEO"
   *   file       : File,     // required — the actual file object
   *   file_size? : string,   // optional — e.g. "2.4 MB"
   *   duration?  : string,   // optional — for videos
   * }
   *
   * @example
   *   resourceService.createWithFile({
   *     category: 1,
   *     title: "Home Loan Brochure",
   *     file_type: FILE_TYPES.PDF,
   *     file: fileInputRef.current.files[0],
   *     file_size: "1.2 MB",
   *   });
   */
  createWithFile: ({ file, ...rest }) => {
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(rest).forEach(([key, val]) => {
      if (val !== undefined && val !== null) formData.append(key, val);
    });
    return request("/resources/", "POST", formData);
  },

  // ── UPDATE ──────────────────────────────────

  /**
   * Full update of a resource.
   * PUT /resources/:id/
   *
   * @param {number} id
   * @param {object} data
   */
  update: (id, data) => request(`/resources/${id}/`, "PUT", data),

  /**
   * Partial update — only send fields you want to change.
   * PATCH /resources/:id/
   *
   * @param {number} id
   * @param {object} fields
   *
   * @example
   *   resourceService.patch(5, { title: "Updated Title" })
   *   resourceService.patch(5, { external_link: "https://newlink.com" })
   */
  patch: (id, fields) => request(`/resources/${id}/`, "PATCH", fields),

  /**
   * Replace the file attached to a resource.
   * PATCH /resources/:id/  with FormData
   *
   * @param {number} id
   * @param {File}   file - new file to upload
   *
   * @example
   *   resourceService.replaceFile(5, newFileInput.files[0])
   */
  replaceFile: (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request(`/resources/${id}/`, "PATCH", formData);
  },

  /**
   * Increment the download count for a resource by 1.
   * PATCH /resources/:id/
   * Note: If your backend auto-increments downloads, you can skip this.
   *
   * @param {number} id
   * @param {number} currentDownloads - current downloads value from the object
   */
  incrementDownloads: (id, currentDownloads = 0) =>
    request(`/resources/${id}/`, "PATCH", {
      downloads: currentDownloads + 1,
    }),

  // ── DELETE ──────────────────────────────────

  /**
   * Delete a resource.
   * DELETE /resources/:id/
   *
   * @param {number} id
   */
  delete: (id) => request(`/resources/${id}/`, "DELETE"),

  // ── HELPERS ─────────────────────────────────

  /**
   * Get human-readable label for a file type.
   * @param {string} fileType
   * @returns {string}
   *
   * @example
   *   resourceService.getFileTypeLabel("PDF")  // → "PDF"
   *   resourceService.getFileTypeLabel("VIDEO") // → "Video"
   */
  getFileTypeLabel: (fileType) => {
    const labels = {
      PDF: "PDF",
      DOCX: "DOCX",
      VIDEO: "Video",
      LINK: "Link",
    };
    return labels[fileType] || fileType;
  },

  /**
   * Get icon name suggestion for a file type (for use with icon libraries).
   * @param {string} fileType
   * @returns {string}
   */
  getFileTypeIcon: (fileType) => {
    const icons = {
      PDF: "file-text",
      DOCX: "file",
      VIDEO: "play-circle",
      LINK: "external-link",
    };
    return icons[fileType] || "file";
  },

  /**
   * Get the full URL for a resource file hosted by Django.
   * @param {string} filePath - e.g. "resources/files/brochure.pdf"
   * @returns {string} full URL
   *
   * @example
   *   resourceService.getFileUrl("resources/files/brochure.pdf")
   *   // → "http://localhost:8000/media/resources/files/brochure.pdf"
   */
  getFileUrl: (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    return `${BASE_URL}/media/${filePath}`;
  },

  /**
   * Determine whether a resource uses a file upload or an external link.
   * @param {object} resource
   * @returns {"file"|"link"|"none"}
   */
  getResourceSource: (resource) => {
    if (resource.file) return "file";
    if (resource.external_link) return "link";
    return "none";
  },

  /**
   * Format downloads count for display.
   * @param {number} count
   * @returns {string} e.g. "1.2k" for 1200+
   */
  formatDownloads: (count = 0) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return String(count);
  },

  /**
   * Format created_at datetime for display.
   * @param {string} isoString
   * @returns {string} e.g. "15 Mar 2024"
   */
  formatDate: (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  },
};

// ══════════════════════════════════════════════
//  USAGE EXAMPLES (for reference)
// ══════════════════════════════════════════════

/*

── Get all resources in a category:
   const items = await resourceService.getByCategory(categoryId);

── Get all PDF resources:
   const pdfs = await resourceService.getPDFs();

── Upload a new PDF resource:
   await resourceService.createWithFile({
     category: 1,
     title: "Home Loan Brochure",
     file_type: FILE_TYPES.PDF,
     file: fileInput.files[0],
     file_size: "1.2 MB",
   });

── Create an external link resource:
   await resourceService.create({
     category: 3,
     title: "Loan Application Portal",
     file_type: FILE_TYPES.LINK,
     external_link: "https://portal.example.com",
   });

── Track a download:
   await resourceService.incrementDownloads(resource.id, resource.downloads);

── Replace a file:
   await resourceService.replaceFile(resource.id, newFileInput.files[0]);

── Get display URL for a file:
   const url = resourceService.getFileUrl(resource.file);
   window.open(url, "_blank");

── Get all categories of type TRAINING:
   const cats = await resourceCategoryService.getByType(CATEGORY_TYPES.TRAINING);

*/