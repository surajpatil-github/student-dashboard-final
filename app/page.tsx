// app/page.tsx
import { makeStudents } from "@/lib/data";
import { summary } from "@/lib/analytics";
import { kmeans, trainRegressor } from "@/lib/model";

import StatsCards from "./components/StatsCards";
import BarSkillVsScore from "./components/BarSkillVsScore";
import AttentionScatter from "./components/AttentionScatter";
import StudentRadar from "./components/StudentRadar";
import StudentsTable from "./components/StudentsTable";
import Insights from "./components/Insights";

export default function Page() {
  const students = makeStudents(300, 123);

  const { avgScore, avgSkills, corr } = summary(students);
  const { personas } = kmeans(students, 3);

  // ❌ no 'any' — safely read r2
  let computedR2 = 0;
  try {
    const result = trainRegressor(students);
    if (typeof result?.r2 === "number" && Number.isFinite(result.r2)) {
      computedR2 = result.r2;
    }
  } catch {}

  const r2 =
    computedR2 ||
    (Math.max(
      ...Object.values(corr).map((v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n * n : 0;
      }),
    ) || 0);

  const corrBar = [
    { skill: "comprehension", corr: Number(corr.comprehension ?? 0) },
    { skill: "attention", corr: Number(corr.attention ?? 0) },
    { skill: "focus", corr: Number(corr.focus ?? 0) },
    { skill: "retention", corr: Number(corr.retention ?? 0) },
    { skill: "engagement_time", corr: Number(corr.engagement_time ?? 0) },
  ].filter((d) => Number.isFinite(d.corr));

  const scatter = students.slice(0, 200).map((s) => ({
    x: s.attention,
    y: s.assessment_score,
  }));

  const radarRow = (i: number) =>
    students.length === 0
      ? []
      : [
          { label: "Comp", value: students[i].comprehension },
          { label: "Attn", value: students[i].attention },
          { label: "Focus", value: students[i].focus },
          { label: "Retn", value: students[i].retention },
          { label: "Eng", value: students[i].engagement_time },
        ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-indigo-900 text-white p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
            Cognitive Skills & Student Performance
          </h1>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs md:text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live • Student Persona
          </span>
        </header>

        <StatsCards avgScore={avgScore} avgSkills={avgSkills} r2={r2} />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 shadow-lg shadow-black/20 backdrop-blur">
          <h3 className="text-sm font-semibold text-white/80 mb-2">
            Skills vs Score (Correlation)
          </h3>
          <BarSkillVsScore correlations={corrBar} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 shadow-lg shadow-black/20 backdrop-blur">
          <h3 className="text-sm font-semibold text-white/80 mb-2">
            Attention vs Performance (Scatter)
          </h3>
          <AttentionScatter data={scatter} />
        </section>

        {students.length > 0 && (
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 shadow-lg shadow-black/20 backdrop-blur">
            <h3 className="text-sm font-semibold text-white/80 mb-2">
              Student Profile (Radar)
            </h3>
            <StudentRadar data={radarRow(0)} />
          </section>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 shadow-lg shadow-black/20 backdrop-blur">
          <h3 className="text-sm font-semibold text-white/80 mb-3">Students</h3>
          <StudentsTable students={students} personas={personas} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 shadow-lg shadow-black/20 backdrop-blur">
          <h3 className="text-sm font-semibold text-white/80 mb-3">Insights</h3>
          <Insights corr={corr} personas={personas} />
        </section>
      </div>
    </main>
  );
}
