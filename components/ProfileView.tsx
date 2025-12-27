
import React from 'react';
import { UserProfile } from '../types';
import { Award, BookOpen, BrainCircuit, Star, Zap, Shield, Crown } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  const getLevelTitle = (level: number) => {
    if (level < 5) return "Novice Learner";
    if (level < 10) return "Curious Explorer";
    if (level < 20) return "Knowledge Seeker";
    if (level < 30) return "Wise Scholar";
    return "Grand Sage";
  };

  const nextLevelXp = profile.level * 1000;
  const progressPercent = Math.min(100, (profile.xp / nextLevelXp) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
       {/* Hero Card */}
       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 md:p-12 text-white shadow-xl relative overflow-hidden mb-10">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
           
           <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
               <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-indigo-300">
                   <UserAvatar level={profile.level} />
               </div>
               
               <div className="flex-1 text-center md:text-left w-full">
                   <h2 className="text-2xl md:text-4xl font-display font-bold mb-2">Hello, {profile.name}!</h2>
                   <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <Crown className="w-3 h-3" /> Level {profile.level}
                        </span>
                        <span className="text-indigo-100 font-medium text-sm md:text-base">{getLevelTitle(profile.level)}</span>
                   </div>
                   
                   {/* XP Bar */}
                   <div className="w-full md:max-w-md">
                       <div className="flex justify-between text-xs font-bold text-indigo-200 mb-1">
                           <span>{profile.xp} KP</span>
                           <span>{nextLevelXp} KP</span>
                       </div>
                       <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                           <div 
                                className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercent}%` }}
                           ></div>
                       </div>
                       <p className="text-xs text-indigo-200 mt-2">
                           {nextLevelXp - profile.xp} KP needed for next level
                       </p>
                   </div>
               </div>
           </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
           <StatCard icon={BookOpen} label="Stories" value={profile.storiesRead} color="blue" />
           <StatCard icon={BrainCircuit} label="Quizzes" value={profile.quizzesTaken} color="purple" />
           <StatCard icon={Star} label="Perfect" value={profile.perfectScores} color="yellow" />
           <StatCard icon={Zap} label="Total KP" value={profile.xp} color="indigo" />
       </div>

       {/* Recent Badges */}
       <div>
           <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
               <Award className="w-6 h-6 text-indigo-600" /> Achievements
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Badge 
                    title="First Steps" 
                    desc="Read your first story" 
                    locked={profile.storiesRead < 1} 
                    icon={BookOpen}
                />
                <Badge 
                    title="Quiz Whiz" 
                    desc="Score 100% on a quiz" 
                    locked={profile.perfectScores < 1} 
                    icon={BrainCircuit}
                />
                 <Badge 
                    title="Library Builder" 
                    desc="Save 5 stories" 
                    locked={profile.storiesRead < 5} 
                    icon={Shield}
                />
           </div>
       </div>
    </div>
  );
};

const UserAvatar: React.FC<{ level: number }> = ({ level }) => (
    <div className="text-4xl">
        {level < 5 ? '🐣' : level < 10 ? '🦉' : level < 20 ? '🦁' : '🦄'}
    </div>
);

const StatCard: React.FC<{ icon: any, label: string, value: number, color: string }> = ({ icon: Icon, label, value, color }) => {
    const colors: any = {
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        indigo: 'bg-indigo-100 text-indigo-600',
    };
    
    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className={`p-2 md:p-3 rounded-full ${colors[color]} mb-2 md:mb-3`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-1">{value}</span>
            <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wide">{label}</span>
        </div>
    );
};

const Badge: React.FC<{ title: string, desc: string, locked: boolean, icon: any }> = ({ title, desc, locked, icon: Icon }) => (
    <div className={`flex items-center gap-4 p-4 rounded-xl border ${locked ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-indigo-100 shadow-sm'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${locked ? 'bg-gray-200 text-gray-400' : 'bg-yellow-100 text-yellow-600'}`}>
            {locked ? <Shield className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
        </div>
        <div>
            <h4 className={`font-bold ${locked ? 'text-gray-500' : 'text-gray-800'}`}>{title}</h4>
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
    </div>
);
