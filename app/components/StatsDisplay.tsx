import type { Pokemon } from "../../types/pokemon";

interface StatsDisplayProps {
  stats: Pokemon["stats"];
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Base Stats</h3>
      <ul className="space-y-1">
        {stats.map((s) => (
          <li key={s.stat.name} className="flex items-center justify-between text-sm">
            <span className="capitalize whitespace-nowrap shrink-0 w-32">{s.stat.name}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{s.base_stat}</span>
              <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${Math.min(s.base_stat, 150) / 1.5}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}