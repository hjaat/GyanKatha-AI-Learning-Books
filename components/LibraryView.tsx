
import React from 'react';
import { Story } from '../types';
import { StoryCard } from './StoryCard';
import { BookOpen, Search } from 'lucide-react';

interface LibraryViewProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
  onHome: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ stories, onSelectStory, onDeleteStory, onHome }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">My Library</h2>
          <p className="text-gray-600 text-sm md:text-base">Your personal collection of magical knowledge.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
           {/* Placeholder for future search */}
           <div className="relative w-full md:w-auto">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input 
                type="text" 
                placeholder="Search books..." 
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none w-full md:w-64 text-sm"
             />
           </div>
        </div>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-indigo-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Your library is empty</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            You haven't created any stories yet. Start learning to fill your shelves with magic!
          </p>
          <button 
            onClick={onHome}
            className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
          >
            Create Your First Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {stories.map((story) => (
            <StoryCard 
              key={story.id} 
              story={story} 
              onClick={() => onSelectStory(story)}
              onDelete={(e) => {
                e.stopPropagation();
                if(window.confirm('Are you sure you want to delete this book?')) {
                    onDeleteStory(story.id);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
