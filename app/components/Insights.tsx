"use client";
export default function Insights({ corr, personasCount }:{ corr:Record<string, number>; personasCount:Record<string, number> }){
const top = Object.entries(corr).sort((a,b)=> Math.abs(b[1])-Math.abs(a[1]))[0];
return (
<div className="bg-white border rounded-2xl p-4 shadow">
<div className="font-semibold mb-2">Insights</div>
<ul className="list-disc ml-5 space-y-1 text-sm">
<li><b>Top driver</b> of performance is <b>{top[0]}</b> (corr={top[1].toFixed(2)}).</li>
<li>Persona mix: {Object.entries(personasCount).map(([k,v])=> `${k}: ${v}`).join(" | ")}</li>
<li>Use the table’s search & sort to find at‑risk or high‑achieving students quickly.</li>
</ul>
</div>
);
}