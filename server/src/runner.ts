import { runGoogleGeminiModel } from "./config/modelAi.config"


export const generateModelResponse = async (message: string) => {

    const SYSTEM_INSTRUCTION = `You are a complaint extraction assistant.

Extract complaint details and return ONLY valid JSON.

Rules:
- Create a short title in the SAME language as the user's complaint.
- Keep the description in the SAME language as the user's complaint.
- Do not translate the complaint.
- Select category from:
  water, electricity, lift, security, parking, cleaning, maintenance, other
- Select priority from:
  low, medium, high, critical
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
