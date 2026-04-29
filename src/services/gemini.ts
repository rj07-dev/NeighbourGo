import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeRequest(title: string, description: string) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this community support request:
    Title: ${title}
    Description: ${description}
    
    Tasks:
    1. Moderate: Check if it's safe (no hate speech, scams, or illegal requests).
    2. Classify: Select best category from: food, transport, tutoring, translation, eldercare, housing, other.
    3. Urgency: Determine urgency: low, medium, high, critical.
    4. Optimize: Rewrite into a respectful, clear, and dignified summary for public viewing.
    5. Tag: Extract 2-4 relevant short tags.
    6. Detect: Identify the primary language.
    
    Return the analysis in a structured format.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            urgency: { type: Type.STRING },
            isSafe: { type: Type.BOOLEAN },
            optimizedText: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            detectedLanguage: { type: Type.STRING }
          },
          required: ['category', 'urgency', 'isSafe', 'optimizedText', 'tags', 'detectedLanguage']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to process request with AI. Please try again later.");
  }
}

export async function explainMatch(requestTitle: string, requestDesc: string, volunteerName: string, volunteerSkills: string[]) {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Explain why this volunteer matches this community request.
    Volunteer: ${volunteerName} (Skills: ${volunteerSkills.join(', ')})
    Request: ${requestTitle} (${requestDesc})
    
    Keep the explanation warm, encouraging, and under 3 sentences.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Match Explanation Error:", error);
    return "This volunteer has the matching skills needed for your request.";
  }
}

export async function chatAssistant(message: string, history: { role: string, content: string }[], stats: { requests: number, volunteers: number }) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are the NeighbourGo AI Assistant. 
    You help people in the community find resources, understand how to help, 
    and answer questions about using the app.
    Be kind, professional, and community-focused.
    
    Current community status:
    - Active Requests: ${stats.requests}
    - Registered Volunteers: ${stats.volunteers}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw new Error("Assistant is currently resting. Please try again in a moment.");
  }
}
