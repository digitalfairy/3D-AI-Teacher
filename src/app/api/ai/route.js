// src/app/api/ai/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the same exampleData as before
const exampleData = {
  spanish: [{ word: "¿" }, { word: "Vives" }, { word: "en" }, { word: "España" }, { word: "?" }],
  grammarBreakdown: [
    {
      english: "Do you live in Spain?",
      spanish: [{ word: "¿" }, { word: "Vives" }, { word: "en" }, { word: "España" }, { word: "?" }],
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
  // WARNING: Do not expose your keys directly in client-side code.
  // This is a server-side API route, so using process.env is appropriate.
  // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of AI resources.

  // Initialize the Google Generative AI client
  // Ensure your GEMINI_API_KEY is set in your environment variables.
  const genAI = new GoogleGenerativeAI(process.env["GEMINI_API_KEY"]);

  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Define the expected JSON format string for the prompt
  const jsonFormatString = `{
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
}`;

  try {
    const chatCompletion = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a Spanish language teacher.
Your student asks you how to say something from English to Spanish.
You should respond with a JSON object with the following structure.
The structure must strictly adhere to the provided JSON schema.
- english: the english version ex: "Do you live in Spain?"
- spanish: the spanish translation in split into words ex: ${JSON.stringify(
                exampleData.spanish
              )}
- grammarBreakdown: an explanation of the grammar structure per sentence ex: ${JSON.stringify(
                exampleData.grammarBreakdown
              )}

Here is the exact JSON format you must always return:
${jsonFormatString}

How to say "${
                req.nextUrl.searchParams.get("question") || "Have you ever been to Spain?"
              }" in Spanish?`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json", // This is crucial for JSON output
      },
    });

    const responseText = chatCompletion.response.text();
    console.log("Gemini Raw Response Text:", responseText);

    // Parse the JSON output from the model
    const parsedResponse = JSON.parse(responseText);
    return Response.json(parsedResponse);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Return an error response
    return new Response(JSON.stringify({ error: "Failed to process request." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}