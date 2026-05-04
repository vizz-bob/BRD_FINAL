# ReferPeople.in — Complete Platform Transformation Guide
## From BRD LoanCRM → Multi-Service Real Estate + Loans + Jobs + Education Platform

**Domain:** referpeople.in  
**Platform Version:** 2.0  
**Date:** May 2026  
**Stack:** Django REST Framework + React 19 + PostgreSQL + Redis + Nginx + Docker + AWS EKS

---

## TABLE OF CONTENTS

1. [Platform Overview](#1-platform-overview)
2. [Service Architecture — 4 Pages](#2-service-architecture)
3. [Account Hierarchy — Super Admin / Admin / Tenant / User](#3-account-hierarchy)
4. [Color Scheme & Branding](#4-color-scheme--branding)
5. [Complete Folder Structure](#5-complete-folder-structure)
6. [Database Design for All 4 Services](#6-database-design)
7. [Backend Services — All APIs](#7-backend-services)
8. [Frontend Pages — All 4 Services](#8-frontend-pages)
9. [Nginx Configuration for referpeople.in](#9-nginx-configuration)
10. [Environment Variables — All Services](#10-environment-variables)
11. [Docker Compose — Full Platform](#11-docker-compose)
12. [AWS Deployment — Step by Step](#12-aws-deployment)
13. [DNS Setup for referpeople.in](#13-dns-setup)
14. [SSL Certificate (HTTPS)](#14-ssl-certificate)
15. [Git Branch Strategy](#15-git-branch-strategy)
16. [GitHub Actions CI/CD Pipeline](#16-github-actions-cicd)
17. [All Files Required — Checklist](#17-all-files-required)
18. [Login Credentials & Test Accounts](#18-login-credentials)
19. [Troubleshooting Guide](#19-troubleshooting-guide)

---

## 1. Platform Overview

**ReferPeople.in** is a multi-service platform built on the existing BRD LoanCRM codebase, transformed into four distinct service verticals accessible from one domain:

| Page | URL Path | Service |
|------|----------|---------|
| Page 1 (Home) | referpeople.in/ | **Real Estate** — Buy / Sell / Rent Properties |
| Page 2 | referpeople.in/loans/ | **Loans** — Home Loan, LAP, Personal Loan, Business Loan |
| Page 3 | referpeople.in/jobs/ | **Jobs & Careers** — Job Listings, Applications, Recruitment |
| Page 4 | referpeople.in/education/ | **Higher Education** — College Admissions, Counselling, Applications |

### Account Types Across All Services

```
SUPER ADMIN
    └── MASTER ADMIN (per platform)
            └── TENANT (Real Estate Agency / Bank / Employer / College)
                    └── USER (Property Buyer / Borrower / Job Seeker / Student)
```

---

## 2. Service Architecture

### Page 1 — Real Estate (referpeople.in/)
- **Features:** Property listings (buy/sell/rent), search & filters, agent profiles, property valuation, inquiry management
- **Backend:** `realestate-backend` (port 8001)
- **Frontend:** `realestate-frontend` (port 3000)
- **Database:** `referpeople_realestate` (PostgreSQL)

### Page 2 — Loans (referpeople.in/loans/)
- **Features:** Loan products (Home Loan, LAP, Personal, Business), EMI calculator, application tracking, document upload
- **Backend:** `loans-backend` (port 8002) — reuses BRD loan microservice core
- **Frontend:** `loans-frontend` (port 3001)
- **Database:** `referpeople_loans`

### Page 3 — Jobs & Careers (referpeople.in/jobs/)
- **Features:** Job listings, candidate profiles, applications, recruiter dashboard, resume upload
- **Backend:** `jobs-backend` (port 8003)
- **Frontend:** `jobs-frontend` (port 3002)
- **Database:** `referpeople_jobs`

### Page 4 — Higher Education (referpeople.in/education/)
- **Features:** College search, course listings, admission applications, counselling slots, document verification
- **Backend:** `education-backend` (port 8004)
- **Frontend:** `education-frontend` (port 3003)
- **Database:** `referpeople_education`

### Shared Services
- **Auth Service** (port 8000) — Central JWT authentication for all 4 services
- **Master Admin Backend** (port 8005) — Super Admin + Master Admin panel
- **Redis** (port 6379) — Caching + session management
- **Nginx** (port 80/443) — Routes all traffic by path

---

## 3. Account Hierarchy

### Level 1 — SUPER ADMIN
- Created once via Django management command
- Has unrestricted access to ALL services and ALL tenants
- Can create/delete Master Admins, enable/disable entire services
- Login URL: `referpeople.in/super-admin/`
- Default credentials (change immediately after deploy):
  - Email: `superadmin@referpeople.in`
  - Password: `SuperAdmin@2024`

### Level 2 — MASTER ADMIN
- Created by Super Admin
- Manages one or more service verticals (e.g., manages all Real Estate operations)
- Can create/manage Tenants within their assigned service
- Login URL: `referpeople.in/master-admin/`
- Permissions: CRUD on Tenants, view all data, manage subscriptions

### Level 3 — TENANT ADMIN
- A Real Estate Agency, Bank, Employer, or College registered on the platform
- Has their own dashboard with their listings/loans/jobs/admissions
- Can create Staff Users under them
- Login URL: `referpeople.in/tenant/login/`
- Tenant Types:
  - Real Estate: `AGENCY`, `DEVELOPER`, `INDIVIDUAL_AGENT`
  - Loans: `BANK`, `NBFC`, `FINTECH`
  - Jobs: `COMPANY`, `RECRUITER`
  - Education: `UNIVERSITY`, `COLLEGE`, `COACHING`

### Level 4 — NORMAL USER (Public)
- Registers via the public website
- Can search properties, apply for loans, apply for jobs, apply for admissions
- Login URL: `referpeople.in/login/`
- Self-registration enabled on all 4 service pages

### RBAC Permissions Matrix

| Role | Real Estate | Loans | Jobs | Education |
|------|-------------|-------|------|-----------|
| Super Admin | Full | Full | Full | Full |
| Master Admin | Full (assigned service) | Full (assigned) | Full (assigned) | Full (assigned) |
| Tenant Admin | Own listings only | Own products only | Own jobs only | Own courses only |
| Staff/Agent | View + create leads | View + create applications | View + create candidates | View + create applicants |
| Normal User | Search + inquire | Apply + track | Apply + track | Apply + track |

---

## 4. Color Scheme & Branding

### Primary Brand Colors (Blue + White with Orange & Purple accents)

```css
/* === REFERPEOPLE.IN BRAND THEME === */
:root {
  /* Primary — Navy Blue */
  --rp-primary:        #1A3C6E;
  --rp-primary-light:  #2B5BA8;
  --rp-primary-dark:   #0F2444;

  /* Accent — Sky Blue */
  --rp-accent:         #0EA5E9;
  --rp-accent-light:   #38BDF8;
  --rp-accent-dark:    #0284C7;

  /* Highlight — Orange (from option 3) */
  --rp-orange:         #EA580C;
  --rp-orange-light:   #FB923C;
  --rp-orange-dark:    #C2410C;

  /* Highlight — Purple (from option 4) */
  --rp-purple:         #7C3AED;
  --rp-purple-light:   #A78BFA;
  --rp-purple-dark:    #5B21B6;

  /* Backgrounds */
  --rp-bg:             #FFFFFF;
  --rp-bg-secondary:   #F0F4F8;
  --rp-bg-dark:        #0F172A;

  /* Text */
  --rp-text:           #1F2937;
  --rp-text-light:     #6B7280;
  --rp-text-white:     #FFFFFF;

  /* Service Page Colors */
  --realestate-color:  #1A3C6E;   /* Blue — Real Estate */
  --loans-color:       #EA580C;   /* Orange — Loans */
  --jobs-color:        #7C3AED;   /* Purple — Jobs */
  --education-color:   #0EA5E9;   /* Sky Blue — Education */

  /* Status Colors */
  --success:           #16A34A;
  --warning:           #D97706;
  --error:             #DC2626;
  --info:              #2563EB;

  /* Typography */
  --font-primary:      'Inter', 'Segoe UI', sans-serif;
  --font-heading:      'Poppins', 'Inter', sans-serif;

  /* Shadows */
  --shadow-sm:         0 1px 3px rgba(0,0,0,0.1);
  --shadow-md:         0 4px 12px rgba(26,60,110,0.15);
  --shadow-lg:         0 10px 30px rgba(26,60,110,0.2);

  /* Border Radius */
  --radius-sm:         4px;
  --radius-md:         8px;
  --radius-lg:         16px;
  --radius-full:       9999px;
}
```

### Per-Service Theme Application
- **Real Estate page** — Navy blue navbar, blue property cards, orange CTA buttons
- **Loans page** — Orange header gradient, blue action buttons, orange highlights
- **Jobs page** — Purple sidebar navigation, blue cards, purple tags
- **Education page** — Sky blue hero, purple course categories, orange admission CTA

### Logo & Favicon
- Place logo at: `public/logo.png` (512x512 PNG)
- Favicon: `public/favicon.ico`
- Brand name: **ReferPeople** (written as one word)
- Tagline: *"Find Property. Get Loans. Land Jobs. Start Learning."*

---

## 5. Complete Folder Structure

```
referpeople-platform/               <- Root repo (rename from BRD_FINAL)
├── .github/
│   └── workflows/
│       ├── deploy-production.yml   <- CI/CD: main branch -> AWS
│       └── deploy-developer.yml    <- CI/CD: dev branch -> staging
│
├── nginx/
│   └── conf.d/
│       └── referpeople.conf        <- Main nginx config for referpeople.in
│
├── aws-deployment/
│   ├── k8s/
│   │   ├── namespace.yaml
│   │   ├── realestate-backend.yaml
│   │   ├── loans-backend.yaml
│   │   ├── jobs-backend.yaml
│   │   ├── education-backend.yaml
│   │   ├── auth-backend.yaml
│   │   ├── masteradmin-backend.yaml
│   │   ├── realestate-frontend.yaml
│   │   ├── loans-frontend.yaml
│   │   ├── jobs-frontend.yaml
│   │   ├── education-frontend.yaml
│   │   ├── redis.yaml
│   │   ├── nginx.yaml
│   │   ├── ingress.yaml            <- ALB Ingress for referpeople.in
│   │   └── secrets.yaml            <- All DB credentials (base64)
│   └── terraform/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
│
├── realestate-backend/             <- Django: Real Estate API
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   ├── referpeople_realestate/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── apps/
│       ├── accounts/               <- User auth (JWT)
│       ├── properties/             <- Property listings model
│       ├── agents/                 <- Agent profiles
│       ├── inquiries/              <- Buyer inquiries
│       ├── tenants/                <- Real estate agencies
│       └── valuations/             <- Property valuation requests
│
├── loans-backend/                  <- Django: Loans API (from BRD core)
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   ├── referpeople_loans/
│   └── apps/
│       ├── accounts/
│       ├── loan_products/          <- Home Loan, LAP, Personal Loan
│       ├── applications/           <- Loan application tracking
│       ├── documents/              <- KYC / income docs
│       ├── tenants/                <- Banks, NBFCs
│       └── emi_calculator/         <- EMI computation
│
├── jobs-backend/                   <- Django: Jobs API
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   ├── referpeople_jobs/
│   └── apps/
│       ├── accounts/
│       ├── job_listings/           <- Job posts
│       ├── applications/           <- Candidate applications
│       ├── companies/              <- Employer tenants
│       ├── candidates/             <- Job seeker profiles
│       └── resumes/                <- Resume uploads
│
├── education-backend/              <- Django: Education API
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   ├── referpeople_education/
│   └── apps/
│       ├── accounts/
│       ├── colleges/               <- College listings
│       ├── courses/                <- Course catalog
│       ├── admissions/             <- Application tracking
│       ├── counselling/            <- Counsellor booking
│       └── scholarships/           <- Scholarship listings
│
├── auth-backend/                   <- Shared Django auth service
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── apps/
│       ├── accounts/               <- Central User model
│       ├── tokens/                 <- JWT issue/refresh/revoke
│       └── rbac/                   <- Roles + permissions
│
├── masteradmin-backend/            <- Django: Super Admin + Master Admin
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── apps/
│       ├── accounts/
│       ├── tenants/                <- Manage all tenants
│       ├── subscriptions/          <- Subscription plans
│       └── analytics/              <- Platform-wide stats
│
├── realestate-frontend/            <- React 19 + Vite: Public RE website
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── .env.example
│   ├── public/
│   │   ├── logo.png
│   │   └── favicon.ico
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── theme/
│       │   └── colors.js           <- Brand color constants
│       ├── pages/
│       │   ├── Home.jsx            <- Hero + search + featured
│       │   ├── PropertyListing.jsx <- Search results
│       │   ├── PropertyDetail.jsx  <- Single property view
│       │   ├── PostProperty.jsx    <- List your property
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       └── components/
│           ├── Navbar.jsx
│           ├── PropertyCard.jsx
│           ├── SearchFilter.jsx
│           └── Footer.jsx
│
├── loans-frontend/                 <- React 19: Loans page
│   └── src/pages/
│       ├── LoanHome.jsx
│       ├── LoanProducts.jsx
│       ├── ApplyLoan.jsx
│       ├── EMICalculator.jsx
│       └── TrackApplication.jsx
│
├── jobs-frontend/                  <- React 19: Jobs page
│   └── src/pages/
│       ├── JobHome.jsx
│       ├── JobListing.jsx
│       ├── JobDetail.jsx
│       ├── PostJob.jsx
│       └── CandidateProfile.jsx
│
├── education-frontend/             <- React 19: Education page
│   └── src/pages/
│       ├── EduHome.jsx
│       ├── CollegeSearch.jsx
│       ├── CourseDetail.jsx
│       ├── ApplyAdmission.jsx
│       └── CounsellingBooking.jsx
│
├── masteradmin-frontend/           <- React: Super Admin + Master Admin panel
│   └── src/pages/
│       ├── Dashboard.jsx
│       ├── TenantManagement.jsx
│       ├── UserManagement.jsx
│       ├── SubscriptionPlans.jsx
│       └── Analytics.jsx
│
├── docker-compose.yml              <- Full platform compose file
├── docker-compose.override.yml     <- Local dev overrides
├── start-local.sh                  <- Local startup script
├── .env.example                    <- Root env template
├── Makefile                        <- Common commands
└── README.md                       <- Platform README
```

---

## 6. Database Design

### A. Real Estate Database (`referpeople_realestate`)

```sql
-- Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    title VARCHAR(200) NOT NULL,
    property_type VARCHAR(50),  -- APARTMENT, VILLA, PLOT, COMMERCIAL, PG
    listing_type VARCHAR(20),   -- BUY, SELL, RENT
    price DECIMAL(15, 2),
    price_per_sqft DECIMAL(10, 2),
    area_sqft DECIMAL(10, 2),
    bedrooms INT,
    bathrooms INT,
    city VARCHAR(100),
    locality VARCHAR(200),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    posted_by UUID REFERENCES accounts_user(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property Images
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 0
);

-- Property Amenities
CREATE TABLE property_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    amenity VARCHAR(100)  -- PARKING, GYM, SWIMMING_POOL, LIFT, SECURITY
);

-- Inquiries
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id),
    user_id UUID REFERENCES accounts_user(id),
    name VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(20),
    message TEXT,
    status VARCHAR(30) DEFAULT 'PENDING',  -- PENDING, CONTACTED, CONVERTED
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Profiles
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES accounts_user(id),
    tenant_id UUID REFERENCES tenants(id),
    rera_number VARCHAR(50),
    experience_years INT,
    specialization VARCHAR(200),  -- RESIDENTIAL, COMMERCIAL, LUXURY
    total_deals INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0
);
```

### B. Loans Database (`referpeople_loans`)

```sql
-- Loan Products
CREATE TABLE loan_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    product_name VARCHAR(200),
    loan_type VARCHAR(50),  -- HOME_LOAN, LAP, PERSONAL, BUSINESS, EDUCATION
    min_amount DECIMAL(15, 2),
    max_amount DECIMAL(15, 2),
    min_tenure_months INT,
    max_tenure_months INT,
    interest_rate_min DECIMAL(5, 2),
    interest_rate_max DECIMAL(5, 2),
    processing_fee_pct DECIMAL(4, 2),
    is_active BOOLEAN DEFAULT TRUE
);

-- Loan Applications
CREATE TABLE loan_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES accounts_user(id),
    loan_product_id UUID REFERENCES loan_products(id),
    applied_amount DECIMAL(15, 2),
    applied_tenure_months INT,
    purpose TEXT,
    status VARCHAR(50) DEFAULT 'DRAFT',
    -- DRAFT -> SUBMITTED -> UNDER_REVIEW -> APPROVED -> DISBURSED / REJECTED
    monthly_income DECIMAL(12, 2),
    employment_type VARCHAR(50),
    cibil_score INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### C. Jobs Database (`referpeople_jobs`)

```sql
-- Job Listings
CREATE TABLE job_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),  -- Company
    title VARCHAR(300) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    job_type VARCHAR(50),  -- FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, REMOTE
    experience_min INT,  -- years
    experience_max INT,
    salary_min DECIMAL(12, 2),
    salary_max DECIMAL(12, 2),
    skills_required TEXT[],
    education_required VARCHAR(200),
    openings INT DEFAULT 1,
    deadline DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES job_listings(id),
    candidate_id UUID REFERENCES accounts_user(id),
    cover_letter TEXT,
    resume_url TEXT,
    status VARCHAR(50) DEFAULT 'APPLIED',
    -- APPLIED -> SHORTLISTED -> INTERVIEW -> OFFERED -> JOINED / REJECTED
    applied_at TIMESTAMPTZ DEFAULT NOW()
);
```

### D. Education Database (`referpeople_education`)

```sql
-- Colleges
CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(300) NOT NULL,
    university_affiliation VARCHAR(300),
    naac_grade VARCHAR(5),
    nirf_rank INT,
    established_year INT,
    location VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    website VARCHAR(300),
    logo_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES colleges(id),
    name VARCHAR(300),
    degree_type VARCHAR(50),  -- UG, PG, DIPLOMA, CERTIFICATE, PHD
    duration_years INT,
    total_seats INT,
    fee_per_year DECIMAL(12, 2),
    admission_type VARCHAR(50),  -- MERIT, ENTRANCE, MANAGEMENT
    entrance_exams TEXT[],
    last_date DATE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Admission Applications
CREATE TABLE admission_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES accounts_user(id),
    course_id UUID REFERENCES courses(id),
    application_number VARCHAR(50) UNIQUE,
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    -- SUBMITTED -> UNDER_REVIEW -> SHORTLISTED -> ADMITTED / REJECTED
    entrance_score DECIMAL(6, 2),
    board_percentage DECIMAL(5, 2),
    applied_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. Backend Services — All APIs

### Real Estate Backend API Endpoints

```
POST   /api/auth/login/              <- Login (returns JWT)
POST   /api/auth/register/           <- Register new user
POST   /api/auth/token/refresh/      <- Refresh JWT

GET    /api/properties/              <- List all properties (search/filter)
POST   /api/properties/              <- Create new listing (auth required)
GET    /api/properties/{id}/         <- Property detail
PUT    /api/properties/{id}/         <- Update listing (owner)
DELETE /api/properties/{id}/         <- Delete listing (owner/admin)

GET    /api/properties/featured/     <- Featured properties
GET    /api/properties/search/       <- Advanced search with filters
GET    /api/properties/nearby/       <- Location-based search

POST   /api/inquiries/               <- Submit buyer inquiry
GET    /api/inquiries/               <- List inquiries (agent/admin)
PUT    /api/inquiries/{id}/status/   <- Update inquiry status

GET    /api/agents/                  <- List agents
GET    /api/agents/{id}/             <- Agent profile + listings

POST   /api/valuations/              <- Request property valuation
GET    /api/valuations/{id}/         <- Valuation result

# Admin APIs
GET    /api/admin/tenants/           <- List all tenants (admin)
POST   /api/admin/tenants/           <- Create new tenant
GET    /api/admin/stats/             <- Platform statistics
```

### Loans Backend API Endpoints

```
GET    /api/loans/products/          <- All loan products (public)
GET    /api/loans/products/{id}/     <- Product detail
POST   /api/loans/calculate-emi/     <- EMI calculation (no auth)

POST   /api/loans/apply/             <- Submit loan application
GET    /api/loans/applications/      <- My applications
GET    /api/loans/applications/{id}/ <- Application status
POST   /api/loans/documents/upload/  <- Upload KYC/income docs

# Tenant (Bank/NBFC) APIs
GET    /api/tenant/products/         <- My loan products
POST   /api/tenant/products/         <- Add loan product
GET    /api/tenant/applications/     <- Applications received
PUT    /api/tenant/applications/{id}/status/ <- Approve/Reject
```

### Jobs Backend API Endpoints

```
GET    /api/jobs/                    <- Job listings (search/filter)
GET    /api/jobs/{id}/               <- Job detail
POST   /api/jobs/apply/              <- Apply for job

GET    /api/candidates/profile/      <- My profile
PUT    /api/candidates/profile/      <- Update profile
POST   /api/candidates/resume/       <- Upload resume

# Employer APIs
POST   /api/employer/jobs/           <- Post new job
GET    /api/employer/jobs/           <- My job postings
GET    /api/employer/applications/   <- Applications received
PUT    /api/employer/applications/{id}/status/ <- Update status
```

### Education Backend API Endpoints

```
GET    /api/colleges/                <- College list (search)
GET    /api/colleges/{id}/           <- College detail + courses
GET    /api/courses/                 <- Course catalog
GET    /api/courses/{id}/            <- Course detail

POST   /api/admissions/apply/        <- Submit admission application
GET    /api/admissions/              <- My applications
GET    /api/admissions/{id}/         <- Application status

POST   /api/counselling/book/        <- Book counselling slot
GET    /api/counselling/slots/       <- Available slots

# College Admin APIs
GET    /api/college-admin/applicants/    <- All applicants
PUT    /api/college-admin/admissions/{id}/status/ <- Admit/Reject
```

---

## 8. Frontend Pages — All 4 Services

### Page 1: Real Estate Frontend (`realestate-frontend`)

**Key React Components:**

```jsx
// src/App.jsx — Main routing
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertyListing />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/post-property" element={<PostProperty />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/agent/:id" element={<AgentProfile />} />
        <Route path="/my-properties" element={<MyProperties />} />
        <Route path="/my-inquiries" element={<MyInquiries />} />
      </Routes>
    </BrowserRouter>
  );
}

// src/theme/colors.js — Brand colors
export const colors = {
  primary: '#1A3C6E',
  accent: '#0EA5E9',
  orange: '#EA580C',
  purple: '#7C3AED',
  bg: '#FFFFFF',
  text: '#1F2937',
};

// src/pages/Home.jsx — Hero section
export default function Home() {
  return (
    <div>
      <nav style={{ backgroundColor: colors.primary }}>
        <span style={{ color: 'white', fontFamily: 'Poppins' }}>ReferPeople</span>
        <div>
          <a href="/loans" style={{ color: colors.orange }}>Loans</a>
          <a href="/jobs" style={{ color: colors.purple }}>Jobs</a>
          <a href="/education" style={{ color: colors.accent }}>Education</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}>
        <h1>Find Your Perfect Property</h1>
        <p>Buy, Sell & Rent Properties Across India</p>
        <SearchBar />
      </div>

      {/* Featured Properties */}
      <FeaturedProperties />

      {/* Service Links */}
      <ServiceGrid /> {/* Shows all 4 services */}
    </div>
  );
}
```

### Page 2: Loans Frontend (`loans-frontend`)

```jsx
// src/App.jsx
<Routes>
  <Route path="/loans" element={<LoanHome />} />
  <Route path="/loans/products" element={<LoanProducts />} />
  <Route path="/loans/apply/:productId" element={<ApplyLoan />} />
  <Route path="/loans/calculator" element={<EMICalculator />} />
  <Route path="/loans/track" element={<TrackApplication />} />
  <Route path="/loans/login" element={<LoanLogin />} />
</Routes>

// EMI Calculator component
function EMICalculator() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(240); // months

  const emi = (principal * (rate/1200) * Math.pow(1 + rate/1200, tenure))
              / (Math.pow(1 + rate/1200, tenure) - 1);

  return (
    <div style={{ backgroundColor: colors.orange + '10', border: `2px solid ${colors.orange}` }}>
      <h2>EMI Calculator</h2>
      {/* Sliders for principal, rate, tenure */}
      <p>Monthly EMI: ₹{Math.round(emi).toLocaleString('en-IN')}</p>
    </div>
  );
}
```

### Page 3: Jobs Frontend (`jobs-frontend`)

```jsx
<Routes>
  <Route path="/jobs" element={<JobHome />} />
  <Route path="/jobs/listings" element={<JobListing />} />
  <Route path="/jobs/:id" element={<JobDetail />} />
  <Route path="/jobs/post" element={<PostJob />} />
  <Route path="/jobs/profile" element={<CandidateProfile />} />
  <Route path="/jobs/my-applications" element={<MyApplications />} />
</Routes>
```

### Page 4: Education Frontend (`education-frontend`)

```jsx
<Routes>
  <Route path="/education" element={<EduHome />} />
  <Route path="/education/colleges" element={<CollegeSearch />} />
  <Route path="/education/college/:id" element={<CollegeDetail />} />
  <Route path="/education/course/:id" element={<CourseDetail />} />
  <Route path="/education/apply/:courseId" element={<ApplyAdmission />} />
  <Route path="/education/counselling" element={<CounsellingBooking />} />
  <Route path="/education/my-applications" element={<MyAdmissions />} />
</Routes>
```

---

## 9. Nginx Configuration for referpeople.in

**File:** `nginx/conf.d/referpeople.conf`

```nginx
# Redirect HTTP -> HTTPS
server {
    listen 80;
    server_name referpeople.in www.referpeople.in;
    return 301 https://$host$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name referpeople.in www.referpeople.in;

    # SSL certificates (from AWS ACM or Let's Encrypt)
    ssl_certificate     /etc/nginx/ssl/referpeople.in.crt;
    ssl_certificate_key /etc/nginx/ssl/referpeople.in.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    client_max_body_size 20M;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000" always;

    # ─── Page 1: Real Estate (Home) ─────────────────────────────────────────
    location / {
        proxy_pass http://realestate-frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 60s;
    }

    # Real Estate API
    location /api/realestate/ {
        proxy_pass http://realestate-backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # ─── Page 2: Loans ──────────────────────────────────────────────────────
    location /loans/ {
        proxy_pass http://loans-frontend:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /api/loans/ {
        proxy_pass http://loans-backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # ─── Page 3: Jobs ───────────────────────────────────────────────────────
    location /jobs/ {
        proxy_pass http://jobs-frontend:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /api/jobs/ {
        proxy_pass http://jobs-backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # ─── Page 4: Education ──────────────────────────────────────────────────
    location /education/ {
        proxy_pass http://education-frontend:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /api/education/ {
        proxy_pass http://education-backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # ─── Shared Auth API ────────────────────────────────────────────────────
    location /api/auth/ {
        proxy_pass http://auth-backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # ─── Master Admin Panel ─────────────────────────────────────────────────
    location /master-admin/ {
        proxy_pass http://masteradmin-frontend:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /api/master-admin/ {
        proxy_pass http://masteradmin-backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # Static files
    location /static/ {
        alias /var/www/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /var/www/media/;
        expires 7d;
    }
}
```

---

## 10. Environment Variables — All Services

### Root `.env.example` (shared template)

```env
# ── Django Settings ────────────────────────────────────────────────────────
DEBUG=False
SECRET_KEY=your-secret-key-change-in-production-min-50-chars
ALLOWED_HOSTS=referpeople.in,www.referpeople.in,api.referpeople.in

# ── JWT Settings ───────────────────────────────────────────────────────────
ACCESS_TOKEN_LIFETIME_HOURS=8
REFRESH_TOKEN_LIFETIME_DAYS=1

# ── CORS ───────────────────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in

# ── Redis ──────────────────────────────────────────────────────────────────
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/1

# ── AWS Settings ───────────────────────────────────────────────────────────
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-south-1
AWS_S3_BUCKET=referpeople-media

# ── Email (AWS SES) ────────────────────────────────────────────────────────
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=email-smtp.ap-south-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-ses-smtp-user
EMAIL_HOST_PASSWORD=your-ses-smtp-password
DEFAULT_FROM_EMAIL=noreply@referpeople.in
```

### Real Estate Backend `.env.example`

```env
# Inherits root .env, plus:
DB_NAME=referpeople_realestate
DB_USER=referpeople_re_user
DB_PASSWORD=your-secure-password
DB_HOST=your-rds-endpoint.ap-south-1.rds.amazonaws.com
DB_PORT=5432

# Service-specific
MAX_PROPERTY_IMAGES=20
PROPERTY_IMAGE_MAX_SIZE_MB=5
MAPS_API_KEY=your-google-maps-api-key
```

### Loans Backend `.env.example`

```env
DB_NAME=referpeople_loans
DB_USER=referpeople_loans_user
DB_PASSWORD=your-secure-password
DB_HOST=your-rds-endpoint.ap-south-1.rds.amazonaws.com
DB_PORT=5432

CIBIL_API_URL=https://cibil-api-endpoint
CIBIL_API_KEY=your-cibil-key
```

### Jobs Backend `.env.example`

```env
DB_NAME=referpeople_jobs
DB_USER=referpeople_jobs_user
DB_PASSWORD=your-secure-password
DB_HOST=your-rds-endpoint.ap-south-1.rds.amazonaws.com
DB_PORT=5432

RESUME_MAX_SIZE_MB=5
```

### Education Backend `.env.example`

```env
DB_NAME=referpeople_education
DB_USER=referpeople_edu_user
DB_PASSWORD=your-secure-password
DB_HOST=your-rds-endpoint.ap-south-1.rds.amazonaws.com
DB_PORT=5432
```

### Auth Backend `.env.example`

```env
DB_NAME=referpeople_auth
DB_USER=referpeople_auth_user
DB_PASSWORD=your-secure-password
DB_HOST=your-rds-endpoint.ap-south-1.rds.amazonaws.com
DB_PORT=5432

# Brute force protection
AXES_FAILURE_LIMIT=5
AXES_COOLOFF_TIME=1

# 2FA (optional)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_FROM_NUMBER=+1234567890
```

### Frontend `.env.example` (all 4 frontends)

```env
# Real Estate Frontend
VITE_API_BASE_URL=https://referpeople.in/api/realestate
VITE_AUTH_URL=https://referpeople.in/api/auth
VITE_GOOGLE_MAPS_KEY=your-maps-key
VITE_RAZORPAY_KEY=your-razorpay-key

# Loans Frontend
VITE_API_BASE_URL=https://referpeople.in/api/loans
VITE_AUTH_URL=https://referpeople.in/api/auth

# Jobs Frontend
VITE_API_BASE_URL=https://referpeople.in/api/jobs
VITE_AUTH_URL=https://referpeople.in/api/auth

# Education Frontend
VITE_API_BASE_URL=https://referpeople.in/api/education
VITE_AUTH_URL=https://referpeople.in/api/auth
```

---

## 11. Docker Compose — Full Platform

**File:** `docker-compose.yml`

```yaml
version: '3.9'

networks:
  referpeople_network:
    driver: bridge

volumes:
  redis_data:
  static_files:
  media_files:
  postgres_data:

services:

  # ── Infrastructure ─────────────────────────────────────────────────────────

  redis:
    image: redis:7-alpine
    container_name: rp_redis
    restart: unless-stopped
    command: redis-server --appendonly yes --maxmemory 512mb
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - referpeople_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:1.25-alpine
    container_name: rp_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - static_files:/var/www/static:ro
      - media_files:/var/www/media:ro
    networks:
      - referpeople_network
    depends_on:
      - realestate-backend
      - loans-backend
      - jobs-backend
      - education-backend
      - auth-backend
      - masteradmin-backend
      - realestate-frontend
      - loans-frontend
      - jobs-frontend
      - education-frontend
      - masteradmin-frontend

  # ── Backends ──────────────────────────────────────────────────────────────

  realestate-backend:
    build:
      context: ./realestate-backend
      dockerfile: Dockerfile
    container_name: rp_realestate_backend
    restart: unless-stopped
    ports:
      - "8001:8000"
    env_file: ./realestate-backend/.env
    volumes:
      - static_files:/app/staticfiles
      - media_files:/app/media
    networks:
      - referpeople_network
    depends_on:
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health/"]
      interval: 30s
      timeout: 10s
      retries: 3

  loans-backend:
    build:
      context: ./loans-backend
      dockerfile: Dockerfile
    container_name: rp_loans_backend
    restart: unless-stopped
    ports:
      - "8002:8000"
    env_file: ./loans-backend/.env
    volumes:
      - static_files:/app/staticfiles
      - media_files:/app/media
    networks:
      - referpeople_network
    depends_on:
      redis:
        condition: service_healthy

  jobs-backend:
    build:
      context: ./jobs-backend
      dockerfile: Dockerfile
    container_name: rp_jobs_backend
    restart: unless-stopped
    ports:
      - "8003:8000"
    env_file: ./jobs-backend/.env
    volumes:
      - static_files:/app/staticfiles
      - media_files:/app/media
    networks:
      - referpeople_network
    depends_on:
      redis:
        condition: service_healthy

  education-backend:
    build:
      context: ./education-backend
      dockerfile: Dockerfile
    container_name: rp_education_backend
    restart: unless-stopped
    ports:
      - "8004:8000"
    env_file: ./education-backend/.env
    volumes:
      - static_files:/app/staticfiles
      - media_files:/app/media
    networks:
      - referpeople_network
    depends_on:
      redis:
        condition: service_healthy

  auth-backend:
    build:
      context: ./auth-backend
      dockerfile: Dockerfile
    container_name: rp_auth_backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    env_file: ./auth-backend/.env
    networks:
      - referpeople_network
    depends_on:
      redis:
        condition: service_healthy

  masteradmin-backend:
    build:
      context: ./masteradmin-backend
      dockerfile: Dockerfile
    container_name: rp_masteradmin_backend
    restart: unless-stopped
    ports:
      - "8005:8000"
    env_file: ./masteradmin-backend/.env
    networks:
      - referpeople_network

  # ── Frontends ─────────────────────────────────────────────────────────────

  realestate-frontend:
    build:
      context: ./realestate-frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_BASE_URL=/api/realestate
        - VITE_AUTH_URL=/api/auth
    container_name: rp_realestate_frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    networks:
      - referpeople_network

  loans-frontend:
    build:
      context: ./loans-frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_BASE_URL=/api/loans
        - VITE_AUTH_URL=/api/auth
    container_name: rp_loans_frontend
    restart: unless-stopped
    ports:
      - "3001:80"
    networks:
      - referpeople_network

  jobs-frontend:
    build:
      context: ./jobs-frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_BASE_URL=/api/jobs
        - VITE_AUTH_URL=/api/auth
    container_name: rp_jobs_frontend
    restart: unless-stopped
    ports:
      - "3002:80"
    networks:
      - referpeople_network

  education-frontend:
    build:
      context: ./education-frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_BASE_URL=/api/education
        - VITE_AUTH_URL=/api/auth
    container_name: rp_education_frontend
    restart: unless-stopped
    ports:
      - "3003:80"
    networks:
      - referpeople_network

  masteradmin-frontend:
    build:
      context: ./masteradmin-frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_BASE_URL=/api/master-admin
    container_name: rp_masteradmin_frontend
    restart: unless-stopped
    ports:
      - "3004:80"
    networks:
      - referpeople_network
```

---

## 12. AWS Deployment — Step by Step

### PREREQUISITES (install on your computer)

```bash
# 1. AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
unzip awscliv2.zip && sudo ./aws/install
aws configure  # Enter: Access Key, Secret Key, Region: ap-south-1, Output: json

# 2. kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# 3. eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# 4. Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform*.zip && sudo mv terraform /usr/local/bin/

# 5. Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### STEP 1 — Create AWS Infrastructure

```bash
# Create ECR repositories for all Docker images
aws ecr create-repository --repository-name referpeople/realestate-backend --region ap-south-1
aws ecr create-repository --repository-name referpeople/loans-backend --region ap-south-1
aws ecr create-repository --repository-name referpeople/jobs-backend --region ap-south-1
aws ecr create-repository --repository-name referpeople/education-backend --region ap-south-1
aws ecr create-repository --repository-name referpeople/auth-backend --region ap-south-1
aws ecr create-repository --repository-name referpeople/masteradmin-backend --region ap-south-1
aws ecr create-repository --repository-name referpeople/realestate-frontend --region ap-south-1
aws ecr create-repository --repository-name referpeople/loans-frontend --region ap-south-1
aws ecr create-repository --repository-name referpeople/jobs-frontend --region ap-south-1
aws ecr create-repository --repository-name referpeople/education-frontend --region ap-south-1
aws ecr create-repository --repository-name referpeople/masteradmin-frontend --region ap-south-1
```

### STEP 2 — Create EKS Cluster

```bash
# Create EKS cluster (takes 15-20 minutes)
eksctl create cluster \
  --name referpeople-cluster \
  --region ap-south-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 5 \
  --managed

# Verify cluster is running
kubectl get nodes
```

### STEP 3 — Create RDS PostgreSQL Databases

```bash
# Create DB subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name referpeople-db-subnet \
  --db-subnet-group-description "ReferPeople DB Subnet" \
  --subnet-ids subnet-xxxx subnet-yyyy

# Create RDS instance (shared for local, separate for prod)
aws rds create-db-instance \
  --db-instance-identifier referpeople-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username referpeople_admin \
  --master-user-password "YourSecurePassword123!" \
  --allocated-storage 100 \
  --db-subnet-group-name referpeople-db-subnet \
  --vpc-security-group-ids sg-xxxx \
  --multi-az \
  --backup-retention-period 7 \
  --region ap-south-1

# After RDS is available, create individual databases
psql -h <rds-endpoint> -U referpeople_admin -c "CREATE DATABASE referpeople_realestate;"
psql -h <rds-endpoint> -U referpeople_admin -c "CREATE DATABASE referpeople_loans;"
psql -h <rds-endpoint> -U referpeople_admin -c "CREATE DATABASE referpeople_jobs;"
psql -h <rds-endpoint> -U referpeople_admin -c "CREATE DATABASE referpeople_education;"
psql -h <rds-endpoint> -U referpeople_admin -c "CREATE DATABASE referpeople_auth;"
psql -h <rds-endpoint> -U referpeople_admin -c "CREATE DATABASE referpeople_masteradmin;"
```

### STEP 4 — Create ElastiCache Redis

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id referpeople-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --region ap-south-1
```

### STEP 5 — Create S3 Bucket for Media

```bash
aws s3api create-bucket \
  --bucket referpeople-media \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1

aws s3api put-bucket-cors --bucket referpeople-media --cors-configuration '{
  "CORSRules": [{
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://referpeople.in"],
    "MaxAgeSeconds": 3000
  }]
}'
```

### STEP 6 — Build & Push Docker Images

```bash
# Login to ECR
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com

# Build and push all images
SERVICES=(realestate-backend loans-backend jobs-backend education-backend auth-backend masteradmin-backend realestate-frontend loans-frontend jobs-frontend education-frontend masteradmin-frontend)

for SERVICE in "${SERVICES[@]}"; do
  echo "Building $SERVICE..."
  docker build -t $SERVICE ./$SERVICE/
  docker tag $SERVICE:latest $AWS_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/referpeople/$SERVICE:latest
  docker push $AWS_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/referpeople/$SERVICE:latest
  echo "Pushed $SERVICE"
done
```

### STEP 7 — Create Kubernetes Secrets

```bash
# Encode secrets
echo -n "your-re-db-password" | base64
echo -n "your-loans-db-password" | base64

# Apply secrets
kubectl apply -f aws-deployment/k8s/secrets.yaml
kubectl apply -f aws-deployment/k8s/namespace.yaml
```

### STEP 8 — Deploy All Services

```bash
# Deploy in order: auth first, then backends, then frontends, then nginx
kubectl apply -f aws-deployment/k8s/auth-backend.yaml
kubectl apply -f aws-deployment/k8s/masteradmin-backend.yaml
kubectl apply -f aws-deployment/k8s/realestate-backend.yaml
kubectl apply -f aws-deployment/k8s/loans-backend.yaml
kubectl apply -f aws-deployment/k8s/jobs-backend.yaml
kubectl apply -f aws-deployment/k8s/education-backend.yaml

kubectl apply -f aws-deployment/k8s/realestate-frontend.yaml
kubectl apply -f aws-deployment/k8s/loans-frontend.yaml
kubectl apply -f aws-deployment/k8s/jobs-frontend.yaml
kubectl apply -f aws-deployment/k8s/education-frontend.yaml
kubectl apply -f aws-deployment/k8s/masteradmin-frontend.yaml

kubectl apply -f aws-deployment/k8s/nginx.yaml
kubectl apply -f aws-deployment/k8s/ingress.yaml  # ALB Ingress

# Monitor deployment
kubectl get pods -n referpeople
kubectl get services -n referpeople
```

### STEP 9 — Create Super Admin User

```bash
# SSH into auth-backend pod
kubectl exec -it deployment/auth-backend -n referpeople -- bash

# Run Django command
python manage.py createsuperuser \
  --email superadmin@referpeople.in \
  --no-input

# Set password
python manage.py shell
>>> from apps.accounts.models import User
>>> u = User.objects.get(email='superadmin@referpeople.in')
>>> u.set_password('SuperAdmin@2024#Change!')
>>> u.is_super_admin = True
>>> u.save()
```

### STEP 10 — Run Migrations

```bash
# Run migrations on all backends
for DEPLOYMENT in auth-backend masteradmin-backend realestate-backend loans-backend jobs-backend education-backend; do
  echo "Migrating $DEPLOYMENT..."
  kubectl exec -it deployment/$DEPLOYMENT -n referpeople -- python manage.py migrate
done
```

---

## 13. DNS Setup for referpeople.in

### Step-by-Step DNS Configuration

**Provider examples: GoDaddy, Namecheap, Cloudflare, BigRock**

#### Option A — Using AWS Route 53 (Recommended)

```bash
# 1. Create hosted zone in Route 53
aws route53 create-hosted-zone \
  --name referpeople.in \
  --caller-reference "referpeople-$(date +%s)"

# 2. Note the nameservers returned (4 NS records)
# Go to your domain registrar and update NS records

# 3. Get your ALB DNS name
kubectl get ingress -n referpeople
# Output: referpeople-ingress   referpeople.in   k8s-referpe-xxx.ap-south-1.elb.amazonaws.com

# 4. Create Route 53 A record (Alias to ALB)
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "referpeople.in",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "k8s-referpe-xxx.ap-south-1.elb.amazonaws.com",
          "EvaluateTargetHealth": true,
          "HostedZoneId": "ZP97RAFLXTNZK"
        }
      }
    },{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "www.referpeople.in",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecordSet": [{
          "Value": "referpeople.in"
        }]
      }
    }]
  }'
```

#### Option B — Simple DNS Records (any registrar)

Log into your domain registrar control panel and add:

| Record Type | Host/Name | Value | TTL |
|-------------|-----------|-------|-----|
| A | @ (root) | Your ALB IP or EC2 IP | 300 |
| A | www | Your ALB IP or EC2 IP | 300 |
| CNAME | api | referpeople.in | 300 |
| MX | @ | mail.referpeople.in | 300 |
| TXT | @ | v=spf1 include:amazonses.com ~all | 300 |

---

## 14. SSL Certificate (HTTPS)

### Option A — AWS Certificate Manager (Free, for ALB)

```bash
# Request certificate
aws acm request-certificate \
  --domain-name referpeople.in \
  --subject-alternative-names www.referpeople.in *.referpeople.in \
  --validation-method DNS \
  --region ap-south-1

# Validate via DNS (add CNAME records shown in ACM console)
# Certificate auto-renews — no maintenance needed
```

### Option B — Let's Encrypt (for EC2/VPS)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d referpeople.in -d www.referpeople.in \
  --non-interactive --agree-tos --email admin@referpeople.in

# Auto-renew (add to crontab)
echo "0 12 * * * root certbot renew --quiet --post-hook 'nginx -s reload'" | sudo tee -a /etc/crontab
```

---

## 15. Git Branch Strategy

### Branch Structure

```
main (Production)
  └── develop (Staging / QA)
       ├── feature/realestate-search
       ├── feature/loan-emi-calculator
       ├── feature/jobs-application-flow
       └── feature/education-admission-portal

  Hotfix branches from main:
  └── hotfix/critical-login-bug
```

### Branch Rules

| Branch | Purpose | Deploys To | Protection |
|--------|---------|------------|------------|
| `main` | Production code | AWS EKS Production | Requires PR + 1 approval + passing CI |
| `develop` | Integration / QA | AWS EKS Staging | Requires PR + passing CI |
| `feature/*` | New features | Local only | None |
| `hotfix/*` | Emergency fixes | Production (via main) | Merge to main + develop |
| `release/*` | Release prep | Staging QA | Requires passing tests |

### Git Setup Commands

```bash
# Clone and set up
git clone https://github.com/vizz-bob/BRD_FINAL.git referpeople-platform
cd referpeople-platform

# Rename main/master if needed
git branch -m master main

# Create developer branch
git checkout -b develop
git push -u origin develop

# Create first feature branch
git checkout develop
git checkout -b feature/realestate-transformation
```

### Commit Convention

```bash
# Format: type(scope): description

git commit -m "feat(realestate): add property search with location filter"
git commit -m "feat(loans): integrate EMI calculator component"
git commit -m "feat(jobs): add resume upload functionality"
git commit -m "feat(education): add college ranking filter"
git commit -m "fix(auth): resolve JWT token refresh loop"
git commit -m "style(theme): apply ReferPeople brand colors"
git commit -m "chore(docker): update docker-compose for new services"
git commit -m "docs: update deployment guide for referpeople.in"
```

---

## 16. GitHub Actions CI/CD Pipeline

### Production Pipeline: `.github/workflows/deploy-production.yml`

```yaml
name: Deploy to Production (referpeople.in)

on:
  push:
    branches: [main]

env:
  AWS_REGION: ap-south-1
  EKS_CLUSTER: referpeople-cluster
  ECR_REGISTRY: ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.ap-south-1.amazonaws.com

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Run backend tests
        run: |
          cd realestate-backend
          pip install -r requirements.txt
          python manage.py test --keepdb
          cd ../loans-backend
          pip install -r requirements.txt
          python manage.py test --keepdb
          cd ../jobs-backend
          pip install -r requirements.txt
          python manage.py test --keepdb
          cd ../education-backend
          pip install -r requirements.txt
          python manage.py test --keepdb

      - name: Run frontend tests
        run: |
          cd realestate-frontend && npm ci && npm test -- --watchAll=false

  build-and-push:
    name: Build & Push Docker Images
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push all images
        run: |
          SERVICES=(realestate-backend loans-backend jobs-backend education-backend auth-backend masteradmin-backend realestate-frontend loans-frontend jobs-frontend education-frontend masteradmin-frontend)
          for SERVICE in "${SERVICES[@]}"; do
            docker build -t $ECR_REGISTRY/referpeople/$SERVICE:${{ github.sha }} ./$SERVICE/
            docker tag $ECR_REGISTRY/referpeople/$SERVICE:${{ github.sha }} $ECR_REGISTRY/referpeople/$SERVICE:latest
            docker push $ECR_REGISTRY/referpeople/$SERVICE:${{ github.sha }}
            docker push $ECR_REGISTRY/referpeople/$SERVICE:latest
          done

  deploy:
    name: Deploy to EKS Production
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update kubeconfig
        run: aws eks update-kubeconfig --name ${{ env.EKS_CLUSTER }} --region ${{ env.AWS_REGION }}

      - name: Deploy to Kubernetes
        run: |
          # Update image tags
          kubectl set image deployment/realestate-backend realestate-backend=$ECR_REGISTRY/referpeople/realestate-backend:${{ github.sha }} -n referpeople
          kubectl set image deployment/loans-backend loans-backend=$ECR_REGISTRY/referpeople/loans-backend:${{ github.sha }} -n referpeople
          kubectl set image deployment/jobs-backend jobs-backend=$ECR_REGISTRY/referpeople/jobs-backend:${{ github.sha }} -n referpeople
          kubectl set image deployment/education-backend education-backend=$ECR_REGISTRY/referpeople/education-backend:${{ github.sha }} -n referpeople
          kubectl set image deployment/auth-backend auth-backend=$ECR_REGISTRY/referpeople/auth-backend:${{ github.sha }} -n referpeople

          # Update frontends
          kubectl set image deployment/realestate-frontend realestate-frontend=$ECR_REGISTRY/referpeople/realestate-frontend:${{ github.sha }} -n referpeople
          kubectl set image deployment/loans-frontend loans-frontend=$ECR_REGISTRY/referpeople/loans-frontend:${{ github.sha }} -n referpeople
          kubectl set image deployment/jobs-frontend jobs-frontend=$ECR_REGISTRY/referpeople/jobs-frontend:${{ github.sha }} -n referpeople
          kubectl set image deployment/education-frontend education-frontend=$ECR_REGISTRY/referpeople/education-frontend:${{ github.sha }} -n referpeople

          # Wait for rollout
          kubectl rollout status deployment/realestate-backend -n referpeople
          kubectl rollout status deployment/realestate-frontend -n referpeople
          echo "Deployment complete — https://referpeople.in is live!"

      - name: Run post-deploy migrations
        run: |
          kubectl exec deployment/auth-backend -n referpeople -- python manage.py migrate
          kubectl exec deployment/realestate-backend -n referpeople -- python manage.py migrate
          kubectl exec deployment/loans-backend -n referpeople -- python manage.py migrate
          kubectl exec deployment/jobs-backend -n referpeople -- python manage.py migrate
          kubectl exec deployment/education-backend -n referpeople -- python manage.py migrate
```

### Developer Pipeline: `.github/workflows/deploy-developer.yml`

```yaml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run tests
        run: |
          cd realestate-backend
          pip install -r requirements.txt
          python manage.py test

      - name: Deploy to staging server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ubuntu
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /home/ubuntu/referpeople-platform
            git pull origin develop
            docker compose pull
            docker compose up -d --build
            docker compose exec realestate-backend python manage.py migrate
            echo "Staging deployment complete"
```

---

## 17. All Files Required — Checklist

### Backend Files (per service, replicate for all 4 + auth + masteradmin)

```
[service]-backend/
├── [ ] manage.py
├── [ ] requirements.txt          <- Django, DRF, simplejwt, psycopg2, redis, celery
├── [ ] Dockerfile
├── [ ] docker-entrypoint.sh      <- Wait for DB, migrate, collectstatic, gunicorn
├── [ ] .env.example
├── [ ] .env                      <- NEVER commit this (add to .gitignore)
├── referpeople_[service]/
│   ├── [ ] settings.py
│   ├── [ ] urls.py
│   ├── [ ] wsgi.py
│   └── [ ] asgi.py
└── apps/
    ├── accounts/
    │   ├── [ ] models.py         <- Custom User model
    │   ├── [ ] serializers.py
    │   ├── [ ] views.py
    │   ├── [ ] urls.py
    │   └── [ ] migrations/
    ├── [service-specific-app]/
    │   ├── [ ] models.py
    │   ├── [ ] serializers.py
    │   ├── [ ] views.py
    │   ├── [ ] urls.py
    │   ├── [ ] admin.py
    │   ├── [ ] permissions.py    <- Custom DRF permissions
    │   └── [ ] migrations/
    └── tenants/
        ├── [ ] models.py
        └── [ ] migrations/
```

### Frontend Files (per service)

```
[service]-frontend/
├── [ ] package.json              <- React 19, react-router-dom, axios, tailwindcss
├── [ ] vite.config.js
├── [ ] tailwind.config.js
├── [ ] Dockerfile
├── [ ] nginx.conf                <- Serve built React app
├── [ ] .env.example
├── [ ] .env                      <- NEVER commit
├── public/
│   ├── [ ] logo.png
│   └── [ ] favicon.ico
└── src/
    ├── [ ] main.jsx
    ├── [ ] App.jsx
    ├── theme/
    │   └── [ ] colors.js         <- ReferPeople brand colors
    ├── api/
    │   ├── [ ] client.js         <- Axios instance with JWT interceptor
    │   └── [ ] endpoints.js      <- All API endpoint constants
    ├── context/
    │   └── [ ] AuthContext.jsx   <- Global auth state
    ├── hooks/
    │   └── [ ] useAuth.js
    ├── pages/
    │   └── [ ] (all page components)
    └── components/
        ├── [ ] Navbar.jsx
        ├── [ ] Footer.jsx
        └── [ ] (shared components)
```

### Infrastructure Files

```
[ ] docker-compose.yml
[ ] docker-compose.override.yml   <- Local dev overrides (local DB, DEBUG=True)
[ ] .gitignore                    <- Include: .env, __pycache__, node_modules, dist
[ ] Makefile                      <- make start, make stop, make migrate, make build
[ ] start-local.sh                <- One-command local startup
[ ] nginx/conf.d/referpeople.conf <- Nginx config for referpeople.in
[ ] nginx/ssl/                    <- SSL cert files (gitignored)
aws-deployment/
├── k8s/
│   ├── [ ] namespace.yaml
│   ├── [ ] secrets.yaml          <- Base64 encoded credentials
│   ├── [ ] [service]-backend.yaml (6 files)
│   ├── [ ] [service]-frontend.yaml (5 files)
│   ├── [ ] redis.yaml
│   ├── [ ] nginx.yaml
│   └── [ ] ingress.yaml          <- ALB ingress for referpeople.in
└── terraform/
    ├── [ ] main.tf               <- EKS, RDS, ElastiCache, S3, ALB
    ├── [ ] variables.tf
    └── [ ] outputs.tf
.github/workflows/
├── [ ] deploy-production.yml     <- main branch -> EKS prod
└── [ ] deploy-developer.yml      <- develop branch -> staging
```

---

## 18. Login Credentials & Test Accounts

### Default Admin Accounts (Change IMMEDIATELY after deployment!)

| Role | Email | Password | Login URL |
|------|-------|----------|-----------|
| Super Admin | superadmin@referpeople.in | SuperAdmin@2024#Change! | referpeople.in/super-admin/ |
| Master Admin | masteradmin@referpeople.in | MasterAdmin@2024! | referpeople.in/master-admin/ |
| RE Tenant Admin | reTenant@referpeople.in | Tenant@2024! | referpeople.in/tenant/login/ |
| Loans Tenant | loansTenant@referpeople.in | Tenant@2024! | referpeople.in/loans/tenant/login/ |
| Normal User | user@referpeople.in | User@2024! | referpeople.in/login/ |

### Port Reference

| Service | Local Port | Container | Description |
|---------|-----------|-----------|-------------|
| Auth Backend | 8000 | rp_auth_backend | JWT auth for all services |
| Real Estate Backend | 8001 | rp_realestate_backend | Property API |
| Loans Backend | 8002 | rp_loans_backend | Loan products API |
| Jobs Backend | 8003 | rp_jobs_backend | Job listings API |
| Education Backend | 8004 | rp_education_backend | College/admissions API |
| Master Admin Backend | 8005 | rp_masteradmin_backend | Admin panel API |
| Real Estate Frontend | 3000 | rp_realestate_frontend | Main RE website |
| Loans Frontend | 3001 | rp_loans_frontend | Loans page |
| Jobs Frontend | 3002 | rp_jobs_frontend | Jobs page |
| Education Frontend | 3003 | rp_education_frontend | Education page |
| Master Admin Frontend | 3004 | rp_masteradmin_frontend | Admin dashboard |
| Nginx | 80/443 | rp_nginx | Reverse proxy |
| Redis | 6379 | rp_redis | Cache/sessions |

---

## 19. Troubleshooting Guide

### Problem: CORS errors when frontend calls API

```bash
# Check CORS settings in backend settings.py
CORS_ALLOWED_ORIGINS = [
    "https://referpeople.in",
    "https://www.referpeople.in",
    "http://localhost:3000",  # local dev only
]

# Make sure corsheaders is in MIDDLEWARE before CommonMiddleware
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # MUST be first
    "django.middleware.common.CommonMiddleware",
    ...
]
```

### Problem: JWT token expired / 401 Unauthorized

```javascript
// src/api/client.js — Add token refresh interceptor
import axios from 'axios';

const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

client.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem('refresh_token');
      const { data } = await axios.post('/api/auth/token/refresh/', { refresh });
      localStorage.setItem('access_token', data.access);
      error.config.headers.Authorization = `Bearer ${data.access}`;
      return client(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Problem: Pods crashing in Kubernetes

```bash
# Check pod logs
kubectl logs deployment/realestate-backend -n referpeople --previous

# Common causes:
# 1. DB connection failed -> check secrets.yaml DB_HOST is correct RDS endpoint
# 2. Missing env vars -> kubectl describe pod <pod-name> -n referpeople
# 3. Image pull error -> check ECR repository name matches deployment YAML

# Fix: re-apply secrets
kubectl delete secret referpeople-secrets -n referpeople
kubectl apply -f aws-deployment/k8s/secrets.yaml
kubectl rollout restart deployment/realestate-backend -n referpeople
```

### Problem: Nginx 502 Bad Gateway

```bash
# Backend container not ready
kubectl get pods -n referpeople
# Wait for all pods to show STATUS: Running

# Check nginx logs
kubectl logs deployment/nginx -n referpeople

# Verify services are reachable
kubectl exec deployment/nginx -n referpeople -- curl http://realestate-backend:8000/api/health/
```

### Problem: Domain not resolving (referpeople.in)

```bash
# Check DNS propagation (can take 24-48 hours)
nslookup referpeople.in 8.8.8.8
dig referpeople.in

# Verify Route 53 records
aws route53 list-resource-record-sets --hosted-zone-id YOUR_ZONE_ID

# Force browser refresh: Ctrl+Shift+R (hard reload)
```

### Problem: SSL certificate errors

```bash
# For Let's Encrypt
sudo certbot certificates
sudo certbot renew --dry-run

# For ACM — check certificate status
aws acm list-certificates --region ap-south-1
aws acm describe-certificate --certificate-arn arn:... --region ap-south-1
```

### Problem: Django migrations fail

```bash
# Run inside the backend pod
kubectl exec -it deployment/realestate-backend -n referpeople -- bash

# Check pending migrations
python manage.py showmigrations

# Apply specific app migrations
python manage.py migrate apps.properties
python manage.py migrate apps.accounts

# If migration conflicts
python manage.py migrate --fake-initial
```

---

*ReferPeople.in Platform Guide v2.0 — Generated May 2026*
*Domain: referpeople.in | Stack: Django + React + PostgreSQL + Redis + Nginx + AWS EKS*
