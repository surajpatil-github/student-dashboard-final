'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type ScriptableContext,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export type CorrItem = { skill: string; corr: number };

export default function BarSkillVsScore({ correlations }: { correlations: CorrItem[] }) {
  const data: ChartData<'bar', number[], string> = {
    labels: correlations.map((d) => d.skill),
    datasets: [
      {
        label: 'Correlation with Assessment Score',
        data: correlations.map((d) => d.corr),
        backgroundColor: (ctx: ScriptableContext<'bar'>) => {
          const raw = ctx.raw;
          const v = typeof raw === 'number' ? raw : Number(raw);
          return v >= 0 ? 'rgba(99,102,241,0.85)' : 'rgba(244,63,94,0.85)';
        },
        hoverBackgroundColor: (ctx: ScriptableContext<'bar'>) => {
          const raw = ctx.raw;
          const v = typeof raw === 'number' ? raw : Number(raw);
          return v >= 0 ? 'rgba(99,102,241,1)' : 'rgba(244,63,94,1)';
        },
        borderWidth: 0,
        borderRadius: 10,
        borderSkipped: false,
        maxBarThickness: 42,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: 'easeOutQuart' },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#E5E7EB', padding: 16, boxWidth: 12, usePointStyle: true, pointStyle: 'rectRounded' },
      },
      title: { display: true, text: 'Skill vs Score (Correlation)', color: '#F3F4F6', font: { weight: '600' } },
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
      x: { grid: { display: false }, ticks: { color: '#E5E7EB' } },
    },
  };

  return (
    <div className="h-72 rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4 shadow-lg shadow-black/20 backdrop-blur">
      <Bar data={data} options={options} />
    </div>
  );
}
