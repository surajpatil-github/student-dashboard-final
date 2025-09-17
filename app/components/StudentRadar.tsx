'use client';

import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

export type RadarPoint = { label: string; value: number };

export default function StudentRadar({ data }: { data: RadarPoint[] }) {
  const labels = data?.map((d) => d.label) ?? [];
  const values = data?.map((d) => d.value) ?? [];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Student Profile',
        data: values,

        // ✨ Dark-friendly, polished styling (colors only)
        backgroundColor: 'rgba(99, 102, 241, 0.25)',     // indigo-500 @ 25%
        borderColor: 'rgba(99, 102, 241, 1)',            // indigo-500
        borderWidth: 2,
        pointBackgroundColor: 'rgba(244, 114, 182, 1)',  // fuchsia-400 points
        pointBorderColor: 'rgba(255,255,255,0.9)',
        pointBorderWidth: 1,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: 'rgba(99,102,241,1)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false as const,
    animation: { duration: 600, easing: 'easeOutQuart' },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: { color: '#E5E7EB', boxWidth: 10, usePointStyle: true, pointStyle: 'circle' },
      },
      title: { display: false },
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
      r: {
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          color: '#CBD5E1',             // slate-300
          showLabelBackdrop: false,     // remove white boxes
        },
        grid: {
          circular: true,
          color: 'rgba(255,255,255,0.14)',
        },
        angleLines: {
          color: 'rgba(255,255,255,0.18)',
        },
        pointLabels: {
          color: '#E5E7EB',            // axis labels
          font: { weight: '500' as const },
        },
      },
    },
  };

  return (
    <div className="h-80 rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4 shadow-lg shadow-black/20 backdrop-blur">
      <Radar data={chartData} options={options} />
    </div>
  );
}
