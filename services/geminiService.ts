import { GoogleGenAI, Chat } from "@google/genai";
import { FormState } from '../types';
import { getSystemPrompt } from '../constants';

function getAiClient(): GoogleGenAI {
    const API_KEY = "AIzaSyAd9aKNxuiJZwpRT598BVtqbCJ0LDEjtiU";

    if (!API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey: API_KEY });
}

/**
 * Initializes and returns a new chat session with the Gemini model.
 * The session is configured with a system prompt based on the provided form data.
 * @param formData The form data used to generate the system prompt.
 * @returns A Chat instance ready to send messages.
 */
export function startChatSession(formData: FormState): Chat {
    const ai = getAiClient();
    const systemPrompt = getSystemPrompt(formData);

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemPrompt
        }
    });
}
