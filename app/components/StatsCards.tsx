"use client";
import React from "react";


export default function StatsCards({
avgScore,
avgSkills,
r2
}:{
avgScore:number,
avgSkills:{comprehension:number;attention:number;focus:number;retention:number;engagement_time:number},
r2:number
}){
const Card = ({title, value}:{title:string; value:string|number})=> (
<div className="rounded-2xl shadow p-4 bg-white border">
<div className="text-sm text-gray-500">{title}</div>
<div className="text-2xl font-semibold mt-1">{value}</div>
</div>
);
return (
<div className="grid md:grid-cols-3 gap-4">
<Card title="Avg Assessment Score" value={avgScore.toFixed(1)} />
<Card title="Avg Cognitive Skills" value={`${((avgSkills.comprehension+avgSkills.attention+avgSkills.focus+avgSkills.retention)/4).toFixed(1)}`} />
<Card title="Model R²" value={r2.toFixed(3)} />
</div>
);
}