const OpenAI = require("openai");
require('dotenv').config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getMedicineInfo(medicine) {
  const prompt = `
You are MediGuide AI, a medication education assistant.
Give educational information only.
Do not diagnose.
Do not prescribe.
Do not say the user should take the medicine.
Do not provide dosage instructions beyond general caution.

Return valid JSON in this exact format:
{
  "medicineName": "",
  "usedFor": [],
  "commonSideEffects": [],
  "importantWarnings": [],
  "simpleExplanation": "",
  "safetyNote": ""
}

Medicine: ${medicine}
`;

  const response = await client.responses.create({
    model: "gpt-5.4",
    input: prompt,
  });

  const text = response.output_text;

  try {
    return JSON.parse(text);
  } catch (err) {
    return {
      medicineName: medicine,
      usedFor: [],
      commonSideEffects: [],
      importantWarnings: [],
      simpleExplanation: text,
      safetyNote:
        "This information is for education only and is not a substitute for professional medical advice.",
    };
  }
}


module.exports = {getMedicineInfo,};