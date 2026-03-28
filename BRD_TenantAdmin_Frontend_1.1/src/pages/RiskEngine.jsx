import GeoFencingMap from "../components/GeoFencingMap";
import ScorecardBuilder from "../components/ScorecardBuilder";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function RiskEngine() {
  return (
    <div className="p-3 sm:p-5 lg:p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50 animate-fade-in">

      {/* Header */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
        <div className="p-2 sm:p-3 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-200 shrink-0 mt-0.5 sm:mt-0">
          <ShieldCheckIcon className="h-5 w-5 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Risk & Eligibility Engine
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-sm lg:text-base mt-0.5">
            Configure global knockout rules, scoring models, and geo-restrictions.
          </p>
        </div>
      </div>

      {/* 
        Layout strategy:
        - mobile (< lg): stacked vertically, each section has a fixed min-height
        - lg+: side by side, fills viewport height
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        <div className="w-full min-h-[420px] sm:min-h-[500px] overflow-hidden">
          <ScorecardBuilder />
        </div>
        <div className="w-full min-h-[420px] sm:min-h-[500px] overflow-hidden">
          <GeoFencingMap />
        </div>
      </div>
    </div>
  );
}