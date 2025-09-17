'use client';

import { useMemo, useState } from 'react';

type Student = {
  student_id: string;
  name: string;
  class: string;
  comprehension: number;
  attention: number;
  focus: number;
  retention: number;
  engagement_time: number;
  assessment_score: number;
};

type Row = Student & { persona: string };

export default function StudentsTable({
  students,
  personas,
}: {
  students?: Student[];          // <-- optional + safe default
  personas?: string[];           // <-- optional
}) {
  // Build rows safely even if props are missing or lengths differ
  const rows: Row[] = useMemo(() => {
    const list = students ?? [];
    return list.map((s, i) => ({
      ...s,
      persona: personas?.[i] ?? '—',
    }));
  }, [students, personas]);

  // UI state
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<keyof Row>('assessment_score');
  const [asc, setAsc] = useState(false);

  // Filter & sort (all guarded)
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((s) => (s.name ?? '').toLowerCase().includes(query));
  }, [rows, q]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    return arr.sort((a, b) => {
      const av = a[sortKey] as any;
      const bv = b[sortKey] as any;

      // numeric sort when possible
      if (typeof av === 'number' && typeof bv === 'number') {
        return (asc ? 1 : -1) * (av - bv);
      }
      // fallback to string compare
      return (asc ? 1 : -1) * String(av).localeCompare(String(bv));
    });
  }, [filtered, sortKey, asc]);

  // ✨ Dark/glassy styles (no logic changes)
  const th =
    'text-left px-4 py-2 font-medium cursor-pointer select-none text-white/80 hover:text-white';
  const td = 'px-4 py-2';

  return (
    <section className="rounded-2xl border border-white/10 overflow-x-auto p-4 md:p-5 bg-white/5 shadow-lg shadow-black/20 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          className="rounded-md px-3 py-2 w-64 bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400/40"
          placeholder="Search by name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="rounded-md px-3 py-2 bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          value={sortKey as string}
          onChange={(e) => setSortKey(e.target.value as keyof Row)}
        >
          <option value="assessment_score">assessment_score</option>
          <option value="attention">attention</option>
          <option value="comprehension">comprehension</option>
          <option value="focus">focus</option>
          <option value="retention">retention</option>
          <option value="engagement_time">engagement_time</option>
          <option value="name">name</option>
          <option value="class">class</option>
          <option value="persona">persona</option>
          <option value="student_id">student_id</option>
        </select>
        <button
          className="rounded-md px-3 py-2 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 text-white border border-white/20 hover:border-white/30 transition"
          onClick={() => setAsc((v) => !v)}
          aria-label="toggle sort direction"
          aria-pressed={asc}
          title="Toggle sort direction"
        >
          {asc ? 'Asc' : 'Desc'}
        </button>
      </div>

      <table className="min-w-full text-sm text-white/90">
        <thead className="bg-white/10">
          <tr>
            <th className={th} onClick={() => setSortKey('persona')}>Persona</th>
            <th className={th} onClick={() => setSortKey('student_id')}>student_id</th>
            <th className={th} onClick={() => setSortKey('name')}>name</th>
            <th className={th} onClick={() => setSortKey('class')}>class</th>
            <th className={th} onClick={() => setSortKey('comprehension')}>comprehension</th>
            <th className={th} onClick={() => setSortKey('attention')}>attention</th>
            <th className={th} onClick={() => setSortKey('focus')}>focus</th>
            <th className={th} onClick={() => setSortKey('retention')}>retention</th>
            <th className={th} onClick={() => setSortKey('engagement_time')}>engagement_time</th>
            <th className={th} onClick={() => setSortKey('assessment_score')}>assessment_score</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((s) => (
            <tr
              key={s.student_id}
              className="border-t border-white/10 hover:bg-white/5 even:bg-white/[0.04] transition-colors"
            >
              <td className={td}>{s.persona}</td>
              <td className={td}>{s.student_id}</td>
              <td className={td}>{s.name}</td>
              <td className={td}>{s.class}</td>
              <td className={td}>{s.comprehension}</td>
              <td className={td}>{s.attention}</td>
              <td className={td}>{s.focus}</td>
              <td className={td}>{s.retention}</td>
              <td className={td}>{s.engagement_time}</td>
              <td className={td}>{s.assessment_score}</td>
            </tr>
          ))}

          {sorted.length === 0 && (
            <tr>
              <td className="p-6 text-center text-white/60" colSpan={10}>
                No students to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
