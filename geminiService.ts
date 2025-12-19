
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Fix: Strictly follow initialization guidelines by using process.env.API_KEY directly without fallback
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const askTutor = async (question: string, context?: string): Promise<string> => {
  const ai = getAI();
  const prompt = `
    You are an expert educational tutor on the Learner Choice platform. 
    Your goal is to help students learn complex concepts simply.
    ${context ? `Context: ${context}` : ''}
    
    Student Question: ${question}
    
    Response format: Use Markdown. Be encouraging. 
    If the question is about how to earn, explain that completing modules and quizzes earns "Learning Reward Points" which convert to real currency.
  `;

  try {
    // Fix: ai.models.generateContent with model and contents properties is the correct way to query
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Fix: Access the .text property directly instead of calling a method or deep nested paths
    return response.text || "I'm sorry, I couldn't process that. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Technical error. Ensure your API key is valid.";
  }
};

export const summarizeBookChapter = async (chapterTitle: string, content: string): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Summarize the following book chapter titled "${chapterTitle}" for a student.
    Break it down into:
    1. The Core Concept (1 sentence)
    2. 3 Key Takeaways
    3. A "Why this matters" section.
    
    Content: ${content.substring(0, 2000)}...
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Fix: Use response.text property
    return response.text || "Summary unavailable.";
  } catch (error) {
    return "Failed to generate summary.";
  }
};

export const getClassDiscussionPrompt = async (classTitle: string): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Generate a thought-provoking discussion prompt for a live class titled "${classTitle}".
    Include:
    1. A provocative opening question.
    2. Three talking points to guide the conversation.
    3. An "Icebreaker" activity related to the topic.
    
    Keep it engaging and professional. Format with Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Fix: Use response.text property
    return response.text || "No prompt available.";
  } catch (error) {
    return "Failed to generate discussion prompt.";
  }
};

export const getDeepDive = async (topic: string, courseTitle: string): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Provide a detailed, expert-level explanation of the topic "${topic}" within the context of the course "${courseTitle}".
    Break it down into:
    1. The "Big Idea" (Simplified)
    2. Technical Deep Dive (Advanced details)
    3. Practical Real-world Example
    4. A 'Brain Teaser' question to test understanding.
    
    Use clear Markdown formatting with bold headers and lists.
  `;

  try {
    // Fix: Use gemini-3-pro-preview for complex reasoning tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // Fix: Use response.text property
    return response.text || "Could not generate deep dive.";
  } catch (error) {
    return "Failed to connect to the educational server.";
  }
};

export const generateCourseOutline = async (topic: string): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Act as a Master Curriculum Designer. Create a 5-module course outline for the topic: ${topic}.
    For each module, include:
    - Title
    - 3 Lesson Topics
    - Specific learning outcomes
    - Estimated time to complete
    - Reward potential (in LP and USD)
    
    Format as clean Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // Fix: Use response.text property
    return response.text || "Failed to generate course outline.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate content at this time.";
  }
};
