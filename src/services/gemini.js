import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

export const analyzePoopImage = async (imageFile) => {
    if (!genAI) {
        console.warn("Gemini API Key is missing. Returning mock data.");
        // Fallback to mock if no key
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    color: "Mustard Yellow",
                    consistency: "Soft/Seedy",
                    analysis: "This looks like normal breastfed baby poop. The color and texture are typical for a healthy infant.",
                    recommendation: "Normal. Keep doing what you're doing!",
                    isAlarming: false
                });
            }, 2000);
        });
    }

    try {
        // Using Gemini 2.5 Flash Lite as requested
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        // Convert file to base64
        const base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });

        const prompt = `
        Analyze this image of a baby's diaper/stool. 
        Act as a pediatric health assistant using guidelines similar to WebMD or Mayo Clinic.
        
        Provide the output in valid JSON format with the following keys:
        - "color": One or two words describing the color.
        - "consistency": One or two words describing the consistency.
        - "analysis": A 2-3 sentence medical explanation of what this type of stool indicates.
        - "recommendation": Actionable advice (e.g., "Normal", "Monitor hydration", "Consult a doctor immediately").
        - "isAlarming": boolean (true if the parent should see a doctor, e.g., for red, white, or black stool).
        
        If the image does not appear to be of a diaper or stool, return {"error": "Invalid image. Please upload a clear photo of the diaper contents."}.
        `;

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: imageFile.type
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Gemini Analysis Error Details:", error);

        // Handle specific API errors
        if (error.message?.includes('API_KEY_INVALID')) {
            throw new Error("Invalid API Key. Please check your .env file.");
        }
        if (error.message?.includes('User location is not supported')) {
            throw new Error("Gemini AI is not available in your region.");
        }

        // Return the actual error message for debugging
        throw new Error(`Analysis Failed: ${error.message || "Unknown error"}`);
    }
};
