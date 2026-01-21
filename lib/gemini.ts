import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Connection banao
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateKeywords(text: string) {
    try {
        // 2. Model select karo (Flash sabse fast aur free hai)
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        // 3. Prompt likho (AI ko samjhao kya karna hai)
        const prompt = `
      Analyze the following text describing a lost or found item: "${text}".
      
      Your Task:
      1. Extract 5-7 distinct keywords (colors, object type, brand, key features).
      2. If the text is in Roman Urdu (e.g., "kala bag"), translate keywords to English (e.g., "black bag").
      3. Return ONLY a comma-separated list of keywords. No explanations.
    `;

        // 4. AI se poocho
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const keywords = response.text();

        // 5. Safai karo (New lines waghaira hatao)
        return keywords.replace(/\n/g, "").split(",").map(k => k.trim());

    } catch (error) {
        console.error("AI Error:", error);
        return []; // Agar AI fail ho, to empty array bhej do (App crash na ho)
    }
}