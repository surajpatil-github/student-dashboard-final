// lib/data.ts
import type { Student } from './types';

// --- tiny PRNG (deterministic) ---
type RNG = () => number;
function mulberry32(seed: number): RNG {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; // [0,1)
  };
}

// --- helpers ---
const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

// Box–Muller normal RNG (guarded, fast)
function randNorm(rng: RNG, mean: number, std: number) {
  // 1 - rng() keeps u in (0,1]; mulberry32 never returns 1 exactly.
  const u = 1 - rng();
  const v = 1 - rng();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * std;
}

// Fast int in [0, max)
const randInt = (rng: RNG, max: number) => (rng() * max) | 0;

// --- source pools ---
const FIRST_NAMES = [
  'Aarav','Ishita','Rahul','Sneha','Vihaan','Ananya','Arjun','Meera','Rohan','Priya',
  'Karan','Isha','Kabir','Aditi','Neha','Sanjay','Riya','Dev','Aarohi','Ansh',
] as const;

const LAST_NAMES = [
  'Patil','Reddy','Sharma','Gupta','Kumar','Iyer','Nair','Singh','Das','Roy',
] as const;

const CLASSES = ['Grade 8', 'Grade 9', 'Grade 10'] as const;

// --- main API ---
export function makeStudents(n = 300, seed = 42): Student[] {
  const rng = mulberry32(seed);
  const out: Student[] = new Array(n);

  const fnLen = FIRST_NAMES.length;
  const lnLen = LAST_NAMES.length;
  const clsLen = CLASSES.length;

  for (let i = 0; i < n; i++) {
    const name = `${FIRST_NAMES[randInt(rng, fnLen)]} ${LAST_NAMES[randInt(rng, lnLen)]}`;
    const cls = CLASSES[randInt(rng, clsLen)];

    // latent skills (clamped + rounded once)
    const comprehension = Math.round(clamp(randNorm(rng, 70, 15), 0, 100));
    const attention     = Math.round(clamp(randNorm(rng, 65, 18), 0, 100));
    const focus         = Math.round(clamp(randNorm(rng, 68, 16), 0, 100));
    const retention     = Math.round(clamp(randNorm(rng, 66, 17), 0, 100));
    const engagement    = Math.round(clamp(randNorm(rng, 60, 20), 0, 120));

    // weighted assessment + mild noise
    const scoreRaw =
      0.28 * comprehension +
      0.22 * attention +
      0.22 * focus +
      0.18 * retention +
      0.10 * (engagement / 1.2) +
      randNorm(rng, 0, 5);

    const assessment_score = Math.round(clamp(scoreRaw, 0, 100));

    out[i] = {
      student_id: `S${1000 + i}`,
      name,
      class: cls,
      comprehension,
      attention,
      focus,
      retention,
      engagement_time: engagement,
      assessment_score,
    };
  }

  return out;
}
