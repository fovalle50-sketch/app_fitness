import { GoogleGenAI } from "@google/genai";
import { Athlete, Evaluation } from "../types";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("La clave de API de Gemini no está configurada. Por favor, configúrala en el menú de Configuración para habilitar el análisis de IA.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const analyzeAthletePerformance = async (athlete: Athlete, evaluations: Evaluation[]) => {
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
    const aiInstance = getAI();
    const response = await aiInstance.models.generateContent({
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
