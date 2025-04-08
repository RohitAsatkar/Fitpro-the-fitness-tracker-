import React, { useState } from 'react';
import { ArrowRight, Dumbbell as Barbell, Brain, Heart, X } from 'lucide-react';
import ExerciseTracker from './ExerciseTracker';

interface WorkoutTemplate {
  name: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight: number;
    duration?: string;
    intensity?: string;
    breathwork?: string;
  }>;
  description: string;
  type: 'strength' | 'cardio' | 'mindful';
}

const strengthWorkouts: WorkoutTemplate[] = [
  {
    name: 'Upper Body Power',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: 60 },
      { name: 'Overhead Press', sets: 3, reps: 10, weight: 40 },
      { name: 'Bent Over Rows', sets: 4, reps: 8, weight: 50 },
      { name: 'Tricep Pushdowns', sets: 3, reps: 12, weight: 25 },
    ],
    description: 'Focus on building upper body strength with compound movements',
    type: 'strength'
  },
  {
    name: 'Lower Body Focus',
    exercises: [
      { name: 'Barbell Squats', sets: 4, reps: 8, weight: 80 },
      { name: 'Romanian Deadlifts', sets: 3, reps: 10, weight: 70 },
      { name: 'Walking Lunges', sets: 3, reps: 12, weight: 20 },
      { name: 'Calf Raises', sets: 4, reps: 15, weight: 30 },
    ],
    description: 'Build leg strength and power with these fundamental exercises',
    type: 'strength'
  },
  {
    name: 'Full Body Strength',
    exercises: [
      { name: 'Deadlifts', sets: 4, reps: 6, weight: 100 },
      { name: 'Pull-ups', sets: 3, reps: 8, weight: 0 },
      { name: 'Push-ups', sets: 3, reps: 12, weight: 0 },
      { name: 'Goblet Squats', sets: 3, reps: 12, weight: 24 },
    ],
    description: 'Complete full body workout targeting all major muscle groups',
    type: 'strength'
  },
];

const cardioWorkouts: WorkoutTemplate[] = [
  {
    name: 'HIIT Inferno',
    exercises: [
      { name: 'Burpees', sets: 4, reps: 20, weight: 0, duration: '45 sec', intensity: 'High' },
      { name: 'Mountain Climbers', sets: 4, reps: 30, weight: 0, duration: '45 sec', intensity: 'High' },
      { name: 'Jump Rope', sets: 4, reps: 0, weight: 0, duration: '1 min', intensity: 'High' },
      { name: 'High Knees', sets: 4, reps: 0, weight: 0, duration: '45 sec', intensity: 'High' },
      { name: 'Rest', sets: 4, reps: 0, weight: 0, duration: '30 sec', intensity: 'Low' },
    ],
    description: 'High-intensity interval training to maximize calorie burn and improve cardiovascular fitness',
    type: 'cardio'
  },
  {
    name: 'Endurance Builder',
    exercises: [
      { name: 'Sprints', sets: 6, reps: 0, weight: 0, duration: '30 sec', intensity: 'Maximum' },
      { name: 'Jogging Recovery', sets: 6, reps: 0, weight: 0, duration: '1 min', intensity: 'Low' },
      { name: 'Box Jumps', sets: 4, reps: 15, weight: 0, duration: '45 sec', intensity: 'High' },
      { name: 'Jump Squats', sets: 4, reps: 20, weight: 0, duration: '45 sec', intensity: 'High' },
    ],
    description: 'Build stamina and explosive power with this challenging cardio circuit',
    type: 'cardio'
  },
  {
    name: 'Tabata Challenge',
    exercises: [
      { name: 'Jump Lunges', sets: 8, reps: 0, weight: 0, duration: '20 sec', intensity: 'Maximum' },
      { name: 'Rest', sets: 8, reps: 0, weight: 0, duration: '10 sec', intensity: 'Low' },
      { name: 'Kettlebell Swings', sets: 8, reps: 0, weight: 16, duration: '20 sec', intensity: 'High' },
      { name: 'Rest', sets: 8, reps: 0, weight: 0, duration: '10 sec', intensity: 'Low' },
    ],
    description: 'Classic Tabata protocol: 20 seconds work, 10 seconds rest for maximum intensity',
    type: 'cardio'
  },
];

const mindfulWorkouts: WorkoutTemplate[] = [
  {
    name: 'Morning Flow',
    exercises: [
      { name: 'Cat-Cow Stretch', sets: 1, reps: 10, weight: 0, duration: '2 min', intensity: 'Low', breathwork: 'Deep belly breathing' },
      { name: 'Sun Salutation', sets: 3, reps: 1, weight: 0, duration: '5 min', intensity: 'Moderate', breathwork: 'Ujjayi breath' },
      { name: 'Warrior Poses Series', sets: 1, reps: 0, weight: 0, duration: '8 min', intensity: 'Moderate', breathwork: 'Rhythmic breathing' },
      { name: 'Standing Forward Bend', sets: 1, reps: 0, weight: 0, duration: '3 min', intensity: 'Low', breathwork: 'Long exhales' },
      { name: 'Seated Meditation', sets: 1, reps: 0, weight: 0, duration: '5 min', intensity: 'Low', breathwork: 'Mindful breathing' },
    ],
    description: 'Start your day with gentle movement and mindful breathing to increase flexibility and reduce stress',
    type: 'mindful'
  },
  {
    name: 'Stress Relief Session',
    exercises: [
      { name: 'Progressive Muscle Relaxation', sets: 1, reps: 0, weight: 0, duration: '10 min', intensity: 'Low', breathwork: 'Deep relaxation breathing' },
      { name: 'Child\'s Pose', sets: 1, reps: 0, weight: 0, duration: '3 min', intensity: 'Low', breathwork: 'Calming breath' },
      { name: 'Seated Spinal Twist', sets: 2, reps: 0, weight: 0, duration: '2 min per side', intensity: 'Low', breathwork: 'Alternate nostril breathing' },
      { name: 'Legs Up the Wall', sets: 1, reps: 0, weight: 0, duration: '5 min', intensity: 'Low', breathwork: 'Box breathing' },
      { name: 'Savasana', sets: 1, reps: 0, weight: 0, duration: '5 min', intensity: 'Low', breathwork: 'Natural breathing' },
    ],
    description: 'Release tension and find calm with gentle poses and breathing techniques',
    type: 'mindful'
  },
  {
    name: 'Deep Stretch Recovery',
    exercises: [
      { name: 'Hip Opener Series', sets: 1, reps: 0, weight: 0, duration: '8 min', intensity: 'Moderate', breathwork: 'Deep diaphragmatic breathing' },
      { name: 'Hamstring Stretch Flow', sets: 3, reps: 0, weight: 0, duration: '2 min per side', intensity: 'Moderate', breathwork: 'Extended exhale' },
      { name: 'Shoulder Release', sets: 1, reps: 0, weight: 0, duration: '5 min', intensity: 'Low', breathwork: 'Ocean breath' },
      { name: 'Spine Mobility Series', sets: 1, reps: 0, weight: 0, duration: '7 min', intensity: 'Moderate', breathwork: 'Wave breathing' },
      { name: 'Guided Body Scan', sets: 1, reps: 0, weight: 0, duration: '5 min', intensity: 'Low', breathwork: 'Mindful awareness' },
    ],
    description: 'Improve flexibility and release muscle tension with deep stretching and mobility work',
    type: 'mindful'
  },
];

interface QuickStartProps {
  onStartWorkout: (workout: WorkoutTemplate) => void;
}

export default function QuickStart({ onStartWorkout }: QuickStartProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutTemplate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showTracker, setShowTracker] = useState(false);

  const handleStartWorkout = () => {
    if (selectedWorkout) {
      const workoutData = {
        ...selectedWorkout,
        exercises: selectedWorkout.exercises.map(exercise => ({
          ...exercise,
          id: crypto.randomUUID()
        }))
      };
      setShowModal(false);
      setShowTracker(true);
      onStartWorkout(workoutData);
    }
  };

  const handleCompleteWorkout = () => {
    setShowTracker(false);
    setSelectedWorkout(null);
  };

  const quickStartItems = [
    {
      title: 'Strength Training',
      description: 'Build muscle and increase strength with focused workouts',
      icon: Barbell,
      color: 'bg-red-500',
      onClick: () => {
        setSelectedWorkout(strengthWorkouts[0]);
        setShowModal(true);
      },
    },
    {
      title: 'Cardio Session',
      description: 'Improve endurance and heart health with cardio exercises',
      icon: Heart,
      color: 'bg-blue-500',
      onClick: () => {
        setSelectedWorkout(cardioWorkouts[0]);
        setShowModal(true);
      },
    },
    {
      title: 'Mindful Movement',
      description: 'Enhance flexibility and mental clarity with guided sessions',
      icon: Brain,
      color: 'bg-green-500',
      onClick: () => {
        setSelectedWorkout(mindfulWorkouts[0]);
        setShowModal(true);
      },
    },
  ];

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {quickStartItems.map((item) => (
          <button
            key={item.title}
            onClick={item.onClick}
            className="group relative overflow-hidden rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
          >
            <div className={`absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 transform rounded-full ${item.color} opacity-10 transition-transform group-hover:translate-y-0 group-hover:translate-x-0`} />
            <item.icon className={`mb-4 h-8 w-8 ${item.color.replace('bg-', 'text-')}`} />
            <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
            <p className="mb-4 text-sm text-gray-600">{item.description}</p>
            <div className="flex items-center text-sm font-medium text-gray-900">
              Start workout
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>

      {showModal && selectedWorkout && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-left sm:mt-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {selectedWorkout.name}
                      </h3>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {selectedWorkout.description}
                    </p>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Exercises:</h4>
                      <ul className="mt-2 divide-y divide-gray-200">
                        {selectedWorkout.exercises.map((exercise, index) => (
                          <li key={index} className="py-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {exercise.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {exercise.sets} sets
                                  {exercise.reps > 0 ? ` × ${exercise.reps} reps` : ''}
                                  {exercise.duration ? ` • ${exercise.duration}` : ''}
                                  {exercise.intensity ? ` • ${exercise.intensity} intensity` : ''}
                                  {exercise.breathwork ? ` • ${exercise.breathwork}` : ''}
                                </p>
                              </div>
                              {exercise.weight > 0 && (
                                <p className="text-sm font-medium text-gray-900">
                                  {exercise.weight}kg
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleStartWorkout}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Start Workout
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTracker && selectedWorkout && (
        <ExerciseTracker
          exercises={selectedWorkout.exercises}
          onComplete={handleCompleteWorkout}
          onClose={() => setShowTracker(false)}
        />
      )}
    </>
  );
}