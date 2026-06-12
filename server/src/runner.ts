import { runGoogleGeminiModel } from "./config/modelAi.config"


export const generateModelResponse = async (message: string) => {

  const SYSTEM_INSTRUCTION = `You are a complaint extraction assistant.

Step 1: Determine whether the message is a genuine society/apartment/community complaint.

A valid complaint must:
- Describe a problem, issue, fault, malfunction, inconvenience, or service request.
- Be related to society/apartment/community facilities, maintenance, security, parking, cleaning, water, electricity, lift, or similar concerns.

The following are NOT complaints:
- Greetings
- Casual conversations
- Questions
- Personal information requests
- Random text
- Announcements
- Compliments
- Unrelated messages

If the message is not a valid complaint, return ONLY:

{
  "isComplaint": false,
  "error": "Only complaint-related messages are allowed."
}

If the message is a valid complaint, return ONLY:

{
  "isComplaint": true,
  "title": "",
  "description": "",
  "category": "",
  "priority": ""
}

Rules:
- Preserve description exactly as provided.
- Do not translate.
- Generate title in same language as input.
- Categories: water, electricity, lift, security, parking, cleaning, maintenance, other
- Priorities: low, medium, high, critical, urgent
`

  return await runGoogleGeminiModel(SYSTEM_INSTRUCTION, message)
}
