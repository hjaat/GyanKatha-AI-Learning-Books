
export enum ClassLevel {
  Class1 = "Class 1",
  Class2 = "Class 2",
  Class3 = "Class 3",
  Class4 = "Class 4",
  Class5 = "Class 5",
  Class6 = "Class 6",
  Class7 = "Class 7",
  Class8 = "Class 8",
  Class9 = "Class 9",
  Class10 = "Class 10",
}

export enum Subject {
  Science = "Science",
  Maths = "Maths",
  SocialStudies = "Social Studies",
  English = "English",
  Hindi = "Hindi",
  EVS = "EVS",
  History = "History",
  Geography = "Geography",
  Physics = "Physics",
  Chemistry = "Chemistry",
  Biology = "Biology",
  Economics = "Economics",
  PoliticalScience = "Political Science",
  ComputerScience = "Computer Science"
}

export enum Language {
  English = "English",
  Hindi = "Hindi",
  Marathi = "Marathi",
  Bengali = "Bengali",
  Tamil = "Tamil",
  Telugu = "Telugu",
  Gujarati = "Gujarati",
  Kannada = "Kannada",
  Malayalam = "Malayalam",
  Punjabi = "Punjabi"
}

export type PageLayout = 'text-left' | 'text-right' | 'text-top' | 'text-bottom' | 'full-visual';
export type VisualStyle = 'illustration' | 'chart' | 'diagram' | 'comic-panel' | 'shape';

export interface StoryPage {
  pageNumber: number;
  partTitle: string; 
  text: string;
  imagePrompt: string;
  layout: PageLayout;
  visualStyle: VisualStyle;
  teacherTip?: string;
  keyConcepts?: string[]; // New: List of specific terms on this page
  deepDive?: string;      // New: Detailed paragraph for advanced learners
  imageData?: string;
}

export interface VocabularyItem {
  word: string;
  definition: string;
}

export interface Story {
  id: string; // Unique ID for storage
  createdAt: number; // Timestamp
  title: string;
  subject: Subject; // Track subject
  classLevel: ClassLevel; // Track class
  language: Language;
  coverImagePrompt: string;
  summary: string;
  chapterParts: string[];
  vocabulary: VocabularyItem[];
  pages: StoryPage[];
  quizQuestions?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface UserProfile {
  name: string;
  xp: number;
  level: number;
  storiesRead: number;
  quizzesTaken: number;
  perfectScores: number;
  streakDays: number;
  lastLoginDate: string;
}

export interface AppState {
  currentClass: ClassLevel;
  currentSubject: Subject | null;
  currentLanguage: Language;
  customTopic: string;
  generatedStory: Story | null;
  isLoading: boolean;
  view: 'home' | 'story' | 'quiz' | 'library' | 'profile';
  userProfile: UserProfile;
  library: Story[];
}
