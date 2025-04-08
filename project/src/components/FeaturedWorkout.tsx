import React from 'react';
import { Calendar, Clock, Trophy } from 'lucide-react';

export default function FeaturedWorkout() {
  return (
    <div className="relative h-[400px] overflow-hidden rounded-xl bg-cover bg-center" 
         style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200")' }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/0" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="mb-4 flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <span className="text-sm font-medium text-yellow-400">Featured Workout</span>
        </div>
        <h2 className="mb-2 text-2xl font-bold">Full Body Power Hour</h2>
        <p className="mb-4 text-gray-200">
          A comprehensive workout targeting all major muscle groups for maximum results.
        </p>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>60 min</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Beginner Friendly</span>
          </div>
        </div>
      </div>
    </div>
  );
}