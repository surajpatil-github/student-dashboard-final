import { Student } from "./types";
import { mean } from "./analytics";

// scale 0..1
function scale01(v: number, min: number, max: number) {
  return (v - min) / (max - min || 1);
}

// === Multiple Linear Regression via Gradient Descent ===
export function trainRegressor(data: Student[]) {
  const X = data.map((s) => [
    s.comprehension,
    s.attention,
    s.focus,
    s.retention,
    s.engagement_time,
  ]);
  const y = data.map((s) => s.assessment_score);

  // feature scaling
  const mins = X[0].map((_, j) => Math.min(...X.map((r) => r[j])));
  const maxs = X[0].map((_, j) => Math.max(...X.map((r) => r[j])));
  const Xs = X.map((r) => r.map((v, j) => scale01(v, mins[j], maxs[j])));

  // params
  const m = Xs.length;
  const n = Xs[0].length;
  let w = new Array(n).fill(0); // weights
  let b = 0; // bias
  const lr = 0.05,
    iters = 1200;

  const predict = (row: number[]) =>
    row.reduce((s, xi, j) => s + w[j] * xi, b);

  for (let t = 0; t < iters; t++) {
    let db = 0;
    const dw = new Array(n).fill(0);
    for (let i = 0; i < m; i++) {
      const err = predict(Xs[i]) - y[i];
      db += err;
      for (let j = 0; j < n; j++) dw[j] += err * Xs[i][j];
    }
    b -= lr * (db / m);
    for (let j = 0; j < n; j++) w[j] -= lr * (dw[j] / m);
  }

  const preds = Xs.map(predict);
  const ybar = mean(y);
  const ssRes = y.reduce((s, yi, i) => s + (yi - preds[i]) ** 2, 0);
  const ssTot = y.reduce((s, yi) => s + (yi - ybar) ** 2, 0);
  const r2 = 1 - ssRes / (ssTot || 1);

  function predictRaw(s: Student) {
    const feats = [
      s.comprehension,
      s.attention,
      s.focus,
      s.retention,
      s.engagement_time,
    ].map((v, j) => scale01(v, mins[j], maxs[j]));
    const yhat = feats.reduce((sum, xj, j) => sum + w[j] * xj, b);
    return Math.max(0, Math.min(100, yhat));
  }

  return { w, b, r2, predict: predictRaw };
}

// === K-Means (k=3) on skill features (scaled) ===
export function kmeans(students: Student[], k = 3) {
  const feats = students.map((s) => [
    s.comprehension,
    s.attention,
    s.focus,
    s.retention,
    s.engagement_time,
  ]);
  const mins = feats[0].map((_, j) => Math.min(...feats.map((r) => r[j])));
  const maxs = feats[0].map((_, j) => Math.max(...feats.map((r) => r[j])));
  const X = feats.map((r) =>
    r.map((v, j) => (v - mins[j]) / (maxs[j] - mins[j] || 1))
  );

  // init first k points as centroids
  let centroids = X.slice(0, k).map((r) => r.slice());

  const dist = (a: number[], b: number[]) =>
    Math.sqrt(a.reduce((s, ai, i) => s + (ai - b[i]) ** 2, 0));

  for (let it = 0; it < 50; it++) {
    const labels = X.map((x) => {
      let best = 0,
        bd = Infinity;
      for (let c = 0; c < k; c++) {
        const d = dist(x, centroids[c]);
        if (d < bd) {
          bd = d;
          best = c;
        }
      }
      return best;
    });
    const newC = Array.from({ length: k }, () =>
      new Array(X[0].length).fill(0)
    );
    const cnt = new Array(k).fill(0);
    X.forEach((x, i) => {
      const l = labels[i];
      cnt[l]++;
      for (let j = 0; j < x.length; j++) newC[l][j] += x[j];
    });
    for (let c = 0; c < k; c++) {
      if (cnt[c]) for (let j = 0; j < newC[c].length; j++) newC[c][j] /= cnt[c];
    }
    let shift = 0;
    for (let c = 0; c < k; c++) shift += dist(centroids[c], newC[c]);
    centroids = newC;
    if (shift < 1e-4) break;
  }

  // final labels
  const labels = X.map((x) => {
    let best = 0,
      bd = Infinity;
    for (let c = 0; c < k; c++) {
      const d = dist(x, centroids[c]);
      if (d < bd) {
        bd = d;
        best = c;
      }
    }
    return best;
  });

  // persona tags by centroid focus
  const tag = (c: number[]) => {
    const [comp, att, fo, ret, eng] = c;
    const avg = (comp + att + fo + ret) / 4;
    if (avg > 0.7 && eng > 0.55) return "Focused Achievers";
    if (avg > 0.55) return "Balanced Learners";
    return "Developing Support";
  };

  const personas = centroids.map(tag);
  return { labels, centroids, personas };
}
