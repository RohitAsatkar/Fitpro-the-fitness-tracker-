import type { ExerciseDataset } from '../types';

export const exerciseDatabase: ExerciseDataset[] = [
  {
    name: "Barbell Squat",
    type: "strength",
    difficulty: "intermediate",
    muscleGroups: ["quadriceps", "hamstrings", "glutes", "core"],
    equipment: ["barbell", "squat rack"],
    formInstructions: [
      "Stand with feet shoulder-width apart",
      "Place barbell across upper back",
      "Keep chest up and core tight",
      "Lower body until thighs are parallel to ground",
      "Drive through heels to return to starting position"
    ],
    modifications: [
      "Bodyweight squat for beginners",
      "Front squat variation",
      "Box squat for depth control"
    ],
    benefits: [
      "Builds lower body strength",
      "Improves core stability",
      "Enhances functional movement",
      "Increases bone density"
    ],
    safetyTips: [
      "Keep knees aligned with toes",
      "Maintain neutral spine",
      "Don't let knees cave inward",
      "Start with lighter weights to perfect form"
    ],
    contraindications: [
      "Acute lower back pain",
      "Knee injuries",
      "Hip impingement"
    ]
  },
  {
    name: "Push-up",
    type: "bodyweight",
    difficulty: "beginner",
    muscleGroups: ["chest", "shoulders", "triceps", "core"],
    equipment: [],
    formInstructions: [
      "Start in plank position with hands slightly wider than shoulders",
      "Keep body in straight line from head to heels",
      "Lower chest to ground by bending elbows",
      "Push back up to starting position",
      "Keep core engaged throughout movement"
    ],
    modifications: [
      "Knee push-ups for beginners",
      "Incline push-ups on elevated surface",
      "Diamond push-ups for triceps emphasis"
    ],
    benefits: [
      "Builds upper body strength",
      "Improves core stability",
      "Enhances posture",
      "No equipment needed"
    ],
    safetyTips: [
      "Keep elbows at 45-degree angle",
      "Don't let hips sag",
      "Maintain neutral neck position",
      "Breathe steadily throughout movement"
    ],
    contraindications: [
      "Wrist injuries",
      "Shoulder impingement",
      "Acute lower back pain"
    ]
  },
  // Add more exercises as needed
];

export const getExercisesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): ExerciseDataset[] => {
  return exerciseDatabase.filter(exercise => exercise.difficulty === difficulty);
};

export const getExercisesByType = (type: ExerciseDataset['type']): ExerciseDataset[] => {
  return exerciseDatabase.filter(exercise => exercise.type === type);
};

export const getExercisesByEquipment = (equipment: string[]): ExerciseDataset[] => {
  return exerciseDatabase.filter(exercise => 
    equipment.length === 0 || 
    exercise.equipment.some(eq => equipment.includes(eq)) ||
    exercise.equipment.length === 0
  );
};

export const getExercisesByMuscleGroup = (muscleGroups: string[]): ExerciseDataset[] => {
  return exerciseDatabase.filter(exercise =>
    exercise.muscleGroups.some(muscle => muscleGroups.includes(muscle))
  );
};