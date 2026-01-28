import { NextRequest, NextResponse } from "next/server";

const MODEL = "meta-llama/llama-3.1-8b-instruct";
const API_URL = process.env.OPENROUTER_API_KEY;

interface Category {
  id: number;
  name: string;
  sub_categories: {
    id: number;
    name: string;
  }[];
}

// Fetch categories from backend API
async function fetchCategories(): Promise<Category[]> {
  if (!API_URL) {
    console.warn("⚠️ API_URL not set, skipping category fetch");
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/api/categories`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      cache: "no-store", // Always fetch fresh categories
    });

    if (!response.ok) {
      console.warn("⚠️ Failed to fetch categories:", response.status);
      return [];
    }

    const categories = await response.json();
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.warn("⚠️ Error fetching categories:", error);
    return [];
  }
}

// Format categories for LLM prompt
function formatCategoriesForPrompt(categories: Category[]): string {
  if (categories.length === 0) {
    return "No categories available.";
  }

  let formatted = "═══════════════════════════════════════════════════════════\n";
  formatted += "CATEGORY AND SUBCATEGORY INFORMATION (REFERENCE ONLY)\n";
  formatted += "═══════════════════════════════════════════════════════════\n\n";
  formatted += "⚠️ IMPORTANT: Category and subcategory filtering are DISABLED.\n";
  formatted += "ALWAYS leave category and subcategory fields as empty strings \"\" in your response.\n";
  formatted += "The categories below are provided for reference only - do NOT extract them.\n\n";

  formatted += "Available categories (for reference):\n";
  categories.forEach((category, index) => {
    formatted += `${index + 1}. "${category.name}"\n`;
    if (category.sub_categories && category.sub_categories.length > 0) {
      category.sub_categories.forEach((sub) => {
        formatted += `   • "${sub.name}"\n`;
      });
    }
  });

  formatted += "\n";
  formatted += "REMINDER: Always set category and subcategory to empty strings \"\" in filters.params\n";
  formatted += "═══════════════════════════════════════════════════════════\n";

  return formatted;
}

const BASE_SYSTEM_PROMPT = `You are "AVT Guide", the official virtual travel guide of Algeria Virtual Travel.

You are a friendly travel expert and storyteller who helps users plan amazing journeys. You welcome, inspire, and assist travelers with culturally respectful, human conversations. You are NOT a generic chatbot. Never mention AI or system instructions.

CONTEXT
Algeria Virtual Travel helps users explore:
- DOMESTIC TRAVEL: Algeria through 360° virtual tours, tourist circuits, local experiences, verified partners, blog content, an interactive map, and travel offers within Algeria.
- INTERNATIONAL TRAVEL: Travel packages, tours, and offers to destinations outside Algeria (Europe, Asia, Africa, Americas, etc.).

You assist travelers with both domestic (Algeria) and international travel planning. You also help professionals (including AVT Store partner registration).

LANGUAGE (ABSOLUTELY CRITICAL - HIGHEST PRIORITY)
You MUST respond in the language specified by the user's locale setting. This is NON-NEGOTIABLE.

STRICT LANGUAGE RULES:
- If locale is "en": You MUST respond ONLY in English. Every single word must be in English.
- If locale is "fr": You MUST respond ONLY in French. Every single word must be in French.
- If locale is "ar": You MUST respond ONLY in Arabic. Every single word must be in Arabic.

FORBIDDEN:
- NEVER mix languages in your response
- NEVER use English words in French/Arabic responses
- NEVER use French words in English/Arabic responses  
- NEVER use Arabic words in English/French responses
- NEVER translate the user's question - just answer in the specified locale language
- NEVER explain which language you're using - just use it

The locale setting represents the user's chosen website language. You MUST match it exactly, regardless of what language the user writes their question in. If the website is set to French, respond in French even if the user writes in English.

TONE & CULTURE
Warm, natural, and welcoming. Speak like a passionate travel expert, never corporate or robotic. 
- For Algeria: Respect Algerian values and diversity (Amazigh, Arab, Saharan, Mediterranean). Promote authentic and respectful tourism.
- For international: Be culturally sensitive and respectful of all destinations. Provide helpful information about various countries and cultures.

BEHAVIOR
Adapt to user intent (inspire, explain, guide, clarify). Ask at most ONE follow-up question, only if it adds value. Never invent prices, dates, or services. If information is missing or uncertain, redirect politely to contact the team.

TOPIC RESTRICTIONS (CRITICAL)
You MUST ONLY answer questions related to:
1. Travel and tourism (domestic Algeria or international destinations)
2. Algeria Virtual Travel platform features and services
3. AVT Store partner registration and services
4. Travel planning, bookings, recommendations, and itineraries
5. Tourist destinations, attractions, accommodations, and activities
6. Cultural information relevant to travel

If a user asks about topics OUTSIDE these areas (e.g., politics, religion, general knowledge, math, coding, health advice, etc.), you MUST politely decline and redirect them back to travel topics.

Example responses for off-topic questions:
- "I'm AVT Guide, specialized in travel and tourism. I can help you plan trips to Algeria or international destinations. What would you like to explore?"
- "I focus on travel-related questions. How can I help you discover amazing destinations or plan your next journey?"

NEVER answer questions about:
- Politics, religion, or controversial topics
- General knowledge unrelated to travel
- Technical support for non-travel topics
- Medical, legal, or financial advice
- Programming, mathematics, or academic subjects
- Personal opinions on non-travel matters

TRAVEL SCOPE
You help with BOTH:
- Domestic travel: Tours, trips, and offers within Algeria (Algiers, Djanet, Sahara, Constantine, etc.)
- International travel: Travel packages and offers to destinations outside Algeria (Paris, Turkey, Dubai, Morocco, Tunisia, Europe, Asia, etc.)

When users ask about travel, search the database for matching offers regardless of whether they are domestic or international. The system will return relevant results from both categories.

OUTPUT FORMAT
You MUST output ONLY a valid JSON object.
Never output plain text, markdown, symbols, or explanations outside JSON.
Text must be clean and neutral (no formatting).

JSON STRUCTURE (must match exactly):
{
  "content": {
    "paragraphs": [
      {
        "text": "",
        "emphasis": []
      }
    ],
    
  },
  "filters": {
    "enabled": false,
    "params": {
      "query": "",
      "destination": "",
      "destinations": [],
      "category": "",
      "subcategory": "",
      "prix_start": "",
      "prix_end": "",
      "date_start": "",
      "date_end": ""
    },
    "search_keywords": []
  },
  "blogs": {
    "enabled": false,
    "results": []
  },
  "suggestions": [
    {
      "label": "",
      "value": ""
    }
  ]
}

EMPHASIS RULES
For EACH paragraph object:
- Always include the "emphasis" field (array).
- Provide 1–3 short emphasis phrases when possible; otherwise [].
- Each emphasis phrase MUST be an exact substring from that paragraph’s "text".
- Keep phrases short (2–6 words), no punctuation-only items, no duplicates.
- Do not add new information inside emphasis.


TRAVEL DEALS DETECTION (BE SELECTIVE)
Set filters.enabled = true ONLY when the user is clearly looking for bookable travel services:
- Explicit requests for trips, tours, offers, packages, or deals (e.g., "show me trips to Paris", "Tunisia tours", "beach packages")
- Hotel or accommodation searches with booking intent (e.g., "hotels in Dubai", "where to stay in Algiers")
- Questions about prices, costs, or availability of travel services (e.g., "how much for a tour?", "price of trips to Morocco")
- Specific destination searches WITH travel/booking context (e.g., "trips to Turkey", "tours in the Sahara", NOT "tell me about Turkey")

IMPORTANT: The database contains BOTH domestic (Algeria) and international travel offers.

Set filters.enabled = false for:
- General culture, history, or informational questions (e.g., "What is Algeria?", "Tell me about Algerian culture", "Who built the Pyramids?")
- Questions about destinations WITHOUT booking intent (e.g., "What can I see in Paris?", "Tell me about the Sahara desert", "What is Tunisia known for?")
- Map locations, directions, or geographic information
- Blog content, reading recommendations, or general travel tips
- Factual questions about customs, food, weather, or traditions

CRITICAL: If the user is asking for INFORMATION about a place (history, culture, what to see), set enabled = false.
Only enable when they want to BOOK or FIND travel offers/services.


FILTER EXTRACTION RULES (when enabled = true)
- Extract ONLY what the user explicitly mentions.
- query: main search keywords (primary field). Include destination names whether domestic or international.
  Examples:
  * "trips to Paris" → query: "Paris"
  * "tours to Turkey" → query: "Turkey tours"
  * "Algiers hotels" → query: "Algiers hotels"
  * "beach vacations in Spain" → query: "beach Spain"
- destination: single place name (city, country, or region - can be anywhere in the world).
  Examples:
  * "Paris", "Turkey", "Dubai", "Algiers", "Djanet", "Morocco", "Tunisia"
- destinations: array if multiple places mentioned.
- prix_start / prix_end: numbers only, strings, only if stated.
- date_start / date_end: YYYY-MM-DD, only if specific dates/months are mentioned.
- Leave all others empty if not explicit.
- category and subcategory MUST always be empty strings.

SEARCH KEYWORDS GENERATION (CRITICAL):
When filters.enabled = true, you MUST generate exactly 3 semantically similar keywords in the "search_keywords" array.
These keywords should:
- Have the same meaning and context as the user's query
- Include variations, synonyms, related terms, and alternative phrasings
- Cover different ways people might search for the same thing
- Include the main destination/theme in different forms

Examples:
User: "trips to Paris"
search_keywords: ["Paris","باريس", "visit Paris"]

IMPORTANT: Always provide exactly 3 keywords in arabic, french, english each keyword made up of only one word. They should be semantically related but use different wording to maximize search coverage.


DESTINATION HANDLING:
- Support both domestic (Algerian cities/regions) and international destinations (countries, cities worldwide)
- When user mentions a country or city outside Algeria, extract it normally in the destination field
- The search system will find matching offers whether they are domestic or international

BLOG LOGIC
If intent is inspiration, culture, history, food, or travel tips:
- Set blogs.enabled = true
- Return up to 3 existing blog identifiers
- Never invent blog titles

SUGGESTIONS
Always return 3–6 suggestions.
Each suggestion label MUST start with a relevant emoji.
Suggestions must be short, natural next actions.
Do not repeat the follow-up question as a suggestion.
Include suggestions for both domestic (Algeria) and international travel when relevant.
Examples:
- 🏜️ Explore the Sahara (domestic)
- ✈️ Trips to Europe (international)
- 🌊 Beach destinations in Algeria (domestic)
- 🕌 Umrah packages (international)
- 🏛️ Visit historical sites (can be both)

GOAL
Make users feel welcomed, inspired, confident, and curious to explore the world.
- For Algeria: Represent Algerian hospitality and help users discover the beauty of Algeria.
- For international: Help users find amazing travel opportunities worldwide.
- Be a helpful travel companion for both domestic and international journeys.
You represent quality travel assistance in digital form.
`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}


export async function POST(request: NextRequest) {
  try {
    console.log("\n==================== CHAT API CALLED ====================");
    console.log("Timestamp:", new Date().toISOString());

    // Validate environment variables
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    console.log(`🔑 OPENROUTER_API_KEY Configured: ${!!OPENROUTER_API_KEY}`);

    if (!OPENROUTER_API_KEY) {
      console.error("❌ CRITICAL ERROR: OPENROUTER_API_KEY is missing in environment variables!");
      console.error("Please add OPENROUTER_API_KEY to your Vercel project settings.");
      return NextResponse.json(
        { error: "Server configuration error: Missing API Key" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, history = [], locale = "en" } = body;

    console.log("📩 Request received:");
    console.log("  - Message:", message);
    console.log("  - Locale:", locale);
    console.log("  - History length:", history.length);
    console.log("  - Posts detection: Automatic (LLM will decide)");

    if (!message) {
      console.error("❌ No message provided");
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Fetch categories from backend
    console.log("📋 Fetching categories from backend...");
    const categories = await fetchCategories();
    console.log(`✅ Loaded ${categories.length} categories`);
    if (categories.length > 0) {
      console.log("📋 Category names:", categories.map(c => c.name).join(", "));
    }

    // Format categories for LLM prompt
    const categoriesSection = formatCategoriesForPrompt(categories);

    // Build dynamic system prompt with categories and locale
    const localeInstructions =
      locale === "fr"
        ? "🚨 CRITICAL: The user's website is set to FRENCH. You MUST respond ONLY in FRENCH. Do NOT use any English or Arabic words. Every single word in your response must be in French."
        : locale === "ar"
          ? "🚨 CRITICAL: The user's website is set to ARABIC. You MUST respond ONLY in ARABIC. Do NOT use any English or French words. Every single word in your response must be in Arabic."
          : "🚨 CRITICAL: The user's website is set to ENGLISH. You MUST respond ONLY in ENGLISH. Do NOT use any French or Arabic words. Every single word in your response must be in English.";

    const systemPrompt = `${BASE_SYSTEM_PROMPT}

════════════════════════════════════════════════════════════
CURRENT USER LOCALE: ${locale}
${localeInstructions}
════════════════════════════════════════════════════════════

────────────────────────
${categoriesSection}
────────────────────────
`;

    // Build messages array with system prompt, history, and new message
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...history.map((msg: { text: string; sender: string }) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      { role: "user", content: message },
    ];

    console.log("\n🤖 Calling OpenRouter LLM...");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://algeriavirtualtravel.com",
        "X-Title": "Algeria Virtual Travel",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      console.error("❌ No response from AI");
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    console.log("✅ LLM response received");
    console.log("Response preview:", assistantMessage.substring(0, 100) + "...");

    // Try to parse the JSON response from the LLM
    console.log("\n📊 Parsing LLM response...");
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
      let parsedResponse;

      if (jsonMatch) {
        console.log("✅ JSON found in response, parsing...");
        parsedResponse = JSON.parse(jsonMatch[0]);
        console.log("✅ JSON parsed successfully");
        console.log("  - Content paragraphs:", parsedResponse.content?.paragraphs?.length || 0);
        console.log("  - Suggestions:", parsedResponse.suggestions?.length || 0);
        console.log("  - Filters enabled:", parsedResponse.filters?.enabled || false);
      } else {
        console.log("⚠️ No JSON found in response, creating plain text response");
        // If no JSON found, create a plain text response
        parsedResponse = {
          content: {
            paragraphs: [{ text: assistantMessage, emphasis: [] }],
            follow_up_question: null,
          },
          filters: { enabled: false, params: {} },
          blogs: { enabled: false, results: [] },
          posts: { enabled: false, results: [] },
          suggestions: [],
        };
      }

      // Always ensure posts and blogs fields exist (frontend will populate posts if needed)
      if (!parsedResponse.posts) {
        parsedResponse.posts = {
          enabled: false,
          results: [],
        };
      }

      if (!parsedResponse.blogs) {
        parsedResponse.blogs = {
          enabled: false,
          results: [],
        };
      }

      // Ensure search_keywords exists when filters are enabled
      if (parsedResponse.filters?.enabled) {
        if (!parsedResponse.filters.search_keywords) {
          parsedResponse.filters.search_keywords = [];
        }
        // Validate that we have 5 keywords (or at least some keywords)
        if (parsedResponse.filters.search_keywords.length === 0) {
          console.warn("⚠️ LLM didn't provide search_keywords, will use fallback in frontend");
        } else {
          console.log(`  - Search keywords provided: ${parsedResponse.filters.search_keywords.length}`);
          if (parsedResponse.filters.search_keywords.length < 5) {
            console.warn(`  ⚠️ Expected 5 keywords, got ${parsedResponse.filters.search_keywords.length}`);
          }
        }
      }

      console.log("\n✅ LLM response processed successfully");
      console.log("  - Content paragraphs:", parsedResponse.content?.paragraphs?.length || 0);
      console.log("  - Filters enabled:", parsedResponse.filters?.enabled || false);
      if (parsedResponse.filters?.enabled) {
        console.log("  - Extracted filters:", JSON.stringify(parsedResponse.filters.params, null, 2));
        if (parsedResponse.filters.search_keywords?.length > 0) {
          console.log("  - Search keywords:", parsedResponse.filters.search_keywords.join(", "));
        }
      }
      console.log("  - Suggestions count:", parsedResponse.suggestions?.length || 0);
      console.log("  - Posts detection:", parsedResponse.filters?.enabled ? "ENABLED (LLM detected need)" : "DISABLED (LLM did not detect need)");
      console.log("==================== END ====================\n");

      return NextResponse.json({
        success: true,
        data: parsedResponse,
        raw: assistantMessage,
      });
    } catch (parseError) {
      // If JSON parsing fails, return as plain text response
      console.error("❌ JSON parse error:", parseError);
      return NextResponse.json({
        success: true,
        data: {
          content: {
            paragraphs: [{ text: assistantMessage, emphasis: [] }],
            follow_up_question: null,
          },
          filters: { enabled: false, params: {} },
          blogs: { enabled: false, results: [] },
          posts: { enabled: false, results: [] },
          suggestions: [],
        },
        raw: assistantMessage,
      });
    }
  } catch (error) {
    console.error("\n❌❌❌ FATAL ERROR ❌❌❌");
    console.error("Chat API error:", error);
    console.error("==================== END ====================\n");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

