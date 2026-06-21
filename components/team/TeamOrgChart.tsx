import type { CmsTeamOrgChart } from '@/lib/cms'

interface TeamOrgChartProps {
  orgChart: CmsTeamOrgChart
}

export default function TeamOrgChart({ orgChart }: TeamOrgChartProps) {
  const departments = orgChart.departments ?? []
  const roleColumns = orgChart.role_columns ?? []

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-100" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #eef0fb 50%, #f5f0ff 100%)' }}>
      <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-primary-500/5 pointer-events-none" />
      <div className="absolute -bottom-16 -start-16 w-48 h-48 rounded-full bg-secondary-500/5 pointer-events-none" />

      <div className="relative p-10 max-[500px]:p-5">
        <div className="flex items-center justify-center gap-3 mb-12 max-[500px]:mb-8 max-[500px]:gap-2">
          <div className="h-px w-16 max-[500px]:w-8 bg-gradient-to-r from-transparent to-secondary-400" />
          <h3 className="font-black text-primary-500 text-2xl max-[500px]:text-lg tracking-tight text-center">
            {orgChart.title}
          </h3>
          <div className="h-px w-16 max-[500px]:w-8 bg-gradient-to-l from-transparent to-secondary-400" />
        </div>

        {/* Leadership */}
        <div className="flex justify-center mb-0">
          <div className="relative bg-primary-500 text-white rounded-2xl px-10 py-5 max-[500px]:px-6 max-[500px]:py-4 text-center shadow-xl shadow-primary-500/30 min-w-[260px] max-[500px]:min-w-0 max-[500px]:w-full max-w-sm border border-primary-400">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full">
              {orgChart.leadership?.badge}
            </div>
            <p className="text-primary-200 text-xs font-semibold mb-1">{orgChart.leadership?.subtitle}</p>
            <p className="font-black text-xl max-[500px]:text-lg">{orgChart.leadership?.title}</p>
            <p className="text-primary-200 text-xs mt-1">{orgChart.leadership?.person_name}</p>
          </div>
        </div>

        {/* ── Mobile: stacked branches (< 501px) ── */}
        <div className="min-[501px]:hidden">
          <div className="flex justify-center h-6 mt-1">
            <div className="w-0 h-full border-l-2 border-dashed border-[#c7c9e0]" />
          </div>

          <div className="space-y-4 mt-2">
            {departments.map((dept, i) => {
              const roles = roleColumns[i]?.roles ?? []

              return (
                <div
                  key={`${dept.label}-${i}`}
                  className="rounded-2xl border border-primary-100/80 bg-white/70 p-4 shadow-sm"
                >
                  <div className="bg-secondary-500 text-white rounded-xl px-4 py-3.5 text-center shadow-md shadow-secondary-500/20 border border-secondary-400">
                    <div className="text-xl mb-1">{dept.icon}</div>
                    <p className="font-black text-sm leading-snug">{dept.label}</p>
                    <p className="text-secondary-100 text-xs mt-0.5 font-medium leading-snug">{dept.sub}</p>
                  </div>

                  {roles.length > 0 && (
                    <>
                      <div className="flex justify-center py-2">
                        <div className="w-0 h-5 border-l-2 border-dashed border-[#c7c9e0]" />
                      </div>
                      <div className="space-y-2">
                        {roles.map((role) => (
                          <div
                            key={role}
                            className="border-secondary-200 bg-white border rounded-xl px-4 py-3 text-center shadow-sm"
                          >
                            <div className="w-2 h-2 rounded-full bg-secondary-400 mx-auto mb-2" />
                            <p className="text-sm font-bold text-primary-500 leading-snug">{role}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Desktop: 3-column tree (≥ 501px) ── */}
        <div className="hidden min-[501px]:block">
          <div className="flex justify-center h-8">
            <div className="w-0 h-full border-l-2 border-dashed border-[#c7c9e0]" />
          </div>
          <div className="grid grid-cols-3 gap-5 h-8 relative">
            <div
              className="absolute top-0 left-[calc((100%-2.5rem)/6)] right-[calc((100%-2.5rem)/6)] h-0 border-t-2 border-dashed border-[#c7c9e0]"
              aria-hidden="true"
            />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex justify-center h-full">
                <div className="w-0 h-full border-l-2 border-dashed border-[#c7c9e0]" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-5 mb-0">
            {departments.map((dept) => (
              <div key={dept.label} className="bg-secondary-500 text-white rounded-2xl px-4 py-4 text-center shadow-lg shadow-secondary-500/25 border border-secondary-400">
                <div className="text-2xl mb-1">{dept.icon}</div>
                <p className="font-black text-sm">{dept.label}</p>
                <p className="text-secondary-100 text-xs mt-0.5 font-medium">{dept.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-5 h-10">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex justify-center h-full">
                <div className="w-0 h-full border-l-2 border-dashed border-[#c7c9e0]" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-5 mb-8">
            {roleColumns.map((col, gi) => (
              <div key={gi} className="flex flex-col gap-2">
                {col.roles.map((role) => (
                  <div
                    key={role}
                    className="border-secondary-200 bg-white border rounded-xl px-4 py-3 text-center shadow-sm hover:shadow-md hover:border-primary-300 transition-all"
                  >
                    <div className="w-2 h-2 rounded-full bg-secondary-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-primary-500">{role}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Support units */}
        <div className="border-t-2 border-dashed border-primary-200 pt-6 max-[500px]:pt-5 mt-2 min-[501px]:mt-0">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 max-[500px]:mb-3">
            {orgChart.support_strip?.title}
          </p>
          <div className="flex justify-center gap-3 max-[500px]:gap-2 flex-wrap">
            {(orgChart.support_strip?.items ?? []).map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 bg-white border border-primary-100 rounded-full px-5 py-2 max-[500px]:px-4 max-[500px]:py-2 shadow-sm"
              >
                <span className="text-sm">{s.icon}</span>
                <p className="text-xs max-[500px]:text-[11px] font-bold text-primary-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
