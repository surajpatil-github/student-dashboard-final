"use client";
import React from "react";
import { Student } from "@/lib/types";


export default function StudentsTable({ data, personas }:{ data:Student[]; personas:string[] }){
const [q, setQ] = React.useState("");
const [sortKey, setSortKey] = React.useState<keyof Student>("assessment_score");
const [asc, setAsc] = React.useState(false);


const filtered = data.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
const sorted = [...filtered].sort((a,b)=> (asc?1:-1) * ((a[sortKey] as number) - (b[sortKey] as number)));


return (
<div className="bg-white border rounded-2xl p-4 shadow">
<div className="flex items-center justify-between gap-2 mb-3">
<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name..." className="border rounded-lg px-3 py-2 w-full max-w-xs" />
<select className="border rounded-lg px-3 py-2" value={String(sortKey)} onChange={e=>setSortKey(e.target.value as keyof Student)}>
{Object.keys(data[0]).map(k=> <option key={k} value={k}>{k}</option>)}
</select>
<button className="border rounded-lg px-3 py-2" onClick={()=>setAsc(a=>!a)}>{asc?"Asc":"Desc"}</button>
</div>


<div className="overflow-x-auto">
<table className="min-w-full text-sm">
<thead>
<tr className="bg-gray-50">
<th className="p-2 text-left">Persona</th>
{Object.keys(data[0]).map(k=> <th key={k} className="p-2 text-left">{k}</th>)}
</tr>
</thead>
<tbody>
{sorted.map((s,i)=> (
<tr key={s.student_id} className="odd:bg-white even:bg-gray-50">
<td className="p-2">{personas[i]}</td>
<td className="p-2">{s.student_id}</td>
<td className="p-2">{s.name}</td>
<td className="p-2">{s.class}</td>
<td className="p-2">{s.comprehension}</td>
<td className="p-2">{s.attention}</td>
<td className="p-2">{s.focus}</td>
<td className="p-2">{s.retention}</td>
<td className="p-2">{s.engagement_time}</td>
<td className="p-2 font-medium">{s.assessment_score}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}