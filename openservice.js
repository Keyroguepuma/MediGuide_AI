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


give the response as a chatbot

if not medicine was found or it doesn't relate to medicine then respond with No Response

Medicine: ${medicine}
`;

  const response = await client.responses.create({
    model: "gpt-5.4",
    input: prompt,
  });

 const text = response.output[0].content[0].text;

 return text;

}


module.exports = {getMedicineInfo,};