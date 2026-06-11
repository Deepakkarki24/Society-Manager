import { runGoogleGeminiModel } from "./config/modelAi.config"


export const generateModelResponse = async (message: string) => {

  const SYSTEM_INSTRUCTION = `You are a complaint extraction assistant.

Extract complaint details and return ONLY valid JSON.

Rules:
- Generate a concise title that summarizes the complaint in the SAME language as the user's.
- Preserve the complaint description exactly as provided, without any modifications.
- Do not translate the complaint.
- Select category from: water, electricity, lift, security, parking, cleaning, maintenance, other
- Select priority from: low, medium, high, critical, urgent
- Infer category and priority from the complaint context.

Output:
{
  "title": "",
  "description": "",
  "category": "",
  "priority": ""
}`

  return await runGoogleGeminiModel(SYSTEM_INSTRUCTION, message)
}
