const GEMINI_PRIMARY_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
const GEMINI_FALLBACK_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function getGeminiApiKey() {
  if (typeof process !== "undefined" && process.env && process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  if (typeof window !== "undefined") {
    if (window.GEMINI_API_KEY) return window.GEMINI_API_KEY;
    try {
      const res = await fetch("/api/config");
      if (res.ok) {
        const config = await res.json();
        if (config.geminiApiKey) {
          window.GEMINI_API_KEY = config.geminiApiKey;
          return config.geminiApiKey;
        }
      }
    } catch (e) {
      // Ignore API fetch error
    }
  }
  return "";
}

export async function generateQuestionsWithGemini({ subject, chapterTitle = "", textContent = "", count = 5, type = "mcq" }) {
  const apiKey = await getGeminiApiKey();
  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found, using local fallback questions.");
    return generateFallbackQuestions(subject, chapterTitle, textContent, count, type);
  }

  const promptText = buildGeminiPrompt(subject, chapterTitle, textContent, count, type);

  const payload = {
    contents: [{ parts: [{ text: promptText }] }]
  };

  const headers = {
    "Content-Type": "application/json",
    "X-goog-api-key": apiKey
  };

  let rawText = "";

  try {
    let response = await fetch(GEMINI_PRIMARY_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      response = await fetch(GEMINI_FALLBACK_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) {
      throw new Error(`Gemini API HTTP Error ${response.status}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    if (candidate && candidate.content && candidate.content.parts) {
      rawText = candidate.content.parts.map((p) => p.text).join("\n");
    }
  } catch (err) {
    console.error("Gemini API call failed, using fallback:", err);
    return generateFallbackQuestions(subject, chapterTitle, textContent, count, type);
  }

  try {
    const questions = parseGeminiJsonResponse(rawText, type, count);
    if (questions && questions.length > 0) {
      return questions;
    }
  } catch (e) {
    console.warn("Could not parse Gemini JSON response:", e);
  }

  return generateFallbackQuestions(subject, chapterTitle, textContent, count, type);
}

function buildGeminiPrompt(subject, chapterTitle, textContent, count, type) {
  const contextSnippet = textContent ? textContent.slice(0, 3000) : "";
  if (type === "mcq") {
    return `You are an educational AI assistant for students.
Generate ${count} high-quality Multiple Choice Questions (MCQs) for the subject "${subject}".
${chapterTitle ? `Chapter / Topic: "${chapterTitle}".` : ""}
${contextSnippet ? `Source Text Context:\n"""${contextSnippet}"""` : ""}

CRITICAL REQUIREMENTS:
- Provide exactly 4 options per question.
- Format answer as the exact matching string from one of the 4 options.
- Return ONLY a raw JSON array without markdown formatting.
- Structure of each object:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A"
  }
]`;
  } else {
    return `You are an educational AI assistant for students.
Generate ${count} short question-answer pairs for the subject "${subject}".
${chapterTitle ? `Chapter / Topic: "${chapterTitle}".` : ""}
${contextSnippet ? `Source Text Context:\n"""${contextSnippet}"""` : ""}

CRITICAL REQUIREMENTS:
- Return ONLY a raw JSON array without markdown formatting.
- Structure of each object:
[
  {
    "question": "Question text here?",
    "answer": "Correct answer text here"
  }
]`;
  }
}

function parseGeminiJsonResponse(rawText, type, expectedCount) {
  if (!rawText) return null;
  let clean = rawText.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = clean.indexOf("[");
  const end = clean.lastIndexOf("]");
  if (start !== -1 && end !== -1 && end > start) {
    clean = clean.substring(start, end + 1);
  }

  const parsed = JSON.parse(clean);
  if (!Array.isArray(parsed)) return null;

  return parsed.map((item) => {
    if (type === "mcq") {
      const opts = Array.isArray(item.options) && item.options.length >= 2
        ? item.options.map(String)
        : ["True", "False", "Both", "None"];
      return {
        question: String(item.question || "Question"),
        options: opts,
        answer: String(item.answer || opts[0])
      };
    } else {
      return {
        question: String(item.question || "Question"),
        answer: String(item.answer || "")
      };
    }
  });
}

function generateFallbackQuestions(subject, chapterTitle, textContent, count, type) {
  const fallbackList = [];
  const topic = chapterTitle || subject || "General Knowledge";

  for (let i = 1; i <= count; i++) {
    if (type === "mcq") {
      fallbackList.push({
        question: `[${subject}] Q${i}: What is a core concept taught in ${topic}?`,
        options: [
          `Fundamental principles of ${topic}`,
          `Practical application in ${subject}`,
          `Historical background of ${topic}`,
          `Observational study in ${subject}`
        ],
        answer: `Fundamental principles of ${topic}`
      });
    } else {
      fallbackList.push({
        question: `Fill in the blank: ${topic} is an important part of ____.`,
        answer: subject
      });
    }
  }
  return fallbackList;
}
