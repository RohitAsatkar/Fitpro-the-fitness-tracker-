import React from 'react';
import { Activity, Calendar, Dumbbell, TrendingUp } from 'lucide-react';
import type { WorkoutStats } from '../types';

interface DashboardStatsProps {
  stats: WorkoutStats;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const stats_items = [
    {
      name: 'Total Workouts',
      value: stats.totalWorkouts,
      icon: Activity,
      color: 'text-blue-500',
    },
    {
      name: 'Total Exercises',
      value: stats.totalExercises,
      icon: Dumbbell,
      color: 'text-green-500',
    },
    {
      name: 'Total Weight',
      value: `${stats.totalWeight}kg`,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      name: 'Current Streak',
      value: `${stats.streakDays} days`,
      icon: Calendar,
      color: 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats_items.map((item) => (
        <div
          key={item.name}
          className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
        >
          <dt>
            <div className={`absolute rounded-md p-3 ${item.color} bg-opacity-10`}>
              <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              {item.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
          </dd>
        </div>
      ))}
    </div>
  );
}