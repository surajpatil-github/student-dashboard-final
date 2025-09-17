"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";


export default function StudentRadar({ row }:{ row:{ label:string; value:number }[] }){
return (
<div className="h-80 bg-white border rounded-2xl p-4 shadow">
<div className="font-semibold mb-2">Student Profile (Radar)</div>
<ResponsiveContainer width="100%" height="100%">
<RadarChart data={row}>
<PolarGrid />
<PolarAngleAxis dataKey="label" />
<PolarRadiusAxis angle={30} domain={[0, 100]} />
<Tooltip />
<Radar dataKey="value" stroke="#8884d8" fillOpacity={0.5} />
</RadarChart>
</ResponsiveContainer>
</div>
);
}