export default function PatternTag({ match }) {
  const normalized = match.toUpperCase();

  const getColor = () => {
    if (normalized.includes("MATCH")) {
      return "bg-red-100 text-red-700 border-red-300";
    }
    return "bg-green-100 text-green-700 border-green-300";
  };

  return (
    <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm border ${getColor()} whitespace-nowrap`}>
      {normalized}
    </span>
  );
}