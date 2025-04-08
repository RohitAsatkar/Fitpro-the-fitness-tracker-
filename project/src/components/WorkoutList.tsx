import React from 'react';
import { Calendar, Dumbbell } from 'lucide-react';
import type { Workout } from '../types';

interface WorkoutListProps {
  workouts: Workout[];
}

export default function WorkoutList({ workouts }: WorkoutListProps) {
  if (workouts.length === 0) {
    return (
      <div className="text-center py-12">
        <Dumbbell className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No workouts</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by logging your first workout.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
        >
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {new Date(workout.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {workout.exercises.length} exercises
              </span>
            </div>
            {workout.notes && (
              <p className="mt-2 text-sm text-gray-500">{workout.notes}</p>
            )}
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {workout.exercises.map((exercise) => (
                  <li key={exercise.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Dumbbell className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {exercise.name}
                        </p>
                        <div className="flex space-x-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {exercise.sets} sets
                          </p>
                          <p className="text-sm text-gray-500">
                            {exercise.reps} reps
                          </p>
                          <p className="text-sm text-gray-500">
                            {exercise.weight} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}