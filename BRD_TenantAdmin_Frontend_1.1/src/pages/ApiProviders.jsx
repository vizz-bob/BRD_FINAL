import { useEffect, useState, useMemo } from "react";

// =============================================================================
// SECTION 1: ICONS
// =============================================================================

const Icons = {
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  Cloud: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
  XMark: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>,
  Cog: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Lightning: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  Globe: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
};

// =============================================================================
// SECTION 2: API DATA FROM EXCEL SHEET
// =============================================================================

const API_CATEGORIES = [
  {
    id: 1,
    name: "SMS",
    description: "SMS messaging and notification services",
    providers: [
      { id: 101, name: "gupshup", status: "inactive", baseUrl: "https://api.gupshup.io", authType: "API Key" },
      { id: 102, name: "Textlocal India", status: "inactive", baseUrl: "https://api.textlocal.in", authType: "API Key" },
      { id: 103, name: "MSG91", status: "inactive", baseUrl: "https://api.msg91.com", authType: "API Key" },
    ]
  },
  {
    id: 2,
    name: "Payment",
    description: "Online payment processing and gateways",
    providers: [
      { id: 201, name: "cashfree", status: "inactive", baseUrl: "https://api.cashfree.com", authType: "Client Secret" },
      { id: 202, name: "Paytm", status: "inactive", baseUrl: "https://securegw.paytm.in", authType: "Checksum" },
      { id: 203, name: "Razorpay", status: "inactive", baseUrl: "https://api.razorpay.com/v1", authType: "Basic Auth" },
      { id: 204, name: "Pinelabs", status: "inactive", baseUrl: "https://api.pinelabs.com", authType: "API Key" },
      { id: 205, name: "PayU", status: "inactive", baseUrl: "https://api.payu.in", authType: "Merchant Key" },
      { id: 206, name: "BillDesk", status: "inactive", baseUrl: "https://api.billdesk.com", authType: "HMAC" },
    ]
  },
  {
    id: 3,
    name: "WhatsApp",
    description: "WhatsApp Business API integration",
    providers: [
      { id: 301, name: "gupshup", status: "inactive", baseUrl: "https://api.gupshup.io/wa", authType: "API Key" },
      { id: 302, name: "exotel", status: "inactive", baseUrl: "https://api.exotel.com/whatsapp", authType: "API Key" },
      { id: 303, name: "twilio", status: "inactive", baseUrl: "https://api.twilio.com/whatsapp", authType: "API Key" },
      { id: 304, name: "slack", status: "inactive", baseUrl: "https://slack.com/api", authType: "OAuth 2.0" },
    ]
  },
  {
    id: 4,
    name: "PAN Verification",
    description: "PAN card validation and verification",
    providers: [
      { id: 401, name: "Perfios", status: "inactive", baseUrl: "https://api.perfios.com", authType: "API Key" },
      { id: 402, name: "nsdl", status: "inactive", baseUrl: "https://api.nsdl.com", authType: "Certificate" },
      { id: 403, name: "karza", status: "inactive", baseUrl: "https://api.karza.in/pan", authType: "API Key" },
      { id: 404, name: "signzy", status: "inactive", baseUrl: "https://api.signzy.com/pan", authType: "Bearer Token" },
      { id: 405, name: "UIDAI( Aadhar ekyc)", status: "inactive", baseUrl: "https://resident.uidai.gov.in/api", authType: "Certificate" },
      { id: 406, name: "NSDL", status: "inactive", baseUrl: "https://api.nsdl.com", authType: "Certificate" },
      { id: 407, name: "CKYC", status: "inactive", baseUrl: "https://api.ckyc.in", authType: "API Key" },
      { id: 408, name: "signzy", status: "inactive", baseUrl: "https://api.signzy.com", authType: "Bearer Token" },
    ]
  },
  {
    id: 5,
    name: "GST Verification",
    description: "GST validation and compliance",
    providers: [
      { id: 501, name: "cleartax", status: "inactive", baseUrl: "https://api.cleartax.in", authType: "API Key" },
      { id: 502, name: "karza", status: "inactive", baseUrl: "https://api.karza.in/gst", authType: "API Key" },
      { id: 503, name: "signzy", status: "inactive", baseUrl: "https://api.signzy.com/gst", authType: "Bearer Token" },
      { id: 504, name: "GST returns", status: "inactive", baseUrl: "https://api.gst.gov.in", authType: "OAuth 2.0" },
    ]
  },
  {
    id: 6,
    name: "Aadhaar eKYC",
    description: "Aadhaar authentication and eKYC",
    providers: [
      { id: 601, name: "Perfios", status: "inactive", baseUrl: "https://api.perfios.com", authType: "API Key" },
      { id: 602, name: "nsdl", status: "inactive", baseUrl: "https://api.nsdl.com", authType: "Certificate" },
      { id: 603, name: "karza", status: "inactive", baseUrl: "https://api.karza.in/aadhaar", authType: "API Key" },
      { id: 604, name: "signzy", status: "inactive", baseUrl: "https://api.signzy.com/aadhaar", authType: "Bearer Token" },
      { id: 605, name: "UIDAI", status: "inactive", baseUrl: "https://resident.uidai.gov.in/api", authType: "Certificate" },
    ]
  },
  {
    id: 7,
    name: "Account Aggregator",
    description: "Financial data aggregation (RBI licensed)",
    providers: [
      { id: 701, name: "camsfinserv", status: "inactive", baseUrl: "https://api.camsfinserv.com", authType: "Certificate" },
      { id: 702, name: "finvu", status: "inactive", baseUrl: "https://api.finvu.in", authType: "OAuth 2.0" },
      { id: 703, name: "one money", status: "inactive", baseUrl: "https://api.onemoney.in", authType: "Certificate" },
      { id: 704, name: "anumati", status: "inactive", baseUrl: "https://api.anumati.in", authType: "OAuth 2.0" },
      { id: 705, name: "Perfios", status: "inactive", baseUrl: "https://api.saafe.in", authType: "Certificate + OAuth" },
    ]
  },
  {
    id: 8,
    name: "E-Sign/E-Stamp",
    description: "Digital signature and e-stamping services",
    providers: [
      { id: 801, name: "docusign", status: "inactive", baseUrl: "https://api.docusign.com", authType: "OAuth 2.0" },
      { id: 802, name: "leegality", status: "inactive", baseUrl: "https://api.leegality.com", authType: "Bearer Token" },
      { id: 803, name: "signdesk", status: "inactive", baseUrl: "https://api.signdesk.in", authType: "API Key" },
      { id: 804, name: "signzy", status: "inactive", baseUrl: "https://api.signzy.com/esign", authType: "Bearer Token" },
      { id: 805, name: "UIDAI", status: "inactive", baseUrl: "https://resident.uidai.gov.in/api", authType: "Certificate" },
      { id: 806, name: "CDAC eSign", status: "inactive", baseUrl: "https://api.cdac.in/esign", authType: "Certificate" },
      { id: 807, name: "Stamp", status: "inactive", baseUrl: "https://api.stamp.com", authType: "API Key" },
    ]
  },
  {
    id: 9,
    name: "Face Match",
    description: "Facial recognition and verification",
    providers: [
      { id: 901, name: "hyperverge", status: "inactive", baseUrl: "https://api.hyperverge.co", authType: "API Key" },
      { id: 902, name: "signzy", status: "inactive", baseUrl: "https://api.signzy.com/face", authType: "Bearer Token" },
      { id: 903, name: "karza", status: "inactive", baseUrl: "https://api.karza.in/face", authType: "API Key" },
    ]
  },
  {
    id: 10,
    name: "Address/Geo Location",
    description: "Location and mapping services",
    providers: [
      { id: 1001, name: "google maps", status: "inactive", baseUrl: "https://maps.googleapis.com/maps/api", authType: "API Key" },
    ]
  },
  {
    id: 11,
    name: "Telephony/Dialers",
    description: "Cloud telephony and dialer systems",
    providers: [
      { id: 1101, name: "exotel", status: "inactive", baseUrl: "https://api.exotel.com", authType: "API Key" },
      { id: 1102, name: "knowlarity", status: "inactive", baseUrl: "https://api.knowlarity.com", authType: "OAuth 2.0" },
      { id: 1103, name: "myoperator", status: "inactive", baseUrl: "https://api.myoperator.com", authType: "Basic Auth" },
    ]
  },
  {
    id: 12,
    name: "Messaging and Notification",
    description: "Multi-channel messaging and notifications",
    providers: [
      { id: 1201, name: "Whatsapp Business api", status: "inactive", baseUrl: "https://api.whatsapp.com", authType: "Bearer Token" },
      { id: 1202, name: "whatsapp cloud api", status: "inactive", baseUrl: "https://graph.facebook.com", authType: "Bearer Token" },
      { id: 1203, name: "slack webhooks", status: "inactive", baseUrl: "https://hooks.slack.com", authType: "Webhook" },
    ]
  },
  {
    id: 13,
    name: "Video & Collaboration",
    description: "Video conferencing and collaboration tools",
    providers: [
      { id: 1301, name: "google meet", status: "inactive", baseUrl: "https://meet.googleapis.com", authType: "OAuth 2.0" },
      { id: 1302, name: "zoom", status: "inactive", baseUrl: "https://api.zoom.us/v2", authType: "OAuth 2.0" },
      { id: 1303, name: "microsoft teams", status: "inactive", baseUrl: "https://graph.microsoft.com", authType: "OAuth 2.0" },
      { id: 1304, name: "google calendar", status: "inactive", baseUrl: "https://www.googleapis.com/calendar/v3", authType: "OAuth 2.0" },
      { id: 1305, name: "google drive", status: "inactive", baseUrl: "https://www.googleapis.com/drive/v3", authType: "OAuth 2.0" },
      { id: 1306, name: "zoho meeting", status: "inactive", baseUrl: "https://meeting.zoho.com/api", authType: "OAuth 2.0" },
    ]
  },
  {
    id: 14,
    name: "Virtual Meeting",
    description: "Virtual meeting platforms and credit bureaus",
    providers: [
      { id: 1401, name: "google meet", status: "inactive", baseUrl: "https://meet.googleapis.com", authType: "OAuth 2.0" },
      { id: 1402, name: "zoom", status: "inactive", baseUrl: "https://api.zoom.us/v2", authType: "OAuth 2.0" },
      { id: 1403, name: "microsoft", status: "inactive", baseUrl: "https://graph.microsoft.com", authType: "OAuth 2.0" },
      { id: 1404, name: "zoho meeting", status: "inactive", baseUrl: "https://meeting.zoho.com/api", authType: "OAuth 2.0" },
      { id: 1405, name: "experian", status: "inactive", baseUrl: "https://api.experian.in", authType: "OAuth 2.0" },
      { id: 1406, name: "equifax", status: "inactive", baseUrl: "https://api.equifax.co.in", authType: "Certificate" },
      { id: 1407, name: "CRIF High Mark", status: "inactive", baseUrl: "https://api.crifhighmark.com", authType: "API Key" },
      { id: 1408, name: "TransUnion", status: "inactive", baseUrl: "https://api.cibil.com", authType: "Certificate + API Key" },
      { id: 1409, name: "BillDesk", status: "inactive", baseUrl: "https://api.billdesk.com", authType: "HMAC" },
      { id: 1410, name: "Razorpay", status: "inactive", baseUrl: "https://api.razorpay.com/v1", authType: "Basic Auth" },
      { id: 1411, name: "Cashfree Payments", status: "inactive", baseUrl: "https://api.cashfree.com", authType: "Client Secret" },
      { id: 1412, name: "Razorpay", status: "inactive", baseUrl: "https://api.razorpay.com/v1", authType: "Basic Auth" },
      { id: 1413, name: "Cashfree Payments", status: "inactive", baseUrl: "https://api.cashfree.com", authType: "Client Secret" },
      { id: 1414, name: "Perfios.", status: "inactive", baseUrl: "https://api.perfios.com", authType: "API Key" },
      { id: 1415, name: "Karza Technologies", status: "inactive", baseUrl: "https://api.karza.in", authType: "API Key" },
      { id: 1416, name: "Signzy Technologies", status: "inactive", baseUrl: "https://api.signzy.com", authType: "Bearer Token" },
    ]
  },
  {
    id: 15,
    name: "Social Platforms",
    description: "Social media integration APIs",
    providers: [
      { id: 1501, name: "Facebook", status: "inactive", baseUrl: "https://graph.facebook.com", authType: "OAuth 2.0" },
      { id: 1502, name: "Instagram", status: "inactive", baseUrl: "https://graph.instagram.com", authType: "OAuth 2.0" },
      { id: 1503, name: "Linkedin", status: "inactive", baseUrl: "https://api.linkedin.com/v2", authType: "OAuth 2.0" },
      { id: 1504, name: "Twitter", status: "inactive", baseUrl: "https://api.twitter.com/2", authType: "OAuth 2.0" },
      { id: 1505, name: "Youtube", status: "inactive", baseUrl: "https://www.googleapis.com/youtube/v3", authType: "OAuth 2.0" },
      { id: 1506, name: "ShareChat", status: "inactive", baseUrl: "https://api.sharechat.com", authType: "API Key" },
      { id: 1507, name: "Koo, Moj", status: "inactive", baseUrl: "https://api.kooapp.com", authType: "API Key" },
      { id: 1508, name: "Josh", status: "inactive", baseUrl: "https://api.josh.com", authType: "API Key" },
      { id: 1509, name: "Kutumb.", status: "inactive", baseUrl: "https://api.kutumb.app", authType: "API Key" },
    ]
  },
  {
    id: 16,
    name: "Aggregator API",
    description: "Business and data aggregation services",
    providers: [
      { id: 1601, name: "justdial", status: "inactive", baseUrl: "https://api.justdial.com", authType: "API Key" },
      { id: 1602, name: "sulekha", status: "inactive", baseUrl: "https://api.sulekha.com", authType: "API Key" },
      { id: 1603, name: "indiamart", status: "inactive", baseUrl: "https://api.indiamart.com", authType: "API Key" },
      { id: 1604, name: "setu", status: "inactive", baseUrl: "https://api.setu.co", authType: "Bearer Token" },
      { id: 1605, name: "decentro", status: "inactive", baseUrl: "https://api.decentro.tech", authType: "API Key" },
      { id: 1606, name: "perfios", status: "inactive", baseUrl: "https://api.perfios.com", authType: "API Key" },
      { id: 1607, name: "karza", status: "inactive", baseUrl: "https://api.karza.in", authType: "API Key" },
    ]
  },
  {
    id: 17,
    name: "Cloud Structure API",
    description: "Cloud infrastructure and services",
    providers: [
      { id: 1701, name: "Aws", status: "inactive", baseUrl: "https://aws.amazon.com", authType: "AWS Signature" },
      { id: 1702, name: "Google cloud platform(GCP)", status: "inactive", baseUrl: "https://cloud.google.com", authType: "OAuth 2.0" },
      { id: 1703, name: "microsoft azure", status: "inactive", baseUrl: "https://management.azure.com", authType: "OAuth 2.0" },
    ]
  },
  {
    id: 18,
    name: "Blockchain/DLT API",
    description: "Blockchain and distributed ledger technology",
    providers: [
      { id: 1801, name: "hyperledger fabric", status: "inactive", baseUrl: "https://api.hyperledger.org", authType: "Certificate" },
      { id: 1802, name: "polygon", status: "inactive", baseUrl: "https://api.polygon.io", authType: "API Key" },
      { id: 1803, name: "quorum", status: "inactive", baseUrl: "https://api.quorum.io", authType: "API Key" },
      { id: 1804, name: "gochain", status: "inactive", baseUrl: "https://api.gochain.io", authType: "API Key" },
      { id: 1805, name: "Auxesis Group", status: "inactive", baseUrl: "https://api.auxesisgroup.com", authType: "API Key" },
      { id: 1806, name: "Zebi Data India", status: "inactive", baseUrl: "https://api.zebi.io", authType: "API Key" },
      { id: 1807, name: "Primechain Technologies", status: "inactive", baseUrl: "https://api.primechain.in", authType: "API Key" },
    ]
  },
  {
    id: 19,
    name: "Database & Storage API",
    description: "Database and storage solutions",
    providers: [
      { id: 1901, name: "postgreSQL", status: "inactive", baseUrl: "https://postgresql.org", authType: "Connection String" },
    ]
  },
  {
    id: 20,
    name: "Government Compliance API",
    description: "Government regulatory and compliance APIs",
    providers: [
      { id: 2001, name: "GST", status: "inactive", baseUrl: "https://api.gst.gov.in", authType: "OAuth 2.0" },
      { id: 2002, name: "TDS", status: "inactive", baseUrl: "https://www.incometax.gov.in/iec/foportal", authType: "Certificate" },
      { id: 2003, name: "ITR", status: "inactive", baseUrl: "https://www.incometax.gov.in/iec/foportal", authType: "Certificate" },
      { id: 2004, name: "PF/ESIC", status: "inactive", baseUrl: "https://unifiedportal-emp.epfindia.gov.in", authType: "Digital Signature" },
      { id: 2005, name: "ROC", status: "inactive", baseUrl: "https://www.mca.gov.in", authType: "Digital Signature" },
      { id: 2006, name: "RBI RETURNS", status: "inactive", baseUrl: "https://api.rbi.org.in", authType: "Certificate" },
      { id: 2007, name: "ITR – Returns", status: "inactive", baseUrl: "https://www.incometax.gov.in/iec/foportal", authType: "Certificate" },
      { id: 2008, name: "Challans", status: "inactive", baseUrl: "https://www.tin-nsdl.com", authType: "API Key" },
      { id: 2009, name: "Ministry of Corporate Affairs (MCA21 APIs)", status: "inactive", baseUrl: "https://www.mca.gov.in", authType: "Digital Signature" },
      { id: 2010, name: "Goods and Services Tax Network (GST APIs)", status: "inactive", baseUrl: "https://api.gst.gov.in", authType: "OAuth 2.0" },
      { id: 2011, name: "National Payments Corporation of India (KYC/UPI/NACH)", status: "inactive", baseUrl: "https://api.npci.org.in", authType: "Certificate" },
      { id: 2012, name: "Protean eGov Technologies Limited", status: "inactive", baseUrl: "https://api.proteantech.in", authType: "Certificate" },
      { id: 2013, name: "NSDL e-Governance Infrastructure Limited", status: "inactive", baseUrl: "https://www.nsdl.co.in", authType: "Certificate" },
      { id: 2014, name: "CDSL Ventures Limited (CKYC)", status: "inactive", baseUrl: "https://www.cvl-kra.com", authType: "Certificate" },
    ]
  },
  {
    id: 21,
    name: "Speech-to-Text",
    description: "Voice to text conversion services",
    providers: [
      { id: 2101, name: "Voice to Text", status: "inactive", baseUrl: "https://api.speechtotext.com", authType: "API Key" },
    ]
  },
  {
    id: 22,
    name: "Text-to-Speech",
    description: "Text to voice conversion services",
    providers: [
      { id: 2201, name: "Text to Voice", status: "inactive", baseUrl: "https://api.texttospeech.com", authType: "API Key" },
    ]
  },
  {
    id: 23,
    name: "Chatbot",
    description: "AI-powered chatbot services",
    providers: [
      { id: 2301, name: "Chatbot", status: "inactive", baseUrl: "https://api.chatbot.com", authType: "API Key" },
    ]
  },
  {
    id: 24,
    name: "Mandate",
    description: "eNACH and UPI mandate services",
    providers: [
      { id: 2401, name: "eNACH", status: "inactive", baseUrl: "https://api.npci.org.in/enach", authType: "Certificate" },
      { id: 2402, name: "UPI Mandate", status: "inactive", baseUrl: "https://api.npci.org.in/upi", authType: "Certificate" },
    ]
  },
  {
    id: 25,
    name: "Payout",
    description: "Vendor payment and payout services",
    providers: [
      { id: 2501, name: "Vendor Payment", status: "inactive", baseUrl: "https://api.payout.com", authType: "API Key" },
    ]
  },
  {
    id: 26,
    name: "MCA Filing",
    description: "MCA and ROC compliance filing",
    providers: [
      { id: 2601, name: "ROC", status: "inactive", baseUrl: "https://www.mca.gov.in", authType: "Digital Signature" },
      { id: 2602, name: "MCA Returns", status: "inactive", baseUrl: "https://www.mca.gov.in", authType: "Digital Signature" },
    ]
  },
  {
    id: 27,
    name: "Bulk Mailing",
    description: "Email marketing and transactional email services",
    providers: [
      { id: 2701, name: "mailgun", status: "inactive", baseUrl: "https://api.mailgun.net", authType: "API Key" },
      { id: 2702, name: "brevo , (sendgrid backup)", status: "inactive", baseUrl: "https://api.brevo.com", authType: "API Key" },
    ]
  },
  {
    id: 28,
    name: "Alternate Date",
    description: "Alternative date and calendar services",
    providers: [
      { id: 2801, name: "evahan", status: "inactive", baseUrl: "https://api.evahan.com", authType: "API Key" },
    ]
  },
  {
    id: 29,
    name: "Behaviour and Psychometric Test",
    description: "Psychological and behavioral assessment",
    providers: [
      { id: 2901, name: "traitify", status: "inactive", baseUrl: "https://api.traitify.com", authType: "API Key" },
    ]
  },
  {
    id: 30,
    name: "Vehicle Registration",
    description: "Vehicle registration verification",
    providers: [
      { id: 3001, name: "Evahan", status: "inactive", baseUrl: "https://api.evahan.com", authType: "API Key" },
    ]
  },
  {
    id: 31,
    name: "Vehicle Valuation",
    description: "Vehicle valuation and pricing",
    providers: [
      { id: 3101, name: "carwale, cardekho", status: "inactive", baseUrl: "https://api.carwale.com", authType: "API Key" },
    ]
  },
  {
    id: 32,
    name: "Gold Value",
    description: "Gold price and valuation services",
    providers: [
      { id: 3201, name: "money control", status: "inactive", baseUrl: "https://api.moneycontrol.com", authType: "API Key" },
    ]
  },
  {
    id: 33,
    name: "Security",
    description: "Security and market data services",
    providers: [
      { id: 3301, name: "money control", status: "inactive", baseUrl: "https://api.moneycontrol.com", authType: "API Key" },
    ]
  },
  {
    id: 34,
    name: "GST Returns and Challans",
    description: "GST returns filing and challan services",
    providers: [
      { id: 3401, name: "GSP", status: "inactive", baseUrl: "https://api.gsp.gov.in", authType: "OAuth 2.0" },
    ]
  },
  {
    id: 35,
    name: "TDS",
    description: "TDS filing and compliance services",
    providers: [
      { id: 3501, name: "NSGL", status: "inactive", baseUrl: "https://www.tin-nsdl.com", authType: "Certificate" },
    ]
  },
  {
    id: 36,
    name: "Property Title Check",
    description: "Property verification and title search",
    providers: [
      { id: 3601, name: "Squareyard,Magicbrick,99 acres", status: "inactive", baseUrl: "https://api.squareyards.com", authType: "API Key" },
    ]
  },
  {
    id: 37,
    name: "Passport and Utility Bills",
    description: "Passport and utility bill verification",
    providers: [
      { id: 3701, name: "idcentral , eko india", status: "inactive", baseUrl: "https://api.idcentral.io", authType: "API Key" },
    ]
  },
  {
    id: 38,
    name: "CIBIL, Equifax, Experian, CRIF",
    description: "Credit bureau and scoring services",
    providers: [
      { id: 3801, name: "verifyal , surepass", status: "inactive", baseUrl: "https://api.verifyal.com", authType: "API Key" },
    ]
  },
];

// =============================================================================
// SECTION 3: UI COMPONENTS
// =============================================================================

const FormLabel = ({ children, required }) => (
  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 ml-0.5 select-none">
    {children}
    {required && <span className="text-rose-500 ml-1" title="Required">*</span>}
  </label>
);

const Button = ({ children, variant = "primary", onClick, disabled, className, icon }) => {
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200 border border-transparent",
    secondary: "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 border border-transparent",
    danger: "bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 shadow-sm",
    ghost: "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-widest transition-all duration-200 transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3 text-xs ${variants[variant]} ${className}`}
    >
      {icon} {children}
    </button>
  );
};

// =============================================================================
// SECTION 4: MAIN COMPONENT
// =============================================================================

export default function ApiProviders() {
  const [apiCategories, setApiCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize with data from Excel sheet
  useEffect(() => {
    setApiCategories(API_CATEGORIES);
  }, []);

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!search) return apiCategories;
    const s = search.toLowerCase();
    return apiCategories.filter(cat =>
      cat.name.toLowerCase().includes(s) ||
      cat.description.toLowerCase().includes(s) ||
      cat.providers.some(p => p.name.toLowerCase().includes(s))
    );
  }, [apiCategories, search]);

  // Handle provider activation
  const handleActivateProvider = async (categoryId, providerId) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await apiProviderService.activate(categoryId, providerId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApiCategories(prevCategories =>
        prevCategories.map(cat => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              providers: cat.providers.map(provider => {
                if (provider.id === providerId) {
                  return { ...provider, status: "active" };
                }
                // Deactivate other providers in the same category
                return { ...provider, status: "inactive" };
              })
            };
          }
          return cat;
        })
      );
      
      alert("Provider activated successfully!");
    } catch (error) {
      console.error("Error activating provider:", error);
      alert("Failed to activate provider");
    } finally {
      setLoading(false);
    }
  };

  // Handle provider deactivation
  const handleDeactivateProvider = async (categoryId, providerId) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await apiProviderService.deactivate(categoryId, providerId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApiCategories(prevCategories =>
        prevCategories.map(cat => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              providers: cat.providers.map(provider => {
                if (provider.id === providerId) {
                  return { ...provider, status: "inactive" };
                }
                return provider;
              })
            };
          }
          return cat;
        })
      );
      
      alert("Provider deactivated successfully!");
    } catch (error) {
      console.error("Error deactivating provider:", error);
      alert("Failed to deactivate provider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1800px] mx-auto min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8 md:mb-12">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter mb-2">API Providers</h1>
          <p className="text-slate-500 text-base md:text-lg font-medium">Configure and manage third-party API integrations for your system</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden mb-6 md:mb-8">
        <div className="p-4 md:p-8 border-b border-slate-100 bg-white">
          <div className="relative w-full max-w-lg">
            <span className="absolute left-5 top-4 text-slate-400"><Icons.Search /></span>
            <input
              className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="Search API categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* API Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredCategories.map((category) => {
          const activeProvider = category.providers.find(p => p.status === "active");
          return (
            <div key={category.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Card Header */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 md:p-6 border-b border-slate-200">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shrink-0">
                    <Icons.Cloud />
                  </div>
                  {activeProvider && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                      <Icons.Check /> Active
                    </span>
                  )}
                </div>
                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 mb-2">{category.name}</h3>
                <p className="text-sm text-slate-600 font-medium">{category.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-5 md:p-6 space-y-4">
                {activeProvider && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Currently Active</span>
                      <Icons.Lightning />
                    </div>
                    <div className="text-sm font-bold text-emerald-800 mb-1">{activeProvider.name}</div>
                    <div className="text-xs text-emerald-600 font-medium break-all">{activeProvider.baseUrl}</div>
                    <div className="text-xs text-emerald-600 font-medium mt-1">Auth: {activeProvider.authType}</div>
                  </div>
                )}

                <div className="space-y-2">
                  <FormLabel>Available Providers ({category.providers.length})</FormLabel>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {category.providers.map((provider) => (
                      <div
                        key={provider.id}
                        className={`flex items-center justify-between gap-2 p-3 rounded-lg border transition-all ${
                          provider.status === "active" ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-800 truncate">{provider.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{provider.authType}</div>
                        </div>
                        {provider.status === "active" ? (
                          <Button variant="danger" onClick={() => handleDeactivateProvider(category.id, provider.id)} disabled={loading} className="!px-3 !py-2 !text-[10px] shrink-0" icon={<Icons.XMark />}>
                            Deactivate
                          </Button>
                        ) : (
                          <Button variant="success" onClick={() => handleActivateProvider(category.id, provider.id)} disabled={loading} className="!px-3 !py-2 !text-[10px] shrink-0" icon={<Icons.Check />}>
                            Activate
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Search /></div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No APIs Found</h3>
          <p className="text-slate-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}