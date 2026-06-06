import {
  GoogleGenAI,
  ThinkingLevel,
  Type,
} from '@google/genai';
import { GOOGLE_API_KEY } from './env';

export const runGoogleGeminiModel = async (systemInstruction: string, message: string) => {
  try {

    const ai = new GoogleGenAI({
      apiKey: GOOGLE_API_KEY,
    });
    const tools = [
      {
        googleSearch: {
        }
      },
    ];
    const config = {
      systemInstruction,
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.MINIMAL,
      },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        required: ["title", "description", "category", "priority"],
        properties: {
          title: {
            type: Type.STRING,
          },
          description: {
            type: Type.STRING,
          },
          category: {
            type: Type.STRING,
          },
          priority: {
            type: Type.STRING,
          },
        },
      },
    };
    const model = 'gemini-3.5-flash';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: message,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    let result = "";
    for await (const chunk of response) {
      if (chunk.text) {
        result += chunk.text ?? ""
      }
    }

    const finalResult = JSON.parse(result);

    return {
      success: true,
      data: finalResult,
      message: "AI json complaint generated",
      service: "google",
      err: ""
    };

  } catch (err) {
    console.log("err", (err as any).message)
    return {
      success: false,
      data: "",
      message: "",
      service: "google",
      err: (err as any).message
    };
  }
}


