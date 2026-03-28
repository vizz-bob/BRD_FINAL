const DonutLegend = ({ items }) => (
  <dl className="mt-2 space-y-2 text-lg">
    {items.map((item) => (
      <div key={item.label} className="flex items-center gap-2">
        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="text-brand-text">{item.label}</span>
        <span className="ml-2 font-semibold text-brand-text">{item.value}%</span>
      </div>
    ))}
  </dl>
)

export default DonutLegend
