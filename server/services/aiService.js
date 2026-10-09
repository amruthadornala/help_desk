import { db } from '../database/db.js';

const SYSTEM_PROMPT = `You are an AI College Help Desk Assistant.
Your job is to help students with college-related questions.
Use the provided college knowledge base as the primary source of information.
Answer in simple, clear language.
Do not invent information.
If the answer is not available in the knowledge base, clearly say that the information is unavailable and suggest contacting the appropriate college department.
Keep answers concise but useful.
For procedures, provide step-by-step instructions.
For dates, fees, rules, and official information, only use information provided by the college knowledge base.
You should be polite, professional, and student-friendly.`;

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'can', 'could', 'should', 'would', 'will', 'i', 'you',
  'me', 'my', 'we', 'our', 'what', 'where', 'when', 'how', 'who', 'which',
  'why', 'about', 'tell', 'give', 'need', 'know', 'please', 'any', 'some'
]);

/**
 * Searches the Knowledge Base, FAQs, Departments, and Announcements for relevant context.
 */
export function retrieveContext(query) {
  const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = cleanQuery
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));

  // Retrieve all records from DB
  const kbEntries = db.prepare('SELECT id, title, content, category, keywords FROM knowledge_base').all();
  const faqEntries = db.prepare('SELECT id, question, answer, category FROM faqs').all();
  const deptEntries = db.prepare('SELECT id, name, hod, contact, email, location, description FROM departments').all();
  const annEntries = db.prepare('SELECT id, title, description, category, priority, date FROM announcements').all();

  const scoredResults = [];

  // 1. Score FAQs
  for (const faq of faqEntries) {
    let score = 0;
    const lowerQ = faq.question.toLowerCase();
    const lowerA = faq.answer.toLowerCase();

    // Exact or phrase matches
    if (cleanQuery.includes(lowerQ) || lowerQ.includes(cleanQuery)) {
      score += 50;
    }

    for (const t of tokens) {
      if (lowerQ.includes(t)) score += 10;
      if (lowerA.includes(t)) score += 4;
      if (faq.category.toLowerCase().includes(t)) score += 6;
    }

    if (score > 6) {
      scoredResults.push({
        type: 'FAQ',
        title: faq.question,
        content: faq.answer,
        category: faq.category,
        score
      });
    }
  }

  // 2. Score Knowledge Base
  for (const kb of kbEntries) {
    let score = 0;
    const lowerTitle = kb.title.toLowerCase();
    const lowerContent = kb.content.toLowerCase();
    const lowerKeywords = (kb.keywords || '').toLowerCase();
    const lowerCat = kb.category.toLowerCase();

    if (cleanQuery.includes(lowerTitle) || lowerTitle.includes(cleanQuery)) {
      score += 45;
    }

    for (const t of tokens) {
      if (lowerTitle.includes(t)) score += 12;
      if (lowerKeywords.includes(t)) score += 8;
      if (lowerCat.includes(t)) score += 7;
      if (lowerContent.includes(t)) score += 3;
    }

    if (score > 6) {
      scoredResults.push({
        type: 'Knowledge Base',
        title: kb.title,
        content: kb.content,
        category: kb.category,
        score
      });
    }
  }

  // 3. Score Departments
  for (const dept of deptEntries) {
    let score = 0;
    const lowerName = dept.name.toLowerCase();
    const lowerDesc = dept.description.toLowerCase();
    const lowerLoc = dept.location.toLowerCase();

    for (const t of tokens) {
      if (lowerName.includes(t)) score += 15;
      if (t === 'cse' && lowerName.includes('computer')) score += 20;
      if (t === 'it' && lowerName.includes('information')) score += 20;
      if (t === 'ece' && lowerName.includes('electronics')) score += 20;
      if (t === 'eee' && lowerName.includes('electrical')) score += 20;
      if (t === 'mech' && lowerName.includes('mechanical')) score += 20;
      if (t === 'civil' && lowerName.includes('civil')) score += 20;
      if (lowerDesc.includes(t)) score += 4;
      if (lowerLoc.includes(t)) score += 5;
    }

    if (score > 8) {
      scoredResults.push({
        type: 'Department',
        title: `Department of ${dept.name}`,
        content: `HOD: ${dept.hod}. Location: ${dept.location}. Contact: ${dept.contact} (${dept.email || 'N/A'}). Details: ${dept.description}`,
        category: 'Departments',
        score
      });
    }
  }

  // 4. Score Announcements
  for (const ann of annEntries) {
    let score = 0;
    const lowerTitle = ann.title.toLowerCase();
    const lowerDesc = ann.description.toLowerCase();

    for (const t of tokens) {
      if (lowerTitle.includes(t)) score += 10;
      if (lowerDesc.includes(t)) score += 4;
      if (ann.category.toLowerCase().includes(t)) score += 5;
    }

    if (score > 8) {
      scoredResults.push({
        type: 'Announcement',
        title: `Announcement: ${ann.title}`,
        content: `[${ann.category} | Priority: ${ann.priority} | Date: ${ann.date}] ${ann.description}`,
        category: ann.category,
        score
      });
    }
  }

  // Sort by score descending
  scoredResults.sort((a, b) => b.score - a.score);
  return scoredResults.slice(0, 4);
}

/**
 * Fallback Intelligent RAG answer synthesizer when external AI API is absent or offline.
 */
function synthesizeFallbackAnswer(query, contexts) {
  if (!contexts || contexts.length === 0) {
    return {
      answer: "I'm sorry, I couldn't find reliable information about that. Please contact the appropriate college department.",
      sources: []
    };
  }

  const topContext = contexts[0];
  const sources = contexts.map(c => `${c.title} (${c.category})`);

  // Direct high-confidence FAQ match
  if (topContext.type === 'FAQ' && topContext.score >= 15) {
    return {
      answer: topContext.content,
      sources
    };
  }

  // High-confidence Knowledge Base / Department match
  if (topContext.type === 'Department') {
    return {
      answer: `Here is the information for the ${topContext.title}:\n\n${topContext.content}`,
      sources
    };
  }

  // Combine top relevant items nicely
  let formattedResponse = topContext.content;

  if (contexts.length > 1 && contexts[1].score >= 12 && contexts[1].title !== topContext.title) {
    formattedResponse += `\n\n📌 Related Note (${contexts[1].title}):\n${contexts[1].content}`;
  }

  return {
    answer: formattedResponse,
    sources
  };
}

/**
 * Calls Gemini API if GEMINI_API_KEY is configured.
 */
async function callGeminiApi(apiKey, prompt, contextText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\n=== COLLEGE KNOWLEDGE BASE CONTEXT ===\n${contextText}\n\n=== STUDENT QUESTION ===\n${prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 500
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini API');
  }
  return text.trim();
}

/**
 * Main AI answer generator with Knowledge Base RAG and graceful fallback.
 */
export async function generateAiResponse(userQuestion) {
  if (!userQuestion || !userQuestion.trim()) {
    return {
      answer: 'Please enter a question.',
      sources: []
    };
  }

  const matchedContexts = retrieveContext(userQuestion);

  // If no matching information in KB at all
  if (matchedContexts.length === 0) {
    return {
      answer: "I'm sorry, I couldn't find reliable information about that. Please contact the appropriate college department.",
      sources: []
    };
  }

  const sources = matchedContexts.map(c => `${c.title} (${c.category})`);

  // Try external AI if key is present
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim() !== '') {
    try {
      const contextText = matchedContexts
        .map(c => `[Category: ${c.category}] Title: ${c.title}\nDetails: ${c.content}`)
        .join('\n\n');

      const aiText = await callGeminiApi(geminiKey, userQuestion, contextText);
      return {
        answer: aiText,
        sources
      };
    } catch (apiErr) {
      console.warn('External AI call failed, switching to Intelligent Local RAG fallback:', apiErr.message);
      // Fall through to fallback
    }
  }

  // Local RAG Fallback
  return synthesizeFallbackAnswer(userQuestion, matchedContexts);
}
