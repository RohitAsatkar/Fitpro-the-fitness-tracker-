import React from 'react';
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
import { format } from 'date-fns';
import type { StepData, TrackingPreferences } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StepStatsProps {
  dailyStats: StepData[];
  weeklyStats: StepData[];
  monthlyStats: StepData[];
  preferences: TrackingPreferences;
  onPreferencesChange: (prefs: TrackingPreferences) => void;
}

export default function StepStats({
  dailyStats,
  weeklyStats,
  monthlyStats,
  preferences,
  onPreferencesChange,
}: StepStatsProps) {
  const [activeTab, setActiveTab] = React.useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  );

  const getChartData = (data: StepData[]) => {
    return {
      labels: data.map((d) =>
        activeTab === 'daily'
          ? format(new Date(d.date), 'HH:mm')
          : activeTab === 'weekly'
          ? format(new Date(d.date), 'EEE')
          : format(new Date(d.date), 'MMM d')
      ),
      datasets: [
        {
          label: 'Steps',
          data: data.map((d) => d.steps),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Step Count`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      {/* Stats Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['daily', 'weekly', 'monthly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`border-b-2 px-1 pb-4 text-sm font-medium ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Overview
            </button>
          ))}
        </nav>
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        <Bar
          options={chartOptions}
          data={getChartData(
            activeTab === 'daily'
              ? dailyStats
              : activeTab === 'weekly'
              ? weeklyStats
              : monthlyStats
          )}
        />
      </div>

      {/* Settings */}
      <div className="mt-8 rounded-lg border border-gray-200 p-4">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Tracking Settings</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Daily Step Goal
            </label>
            <input
              type="number"
              value={preferences.dailyGoal}
              onChange={(e) =>
                onPreferencesChange({
                  ...preferences,
                  dailyGoal: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Measurement Units
            </label>
            <select
              value={preferences.units}
              onChange={(e) =>
                onPreferencesChange({
                  ...preferences,
                  units: e.target.value as 'metric' | 'imperial',
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="metric">Metric (km)</option>
              <option value="imperial">Imperial (mi)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}