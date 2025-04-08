import React, { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';
import DashboardStats from './components/DashboardStats';
import FeaturedWorkout from './components/FeaturedWorkout';
import QuickStart from './components/QuickStart';
import StepTracker from './components/StepTracker';
import AITrainer from './components/AITrainer';
import AdvancedTraining from './components/AdvancedTraining';
import type { Workout, WorkoutFormData, WorkoutStats, WorkoutTemplate } from './types';

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [showStepTracker, setShowStepTracker] = useState(false);
  const [showAITrainer, setShowAITrainer] = useState(false);
  const [showAdvancedTraining, setShowAdvancedTraining] = useState(false);

  const calculateStats = (): WorkoutStats => {
    return {
      totalWorkouts: workouts.length,
      totalExercises: workouts.reduce((acc, workout) => acc + workout.exercises.length, 0),
      totalWeight: workouts.reduce((acc, workout) => 
        acc + workout.exercises.reduce((sum, exercise) => sum + exercise.weight, 0), 0
      ),
      streakDays: calculateStreak(),
    };
  };

  const calculateStreak = (): number => {
    if (workouts.length === 0) return 0;
    
    const sortedDates = workouts
      .map(w => new Date(w.date).toISOString().split('T')[0])
      .sort()
      .reverse();

    let streak = 1;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(sortedDates[0]);

    if (sortedDates[0] !== today) return 0;

    for (let i = 1; i < sortedDates.length; i++) {
      const previousDate = new Date(currentDate);
      previousDate.setDate(previousDate.getDate() - 1);
      
      if (sortedDates[i] === previousDate.toISOString().split('T')[0]) {
        streak++;
        currentDate = previousDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const handleWorkoutSubmit = (data: WorkoutFormData) => {
    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      ...data,
    };
    setWorkouts([newWorkout, ...workouts]);
    setShowWorkoutForm(false);
  };

  const handleStartWorkout = (template: WorkoutTemplate) => {
    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      exercises: template.exercises.map(exercise => ({
        ...exercise,
        id: crypto.randomUUID()
      })),
      notes: `Quick start: ${template.name}`,
    };
    setWorkouts([newWorkout, ...workouts]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Dumbbell className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Fitness Tracker</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowStepTracker(false);
                  setShowAITrainer(false);
                  setShowAdvancedTraining(!showAdvancedTraining);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {showAdvancedTraining ? 'Show Workouts' : 'Advanced Training'}
              </button>
              <button
                onClick={() => {
                  setShowStepTracker(false);
                  setShowAITrainer(!showAITrainer);
                  setShowAdvancedTraining(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {showAITrainer ? 'Show Workouts' : 'AI Trainer'}
              </button>
              <button
                onClick={() => {
                  setShowAITrainer(false);
                  setShowStepTracker(!showStepTracker);
                  setShowAdvancedTraining(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {showStepTracker ? 'Show Workouts' : 'Step Tracker'}
              </button>
              {!showStepTracker && !showAITrainer && !showAdvancedTraining && (
                <button
                  onClick={() => setShowWorkoutForm(!showWorkoutForm)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {showWorkoutForm ? 'Close Form' : 'Log Workout'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {showStepTracker ? (
          <StepTracker />
        ) : showAITrainer ? (
          <AITrainer />
        ) : showAdvancedTraining ? (
          <AdvancedTraining />
        ) : (
          <div className="px-4 py-6 sm:px-0 space-y-8">
            {showWorkoutForm ? (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Log New Workout</h2>
                <WorkoutForm onSubmit={handleWorkoutSubmit} />
              </div>
            ) : (
              <>
                <DashboardStats stats={calculateStats()} />
                
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Featured Workout</h2>
                    <FeaturedWorkout />
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Quick Start</h2>
                    <QuickStart onStartWorkout={handleStartWorkout} />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Workout History</h2>
                  <WorkoutList workouts={workouts} />
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;