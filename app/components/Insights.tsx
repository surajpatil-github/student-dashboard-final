// app/components/Insights.tsx
type Props = {
  corr?: Record<string, number>;
  personas?: string[];
};

export default function Insights({ corr, personas }: Props) {
  // safe correlations
  const corrEntries = Object.entries(corr ?? {});
  const top =
    corrEntries.length > 0
      ? [...corrEntries].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0]
      : undefined;

  // safe persona counts
  const personasCount = (personas ?? []).reduce<Record<string, number>>((acc, p) => {
    acc[p] = (acc[p] ?? 0) + 1;
    return acc;
  }, {});

  const personasLine =
    Object.keys(personasCount).length > 0
      ? Object.entries(personasCount)
          .map(([k, v]) => `${k}: ${v}`)
          .join(' | ')
      : '—';

  return (
    <section className="rounded-xl border p-4">
      <h3 className="text-lg font-semibold mb-2">Insights</h3>
      <ul className="list-disc ml-5 space-y-1 text-sm">
        <li>
          <b>Top driver</b> of performance is{' '}
          {top ? <b>{top[0]}</b> : '—'}
          {top ? ` (corr=${top[1].toFixed(2)})` : ''}.
        </li>
        <li>
          <b>Persona mix:</b> {personasLine}
        </li>
        <li>
          Use the table’s search & sort to find at-risk or high-achieving students quickly.
        </li>
      </ul>
    </section>
  );
}
