import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";

export default function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full px-3 py-3 sm:px-4 text-left hover:bg-gray-50 rounded-lg transition-colors gap-2"
      >
        <span className="font-medium text-gray-900 text-sm sm:text-base">{title}</span>
        <HiChevronDown
          className={`text-lg text-gray-500 transition-transform duration-200 flex-shrink-0 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <div className="px-3 pb-4 pt-2 sm:px-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}