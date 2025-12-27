import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, Award, ArrowRight, RefreshCcw } from 'lucide-react';

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-2xl mx-auto border-4 border-indigo-100 p-10 text-center animate-fade-in relative">
        {score === questions.length && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 text-4xl animate-bounce">🎉</div>
                <div className="absolute top-20 right-20 text-4xl animate-bounce delay-100">⭐</div>
                <div className="absolute bottom-10 left-1/4 text-4xl animate-bounce delay-200">🏆</div>
            </div>
        )}
        
        <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Award className="w-16 h-16 text-yellow-600" />
        </div>
        <h2 className="text-4xl font-display font-bold text-indigo-900 mb-4">Quiz Completed!</h2>
        <p className="text-xl text-gray-600 mb-8">
          You scored <span className="font-bold text-indigo-600 text-3xl mx-2">{score}</span> out of <span className="font-bold text-3xl mx-2">{questions.length}</span>
        </p>
        
        {score === questions.length ? (
            <p className="text-green-600 font-bold mb-8 text-lg">Perfect Score! You're a Genius! 🌟</p>
        ) : (
            <p className="text-indigo-600 font-bold mb-8 text-lg">Great effort! Keep learning! 🚀</p>
        )}

        <div className="flex justify-center">
          <button 
            onClick={() => onComplete(score, questions.length)}
            className="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200 text-lg"
          >
            <RefreshCcw className="w-6 h-6" />
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-3xl mx-auto border-4 border-indigo-100">
      <div className="bg-indigo-50 px-8 py-6 border-b border-indigo-100 flex justify-between items-center">
        <h3 className="font-display font-bold text-indigo-800 text-xl">Quiz Time</h3>
        <div className="flex gap-1">
             {questions.map((_, idx) => (
                 <div key={idx} className={`h-2 w-8 rounded-full ${idx === currentIndex ? 'bg-indigo-500' : idx < currentIndex ? 'bg-indigo-200' : 'bg-gray-200'}`}></div>
             ))}
        </div>
      </div>

      <div className="p-8 md:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed font-display">
          {currentQuestion.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctAnswerIndex;
            const showCorrectness = selectedOption !== null;
            
            let btnClass = "w-full text-left p-5 rounded-2xl border-2 transition-all font-semibold flex items-center justify-between group text-lg ";
            
            if (showCorrectness) {
              if (isCorrect) btnClass += "bg-green-50 border-green-500 text-green-800 ";
              else if (isSelected) btnClass += "bg-red-50 border-red-500 text-red-800 ";
              else btnClass += "bg-gray-50 border-gray-100 text-gray-400 opacity-60 ";
            } else {
              btnClass += "bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 hover:shadow-md cursor-pointer";
            }

            return (
              <button 
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleOptionClick(idx)}
                className={btnClass}
              >
                <span>{option}</span>
                {showCorrectness && isCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                {showCorrectness && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-600" />}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 mb-8">
              <p className="text-blue-800 font-bold mb-2 flex items-center gap-2">
                  <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs">EXPLANATION</span>
              </p>
              <p className="text-blue-900 text-lg leading-relaxed">{currentQuestion.explanation}</p>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-300 text-lg"
              >
                {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};