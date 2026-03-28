import { GoogleGenAI, Type } from "@google/genai";
import { Athlete, Evaluation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeAthletePerformance = async (athlete: Athlete, evaluations: Evaluation[]) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  const athleteEvaluations = evaluations.filter(e => e.athleteId === athlete.id);
  
  const prompt = `
    Analyze the performance of the following athlete:
    Name: ${athlete.name}
    Age: ${athlete.birthDate}
    Gender: ${athlete.gender}
    Weight: ${athlete.weight}kg
    Current Status: ${athlete.status}
    
    Recent Evaluations:
    ${athleteEvaluations.map(e => `
      Date: ${e.date}
      Final Grade: ${e.finalGrade}
      Status: ${e.status}
      Exercises: ${e.exercises.map(ex => `${ex.exerciseName}: ${ex.reps} reps, ${ex.load}kg, Score: ${ex.score}`).join(', ')}
    `).join('\n')}
    
    Please provide:
    1. A summary of their current physical state.
    2. Key strengths identified from the evaluations.
    3. Areas for improvement.
    4. Specific training recommendations for the next 4 weeks.
    
    Keep the tone professional, technical, and encouraging. Use bullet points for recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
