import { makeStudents } from "@/lib/data";
import { summary } from "@/lib/analytics";
import { kmeans, trainRegressor } from "@/lib/model";
import StatsCards from "./components/StatsCards";
import SkillBar from "./components/SkillBar";
import AttentionScatter from "./components/AttentionScatter";
import StudentRadar from "./components/StudentRadar";
import StudentsTable from "./components/StudentsTable";
import Insights from "./components/Insights";


export default function Page(){
const students = makeStudents(300, 123);
const { avgScore, avgSkills, corr } = summary(students);
const { labels, personas } = kmeans(students, 3);
const model = trainRegressor(students);


const corrBar = Object.entries(corr).map(([skill,val])=> ({ skill, corr: Number(val.toFixed(3)) }));
const scatter = students.slice(0,200).map(s=> ({ x: s.attention, y: s.assessment_score }));
const radarRow = (i:number)=> [
{label:"Comp", value: students[i].comprehension},
{label:"Attn", value: students[i].attention},
{label:"Focus", value: students[i].focus},
{label:"Retn", value: students[i].retention},
{label:"Eng", value: students[i].engagement_time}
];


const personaNames = labels.map(i=> personas[i]);
const personasCount: Record<string, number> = {};
personaNames.forEach(p=> { personasCount[p] = (personasCount[p]||0)+1; });


return (
<main className="px-4 md:px-8 py-6 space-y-6 bg-gray-100 min-h-screen">
<h1 className="text-2xl font-bold">Cognitive Skills & Student Performance Dashboard</h1>
<StatsCards avgScore={avgScore} avgSkills={avgSkills} r2={model.r2} />


<div className="grid md:grid-cols-2 gap-4">
<SkillBar data={corrBar} />
<AttentionScatter points={scatter} />
</div>


<StudentRadar row={radarRow(0)} />


<StudentsTable data={students} personas={personaNames} />
<Insights corr={corr} personasCount={personasCount} />


<div className="text-xs text-gray-500">Synthetic data only. Model: multivariate linear regression (GD). Clusters: k‑means (k=3).</div>
</main>
);
}