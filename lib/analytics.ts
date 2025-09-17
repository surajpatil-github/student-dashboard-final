import { Student } from "./types";


export function mean(xs: number[]) {
return xs.reduce((a,b)=>a+b,0)/xs.length;
}
export function std(xs: number[]) {
const m = mean(xs); const v = mean(xs.map(x => (x-m)**2)); return Math.sqrt(v);
}
export function pearson(x: number[], y: number[]) {
const mx = mean(x), my = mean(y);
const sx = std(x), sy = std(y);
const cov = mean(x.map((xi,i)=> (xi-mx)*(y[i]-my)));
return cov/(sx*sy || 1);
}


export function summary(students: Student[]) {
const avgScore = mean(students.map(s=>s.assessment_score));
const avgSkills = {
comprehension: mean(students.map(s=>s.comprehension)),
attention: mean(students.map(s=>s.attention)),
focus: mean(students.map(s=>s.focus)),
retention: mean(students.map(s=>s.retention)),
engagement_time: mean(students.map(s=>s.engagement_time)),
};
const corr = {
comprehension: pearson(students.map(s=>s.comprehension), students.map(s=>s.assessment_score)),
attention: pearson(students.map(s=>s.attention), students.map(s=>s.assessment_score)),
focus: pearson(students.map(s=>s.focus), students.map(s=>s.assessment_score)),
retention: pearson(students.map(s=>s.retention), students.map(s=>s.assessment_score)),
engagement_time: pearson(students.map(s=>s.engagement_time), students.map(s=>s.assessment_score)),
};
return { avgScore, avgSkills, corr };
}