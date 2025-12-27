
import React, { useState, useEffect } from 'react';
import { SUBJECTS_CONFIG, CLASS_LEVELS, SUGGESTED_TOPICS, CLASS_SUBJECTS_MAPPING, SUPPORTED_LANGUAGES } from './constants';
import { Subject, ClassLevel, Story, AppState, Language, UserProfile } from './types';
import { generateStoryContent } from './services/geminiService';
import { StoryViewer } from './components/StoryViewer';
import { QuizView } from './components/QuizView';
import { LoadingScreen } from './components/LoadingScreen';
import { LibraryView } from './components/LibraryView';
import { ProfileView } from './components/ProfileView';
import { BookOpen, Sparkles, GraduationCap, ChevronDown, Check, Dices, Globe, Home, Library, User, Trophy, Zap, Mic, MicOff, Flame } from 'lucide-react';

// --- Local Storage Helpers ---
const loadProfile = (): UserProfile => {
    const saved = localStorage.getItem('user_profile');
    if (saved) return JSON.parse(saved);
    return { 
        name: 'Student', 
        xp: 0, 
        level: 1, 
        storiesRead: 0, 
        quizzesTaken: 0, 
        perfectScores: 0,
        streakDays: 0,
        lastLoginDate: new Date().toDateString()
    };
};

const loadLibrary = (): Story[] => {
    const saved = localStorage.getItem('user_library');
    if (saved) return JSON.parse(saved);
    return [];
};

const saveProfile = (profile: UserProfile) => localStorage.setItem('user_profile', JSON.stringify(profile));
const saveLibrary = (library: Story[]) => localStorage.setItem('user_library', JSON.stringify(library));

// --- Streak Calculation ---
const updateStreak = (profile: UserProfile): UserProfile => {
    const today = new Date().toDateString();
    const lastLogin = new Date(profile.lastLoginDate);
    const timeDiff = new Date(today).getTime() - lastLogin.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    let newStreak = profile.streakDays;
    
    if (daysDiff === 1) {
        // Login on consecutive day
        newStreak += 1;
    } else if (daysDiff > 1) {
        // Missed a day
        newStreak = 1; 
    } else if (profile.streakDays === 0) {
        newStreak = 1;
    }

    return { ...profile, streakDays: newStreak, lastLoginDate: today };
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentClass: ClassLevel.Class1,
    currentSubject: null,
    currentLanguage: Language.English,
    customTopic: "",
    generatedStory: null,
    isLoading: false,
    view: 'home',
    userProfile: loadProfile(),
    library: loadLibrary()
  });

  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Update streak on mount
  useEffect(() => {
    const updatedProfile = updateStreak(state.userProfile);
    if (updatedProfile.streakDays !== state.userProfile.streakDays || updatedProfile.lastLoginDate !== state.userProfile.lastLoginDate) {
        setState(prev => ({ ...prev, userProfile: updatedProfile }));
    }
  }, []);

  // Sync with local storage
  useEffect(() => {
    saveProfile(state.userProfile);
  }, [state.userProfile]);

  useEffect(() => {
    saveLibrary(state.library);
  }, [state.library]);

  const handleClassSelect = (cls: ClassLevel) => {
    const availableSubjects = CLASS_SUBJECTS_MAPPING[cls];
    const isSubjectValid = state.currentSubject && availableSubjects.includes(state.currentSubject);

    setState(prev => ({ 
        ...prev, 
        currentClass: cls,
        currentSubject: isSubjectValid ? prev.currentSubject : null,
        customTopic: isSubjectValid ? prev.customTopic : ""
    }));
    setClassDropdownOpen(false);
  };

  const handleLanguageSelect = (lang: Language) => {
    setState(prev => ({ ...prev, currentLanguage: lang }));
    setLangDropdownOpen(false);
  };

  const handleSubjectSelect = (subj: Subject) => {
    setState(prev => ({ ...prev, currentSubject: subj, customTopic: "" }));
  };

  const handleCreateStory = async () => {
    if (!state.currentSubject || !state.customTopic.trim()) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const storyRaw = await generateStoryContent(
        state.currentClass, 
        state.currentSubject, 
        state.customTopic,
        state.currentLanguage
      );

      // Add ID and Metadata
      const newStory: Story = {
          ...storyRaw,
          id: Date.now().toString(),
          createdAt: Date.now(),
          subject: state.currentSubject,
          classLevel: state.currentClass
      };

      setState(prev => ({ 
        ...prev, 
        generatedStory: newStory, 
        isLoading: false, 
        view: 'story',
        library: [newStory, ...prev.library],
        userProfile: {
            ...prev.userProfile,
            storiesRead: prev.userProfile.storiesRead + 1,
            xp: prev.userProfile.xp + 50
        }
      }));

    } catch (error) {
      console.error(error);
      alert("Oops! Something went wrong while creating your story. Please try again.");
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSurpriseMe = () => {
      if (!state.currentSubject) return;
      const classTopics = SUGGESTED_TOPICS[state.currentClass];
      const subjectTopics = classTopics ? classTopics[state.currentSubject] : [];
      
      if (subjectTopics && subjectTopics.length > 0) {
        const randomTopic = subjectTopics[Math.floor(Math.random() * subjectTopics.length)];
        setState(prev => ({ ...prev, customTopic: randomTopic }));
      }
  };

  // Voice Input Logic
  const toggleVoiceInput = () => {
      if (!('webkitSpeechRecognition' in window)) {
          alert("Voice input is not supported in this browser. Please use Chrome.");
          return;
      }

      if (isListening) {
          setIsListening(false);
          return;
      }

      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // Default to English for simplicity or map to state.currentLanguage

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setState(prev => ({ ...prev, customTopic: transcript }));
      };
      
      recognition.start();
  };

  const handleQuizComplete = (score: number, total: number) => {
      const xpEarned = score * 10;
      const isPerfect = score === total;
      
      setState(prev => {
          const newXp = prev.userProfile.xp + xpEarned;
          const newLevel = Math.floor(newXp / 1000) + 1;

          return {
              ...prev,
              view: 'home',
              generatedStory: null,
              currentSubject: null,
              customTopic: "",
              userProfile: {
                  ...prev.userProfile,
                  xp: newXp,
                  level: newLevel,
                  quizzesTaken: prev.userProfile.quizzesTaken + 1,
                  perfectScores: isPerfect ? prev.userProfile.perfectScores + 1 : prev.userProfile.perfectScores
              }
          };
      });
  };

  const handleDeleteStory = (id: string) => {
      setState(prev => ({
          ...prev,
          library: prev.library.filter(s => s.id !== id)
      }));
  };

  const handleSelectSavedStory = (story: Story) => {
      setState(prev => ({
          ...prev,
          generatedStory: story,
          view: 'story'
      }));
  };

  const handleNavigation = (view: 'home' | 'library' | 'profile') => {
      setState(prev => ({ ...prev, view }));
  };

  const availableSubjectsForClass = CLASS_SUBJECTS_MAPPING[state.currentClass];
  const filteredSubjects = SUBJECTS_CONFIG.filter(subj => availableSubjectsForClass.includes(subj.id));

  // --- Smart Recommendations ---
  const getRecommendedTopics = () => {
      if (state.library.length === 0) return [];
      
      // Find most read subject
      const subjectCounts: Record<string, number> = {};
      state.library.forEach(s => {
          subjectCounts[s.subject] = (subjectCounts[s.subject] || 0) + 1;
      });
      const favoriteSubject = Object.keys(subjectCounts).reduce((a, b) => subjectCounts[a] > subjectCounts[b] ? a : b) as Subject;
      
      const topics = SUGGESTED_TOPICS[state.currentClass]?.[favoriteSubject] || [];
      // Filter out topics already read (by simple string match)
      const readTitles = state.library.map(s => s.title.toLowerCase());
      const unreadTopics = topics.filter(t => !readTitles.some(title => title.includes(t.toLowerCase())));
      
      // Return up to 3 random unread topics
      return unreadTopics.sort(() => 0.5 - Math.random()).slice(0, 3).map(t => ({ subject: favoriteSubject, topic: t }));
  };

  const recommendedTopics = getRecommendedTopics();
  const suggestedTopics = state.currentSubject ? SUGGESTED_TOPICS[state.currentClass]?.[state.currentSubject] || [] : [];

  // ---------------- RENDER ----------------

  if (state.isLoading) {
    return (
      <div className="min-h-[100dvh] bg-indigo-50 flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  if (state.view === 'story' && state.generatedStory) {
    return (
      <div className="fixed inset-0 h-[100dvh] bg-indigo-50 overflow-hidden z-50">
        <StoryViewer 
          story={state.generatedStory} 
          onFinish={() => setState(prev => ({ ...prev, view: 'quiz' }))}
          onBack={() => setState(prev => ({ ...prev, view: 'home' }))}
        />
      </div>
    );
  }

  if (state.view === 'quiz' && state.generatedStory?.quizQuestions) {
    return (
      <div className="min-h-[100dvh] bg-indigo-50 p-4 md:p-8 flex items-center justify-center pb-24 md:pb-8">
        <div className="w-full">
            <div className="mb-8 flex justify-center">
                <button onClick={() => handleNavigation('home')} className="text-indigo-600 font-bold hover:underline flex items-center gap-2">
                   <Home className="w-4 h-4" /> Back to Home
                </button>
            </div>
            <QuizView 
                questions={state.generatedStory.quizQuestions} 
                onComplete={handleQuizComplete} 
            />
        </div>
      </div>
    );
  }

  // MAIN LAYOUT
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-blue-50 to-white font-sans pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-blue-100 shadow-sm safe-pt">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 lg:py-5 flex justify-between items-center gap-3">
          
          {/* LOGO - Circular Badge */}
          <div className="flex items-center cursor-pointer group" onClick={() => handleNavigation('home')}>
             <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full shadow-lg shadow-indigo-200/50 group-hover:scale-110 transition-all duration-300 ring-4 ring-white/50 border border-white/20">
                <span className="font-display font-black text-white text-sm md:text-lg tracking-tight">GK</span>
             </div>
          </div>

          {/* Desktop Navigation Bar */}
          <nav className="hidden md:flex items-center gap-2 bg-gray-100/50 px-2 py-1.5 rounded-full border border-gray-200/50">
             <button onClick={() => handleNavigation('home')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${state.view === 'home' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-indigo-600'}`}>
                <Home className="w-4 h-4" /> <span className="hidden sm:inline">Home</span>
             </button>
             <button onClick={() => handleNavigation('library')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${state.view === 'library' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-indigo-600'}`}>
                <Library className="w-4 h-4" /> <span className="hidden sm:inline">Library</span>
             </button>
              <button onClick={() => handleNavigation('profile')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${state.view === 'profile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-indigo-600'}`}>
                <User className="w-4 h-4" /> <span className="hidden sm:inline">Profile</span>
             </button>
          </nav>

          <div className="flex gap-2 md:gap-3">
             {/* Streak Indicator */}
             <div className="flex items-center gap-1 bg-orange-50 px-2 md:px-3 py-1 rounded-full border border-orange-100" title="Day Streak">
                 <Flame className="w-3 h-3 md:w-4 md:h-4 text-orange-500 fill-orange-500 animate-pulse" />
                 <span className="font-bold text-orange-600 text-xs md:text-sm">{state.userProfile.streakDays}</span>
             </div>

             {/* XP Indicator - Hidden on very small screens */}
             <div className="hidden sm:flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200" title="Knowledge Points">
                 <Zap className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                 <span className="font-bold text-yellow-700 text-sm">{state.userProfile.xp}</span>
             </div>

            {/* Language Dropdown */}
            <div className="relative">
                <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 bg-white border-2 border-orange-100 px-2 md:px-3 py-1.5 md:py-2 rounded-full font-bold text-orange-700 hover:border-orange-300 transition-all shadow-sm hover:shadow-md text-xs md:text-sm"
                >
                <Globe className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">{SUPPORTED_LANGUAGES.find(l => l.id === state.currentLanguage)?.nativeName || state.currentLanguage}</span>
                <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {langDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden py-2 animate-fade-in z-50 h-64 overflow-y-auto">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                        key={lang.id}
                        onClick={() => handleLanguageSelect(lang.id)}
                        className={`w-full text-left px-5 py-3 hover:bg-orange-50 flex items-center justify-between ${state.currentLanguage === lang.id ? 'text-orange-600 font-bold bg-orange-50' : 'text-gray-600'}`}
                    >
                        <div className="flex flex-col">
                            <span>{lang.nativeName}</span>
                            <span className="text-xs text-gray-400 font-normal">{lang.name}</span>
                        </div>
                        {state.currentLanguage === lang.id && <Check className="w-4 h-4" />}
                    </button>
                    ))}
                </div>
                )}
            </div>

            {/* Class Dropdown */}
            <div className="relative">
                <button 
                onClick={() => setClassDropdownOpen(!classDropdownOpen)}
                className="flex items-center gap-2 bg-white border-2 border-indigo-100 px-2 md:px-3 py-1.5 md:py-2 rounded-full font-bold text-indigo-700 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md text-xs md:text-sm"
                >
                <GraduationCap className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden lg:inline">{state.currentClass}</span>
                <span className="lg:hidden">{state.currentClass.replace("Class ", "")}th</span>
                <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${classDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {classDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden py-2 animate-fade-in z-50">
                    {CLASS_LEVELS.map((cls) => (
                    <button
                        key={cls}
                        onClick={() => handleClassSelect(cls)}
                        className={`w-full text-left px-5 py-3 hover:bg-indigo-50 flex items-center justify-between ${state.currentClass === cls ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-600'}`}
                    >
                        {cls}
                        {state.currentClass === cls && <Check className="w-4 h-4" />}
                    </button>
                    ))}
                </div>
                )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex justify-around p-3 safe-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button onClick={() => handleNavigation('home')} className={`flex flex-col items-center gap-1 ${state.view === 'home' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <Home className={`w-6 h-6 ${state.view === 'home' ? 'fill-indigo-100' : ''}`} />
            <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => handleNavigation('library')} className={`flex flex-col items-center gap-1 ${state.view === 'library' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <Library className={`w-6 h-6 ${state.view === 'library' ? 'fill-indigo-100' : ''}`} />
            <span className="text-[10px] font-bold">Library</span>
        </button>
        <button onClick={() => handleNavigation('profile')} className={`flex flex-col items-center gap-1 ${state.view === 'profile' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <User className={`w-6 h-6 ${state.view === 'profile' ? 'fill-indigo-100' : ''}`} />
            <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-12 safe-pl safe-pr">
        
        {state.view === 'library' && (
            <LibraryView 
                stories={state.library} 
                onSelectStory={handleSelectSavedStory} 
                onDeleteStory={handleDeleteStory}
                onHome={() => handleNavigation('home')}
            />
        )}

        {state.view === 'profile' && (
            <ProfileView profile={state.userProfile} />
        )}

        {state.view === 'home' && (
            <>
                <div className="text-center mb-8 md:mb-16 animate-fade-in">
                <h1 className="text-3xl md:text-6xl font-display font-extrabold text-gray-900 mb-4 md:mb-6">
                    What do you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">learn</span> today?
                </h1>
                <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                    Pick a subject, speak your topic, and let Magic AI create a book just for you.
                </p>
                </div>

                {/* Recommendations Section */}
                {recommendedTopics.length > 0 && !state.currentSubject && (
                    <section className="mb-12 animate-fade-in">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            <h2 className="text-xl font-bold text-gray-800">Recommended for You</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {recommendedTopics.map((rec, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => {
                                        setState(prev => ({ 
                                            ...prev, 
                                            currentSubject: rec.subject, 
                                            customTopic: rec.topic 
                                        }));
                                    }}
                                    className="text-left bg-white p-6 rounded-2xl shadow-sm border border-indigo-50 hover:border-indigo-200 hover:shadow-md transition-all group"
                                >
                                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-1">{rec.subject}</div>
                                    <div className="font-display font-bold text-lg text-gray-800 group-hover:text-indigo-600">{rec.topic}</div>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Step 1: Subjects */}
                <section className="mb-12 md:mb-16">
                <h2 className="text-xl md:text-2xl font-display font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md">1</span>
                    Select a Subject
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {filteredSubjects.map((subj) => {
                    const isSelected = state.currentSubject === subj.id;
                    const Icon = subj.icon;
                    return (
                        <button
                        key={subj.id}
                        onClick={() => handleSubjectSelect(subj.id)}
                        className={`
                            p-4 md:p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 md:gap-4 group relative overflow-hidden
                            ${isSelected 
                            ? `${subj.border} ${subj.color} ring-4 ring-offset-2 ring-indigo-100 shadow-xl transform scale-105` 
                            : 'bg-white border-transparent shadow-sm hover:shadow-lg hover:border-gray-200 hover:-translate-y-1'}
                        `}
                        >
                        <div className={`p-3 md:p-4 rounded-2xl ${isSelected ? 'bg-white/60' : 'bg-gray-50 group-hover:bg-indigo-50'} transition-colors`}>
                            <Icon className={`w-6 h-6 md:w-8 md:h-8 ${isSelected ? 'text-current' : 'text-gray-400 group-hover:text-indigo-600'}`} />
                        </div>
                        <span className={`font-bold text-sm md:text-lg text-center leading-tight ${isSelected ? 'text-current' : 'text-gray-600'}`}>{subj.id}</span>
                        
                        {isSelected && (
                            <div className="absolute top-3 right-3 text-current opacity-50">
                                <Check className="w-5 h-5" />
                            </div>
                        )}
                        </button>
                    );
                    })}
                </div>
                </section>

                {/* Step 2: Topic Input */}
                <section className={`transition-all duration-500 transform ${state.currentSubject ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-10 pointer-events-none'}`}>
                <h2 className="text-xl md:text-2xl font-display font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md">2</span>
                    Choose a Topic
                </h2>
                
                <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-xl border border-indigo-50">
                    {/* Suggested Topics Chips */}
                    {state.currentSubject && (
                        <div className="mb-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Suggested for {state.currentSubject}</span>
                                <button onClick={handleSurpriseMe} className="text-sm text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1">
                                    <Dices className="w-4 h-4" /> Surprise Me
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {suggestedTopics.map(topic => (
                                    <button
                                        key={topic}
                                        onClick={() => setState(prev => ({ ...prev, customTopic: topic }))}
                                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all border text-left
                                            ${state.customTopic === topic 
                                                ? 'bg-indigo-100 text-indigo-700 border-indigo-200 ring-2 ring-indigo-200 ring-offset-1' 
                                                : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm'
                                            }`}
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={state.customTopic}
                                onChange={(e) => setState(prev => ({ ...prev, customTopic: e.target.value }))}
                                placeholder={state.currentSubject ? "Type your topic or click mic..." : "First, select a subject above"}
                                disabled={!state.currentSubject}
                                className="w-full px-5 py-3 md:px-6 md:py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-base md:text-lg disabled:bg-gray-50 disabled:text-gray-400"
                            />
                            {state.currentSubject && (
                                <button 
                                    onClick={toggleVoiceInput}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-gray-100 text-gray-400'}`}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleCreateStory}
                            disabled={!state.currentSubject || !state.customTopic.trim() || state.isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 min-w-[200px]"
                        >
                            <Sparkles className="w-5 h-5" />
                            Create Story
                        </button>
                    </div>
                </div>
                </section>
            </>
        )}

      </main>
    </div>
  );
};

export default App;
