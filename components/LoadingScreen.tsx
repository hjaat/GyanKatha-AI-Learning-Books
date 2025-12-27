import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = "Weaving your magic story..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
        <div className="relative bg-white p-8 rounded-3xl shadow-xl mb-8 border-4 border-indigo-50">
          <Sparkles className="w-16 h-16 text-indigo-600 animate-spin-slow" />
        </div>
      </div>
      <h2 className="text-3xl font-display font-bold text-gray-800 mb-4">{message}</h2>
      <p className="text-gray-500 max-w-md text-lg">Our AI storyteller is writing pages, drawing pictures, and preparing a fun quiz just for you!</p>
      
      <div className="mt-10 flex gap-3">
        <div className="w-4 h-4 bg-indigo-400 rounded-full animate-bounce delay-0"></div>
        <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
};