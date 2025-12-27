import React from 'react';
import { BookOpen, Trash2, Calendar, ArrowRight } from 'lucide-react';
import { Story, Subject } from '../types';
import { SUBJECTS_CONFIG } from '../constants';

interface StoryCardProps {
  story: Story;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onClick, onDelete }) => {
  const subjectConfig = SUBJECTS_CONFIG.find(s => s.id === story.subject) || SUBJECTS_CONFIG[0];
  const Icon = subjectConfig.icon;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 group flex flex-col h-full relative overflow-hidden"
    >
      <div className={`h-2 w-full ${subjectConfig.color.split(' ')[0]}`}></div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${subjectConfig.color.replace('text-', 'bg-').replace('600', '100')} ${subjectConfig.color.split(' ')[1]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-md uppercase tracking-wide">
            {story.classLevel.replace('Class ', 'Std ')}
          </span>
        </div>

        <h3 className="text-xl font-display font-bold text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {story.title}
        </h3>
        
        <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1">
          {story.summary}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(story.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1 font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
            Read Now <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {onDelete && (
        <button 
          onClick={onDelete}
          className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
          title="Delete Story"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};