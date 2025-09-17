"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";


export default function SkillBar({ data }:{ data:{skill:string; corr:number}[] }){
return (
<div className="h-72 bg-white border rounded-2xl p-4 shadow">
<div className="font-semibold mb-2">Correlation with Assessment Score</div>
<ResponsiveContainer width="100%" height="100%">
<BarChart data={data}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="skill" />
<YAxis domain={[-1,1]} />
<Tooltip />
<Bar dataKey="corr" />
</BarChart>
</ResponsiveContainer>
</div>
);
}