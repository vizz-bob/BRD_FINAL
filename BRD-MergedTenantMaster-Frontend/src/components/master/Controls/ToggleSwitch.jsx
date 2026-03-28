import React from "react";

/**
 * Shared Toggle Switch Component
 * Usage:
 * <ToggleSwitch
 *   label="Active"
 *   checked={isActive}
 *   onChange={(val) => setIsActive(val)}
 * />
 */

const ToggleSwitch = ({ label, checked, onChange, disabled = false }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
            <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${checked ? "bg-blue-600" : "bg-gray-200"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"
                        }`}
                />
            </button>
        </div>
    );
};

export default ToggleSwitch;
