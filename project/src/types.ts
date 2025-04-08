import type { LatLng } from 'leaflet';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  duration?: string;
  intensity?: string;
  breathwork?: string;
  formInstructions?: string[];
  modifications?: string[];
  benefits?: string[];
  safetyTips?: string[];
}

export interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
  notes?: string;
}

export interface WorkoutFormData {
  date: string;
  exercises: Exercise[];
  notes: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalExercises: number;
  totalWeight: number;
  streakDays: number;
}

export interface WorkoutTemplate {
  name: string;
  exercises: Exercise[];
  description: string;
  type: 'strength' | 'cardio' | 'mindful';
}

export interface StepData {
  date: string;
  steps: number;
  distance: number;
  calories: number;
}

export interface TrackingPreferences {
  units: 'metric' | 'imperial';
  dailyGoal: number;
  showRoute: boolean;
}

export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  dietaryPreferences: string[];
  restrictions: string[];
  injuries: string[];
  equipmentAccess: string[];
  workoutPreference: 'home' | 'gym' | 'both';
  availableTime: number; // minutes per day
}

export interface AIRecommendation {
  workoutPlan: {
    exercises: Exercise[];
    duration: number;
    intensity: string;
    frequency: number;
    notes: string;
  };
  nutritionPlan: {
    dailyCalories: number;
    macros: {
      protein: number;
      carbs: number;
      fats: number;
    };
    mealSuggestions: {
      breakfast: string[];
      lunch: string[];
      dinner: string[];
      snacks: string[];
    };
    recommendations: string[];
  };
}

export interface ExerciseDataset {
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'bodyweight' | 'equipment' | 'sport';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  equipment: string[];
  formInstructions: string[];
  modifications: string[];
  benefits: string[];
  safetyTips: string[];
  contraindications: string[];
}