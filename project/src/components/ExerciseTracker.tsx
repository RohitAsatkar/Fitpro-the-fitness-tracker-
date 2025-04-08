import React, { useState } from 'react';
import { CheckCircle, ChevronRight, Timer, X } from 'lucide-react';
import type { Exercise } from '../types';

interface ExerciseTrackerProps {
  exercises: Exercise[];
  onComplete: () => void;
  onClose: () => void;
}

export default function ExerciseTracker({ exercises, onComplete, onClose }: ExerciseTrackerProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const currentExercise = exercises[currentExerciseIndex];
  const progress = (completedExercises.size / exercises.length) * 100;

  const startTimer = () => {
    if (currentExercise.duration) {
      const durationInSeconds = parseDuration(currentExercise.duration);
      setTimer(durationInSeconds);
      setIsTimerRunning(true);

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const parseDuration = (duration: string): number => {
    const minutes = duration.match(/(\d+)\s*min/);
    const seconds = duration.match(/(\d+)\s*sec/);
    return (minutes ? parseInt(minutes[1]) * 60 : 0) + (seconds ? parseInt(seconds[1]) : 0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    const newCompleted = new Set(completedExercises);
    newCompleted.add(currentExerciseIndex);
    setCompletedExercises(newCompleted);

    if (newCompleted.size === exercises.length) {
      onComplete();
    } else {
      setCurrentExerciseIndex((prev) => Math.min(prev + 1, exercises.length - 1));
      setTimer(null);
      setIsTimerRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
          <div className="relative p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {currentExercise.name}
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  {currentExercise.sets} sets × {currentExercise.reps} reps
                  {currentExercise.weight > 0 && ` • ${currentExercise.weight}kg`}
                </p>
                {currentExercise.duration && (
                  <p>Duration: {currentExercise.duration}</p>
                )}
                {currentExercise.intensity && (
                  <p>Intensity: {currentExercise.intensity}</p>
                )}
                {currentExercise.breathwork && (
                  <p>Breathwork: {currentExercise.breathwork}</p>
                )}
              </div>
            </div>

            {currentExercise.duration && (
              <div className="mb-8 text-center">
                <div className="mb-4 text-3xl font-bold">
                  {timer !== null ? formatTime(timer) : currentExercise.duration}
                </div>
                <button
                  onClick={startTimer}
                  disabled={isTimerRunning}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Timer className="mr-2 h-5 w-5" />
                  {isTimerRunning ? 'Timer Running' : 'Start Timer'}
                </button>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentExerciseIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentExerciseIndex === 0}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={handleComplete}
                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                {completedExercises.has(currentExerciseIndex) ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Completed
                  </>
                ) : (
                  <>
                    Complete
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-6">
              <h4 className="mb-2 text-sm font-medium text-gray-900">
                Coming up next:
              </h4>
              <div className="space-y-2">
                {exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 3).map((exercise, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-gray-50 p-3 text-sm text-gray-600"
                  >
                    {exercise.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}