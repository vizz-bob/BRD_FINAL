const ChartCard = ({ title, subtitle, children, actions, compact }) => (
  <div className={`flex h-full flex-col rounded-2xl border border-brand-border bg-brand-panel ${compact ? 'p-3' : 'p-5'} shadow-glow`}>
    <div className={`${compact ? 'mb-2' : 'mb-4'} flex items-start justify-between gap-3`}>
      <div>
        <p className="text-lg font-semibold text-brand-text">{title}</p>
        {subtitle ? <p className="text-sm text-brand-text/60">{subtitle}</p> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
    <div className="flex-1">{children}</div>
  </div>
)

export default ChartCard
