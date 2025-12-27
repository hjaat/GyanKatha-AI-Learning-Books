
import React, { useState, useEffect, useRef } from 'react';
import { Story, StoryPage, ClassLevel } from '../types';
import { generateIllustration, generateSpeech, generateExplanation, askQuestion } from '../services/geminiService';
import { ArrowRight, RefreshCw, Volume2, Lightbulb, Book, Home, HelpCircle, Play, Pause, BrainCircuit, List, VolumeX, Mic, MicOff, ZoomIn, X, Settings2 } from 'lucide-react';

interface StoryViewerProps {
  story: Story;
  onFinish: () => void;
  onBack: () => void;
}

const VOICE_OPTIONS = [
  { id: 'Puck', name: 'Playful', desc: 'Stories' },
  { id: 'Kore', name: 'Calm', desc: 'Teacher' },
  { id: 'Fenrir', name: 'Deep', desc: 'Narrator' },
  { id: 'Zephyr', name: 'Gentle', desc: 'Soft' },
];

const playSound = (type: 'correct' | 'wrong' | 'flip', ctx: AudioContext) => {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'flip') {
        const bufferSize = ctx.sampleRate * 0.1; 
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.1, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start();
    }
};

const renderQuickShape = (prompt: string) => {
  const p = prompt.toLowerCase();
  const strokeClass = "stroke-indigo-600";
  const fillClass = "fill-indigo-50";
  const hoverClass = "hover:fill-indigo-200 transition-colors duration-300 cursor-pointer";

  if (p.includes('triangle')) {
    return (
      <svg viewBox="0 0 100 100" className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 animate-fade-in group">
        <polygon points="50,15 90,85 10,85" className={`${strokeClass} ${fillClass} ${hoverClass}`} strokeWidth="3" />
        <text x="50" y="10" textAnchor="middle" className="text-xs md:text-sm fill-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Vertex</text>
        <text x="50" y="95" textAnchor="middle" className="text-xs md:text-sm fill-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Base</text>
      </svg>
    );
  }
  if (p.includes('square')) {
    return (
      <svg viewBox="0 0 100 100" className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 animate-fade-in group">
        <rect x="15" y="15" width="70" height="70" className={`${strokeClass} ${fillClass} ${hoverClass}`} strokeWidth="3" />
        <text x="10" y="50" textAnchor="middle" className="text-xs md:text-sm fill-gray-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Side</text>
      </svg>
    );
  }
  if (p.includes('rectangle')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-64 md:h-80 lg:h-96 animate-fade-in group">
        <rect x="10" y="25" width="80" height="50" className={`${strokeClass} ${fillClass} ${hoverClass}`} strokeWidth="3" />
      </svg>
    );
  }
  if (p.includes('circle')) {
    return (
      <svg viewBox="0 0 100 100" className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 animate-fade-in group">
        <circle cx="50" cy="50" r="35" className={`${strokeClass} ${fillClass} ${hoverClass}`} strokeWidth="3" />
        <line x1="50" y1="50" x2="85" y2="50" className="stroke-red-400" strokeWidth="2" />
        <text x="68" y="45" textAnchor="middle" className="text-xs md:text-sm fill-red-500 font-bold">Radius</text>
      </svg>
    );
  }
  return null;
}

async function createAudioBufferFromPCM(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number = 24000,
    numChannels: number = 1
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ story, onFinish, onBack }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(-1);
  const [pages, setPages] = useState<StoryPage[]>(story.pages);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isVocabOpen, setIsVocabOpen] = useState(false);
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
  const [autoPlay, setAutoPlay] = useState(false);
  const [showDeepDive, setShowDeepDive] = useState(false);
  
  const isHighSchool = story.classLevel === ClassLevel.Class9 || story.classLevel === ClassLevel.Class10;
  const [selectedVoice, setSelectedVoice] = useState(isHighSchool ? 'Kore' : 'Puck');
  const [voiceDropdownOpen, setVoiceDropdownOpen] = useState(false);
  
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionInput, setQuestionInput] = useState("");
  const [questionAnswer, setQuestionAnswer] = useState<string | null>(null);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [isSpeakingAnswer, setIsSpeakingAnswer] = useState(false);
  const [isListeningToQuestion, setIsListeningToQuestion] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [explaining, setExplaining] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isPlayingRef = useRef(false);
  const audioCache = useRef<Record<string, AudioBuffer>>({});
  const fetchingAudio = useRef<Record<string, boolean>>({});

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    return () => { if (audioContextRef.current) audioContextRef.current.close(); };
  }, []);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { audioCache.current = {}; }, [selectedVoice]);

  const stopAudio = () => {
      if (audioSourceRef.current) {
          try { audioSourceRef.current.stop(); } catch (e) { }
          audioSourceRef.current = null;
      }
      setIsPlaying(false);
      setExplaining(false);
      setIsSpeakingAnswer(false);
  };

  const playBuffer = async (buffer: AudioBuffer, onEnded?: () => void) => {
      stopAudio();
      if (!audioContextRef.current) return;
      if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
          setIsPlaying(false);
          setExplaining(false);
          setIsSpeakingAnswer(false);
          if (onEnded) onEnded();
      };
      audioSourceRef.current = source;
      source.start(0);
      setIsPlaying(true);
  };

  useEffect(() => {
    const loadCover = async () => {
      if (coverImage) return;
      try {
        const img = await generateIllustration(story.coverImagePrompt);
        setCoverImage(img);
      } catch (e) { console.error(e); }
    };
    loadCover();
  }, [story.coverImagePrompt, coverImage]);

  useEffect(() => {
    const loadPageImage = async (index: number) => {
      if (index < 0 || index >= pages.length || pages[index].imageData || loadingImages[index]) return;
      if (pages[index].visualStyle === 'shape' && renderQuickShape(pages[index].imagePrompt)) return;
      setLoadingImages(prev => ({ ...prev, [index]: true }));
      try {
        const image = await generateIllustration(pages[index].imagePrompt);
        setPages(prev => prev.map((p, idx) => idx === index ? { ...p, imageData: image } : p));
      } catch (e) { console.error(e); } finally { setLoadingImages(prev => ({ ...prev, [index]: false })); }
    };

    const loadAudioForPage = async (index: number) => {
        const cacheKey = `${index}-${selectedVoice}`;
        if (audioCache.current[cacheKey] || fetchingAudio.current[cacheKey]) return;
        let text = index === -1 ? `${story.title}. ${story.summary}` : pages[index]?.text;
        if (!text) return;
        fetchingAudio.current[cacheKey] = true;
        try {
            if (!audioContextRef.current) return;
            const pcmData = await generateSpeech(text, selectedVoice);
            if (pcmData) {
                const buffer = await createAudioBufferFromPCM(pcmData, audioContextRef.current);
                audioCache.current[cacheKey] = buffer;
            }
        } catch (e) { console.error(e); } finally { fetchingAudio.current[cacheKey] = false; }
    };

    const indexes = [currentPageIndex, currentPageIndex + 1, currentPageIndex + 2].filter(i => i >= -1 && i < pages.length);
    indexes.forEach(idx => {
        if (idx >= 0) loadPageImage(idx);
        loadAudioForPage(idx);
    });
  }, [currentPageIndex, pages, loadingImages, selectedVoice]);

  useEffect(() => {
      stopAudio();
      setShowDeepDive(false);
      if (audioContextRef.current) playSound('flip', audioContextRef.current);
  }, [currentPageIndex]);

  useEffect(() => {
    if (autoPlay) {
       const timer = setTimeout(() => { if (!isPlayingRef.current) handleSpeak(); }, 800);
       return () => clearTimeout(timer);
    }
  }, [currentPageIndex]);

  const handleNext = () => currentPageIndex < pages.length - 1 ? setCurrentPageIndex(prev => prev + 1) : (stopAudio(), onFinish());
  const handlePrev = () => currentPageIndex > -1 && setCurrentPageIndex(prev => prev - 1);

  const handleSpeak = async () => {
    if (isPlayingRef.current && !explaining && !isSpeakingAnswer) { stopAudio(); return; }
    setIsAudioLoading(true);
    const cacheKey = `${currentPageIndex}-${selectedVoice}`;
    if (audioCache.current[cacheKey]) {
        setIsAudioLoading(false);
        playBuffer(audioCache.current[cacheKey]);
        return;
    }
    const text = currentPageIndex === -1 ? `${story.title}. ${story.summary}` : pages[currentPageIndex].text;
    try {
        const pcm = await generateSpeech(text, selectedVoice);
        if (pcm && audioContextRef.current) {
            const buffer = await createAudioBufferFromPCM(pcm, audioContextRef.current);
            audioCache.current[cacheKey] = buffer;
            setIsAudioLoading(false);
            playBuffer(buffer);
        } else { setIsAudioLoading(false); }
    } catch (e) { console.error(e); setIsAudioLoading(false); }
  };

  const handleExplain = async () => {
      if (isPlayingRef.current && explaining) { stopAudio(); return; }
      setIsAudioLoading(true);
      setExplaining(true);
      const text = currentPageIndex === -1 ? story.summary : pages[currentPageIndex].text;
      try {
          const expText = await generateExplanation(text, story.language);
          const pcm = await generateSpeech(expText, 'Kore');
          if (pcm && audioContextRef.current) {
              const buffer = await createAudioBufferFromPCM(pcm, audioContextRef.current);
              playBuffer(buffer);
          } else { setExplaining(false); }
      } catch (e) { setExplaining(false); } finally { setIsAudioLoading(false); }
  };

  const handleAskQuestion = async () => {
    if (!questionInput.trim()) return;
    setIsAskingQuestion(true);
    const context = currentPageIndex === -1 ? story.summary : pages[currentPageIndex].text;
    try {
        const ans = await askQuestion(context, questionInput, story.language);
        setQuestionAnswer(ans);
    } catch (e) { setQuestionAnswer("Error connecting to AI Teacher."); } finally { setIsAskingQuestion(false); }
  };

  const handleSpeakAnswer = async () => {
      if (isPlayingRef.current && isSpeakingAnswer) { stopAudio(); return; }
      if (!questionAnswer) return;
      setIsSpeakingAnswer(true);
      const pcm = await generateSpeech(questionAnswer, 'Kore');
      if (pcm && audioContextRef.current) {
          const buffer = await createAudioBufferFromPCM(pcm, audioContextRef.current);
          playBuffer(buffer);
      } else { setIsSpeakingAnswer(false); }
  };

  const toggleQuestionVoice = () => {
      if (!('webkitSpeechRecognition' in window)) { alert("Mic not supported."); return; }
      if (isListeningToQuestion) { setIsListeningToQuestion(false); return; }
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListeningToQuestion(true);
      recognition.onend = () => setIsListeningToQuestion(false);
      recognition.onresult = (e: any) => setQuestionInput(e.results[0][0].transcript);
      recognition.start();
  };

  const openQuestionModal = () => { setIsQuestionModalOpen(true); setQuestionInput(""); setQuestionAnswer(null); };

  const renderVisual = (page: StoryPage) => {
    const isChart = page.visualStyle === 'chart' || page.visualStyle === 'diagram' || page.visualStyle === 'shape';
    const quickShape = page.visualStyle === 'shape' ? renderQuickShape(page.imagePrompt) : null;
    if (quickShape) return <div className="w-full h-full flex items-center justify-center bg-white p-6 chart-paper animate-fade-in border-4 border-indigo-50 rounded-lg">{quickShape}</div>;
    return (
      <div className={`relative w-full h-full flex items-center justify-center overflow-hidden min-h-[300px] lg:min-h-0 ${isChart ? 'bg-white p-4 chart-paper' : 'bg-gray-100'}`}>
         {page.imageData ? <img src={page.imageData} alt={page.imagePrompt} className={isChart ? 'object-contain' : 'object-cover w-full h-full'} /> : <div className="flex flex-col items-center justify-center p-8 text-gray-400"><RefreshCw className="w-10 h-10 animate-spin mb-4 text-indigo-400" /><p className="text-sm">Preparing visual...</p></div>}
      </div>
    );
  };

  const renderContent = (page: StoryPage) => (
    <div className="h-full flex flex-col justify-center relative z-10 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-24 lg:pb-0">
            <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-indigo-100 pb-2 justify-between">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> {page.partTitle || "Page"}
                </div>
                {page.deepDive && <button onClick={() => setShowDeepDive(true)} className="flex items-center gap-1 text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md hover:bg-indigo-200 transition-colors"><ZoomIn className="w-3 h-3" /> Deep Dive</button>}
            </div>
            <p className="text-lg md:text-xl text-gray-800 leading-loose font-medium mb-6">{page.text}</p>
            {page.keyConcepts?.map((c, i) => <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold px-2 py-1 rounded-md mr-2">{c}</span>)}
            {page.teacherTip && <div className="bg-yellow-100 p-4 rounded-xl border-l-4 border-yellow-400 shadow-sm mt-4 italic text-yellow-900 text-sm"><strong>Tip:</strong> {page.teacherTip}</div>}
        </div>
        <div className="pt-4 mt-auto">
            <button onClick={handleSpeak} disabled={isAudioLoading} className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold border-2 transition-all ${isPlaying && !explaining && !isSpeakingAnswer ? 'bg-indigo-100 text-indigo-600 border-indigo-200 animate-pulse' : 'bg-white text-gray-800 border-gray-200 hover:border-indigo-300'}`}>{isAudioLoading && !explaining ? <RefreshCw className="w-5 h-5 animate-spin"/> : isPlaying && !explaining && !isSpeakingAnswer ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />} {isPlaying && !explaining && !isSpeakingAnswer ? 'Reading...' : 'Read Aloud'}</button>
        </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col max-w-[1600px] mx-auto p-2 md:p-6 lg:p-8 relative">
      <div className="flex justify-between items-center mb-4 flex-shrink-0 gap-2">
        <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => { stopAudio(); onBack(); }} className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full shadow-sm border border-indigo-100 transition-all text-xs md:text-sm">
              <Home className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">Home</span>
            </button>
            <div className="relative">
                <button onClick={() => setVoiceDropdownOpen(!voiceDropdownOpen)} className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-white text-gray-700 rounded-full font-bold border border-gray-200 shadow-sm text-xs md:text-sm">
                    <Settings2 className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">{VOICE_OPTIONS.find(v => v.id === selectedVoice)?.name}</span>
                </button>
                {voiceDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                        {VOICE_OPTIONS.map(v => (
                            <button key={v.id} onClick={() => { setSelectedVoice(v.id); setVoiceDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 flex items-center justify-between ${selectedVoice === v.id ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-600'}`}><span>{v.name}</span> <span className="text-[10px] text-gray-400">{v.desc}</span></button>
                        ))}
                    </div>
                )}
            </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 flex-1 md:flex-none justify-end">
             <button onClick={() => setAutoPlay(!autoPlay)} className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full font-bold border transition-all shadow-sm whitespace-nowrap text-xs md:text-sm ${autoPlay ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-200'}`}>{autoPlay ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} <span className="hidden md:inline">Auto Read</span></button>
             <button onClick={handleExplain} disabled={isAudioLoading} className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full font-bold border transition-all shadow-sm whitespace-nowrap text-xs md:text-sm ${isPlaying && explaining ? 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse' : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'}`}>{isAudioLoading && explaining ? <RefreshCw className="w-4 h-4 animate-spin"/> : <BrainCircuit className="w-4 h-4" />} <span className="hidden md:inline">{isPlaying && explaining ? 'Explaining...' : 'AI Teacher'}</span></button>
             <button onClick={openQuestionModal} className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap text-xs md:text-sm"><HelpCircle className="w-4 h-4" /> <span className="hidden md:inline">Ask Doubt</span></button>
             <button onClick={() => setIsVocabOpen(!isVocabOpen)} className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-white text-indigo-600 rounded-full font-bold border border-indigo-200 shadow-sm whitespace-nowrap text-xs md:text-sm"><Book className="w-4 h-4" /> <span className="hidden md:inline">Vocab</span></button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className={`relative w-full h-full md:aspect-[1.4/1] md:max-h-[85vh] md:max-w-6xl transition-all shadow-2xl rounded-r-2xl rounded-l-md overflow-hidden border-r-8 border-b-8 border-gray-200 flex ${currentPageIndex === -1 ? 'bg-indigo-900' : 'bg-[#fffbf0]'}`}>
            {/* Visual Spine & Shadow */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-gray-900 to-gray-700 z-30 rounded-l-md"></div>
            {currentPageIndex !== -1 && (
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/10 z-30 shadow-[0_0_15px_rgba(0,0,0,0.1)] hidden lg:block"></div>
            )}

            {currentPageIndex === -1 ? (
                <div className="w-full h-full relative overflow-hidden bg-gray-900">
                     {coverImage ? <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-60" /> : <div className="absolute inset-0 flex items-center justify-center bg-indigo-900"><RefreshCw className="w-12 h-12 animate-spin text-white opacity-50" /></div>}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30"></div>
                     <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-8 md:p-12 lg:p-20 overflow-y-auto">
                        <div className="inline-block px-4 py-1 bg-yellow-400 text-yellow-900 text-xs md:text-sm font-bold rounded-full mb-6 uppercase tracking-wider shadow-lg">Interactive AI Story</div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold leading-tight mb-6 text-white drop-shadow-lg max-w-5xl">{story.title}</h1>
                        <p className="text-lg md:text-2xl text-indigo-100 mb-10 font-light italic max-w-3xl leading-relaxed">"{story.summary}"</p>
                        <button onClick={handleNext} className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 px-8 py-4 md:px-12 md:py-6 rounded-full font-bold text-xl md:text-2xl transition-all shadow-xl flex items-center gap-3 active:scale-95">Start Reading <ArrowRight className="w-6 h-6 md:w-8 md:h-8" /></button>
                     </div>
                </div>
            ) : (
                story.pages[currentPageIndex] && (
                    <div className="w-full h-full flex flex-col lg:flex-row relative">
                        {(!story.pages[currentPageIndex].layout || story.pages[currentPageIndex].layout === 'text-right' || story.pages[currentPageIndex].layout === 'text-left') && (
                             <>
                                <div className={`lg:w-1/2 h-[45%] lg:h-full ${story.pages[currentPageIndex].layout === 'text-left' ? 'order-2 lg:order-2 border-l' : 'order-1 lg:order-1 border-r'} border-gray-200`}>{renderVisual(story.pages[currentPageIndex])}</div>
                                <div className={`lg:w-1/2 p-6 md:p-10 lg:p-14 flex flex-col justify-center h-full ${story.pages[currentPageIndex].layout === 'text-left' ? 'order-1 lg:order-1' : 'order-2 lg:order-2'}`}>{renderContent(story.pages[currentPageIndex])}</div>
                             </>
                        )}
                        {(story.pages[currentPageIndex].layout === 'text-top' || story.pages[currentPageIndex].layout === 'text-bottom') && (
                            <div className="flex flex-col w-full h-full">
                                <div className={`p-6 md:p-10 lg:p-12 flex-1 flex flex-col justify-center min-h-0 ${story.pages[currentPageIndex].layout === 'text-top' ? 'order-1' : 'order-2'}`}>{renderContent(story.pages[currentPageIndex])}</div>
                                <div className={`h-[40%] md:h-[45%] border-gray-200 relative flex-shrink-0 ${story.pages[currentPageIndex].layout === 'text-top' ? 'order-2 border-t' : 'order-1 border-b'}`}>{renderVisual(story.pages[currentPageIndex])}</div>
                            </div>
                        )}
                        {story.pages[currentPageIndex].layout === 'full-visual' && (
                             <div className="w-full h-full relative">
                                {renderVisual(story.pages[currentPageIndex])}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 md:p-12 text-white max-h-[60%] overflow-y-auto pb-24 lg:pb-12">
                                    <div className="text-yellow-400 font-bold uppercase tracking-widest text-xs mb-2">{story.pages[currentPageIndex].partTitle}</div>
                                    <p className="text-xl md:text-2xl leading-loose font-medium drop-shadow-md">{story.pages[currentPageIndex].text}</p>
                                    <div className="mt-6 flex gap-4"><button onClick={handleSpeak} className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full backdrop-blur-sm transition-all">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />} Read</button><button onClick={handleExplain} className="bg-amber-500/80 hover:bg-amber-500 px-6 py-3 rounded-full text-white font-bold backdrop-blur-sm transition-all"><BrainCircuit className="w-5 h-5" /> Explain</button></div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            )}
            
            {showDeepDive && story.pages[currentPageIndex]?.deepDive && <div className="absolute inset-0 bg-indigo-900/95 z-40 flex items-center justify-center p-8 backdrop-blur-sm"><div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl border-4 border-indigo-200 overflow-y-auto max-h-[90vh]"><button onClick={() => setShowDeepDive(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button><div className="flex items-center gap-3 mb-6"><div className="bg-indigo-100 p-3 rounded-full text-indigo-600"><ZoomIn className="w-8 h-8" /></div><div><h3 className="text-2xl font-display font-bold text-gray-900">Deep Dive</h3><p className="text-indigo-600 font-bold text-sm uppercase">Advanced Knowledge</p></div></div><p className="text-gray-700 leading-relaxed text-lg">{story.pages[currentPageIndex].deepDive}</p><div className="mt-8 flex justify-end"><button onClick={() => setShowDeepDive(false)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">Got it!</button></div></div></div>}
            {isVocabOpen && <div className="absolute right-0 top-0 bottom-0 w-80 lg:w-96 bg-white shadow-2xl z-30 p-6 lg:p-8 overflow-y-auto border-l border-gray-100 animate-slide-in-right"><div className="flex justify-between items-center mb-6"><h3 className="font-display font-bold text-xl text-gray-800">Vocabulary</h3><button onClick={() => setIsVocabOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button></div><div className="space-y-4">{story.vocabulary.map((v, i) => <div key={i} className="bg-amber-50 p-4 rounded-xl border border-amber-100"><h4 className="font-bold text-amber-800 mb-1">{v.word}</h4><p className="text-sm text-amber-900 leading-relaxed">{v.definition}</p></div>)}</div></div>}
            {isQuestionModalOpen && <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 lg:p-8 relative"><button onClick={() => setIsQuestionModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400"><X className="w-5 h-5" /></button><h3 className="text-2xl font-display font-bold text-indigo-900 mb-2">Ask Doubt</h3><p className="text-gray-500 mb-6 text-sm">Ask your AI Teacher anything about this page.</p>{!questionAnswer ? <div className="flex gap-2 relative"><input type="text" value={questionInput} onChange={e => setQuestionInput(e.target.value)} placeholder="Type your question..." className="flex-1 border border-gray-300 rounded-xl px-4 py-3 pr-10 outline-none text-lg" onKeyDown={e => e.key === 'Enter' && handleAskQuestion()} /><button onClick={toggleQuestionVoice} className={`absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-full ${isListeningToQuestion ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400'}`}>{isListeningToQuestion ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}</button><button onClick={handleAskQuestion} disabled={isAskingQuestion || !questionInput.trim()} className="bg-indigo-600 text-white p-3 rounded-xl">{isAskingQuestion ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}</button></div> : <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100"><p className="text-indigo-900 font-medium leading-relaxed mb-4 text-lg">{questionAnswer}</p><div className="flex justify-between"><button onClick={handleSpeakAnswer} className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">{isPlaying && isSpeakingAnswer ? <Pause className="w-4 h-4"/> : <Volume2 className="w-4 h-4"/>} Listen</button><button onClick={() => { setQuestionAnswer(null); setQuestionInput(""); }} className="text-gray-400 text-sm font-bold">Ask Another</button></div></div>}</div></div>}
            
            {/* Page Navigation Overlay Buttons */}
            <div className="absolute bottom-6 left-6 z-20"><button onClick={handlePrev} disabled={currentPageIndex === -1} className="bg-white/80 hover:bg-white text-gray-800 p-3 lg:p-5 rounded-full shadow-lg backdrop-blur-sm disabled:opacity-0 border border-gray-200 hover:scale-110 active:scale-95 transition-all"><ArrowRight className="w-6 h-6 lg:w-8 lg:h-8 rotate-180" /></button></div>
            <div className="absolute bottom-6 right-6 z-20"><button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 lg:p-5 rounded-full shadow-lg shadow-indigo-200 transition-all transform hover:scale-110 active:scale-95"><ArrowRight className="w-6 h-6 lg:w-8 lg:h-8" /></button></div>
          </div>
      </div>
    </div>
  );
};
