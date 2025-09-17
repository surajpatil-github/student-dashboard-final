'use client';

import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

export default function AttentionScatter({ data }: { data: { x: number; y: number }[] }) {
  const datasets = [
    {
      label: 'Attention vs Score',
      data,
      showLine: false,
      pointRadius: 3.5,
      pointHoverRadius: 6,
      // ✨ Dark-friendly accent colors (emerald)
      pointBackgroundColor: 'rgba(52,211,153,0.9)',
      pointBorderColor: 'rgba(52,211,153,1)',
      pointBorderWidth: 1,
    },
  ];

  return (
    <div className="h-72 rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4 shadow-lg shadow-black/20 backdrop-blur">
      <Scatter
        data={{ datasets }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 600, easing: 'easeOutQuart' },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { color: '#E5E7EB', boxWidth: 10, usePointStyle: true, pointStyle: 'circle' },
            },
            title: {
              display: false, // keep section title outside to avoid duplicates
              text: '',
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
            x: {
              title: { display: true, text: 'Attention', color: '#E5E7EB' },
              min: 0,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.08)' },
              ticks: { color: '#E5E7EB' },
            },
            y: {
              title: { display: true, text: 'Assessment Score', color: '#E5E7EB' },
              min: 0,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.08)' },
              ticks: { color: '#E5E7EB' },
            },
          },
          layout: { padding: 0 },
        }}
      />
    </div>
  );
}
