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
  students?: Student[];
  personas?: string[];
}) {
  const rows: Row[] = useMemo(() => {
    const list = students ?? [];
    return list.map((s, i) => ({ ...s, persona: personas?.[i] ?? '—' }));
  }, [students, personas]);

  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<keyof Row>('assessment_score');
  const [asc, setAsc] = useState(false);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((s) => (s.name ?? '').toLowerCase().includes(query));
  }, [rows, q]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    return arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return (asc ? 1 : -1) * (av - bv);
      }
      return (asc ? 1 : -1) * String(av).localeCompare(String(bv));
    });
  }, [filtered, sortKey, asc]);

  const th = 'text-left p-3 font-medium cursor-pointer select-none';
  const td = 'p-3';

  return (
    <section className="rounded-xl border overflow-x-auto p-4">
      <div className="flex items-center gap-3 mb-3">
        <input
          className="border rounded-md p-2 w-64"
          placeholder="Search by name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="border rounded-md p-2"
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
          className="border rounded-md px-3 py-2"
          onClick={() => setAsc((v) => !v)}
          aria-label="toggle sort direction"
        >
          {asc ? 'Asc' : 'Desc'}
        </button>
      </div>

      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
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
            <tr key={s.student_id} className="border-t even:bg-gray-50/60">
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
              <td className="p-6 text-center text-gray-500" colSpan={10}>
                No students to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
