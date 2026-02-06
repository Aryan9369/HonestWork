
import { GoogleGenAI } from "@google/genai";
import { Review } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCompanyReviewSummary = async (companyName: string, reviews: Review[]) => {
  if (reviews.length === 0) return "Not enough reviews for an AI summary yet.";

  const reviewText = reviews.map(r => `Rating: ${r.rating}. Pros: ${r.pros}. Cons: ${r.cons}`).join('\n---\n');
  
  const prompt = `
    Based on the following employee reviews for ${companyName}, provide a concise, 2-sentence summary of the general sentiment and key takeaways for a prospective employee.
    
    Reviews:
    ${reviewText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI insight currently unavailable.";
  }
};
