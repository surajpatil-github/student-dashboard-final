import { Student } from "./types";


// simple seeded RNG so the dataset is same across builds
function mulberry32(a: number) {
return function () {
let t = (a += 0x6d2b79f5);
t = Math.imul(t ^ (t >>> 15), t | 1);
t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}


function randNorm(rng: () => number, mean: number, std: number) {
// Box–Muller
const u = 1 - rng();
const v = 1 - rng();
const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
return mean + z * std;
}


const firstNames = ["Aarav","Ishita","Rahul","Sneha","Vihaan","Ananya","Arjun","Meera","Rohan","Priya","Karan","Isha","Kabir","Aditi","Neha","Sanjay","Riya","Dev","Aarohi","Ansh"];
const lastNames = ["Patil","Reddy","Sharma","Gupta","Kumar","Iyer","Nair","Singh","Das","Roy"];
const classes = ["Grade 8","Grade 9","Grade 10"];


export function makeStudents(n = 300, seed = 42): Student[] {
const rng = mulberry32(seed);
const students: Student[] = [];


for (let i = 0; i < n; i++) {
const name = `${firstNames[Math.floor(rng()*firstNames.length)]} ${lastNames[Math.floor(rng()*lastNames.length)]}`;
const cls = classes[Math.floor(rng()*classes.length)];


// generate latent skill base and add small correlations
const comprehension = Math.min(100, Math.max(0, randNorm(rng, 70, 15)));
const attention = Math.min(100, Math.max(0, randNorm(rng, 65, 18)));
const focus = Math.min(100, Math.max(0, randNorm(rng, 68, 16)));
const retention = Math.min(100, Math.max(0, randNorm(rng, 66, 17)));
const engagement = Math.min(120, Math.max(0, randNorm(rng, 60, 20)));


// assessment score as weighted mix + noise
const scoreRaw = 0.28*comprehension + 0.22*attention + 0.22*focus + 0.18*retention + 0.10*(engagement/1.2) + randNorm(rng, 0, 5);
const assessment_score = Math.round(Math.min(100, Math.max(0, scoreRaw)));


students.push({
student_id: `S${1000+i}`,
name,
class: cls,
comprehension: Math.round(comprehension),
attention: Math.round(attention),
focus: Math.round(focus),
retention: Math.round(retention),
engagement_time: Math.round(engagement),
assessment_score,
});
}
return students;
}