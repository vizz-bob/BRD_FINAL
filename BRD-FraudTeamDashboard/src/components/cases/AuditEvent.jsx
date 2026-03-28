import { HiCheck, HiX, HiBan, HiArrowRight } from "react-icons/hi";

export default function AuditEvent({ action, ts }) {
  const getIcon = () => {
    if (action.includes("APPROVED")) return <HiCheck className="text-green-600" />;
    if (action.includes("REJECTED")) return <HiX className="text-yellow-600" />;
    if (action.includes("BLACKLISTED")) return <HiBan className="text-red-600" />;
    return <HiArrowRight className="text-blue-600" />;
  };

  return (
    <div className="flex items-start gap-3 border-b pb-3 pt-2">
      <div>{getIcon()}</div>

      <div className="flex-1">
        <p className="font-semibold text-gray-800">{action}</p>
        <p className="text-xs text-gray-500">{ts}</p>
      </div>
    </div>
  );
}
