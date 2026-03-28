export default function RiskBadge({ score }) {
  const getColor = () => {
    if (score >= 75) return "bg-red-100 text-red-700";
    if (score >= 40) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getColor()}`}>
      {score}%
    </span>
  );
}