
import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { Story, ClassLevel, Subject, Language } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

// Helper to strip Markdown code blocks and handle potential formatting issues
const cleanJson = (text: string): string => {
  let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  // Sometimes models add a preamble, try to find the first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
};

// Define the schema for the story response
const storySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy title (Story style for Classes 1-5, Academic style for 6-10) in the requested language" },
    coverImagePrompt: { type: Type.STRING, description: "A vivid prompt for the book cover illustration. Pixar style for kids, realistic educational style for teens." },
    summary: { type: Type.STRING, description: "A 2-3 sentence summary of the educational concept in the requested language" },
    chapterParts: {
      type: Type.ARRAY,
      description: "A list of 3-5 distinct sub-topics/parts that this chapter is divided into (e.g., 'Introduction', 'Key Principles', 'Applications').",
      items: { type: Type.STRING }
    },
    vocabulary: {
      type: Type.ARRAY,
      description: "List of 3-5 difficult words or technical terms used in the chapter with meanings in the requested language",
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          definition: { type: Type.STRING, description: "Definition in the requested language" }
        },
        required: ["word", "definition"]
      }
    },
    pages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pageNumber: { type: Type.INTEGER },
          partTitle: { type: Type.STRING, description: "The title of the specific chapter part/sub-topic this page covers." },
          text: { type: Type.STRING, description: "The detailed educational content for this page (4-8 sentences). Adapt complexity to Class Level." },
          teacherTip: { type: Type.STRING, description: "A short tip, mnemonic, or fun fact. For Class 9-10, make it a 'Pro Tip' or 'Exam Note'." },
          keyConcepts: { 
            type: Type.ARRAY, 
            description: "List 2-3 specific technical terms or key concepts introduced on this page.",
            items: { type: Type.STRING }
          },
          deepDive: {
             type: Type.STRING,
             description: "An advanced, detailed paragraph. For Class 9-10, include formulas, reactions, dates, or complex analysis."
          },
          imagePrompt: { type: Type.STRING, description: "A detailed visual description. For Class 9-10 Science/Maths, strictly ask for 'Detailed labeled scientific diagram' or 'Clean data chart'." },
          layout: { 
            type: Type.STRING, 
            enum: ['text-left', 'text-right', 'text-top', 'text-bottom', 'full-visual'],
            description: "The layout of the page." 
          },
          visualStyle: { 
            type: Type.STRING, 
            enum: ['illustration', 'chart', 'diagram', 'comic-panel', 'shape'],
            description: "The style of the visual. Use 'chart', 'diagram' or 'shape' heavily for Class 9-10 Science/Maths/Geography." 
          }
        },
        required: ["pageNumber", "partTitle", "text", "teacherTip", "imagePrompt", "layout", "visualStyle"],
      },
    },
    quizQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "Question in the requested language" },
          options: { type: Type.ARRAY, items: { type: Type.STRING, description: "Option in the requested language" } },
          correctAnswerIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING, description: "Detailed explanation in the requested language" }
        },
        required: ["question", "options", "correctAnswerIndex", "explanation"],
      },
    }
  },
  required: ["title", "coverImagePrompt", "summary", "chapterParts", "vocabulary", "pages", "quizQuestions"],
};

export const generateStoryContent = async (
  classLevel: ClassLevel,
  subject: Subject,
  topic: string,
  language: Language
): Promise<Story> => {
  if (!apiKey) throw new Error("API Key not found");

  const isHighSchool = classLevel === ClassLevel.Class9 || classLevel === ClassLevel.Class10;
  
  const persona = isHighSchool 
    ? "You are an expert CBSE/NCERT Academic Tutor for Class 9 and 10 in India. Your goal is to help students score high marks in board exams. You explain topics with precision, using 'Points to Remember', formal definitions, chemical equations (for Chemistry), derivations (for Physics), and map references (for Geography). Tone: Academic, Encouraging, Precise."
    : "You are a friendly Indian School Teacher (like a teacher from a Kendriya Vidyalaya). You teach young students (Class 1-8) using storytelling, Indian cultural examples (e.g., Diwali, Peepal Tree, Cricket), and simple analogies. Tone: Warm, Storytelling, Fun.";

  const contentGuidance = isHighSchool
    ? `
      Content Requirements for High School (Class 9-10):
      1. Strictly follow NCERT syllabus depth.
      2. 'deepDive' section MUST contain: Important Definitions, Chemical Reactions (if Chem), Formulas (if Physics/Maths), or Dates/Events (if History).
      3. 'teacherTip' should be an 'Exam Tip' or 'Common Mistake' to avoid.
      4. Visuals: Ask for labeled diagrams (e.g., 'Diagram of Human Heart', 'Ray Diagram of Concave Mirror') or statistical charts.
      `
    : `
      Content Requirements for Primary/Middle (Class 1-8):
      1. Explain concepts using a narrative or a dialogue between characters (e.g., Rohan and his Grandmother).
      2. Use Indian names and context (e.g., "counting mangoes", "monsoon season").
      3. 'teacherTip' should be a fun fact or a memory aid.
      4. Visuals: Bright, colorful, engaging illustrations.
      `;

  const prompt = `
    ${persona}
    Create a comprehensive educational module for an Indian student in ${classLevel} studying ${subject}.
    The topic is: "${topic}".
    The Output Language must be: ${language}.
    
    ${contentGuidance}
    
    Structure Guidelines:
    1. Divide the topic into 4-6 parts (sub-topics) in 'chapterParts'.
    2. Generate 6-10 pages total.
    3. Include 'keyConcepts' (specific terms) for every page.
    4. Pedagogy:
       - If Subject is Maths/Physics/Chemistry/Biology/Geography: heavily favor 'diagram', 'chart', or 'shape' in 'visualStyle'.
       - If Subject is History/English/Hindi: use 'illustration' or 'comic-panel'.
    
    Return JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: storySchema,
        temperature: isHighSchool ? 0.3 : 0.7, // Lower temperature for high school to be more factual
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean and parse
    const cleanText = cleanJson(text);
    const storyData = JSON.parse(cleanText) as Story;
    storyData.language = language;
    return storyData;

  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
};

export const generateIllustration = async (prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { text: prompt + " high quality, 4k. If diagram/chart: clean lines, white background, textbook style, legible. If illustration: detailed, vibrant." }
        ]
      },
      // Removed responseMimeType as it is not supported for gemini-2.5-flash-image
    });
    
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating illustration:", error);
    return "https://placehold.co/600x400/e2e8f0/475569?text=Image+Generation+Failed";
  }
};

export const generateExplanation = async (text: string, language: Language): Promise<string> => {
    if (!apiKey) throw new Error("API Key not found");

    const prompt = `
      You are a helpful Indian school tutor. 
      Read the following educational text and explain the core concept simply.
      
      Target Language: ${language}
      Text: "${text}"
      
      Keep it short (max 2 sentences).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "I couldn't explain that right now.";
    } catch (e) {
        console.error("Explanation failed", e);
        return "Let's continue reading to find out more!";
    }
};

export const askQuestion = async (context: string, question: string, language: Language): Promise<string> => {
    if (!apiKey) throw new Error("API Key not found");

    const prompt = `
      You are a smart private tutor for a student in India.
      Context: "${context}"
      Student Question: "${question}"
      
      Answer accurately and encouragingly in ${language}.
      If the question is about Science/Maths, give a precise answer.
      Keep the answer under 60 words.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "That's a good question! I'm thinking...";
    } catch (e) {
        console.error("Question answering failed", e);
        return "I'm having a little trouble thinking right now. Ask me again?";
    }
};

export const generateSpeech = async (text: string, voiceName: string = 'Puck'): Promise<Uint8Array | null> => {
    if (!apiKey) throw new Error("API Key not found");

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return null;

        return decode(base64Audio);

    } catch (error) {
        console.error("TTS generation failed", error);
        return null;
    }
};

// --- Audio Helpers ---

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
