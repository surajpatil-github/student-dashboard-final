// lib/model.ts
import type { Student } from "./types";

/* -----------------------------------------------------------
   Helpers
----------------------------------------------------------- */

type Vec = [number, number, number, number, number]; // [comp, attn, focus, retn, engScaled]

const ENG_SCALE = 100 / 120; // bring engagement_time (0..120) onto 0..100 scale

function toVec(s: Student): Vec {
  return [
    s.comprehension,
    s.attention,
    s.focus,
    s.retention,
    s.engagement_time * ENG_SCALE,
  ];
}

function weightedScore(v: Vec): number {
  // Same weights you used to form assessment_score
  return 0.28 * v[0] + 0.22 * v[1] + 0.22 * v[2] + 0.18 * v[3] + 0.10 * v[4];
}

function distance2(a: Vec, b: Vec): number {
  const d0 = a[0] - b[0];
  const d1 = a[1] - b[1];
  const d2 = a[2] - b[2];
  const d3 = a[3] - b[3];
  const d4 = a[4] - b[4];
  return d0 * d0 + d1 * d1 + d2 * d2 + d3 * d3 + d4 * d4;
}

/* -----------------------------------------------------------
   K-Means with deterministic seeding + persona labels
----------------------------------------------------------- */

export type KMeansResult = {
  personas: string[];    // label for each student (in order)
  clusters: number[];    // cluster index 0..k-1 per student
  centroids: Vec[];      // centroid vectors
  labels: string[];      // label text per cluster index
};

export function kmeans(students: Student[], k = 3): KMeansResult {
  const n = students?.length ?? 0;
  if (n === 0) return { personas: [], clusters: [], centroids: [], labels: [] };

  k = Math.max(1, Math.min(k, n));

  const X: Vec[] = students.map(toVec);

  // ---- init centroids by picking k points across the sorted performance line (stable) ----
  const sortedIdx = X.map((v, i) => ({ i, s: weightedScore(v) }))
    .sort((a, b) => a.s - b.s)
    .map((o) => o.i);

  const centroids: Vec[] = new Array(k);
  for (let c = 0; c < k; c++) {
    const j = Math.floor(((c + 0.5) * n) / k);
    centroids[c] = X[Math.min(j, n - 1)].slice() as Vec;
  }

  // ---- Lloyd's iterations ----
  const assign = new Array<number>(n).fill(0);
  for (let iter = 0; iter < 15; iter++) {
    let changed = false;

    // assignment step
    for (let i = 0; i < n; i++) {
      let best = 0;
      let bestd = Infinity;
      for (let c = 0; c < k; c++) {
        const d = distance2(X[i], centroids[c]);
        if (d < bestd) {
          bestd = d;
          best = c;
        }
      }
      if (assign[i] !== best) {
        assign[i] = best;
        changed = true;
      }
    }

    // update step
    const sums: Vec[] = Array.from({ length: k }, () => [0, 0, 0, 0, 0]);
    const counts = new Array<number>(k).fill(0);

    for (let i = 0; i < n; i++) {
      const c = assign[i];
      const v = X[i];
      sums[c][0] += v[0];
      sums[c][1] += v[1];
      sums[c][2] += v[2];
      sums[c][3] += v[3];
      sums[c][4] += v[4];
      counts[c]++;
    }

    for (let c = 0; c < k; c++) {
      if (counts[c] === 0) {
        // re-seed an empty cluster with a spread-out point
        const idx = sortedIdx[Math.floor(((c + 0.5) * n) / k)];
        centroids[c] = X[idx].slice() as Vec;
        continue;
      }
      centroids[c] = [
        sums[c][0] / counts[c],
        sums[c][1] / counts[c],
        sums[c][2] / counts[c],
        sums[c][3] / counts[c],
        sums[c][4] / counts[c],
      ];
    }

    if (!changed) break;
  }

  // ---- label clusters by centroid performance rank ----
  const centroidScores = centroids.map(weightedScore);
  const orderAsc = centroidScores
    .map((s, idx) => ({ s, idx }))
    .sort((a, b) => a.s - b.s)
    .map((o) => o.idx); // lowest..highest

  const labels = new Array<string>(k).fill("Balanced Learners");
  if (k === 1) {
    labels[orderAsc[0]] = "Balanced Learners";
  } else if (k === 2) {
    labels[orderAsc[0]] = "Needs Support";
    labels[orderAsc[1]] = "High Performers";
  } else {
    labels[orderAsc[0]] = "Needs Support";
    labels[orderAsc[1]] = "Balanced Learners";
    labels[orderAsc[2]] = "High Performers";
  }

  const personas = assign.map((c) => labels[c]);

  return { personas, clusters: assign, centroids, labels };
}

/* -----------------------------------------------------------
   Simple regressor score so page.tsx can read r2 safely
----------------------------------------------------------- */

function corr(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n === 0) return 0;
  let ma = 0,
    mb = 0;
  for (let i = 0; i < n; i++) {
    ma += a[i];
    mb += b[i];
  }
  ma /= n;
  mb /= n;
  let num = 0,
    da = 0,
    db = 0;
  for (let i = 0; i < n; i++) {
    const x = a[i] - ma;
    const y = b[i] - mb;
    num += x * y;
    da += x * x;
    db += y * y;
  }
  const den = Math.sqrt(da * db);
  return den === 0 ? 0 : num / den;
}

// Returns { r2 } so your page can use it (or fall back harmlessly)
export function trainRegressor(students: Student[]) {
  const y = students.map((s) => s.assessment_score);
  const cols = [
    students.map((s) => s.comprehension),
    students.map((s) => s.attention),
    students.map((s) => s.focus),
    students.map((s) => s.retention),
    students.map((s) => s.engagement_time * ENG_SCALE),
  ];
  const r2 = Math.max(0, ...cols.map((col) => {
    const r = corr(col, y);
    return r * r;
  }));
  return { r2 };
}
