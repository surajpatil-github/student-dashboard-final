"use client";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


export default function AttentionScatter({ points }:{ points:{x:number;y:number}[] }){
return (
<div className="h-72 bg-white border rounded-2xl p-4 shadow">
<div className="font-semibold mb-2">Attention vs Performance (Scatter)</div>
<ResponsiveContainer width="100%" height="100%">
<ScatterChart>
<CartesianGrid />
<XAxis type="number" dataKey="x" name="Attention" />
<YAxis type="number" dataKey="y" name="Score" />
<Tooltip cursor={{ strokeDasharray: '3 3' }} />
<Scatter data={points} />
</ScatterChart>
</ResponsiveContainer>
</div>
);
}