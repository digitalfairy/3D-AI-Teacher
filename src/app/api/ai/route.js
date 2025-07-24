import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const exampleData = {
  spanish: [
    { word: "¿" },
    { word: "Vives" },
    { word: "en" },
    { word: "España" },
    { word: "?" },
  ],
  grammarBreakdown: [
    {
      english: "Do you live in Spain?",
      spanish: [
        { word: "¿" },
        { word: "Vives" },
        { word: "en" },
        { word: "España" },
        { word: "?" },
      ],
      chunks: [
        {
          spanish: [{ word: "¿" }],
          grammar: "opening question mark",
          pronunciation: "",
        },
        {
          spanish: [{ word: "Vives" }],
          grammar: "verb (vivir - to live), 2nd person singular present indicative",
          pronunciation: "'biβes",
        },
        {
          spanish: [{ word: "en" }],
          grammar: "preposition (in, on, at)",
          pronunciation: "en",
        },
        {
          spanish: [{ word: "España" }],
          grammar: "proper noun (Spain)",
          pronunciation: "es'paɲa",
        },
        {
          spanish: [{ word: "?" }],
          grammar: "closing question mark",
          pronunciation: "",
        },
      ],
    },
  ],
};

export async function GET(req) {
  // WARNING: Do not expose your keys
  // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of ChatGPT resources

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a Spanish language teacher.
Your student asks you how to say something from english to spanish.
You should respond with:
- english: the english version ex: "Do you live in Spain?"
- spanish: the spanish translation in split into words ex: ${JSON.stringify(
          exampleData.spanish
        )}
- grammarBreakdown: an explanation of the grammar structure per sentence ex: ${JSON.stringify(
          exampleData.grammarBreakdown
        )}
`,
      },
      {
        role: "system",
        content: `You always respond with a JSON object with the following format:
{
  "english": "",
  "spanish": [{
    "word": ""
  }],
  "grammarBreakdown": [{
    "english": "",
    "spanish": [{
      "word": ""
    }],
    "chunks": [{
      "spanish": [{
        "word": ""
      }],
      "grammar": "",
      "pronunciation": ""
    }]
  }]
}`,
      },
      {
        role: "user",
        content: `How to say ${
          req.nextUrl.searchParams.get("question") || "Have you ever been to Spain?"
        } in Spanish?`, // Removed "in ${speech} speech?"
      },
    ],
    // model: "gpt-4-turbo-preview", // https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
    model: "gpt-3.5-turbo", // https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4
    response_format: {
      type: "json_object",
    },
  });
  console.log(chatCompletion.choices[0].message.content);
  return Response.json(JSON.parse(chatCompletion.choices[0].message.content));
}
