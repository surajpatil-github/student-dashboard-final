'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export type CorrItem = { skill: string; corr: number };

export default function BarSkillVsScore({ correlations }: { correlations: CorrItem[] }) {
  const data = {
    labels: correlations.map((d) => d.skill),
    datasets: [
      {
        label: 'Correlation with Assessment Score',
        data: correlations.map((d) => d.corr),

        // ✨ Visual refresh (colors only)
        backgroundColor: (ctx: any) => {
          const v = Number(ctx?.raw ?? 0);
          // positive = indigo, negative = rose (pops on dark bg)
          return v >= 0 ? 'rgba(99,102,241,0.85)' : 'rgba(244,63,94,0.85)';
        },
        hoverBackgroundColor: (ctx: any) => {
          const v = Number(ctx?.raw ?? 0);
          return v >= 0 ? 'rgba(99,102,241,1)' : 'rgba(244,63,94,1)';
        },
        borderWidth: 0,
        borderRadius: 10,
        borderSkipped: false,
        maxBarThickness: 42,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false as const,

    // Smooth entrance, no layout shifts
    animation: { duration: 600, easing: 'easeOutQuart' },

    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#E5E7EB', // slate-200
          padding: 16,
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
      title: {
        display: true,
        text: 'Skill vs Score (Correlation)',
        color: '#F3F4F6', // slate-100
        font: { weight: '600' as const },
      },
      tooltip: {
        backgroundColor: '#0B1020',
        borderColor: '#ffffff22',
        borderWidth: 1,
        titleColor: '#E5E7EB',
        bodyColor: '#E5E7EB',
        displayColors: false,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: -1,
        max: 1,
        grid: { color: 'rgba(255,255,255,0.08)' },
        ticks: { color: '#E5E7EB' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#E5E7EB' },
      },
    },
  };

  return (
    <div className="h-72 rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4 shadow-lg shadow-black/20 backdrop-blur">
      <Bar data={data} options={options} />
    </div>
  );
}
