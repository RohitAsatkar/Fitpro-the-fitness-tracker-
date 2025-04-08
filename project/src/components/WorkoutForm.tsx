import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { WorkoutFormData, Exercise } from '../types';

interface WorkoutFormProps {
  onSubmit: (data: WorkoutFormData) => void;
}

export default function WorkoutForm({ onSubmit }: WorkoutFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: crypto.randomUUID(),
        name: '',
        sets: 0,
        reps: 0,
        weight: 0,
      },
    ]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === id ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date,
      exercises,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Exercises</h3>
          <button
            type="button"
            onClick={addExercise}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Exercise
          </button>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="relative grid grid-cols-1 gap-4 p-4 border rounded-lg sm:grid-cols-4"
            >
              <button
                type="button"
                onClick={() => removeExercise(exercise.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sets</label>
                <input
                  type="number"
                  min="0"
                  value={exercise.sets}
                  onChange={(e) =>
                    updateExercise(exercise.id, 'sets', parseInt(e.target.value, 10))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Reps</label>
                <input
                  type="number"
                  min="0"
                  value={exercise.reps}
                  onChange={(e) =>
                    updateExercise(exercise.id, 'reps', parseInt(e.target.value, 10))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={exercise.weight}
                  onChange={(e) =>
                    updateExercise(exercise.id, 'weight', parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          ))}

          {exercises.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No exercises added. Click "Add Exercise" to start.
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Workout
        </button>
      </div>
    </form>
  );
}