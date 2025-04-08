import type { UserProfile, AIRecommendation, ExerciseDataset } from '../types';
import { 
  getExercisesByDifficulty, 
  getExercisesByType, 
  getExercisesByEquipment,
  getExercisesByMuscleGroup 
} from '../data/exerciseDatabase';

const calculateBMR = (profile: UserProfile): number => {
  // Mifflin-St Jeor Equation
  const { age, gender, height, weight } = profile;
  const bmr = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? bmr + 5 : bmr - 161;
};

const calculateTDEE = (bmr: number, activityLevel: UserProfile['activityLevel']): number => {
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725
  };
  return bmr * activityMultipliers[activityLevel];
};

const adjustCaloriesForGoal = (tdee: number, goal: UserProfile['fitnessGoal']): number => {
  switch (goal) {
    case 'weight_loss':
      return tdee - 500; // 500 calorie deficit
    case 'muscle_gain':
      return tdee + 300; // 300 calorie surplus
    default:
      return tdee;
  }
};

const generateWorkoutPlan = (profile: UserProfile): AIRecommendation['workoutPlan'] => {
  // Get appropriate exercises based on user profile
  const baseExercises = getExercisesByDifficulty(profile.fitnessLevel);
  const equipmentExercises = getExercisesByEquipment(profile.equipmentAccess);
  
  // Filter exercises based on injuries
  const safeExercises = equipmentExercises.filter(exercise => 
    !exercise.contraindications.some(contra => 
      profile.injuries.includes(contra)
    )
  );

  // Select exercises for the workout
  const selectedExercises = safeExercises.slice(0, 6).map(exercise => ({
    id: crypto.randomUUID(),
    name: exercise.name,
    sets: profile.fitnessLevel === 'beginner' ? 3 : 4,
    reps: profile.fitnessGoal === 'muscle_gain' ? 8 : 12,
    weight: 0, // This should be customized based on user's strength level
    formInstructions: exercise.formInstructions,
    modifications: exercise.modifications,
    benefits: exercise.benefits,
    safetyTips: exercise.safetyTips
  }));

  return {
    exercises: selectedExercises,
    duration: profile.availableTime,
    intensity: profile.fitnessLevel === 'beginner' ? 'moderate' : 'high',
    frequency: profile.fitnessLevel === 'beginner' ? 3 : 4,
    notes: "Focus on proper form and controlled movements. Rest 60-90 seconds between sets."
  };
};

const generateNutritionPlan = (profile: UserProfile): AIRecommendation['nutritionPlan'] => {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const dailyCalories = adjustCaloriesForGoal(tdee, profile.fitnessGoal);

  // Calculate macros based on goal
  let proteinRatio = 0.3;
  let carbRatio = 0.4;
  let fatRatio = 0.3;

  if (profile.fitnessGoal === 'muscle_gain') {
    proteinRatio = 0.35;
    carbRatio = 0.45;
    fatRatio = 0.2;
  } else if (profile.fitnessGoal === 'weight_loss') {
    proteinRatio = 0.4;
    carbRatio = 0.3;
    fatRatio = 0.3;
  }

  const macros = {
    protein: Math.round((dailyCalories * proteinRatio) / 4), // 4 calories per gram of protein
    carbs: Math.round((dailyCalories * carbRatio) / 4), // 4 calories per gram of carbs
    fats: Math.round((dailyCalories * fatRatio) / 9), // 9 calories per gram of fat
  };

  return {
    dailyCalories: Math.round(dailyCalories),
    macros,
    mealSuggestions: {
      breakfast: [
        "Oatmeal with berries and protein powder",
        "Greek yogurt with honey and nuts",
        "Whole grain toast with eggs and avocado"
      ],
      lunch: [
        "Grilled chicken salad with olive oil dressing",
        "Quinoa bowl with roasted vegetables",
        "Turkey and avocado sandwich on whole grain bread"
      ],
      dinner: [
        "Salmon with sweet potato and green vegetables",
        "Lean beef stir-fry with brown rice",
        "Tofu and vegetable curry with quinoa"
      ],
      snacks: [
        "Apple with almond butter",
        "Protein shake with banana",
        "Mixed nuts and dried fruit",
        "Greek yogurt with berries"
      ]
    },
    recommendations: [
      "Stay hydrated by drinking at least 8 glasses of water daily",
      "Eat protein with every meal to support muscle recovery",
      "Include a variety of colorful vegetables for micronutrients",
      "Time your meals around your workouts for optimal energy",
      "Consider taking a multivitamin for overall health support"
    ]
  };
};

export const generateAIRecommendation = (profile: UserProfile): AIRecommendation => {
  return {
    workoutPlan: generateWorkoutPlan(profile),
    nutritionPlan: generateNutritionPlan(profile)
  };
};