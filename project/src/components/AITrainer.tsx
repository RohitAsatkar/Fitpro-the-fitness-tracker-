import React, { useState, useEffect } from 'react';
import { Brain, Dumbbell, Utensils, AlertCircle, Activity, Clock, Target, Award } from 'lucide-react';
import type { UserProfile, AIRecommendation, Exercise } from '../types';
import { generateAIRecommendation } from '../utils/aiUtils';

export default function AITrainer() {
  const [profile, setProfile] = useState<UserProfile>({
    age: 30,
    gender: 'male',
    height: 175,
    weight: 75,
    activityLevel: 'moderately_active',
    fitnessGoal: 'weight_loss',
    fitnessLevel: 'intermediate',
    dietaryPreferences: [],
    restrictions: [],
    injuries: [],
    equipmentAccess: ['dumbbells', 'resistance bands'],
    workoutPreference: 'both',
    availableTime: 60,
  });

  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate real-time feedback based on profile changes
  useEffect(() => {
    const generateFeedback = () => {
      const newFeedback: string[] = [];

      // BMI-based feedback
      const bmi = profile.weight / Math.pow(profile.height / 100, 2);
      if (bmi < 18.5) {
        newFeedback.push("Your BMI indicates you're underweight. Focus on muscle gain and increasing caloric intake.");
      } else if (bmi > 25) {
        newFeedback.push("Your BMI indicates you might benefit from a weight management program.");
      }

      // Activity level feedback
      if (profile.activityLevel === 'sedentary' && profile.fitnessGoal === 'muscle_gain') {
        newFeedback.push("Consider increasing your activity level to optimize muscle gain.");
      }

      // Time availability feedback
      if (profile.availableTime < 30) {
        newFeedback.push("Short on time? We'll focus on high-intensity, efficient workouts.");
      }

      setFeedback(newFeedback);
    };

    generateFeedback();
  }, [profile]);

  const handleProfileUpdate = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    // Regenerate recommendation if it exists
    if (recommendation) {
      generateRecommendation();
    }
  };

  const generateRecommendation = async () => {
    setLoading(true);
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      const aiRecommendation = generateAIRecommendation(profile);
      setRecommendation(aiRecommendation);
    } catch (error) {
      console.error('Error generating recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Brain className="h-6 w-6 text-blue-500 mr-2" />
          AI Personal Trainer
        </h2>
        <p className="text-gray-600">Get personalized workout and nutrition recommendations based on your profile.</p>
      </div>

      {/* Real-time Feedback */}
      {feedback.length > 0 && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-medium text-blue-900">Real-time Insights</h3>
          </div>
          <ul className="space-y-2">
            {feedback.map((item, index) => (
              <li key={index} className="flex items-start text-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="h-5 w-5 text-purple-500 mr-2" />
            Your Profile
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleProfileUpdate('age', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => handleProfileUpdate('gender', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                <input
                  type="number"
                  value={profile.height}
                  onChange={(e) => handleProfileUpdate('height', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  value={profile.weight}
                  onChange={(e) => handleProfileUpdate('weight', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fitness Goal</label>
              <select
                value={profile.fitnessGoal}
                onChange={(e) => handleProfileUpdate('fitnessGoal', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="endurance">Endurance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Activity Level</label>
              <select
                value={profile.activityLevel}
                onChange={(e) => handleProfileUpdate('activityLevel', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="sedentary">Sedentary</option>
                <option value="lightly_active">Lightly Active</option>
                <option value="moderately_active">Moderately Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Available Time (minutes)</label>
              <input
                type="number"
                value={profile.availableTime}
                onChange={(e) => handleProfileUpdate('availableTime', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="15"
                max="120"
                step="15"
              />
            </div>

            <button
              onClick={generateRecommendation}
              disabled={loading}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <>
                  <Clock className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Analyzing...
                </>
              ) : (
                'Generate Recommendations'
              )}
            </button>
          </div>
        </div>

        {/* Recommendations */}
        {recommendation && (
          <div className="space-y-6">
            {/* Workout Plan */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Dumbbell className="h-6 w-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold">Workout Plan</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{recommendation.workoutPlan.duration} minutes</span>
                  <span>{recommendation.workoutPlan.frequency}x per week</span>
                  <span className="capitalize">{recommendation.workoutPlan.intensity} intensity</span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Recommended Exercises:</h4>
                  <div className="space-y-3">
                    {recommendation.workoutPlan.exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                          selectedExercise?.id === exercise.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{exercise.name}</span>
                          <span className="text-gray-600">
                            {exercise.sets} × {exercise.reps}
                          </span>
                        </div>
                        {selectedExercise?.id === exercise.id && (
                          <div className="mt-3 space-y-3 text-sm">
                            {exercise.formInstructions && (
                              <div>
                                <h5 className="font-medium text-gray-700 mb-1">Form Instructions:</h5>
                                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                                  {exercise.formInstructions.map((instruction, idx) => (
                                    <li key={idx}>{instruction}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {exercise.modifications && (
                              <div>
                                <h5 className="font-medium text-gray-700 mb-1">Modifications:</h5>
                                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                                  {exercise.modifications.map((mod, idx) => (
                                    <li key={idx}>{mod}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Plan */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Utensils className="h-6 w-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold">Nutrition Plan</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Daily Calories: {recommendation.nutritionPlan.dailyCalories}</p>
                  <div className="mt-2 grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Protein</p>
                      <p className="font-medium text-green-700">{recommendation.nutritionPlan.macros.protein}g</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Carbs</p>
                      <p className="font-medium text-blue-700">{recommendation.nutritionPlan.macros.carbs}g</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Fats</p>
                      <p className="font-medium text-purple-700">{recommendation.nutritionPlan.macros.fats}g</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Meal Suggestions:</h4>
                  <div className="space-y-3">
                    {Object.entries(recommendation.nutritionPlan.mealSuggestions).map(([meal, suggestions]) => (
                      <div key={meal} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 capitalize mb-2">{meal}:</p>
                        <ul className="space-y-1">
                          {suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <Award className="h-4 w-4 text-yellow-500 mr-2" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold">Key Recommendations</h3>
              </div>
              <ul className="space-y-2">
                {recommendation.nutritionPlan.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center bg-purple-50 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                    <span className="text-purple-900">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}