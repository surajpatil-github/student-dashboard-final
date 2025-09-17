'use client';

type AvgSkills = {
  comprehension: number;
  attention: number;
  focus: number;
  retention: number;
  engagement_time: number;
};

export default function StatsCards({
  avgScore,
  avgSkills,
  r2, // optional
}: {
  avgScore: number;
  avgSkills: AvgSkills;
  r2?: number;
}) {
  // glassy card base (dark theme friendly)
  const baseCard =
    'rounded-2xl border border-white/10 p-5 flex flex-col gap-1 min-w-[220px] ' +
    'bg-white/5 shadow-lg shadow-black/20 backdrop-blur transition-shadow hover:shadow-xl';

  const avgSkillAll =
    (avgSkills.comprehension +
      avgSkills.attention +
      avgSkills.focus +
      avgSkills.retention +
      avgSkills.engagement_time) /
    5;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Avg Assessment Score */}
      <div className={`${baseCard} bg-gradient-to-br from-emerald-500/10 to-emerald-400/0`}>
        <div className="text-xs font-medium uppercase tracking-wide text-white/70">
          Avg Assessment Score
        </div>
        <div className="text-3xl md:text-4xl font-bold text-white">
          {Number.isFinite(avgScore) ? avgScore.toFixed(1) : '—'}
        </div>
      </div>

      {/* Avg Cognitive Skills */}
      <div className={`${baseCard} bg-gradient-to-br from-indigo-500/10 to-indigo-400/0`}>
        <div className="text-xs font-medium uppercase tracking-wide text-white/70">
          Avg Cognitive Skills
        </div>
        <div className="text-3xl md:text-4xl font-bold text-white">
          {Number.isFinite(avgSkillAll) ? avgSkillAll.toFixed(1) : '—'}
        </div>
      </div>

      {/* Model R² */}
      <div className={`${baseCard} bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-400/0`}>
        <div className="text-xs font-medium uppercase tracking-wide text-white/70">
          Model R²
        </div>
        <div className="text-3xl md:text-4xl font-bold text-white">
          {typeof r2 === 'number' && Number.isFinite(r2) ? r2.toFixed(3) : '—'}
        </div>
      </div>
    </div>
  );
}
