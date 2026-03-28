import { formatTrend } from '../utils/formatters'

const Arrow = ({ direction = 'up' }) => {
  const rotation = direction === 'up' ? 'rotate(-45 12 12)' : 'rotate(135 12 12)'
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth={2}
      aria-hidden="true"
    >
      <g transform={rotation}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </g>
    </svg>
  )
}

const TrendBadge = ({ trend }) => {
  if (trend === null || trend === undefined) return null
  const isPositive = trend >= 0
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
        isPositive ? 'bg-brand-accent/10 text-brand-accent' : 'bg-blue-900/10 text-blue-900'
      }`}
    >
      <Arrow direction={isPositive ? 'up' : 'down'} />
      {formatTrend(trend)}
    </span>
  )
}

const toneStyles = {
  default: 'text-brand-text',
  danger: 'text-brand-danger',
}

const KpiCard = ({
  label,
  value,
  helper,
  trend,
  formatter = (val) => val,
  tone = 'default',
}) => {
  const formattedValue =
    value === null || value === undefined ? '—' : formatter(value)
  const valueClass = toneStyles[tone] ?? toneStyles.default

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-panel p-5 shadow-glow">
      <div className="relative">
        <p className="pr-20 sm:pr-24 text-sm font-medium text-slate-500 break-normal whitespace-normal leading-5">{label}</p>
        <div className="absolute right-0 top-0">
          <TrendBadge trend={typeof trend === 'number' ? trend : null} />
        </div>
      </div>
      <p className={`mt-2 text-3xl font-semibold ${valueClass}`}>{formattedValue}</p>
      {helper ? (
        <p className="mt-2 text-xs text-brand-text/60">{helper}</p>
      ) : null}
    </div>
  )
}

export default KpiCard

