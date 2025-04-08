import React, { useState } from 'react';
import { 
  Dumbbell, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  AlertCircle,
  Info,
  Activity,
  BarChart
} from 'lucide-react';

interface Exercise {
  name: string;
  type: 'compound' | 'isolation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  sets: string;
  rest: string;
  tips: string[];
  secondaryMuscles?: string[];
  variations?: string[];
}

interface MuscleGroup {
  name: string;
  muscles: string[];
  exercises: Exercise[];
}

const muscleGroups: MuscleGroup[] = [
  {
    name: "Chest (Pectorals)",
    muscles: [
      "Pectoralis Major",
      "Pectoralis Minor",
      "Serratus Anterior"
    ],
    exercises: [
      {
        name: "Barbell Bench Press",
        type: "compound",
        difficulty: "intermediate",
        instructions: [
          "Lie on a flat bench with feet firmly planted on the ground",
          "Grip the barbell slightly wider than shoulder width",
          "Unrack the bar and hold it directly above your chest",
          "Lower the bar slowly to your mid-chest",
          "Press the bar back up to the starting position",
          "Keep your shoulder blades retracted throughout the movement"
        ],
        sets: "4 sets of 8-12 reps",
        rest: "90-120 seconds",
        tips: [
          "Keep your wrists straight and elbows at 45 degrees",
          "Drive your feet into the ground for stability",
          "Maintain a slight arch in your lower back"
        ],
        secondaryMuscles: ["Anterior Deltoids", "Triceps"],
        variations: ["Incline Bench Press", "Decline Bench Press", "Close-Grip Bench Press"]
      },
      {
        name: "Push-Ups",
        type: "compound",
        difficulty: "beginner",
        instructions: [
          "Start in a plank position with hands slightly wider than shoulders",
          "Keep your body in a straight line from head to heels",
          "Lower your chest to the ground by bending your elbows",
          "Push back up to the starting position",
          "Keep your core engaged throughout the movement"
        ],
        sets: "3 sets of 10-20 reps",
        rest: "60 seconds",
        tips: [
          "Keep your elbows close to your body",
          "Look slightly ahead of your hands",
          "Don't let your hips sag"
        ],
        variations: ["Diamond Push-Ups", "Decline Push-Ups", "Plyometric Push-Ups"]
      },
      {
        name: "Dumbbell Flyes",
        type: "isolation",
        difficulty: "intermediate",
        instructions: [
          "Lie on a flat bench holding dumbbells above your chest",
          "Keep a slight bend in your elbows",
          "Lower the weights out to the sides in an arc motion",
          "Feel the stretch in your chest at the bottom",
          "Bring the weights back up in the same arc motion",
          "Squeeze your chest at the top"
        ],
        sets: "3 sets of 12-15 reps",
        rest: "60 seconds",
        tips: [
          "Don't go too heavy - focus on the stretch",
          "Keep the same elbow bend throughout",
          "Don't let the weights drop below chest level"
        ]
      }
    ]
  },
  {
    name: "Back",
    muscles: [
      "Latissimus Dorsi",
      "Trapezius",
      "Rhomboids",
      "Erector Spinae",
      "Teres Major",
      "Teres Minor"
    ],
    exercises: [
      {
        name: "Pull-Ups",
        type: "compound",
        difficulty: "intermediate",
        instructions: [
          "Grip the bar with hands wider than shoulder width",
          "Hang with arms fully extended",
          "Pull yourself up until your chin clears the bar",
          "Focus on driving your elbows down and back",
          "Lower yourself with control"
        ],
        sets: "3-4 sets to failure",
        rest: "90 seconds",
        tips: [
          "Initiate the movement with your lats",
          "Keep your core engaged",
          "Avoid swinging"
        ],
        secondaryMuscles: ["Biceps", "Forearms"],
        variations: ["Chin-Ups", "Wide-Grip Pull-Ups", "Neutral-Grip Pull-Ups"]
      },
      {
        name: "Barbell Rows",
        type: "compound",
        difficulty: "intermediate",
        instructions: [
          "Bend at hips and knees, keeping back straight",
          "Grip barbell with hands shoulder-width apart",
          "Pull bar to lower chest",
          "Squeeze shoulder blades together",
          "Lower bar with control"
        ],
        sets: "4 sets of 8-12 reps",
        rest: "90 seconds",
        tips: [
          "Keep your core tight",
          "Don't let your back round",
          "Focus on pulling with your back, not arms"
        ],
        secondaryMuscles: ["Biceps", "Core"],
        variations: ["Pendlay Rows", "One-Arm Dumbbell Rows"]
      }
    ]
  },
  {
    name: "Shoulders (Deltoids)",
    muscles: [
      "Anterior Deltoid",
      "Lateral Deltoid",
      "Posterior Deltoid"
    ],
    exercises: [
      {
        name: "Overhead Press",
        type: "compound",
        difficulty: "intermediate",
        instructions: [
          "Stand with feet shoulder-width apart",
          "Hold barbell at shoulder level with palms facing forward",
          "Press the weight overhead until arms are fully extended",
          "Lower the weight back to shoulder level with control",
          "Keep core tight throughout the movement"
        ],
        sets: "4 sets of 6-10 reps",
        rest: "90 seconds",
        tips: [
          "Keep your core tight",
          "Don't lean back excessively",
          "Breathe out as you press up"
        ],
        secondaryMuscles: ["Triceps", "Upper Chest", "Core"],
        variations: ["Seated Press", "Dumbbell Press", "Push Press"]
      },
      {
        name: "Lateral Raises",
        type: "isolation",
        difficulty: "beginner",
        instructions: [
          "Stand holding dumbbells at your sides",
          "Keep a slight bend in your elbows",
          "Raise the weights out to the sides until parallel with ground",
          "Lower slowly back to starting position",
          "Maintain control throughout"
        ],
        sets: "3 sets of 12-15 reps",
        rest: "60 seconds",
        tips: [
          "Don't swing the weights",
          "Keep your traps relaxed",
          "Lead with your elbows"
        ]
      }
    ]
  },
  {
    name: "Arms",
    muscles: [
      "Biceps Brachii",
      "Brachialis",
      "Triceps Brachii",
      "Forearm Flexors",
      "Forearm Extensors"
    ],
    exercises: [
      {
        name: "Barbell Bicep Curls",
        type: "isolation",
        difficulty: "beginner",
        instructions: [
          "Stand with feet shoulder-width apart",
          "Hold barbell with underhand grip at shoulder width",
          "Keep elbows close to your sides",
          "Curl the weight up while keeping upper arms stationary",
          "Squeeze biceps at the top",
          "Lower the weight with control"
        ],
        sets: "3-4 sets of 10-12 reps",
        rest: "60-90 seconds",
        tips: [
          "Avoid swinging or using momentum",
          "Keep your core tight",
          "Focus on full range of motion"
        ],
        variations: ["Hammer Curls", "Preacher Curls", "Concentration Curls"]
      },
      {
        name: "Skull Crushers",
        type: "isolation",
        difficulty: "intermediate",
        instructions: [
          "Lie on a bench holding a barbell or dumbbells",
          "Start with arms extended above chest",
          "Keep upper arms stationary",
          "Lower weight toward forehead by bending elbows",
          "Extend arms back to starting position",
          "Keep elbows pointed toward ceiling"
        ],
        sets: "3 sets of 12-15 reps",
        rest: "60 seconds",
        tips: [
          "Don't let elbows flare out",
          "Control the negative portion",
          "Keep wrists straight"
        ],
        secondaryMuscles: ["Anterior Deltoid"],
        variations: ["EZ Bar Skull Crushers", "Dumbbell Skull Crushers"]
      }
    ]
  },
  {
    name: "Core (Abdominals & Obliques)",
    muscles: [
      "Rectus Abdominis",
      "Transverse Abdominis",
      "Internal Obliques",
      "External Obliques"
    ],
    exercises: [
      {
        name: "Hanging Leg Raises",
        type: "compound",
        difficulty: "intermediate",
        instructions: [
          "Hang from a pull-up bar with straight arms",
          "Keep your core tight and legs straight",
          "Raise legs until parallel to ground or higher",
          "Lower legs with control",
          "Avoid swinging movements"
        ],
        sets: "3 sets of 12-15 reps",
        rest: "60 seconds",
        tips: [
          "Maintain steady breathing",
          "Keep shoulders packed",
          "Focus on using abs, not momentum"
        ],
        variations: ["Knee Raises", "Toes to Bar", "Windshield Wipers"]
      },
      {
        name: "Russian Twists",
        type: "isolation",
        difficulty: "beginner",
        instructions: [
          "Sit with knees bent and feet elevated",
          "Lean back slightly, maintaining straight back",
          "Hold weight or clasp hands at chest",
          "Rotate torso from side to side",
          "Touch weight or hands to ground on each side"
        ],
        sets: "3 sets of 20 reps (10 each side)",
        rest: "45 seconds",
        tips: [
          "Keep chest up throughout movement",
          "Control the rotation speed",
          "Breathe steadily"
        ],
        variations: ["Weighted Russian Twists", "Medicine Ball Twists"]
      }
    ]
  },
  {
    name: "Legs",
    muscles: [
      "Quadriceps",
      "Hamstrings",
      "Glutes",
      "Calves",
      "Adductors",
      "Abductors"
    ],
    exercises: [
      {
        name: "Barbell Back Squats",
        type: "compound",
        difficulty: "intermediate",
        instructions: [
          "Position bar on upper back, not neck",
          "Stand with feet shoulder-width apart",
          "Break at hips and knees simultaneously",
          "Lower until thighs are parallel to ground",
          "Drive through heels to stand",
          "Keep chest up throughout movement"
        ],
        sets: "4 sets of 8-12 reps",
        rest: "120 seconds",
        tips: [
          "Maintain neutral spine",
          "Keep knees in line with toes",
          "Breathe in on descent, out on ascent"
        ],
        secondaryMuscles: ["Core", "Lower Back"],
        variations: ["Front Squat", "Box Squat", "Pause Squat"]
      },
      {
        name: "Romanian Deadlift",
        type: "compound",
        difficulty: "intermediate",
        instructions: [
          "Hold barbell at hip level",
          "Hinge at hips, pushing them back",
          "Lower weight while keeping legs nearly straight",
          "Feel stretch in hamstrings",
          "Drive hips forward to return to start",
          "Keep bar close to legs throughout"
        ],
        sets: "3-4 sets of 10-12 reps",
        rest: "90 seconds",
        tips: [
          "Keep back straight",
          "Maintain slight knee bend",
          "Focus on hip hinge movement"
        ],
        secondaryMuscles: ["Lower Back", "Glutes"],
        variations: ["Single-Leg RDL", "Dumbbell RDL"]
      },
      {
        name: "Standing Calf Raises",
        type: "isolation",
        difficulty: "beginner",
        instructions: [
          "Stand on edge of step or platform",
          "Balls of feet on edge, heels hanging off",
          "Lower heels below platform level",
          "Rise up onto toes as high as possible",
          "Hold peak contraction briefly",
          "Lower with control"
        ],
        sets: "4 sets of 15-20 reps",
        rest: "60 seconds",
        tips: [
          "Don't bounce at bottom",
          "Use full range of motion",
          "Keep legs straight but not locked"
        ],
        variations: ["Seated Calf Raises", "Single-Leg Calf Raises"]
      }
    ]
  }
];

export default function AdvancedTraining() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMuscleGroups = muscleGroups.map(group => ({
    ...group,
    exercises: group.exercises.filter(exercise => 
      (filterDifficulty === 'all' || exercise.difficulty === filterDifficulty) &&
      (filterType === 'all' || exercise.type === filterType)
    )
  })).filter(group => group.exercises.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Training Guide</h2>
        <p className="text-lg text-gray-600 mb-8">
          Comprehensive muscle group targeting with professional exercise instructions
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-gray-500" />
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <BarChart className="h-5 w-5 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="compound">Compound</option>
              <option value="isolation">Isolation</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredMuscleGroups.map((group) => (
          <div key={group.name} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => setExpandedGroup(expandedGroup === group.name ? null : group.name)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <Dumbbell className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
              </div>
              {expandedGroup === group.name ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {expandedGroup === group.name && (
              <div className="px-6 py-4">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Target Muscles:</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.muscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {group.exercises.map((exercise) => (
                    <div key={exercise.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{exercise.name}</h4>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                              {exercise.difficulty}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {exercise.type}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedExercise(
                            selectedExercise?.name === exercise.name ? null : exercise
                          )}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {selectedExercise?.name === exercise.name ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      {selectedExercise?.name === exercise.name && (
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-2">Instructions:</h5>
                            <ol className="list-decimal list-inside space-y-2">
                              {exercise.instructions.map((instruction, idx) => (
                                <li key={idx} className="text-gray-700">{instruction}</li>
                              ))}
                            </ol>
                          </div>

                          <div className="flex gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-500 mb-1">Sets/Reps:</h5>
                              <p className="text-gray-700">{exercise.sets}</p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-500 mb-1">Rest:</h5>
                              <p className="text-gray-700">{exercise.rest}</p>
                            </div>
                          </div>

                          {exercise.secondaryMuscles && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-500 mb-2">Secondary Muscles:</h5>
                              <div className="flex flex-wrap gap-2">
                                {exercise.secondaryMuscles.map((muscle, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    {muscle}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {exercise.variations && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-500 mb-2">Variations:</h5>
                              <div className="flex flex-wrap gap-2">
                                {exercise.variations.map((variation, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                                    {variation}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-2">Pro Tips:</h5>
                            <ul className="space-y-2">
                              {exercise.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start">
                                  <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-medium text-yellow-800 mb-2">Important Safety Notice</h4>
            <ul className="list-disc list-inside space-y-2 text-yellow-700">
              <li>Always warm up properly before exercising</li>
              <li>Start with lighter weights to perfect form</li>
              <li>If you experience pain, stop and consult a professional</li>
              <li>Maintain proper form throughout each exercise</li>
              <li>Stay hydrated and listen to your body</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}