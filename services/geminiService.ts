import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Review, Company } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper for exponential backoff
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryOperation<T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const statusCode = error?.status || error?.code || error?.error?.code;
    // Retry on 429 (Too Many Requests) or 503 (Service Unavailable)
    if (retries > 0 && (statusCode === 429 || statusCode === 503 || statusCode === 'RESOURCE_EXHAUSTED')) {
      console.warn(`Gemini API rate limited/busy. Retrying in ${delay}ms... (${retries} retries left)`);
      await wait(delay);
      return retryOperation(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const getCompanyReviewSummary = async (companyName: string, reviews: Review[]) => {
  if (reviews.length === 0) return "Not enough reviews for an AI summary yet.";

  const reviewText = reviews.map(r => `Rating: ${r.rating}. Pros: ${r.pros}. Cons: ${r.cons}`).join('\n---\n');
  
  const prompt = `
    Based on the following employee reviews for ${companyName}, provide a concise, 2-sentence summary of the general sentiment and key takeaways for a prospective employee.
    
    Reviews:
    ${reviewText}
  `;

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    }));
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    const statusCode = error?.status || error?.code || error?.error?.code;
    if (statusCode === 429 || statusCode === 'RESOURCE_EXHAUSTED') {
      return "AI summary unavailable (high traffic). Please try again later.";
    }
    return "AI insight currently unavailable.";
  }
};

export const searchCompaniesOnline = async (query: string): Promise<Company[]> => {
  const prompt = `
    The user is searching for companies matching or related to "${query}". 
    Identify up to 3 real, existing companies that are relevant to this query.
    
    Return a list of objects with the following details for each company:
    - name: The official company name.
    - domain: The primary domain name (e.g., 'google.com').
    - industry: The primary industry.
    - description: A short, 1-2 sentence description.
    
    If no companies are found, return an empty list.
  `;

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              domain: { type: Type.STRING },
              industry: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["name", "domain", "industry", "description"]
          }
        }
      }
    }));

    const text = response.text;
    if (!text) return [];

    const data = JSON.parse(text);

    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      id: `ai-${Math.random().toString(36).substr(2, 9)}`,
      name: item.name,
      domain: item.domain,
      industry: item.industry || 'Unknown',
      description: item.description || 'No description available.',
      logo: item.domain ? `https://logo.clearbit.com/${item.domain}` : `https://picsum.photos/seed/${item.name}/200`
    }));

  } catch (error) {
    console.error("AI Company Search Error:", error);
    return [];
  }
};