import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, BlogPost } from "@/lib/blog";

const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_TOOL_ROUNDS = 3;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeminiPart = { text?: string; functionCall?: { name: string; args: any }; functionResponse?: { name: string; response: any } };
type GeminiMessage = { role: "user" | "model"; parts: GeminiPart[] };

const CLIENT_ACTIONS = new Set([
  "navigate_to_section", "show_project", "get_contact_info",
  "toggle_theme", "download_resume", "open_external_link",
  "compose_email", "highlight_skill", "show_stats",
]);

const SYSTEM_PROMPT = `You are an AI assistant on Idrissa Maiga's portfolio website. You are smart, conversational, and helpful.

TOOL PHILOSOPHY:
- You have two kinds of tools: DATA tools that fetch information, and ACTION tools that control the UI.
- DATA tools (get_blog_posts, send_message_to_idrissa): Call these to get real data. You will receive the results and should use them in your answer.
- ACTION tools (navigate_to_section, show_project, download_resume, etc.): Call these ONLY when the user explicitly asks to SEE, GO TO, OPEN, or DOWNLOAD something.
- For general questions ("what projects does he have?", "tell me about his skills"), answer from your context. Do NOT call navigation tools.
- You can call multiple tools if needed. You will get results back and can reason over them.

RESPONSE STYLE:
- Concise (under 200 words), friendly, professional.
- When you call an ACTION tool, include a brief text explaining what you did.
- When you call a DATA tool, use the returned data to give a rich, informed answer.
- Never return empty text.`;

const PORTFOLIO_CONTEXT = `
ABOUT IDRISSA MAIGA:
- Full-Stack Engineer (Java, TypeScript, Python) based in Budapest, Hungary (from Bamako, Mali)
- Email: idrissa.maiga@iditechs.com
- BSc Computer Software Engineering at Obuda University (Sep 2023 - Feb 2027), GPA: 8.7/10
- Languages: English (Fluent), French (Native), Bambara (Native), Hungarian (Beginner)

EXPERIENCE:
- Software Developer Intern at 4D Consulting Kft. (Aug 2025 - Present) - INDUSAC Innovation Ecosystem Platform, Spring Boot + React
- Full Stack Engineer at EISMEA / European Innovation Council (Jan 2025 - Jul 2025) - Built horizoneurope.io, AI-powered EU funding platform, 5,000+ monthly users, <2ms API responses

PROJECTS:
- horizoneurope: AI-powered EU funding guidance platform (horizoneurope.io)
- neptun-api: Python wrapper for Hungary's Neptun university system (1,100+ endpoints, MCP server)
- trading-bot: Automated XAUUSD grid trading bot on MetaTrader 5 (web dashboard, backtester)
- gmail-ai: AI-powered Gmail automation (DeepSeek R1 + Mistral AI)
- filmu: Full VOD streaming platform (HLS, live TV, subscriptions)
- signalapp: React Native forex/binary trading signals app

SKILLS:
- Languages: Java, JavaScript, TypeScript, Python, C#, SQL
- Backend: Spring Boot, Node.js, Express, FastAPI, .NET Core
- Frontend: React, Next.js, Vue.js, React Native, Tailwind CSS
- Databases: PostgreSQL, MongoDB, MySQL, Redis, Firebase
- Cloud/DevOps: AWS, Docker, Kubernetes, Git, GitHub Actions
- AI/ML: OpenAI, DeepSeek, Mistral, Groq, LangChain, TensorFlow

CERTIFICATIONS: CCNA, Spring Boot & Microservices, MERN Stack, ASP.NET Core, Kennedy Lugar YES Program Scholar

STATS: 28+ projects, 530+ commits, 5,000+ users served, 1,100+ API endpoints, 8.7 GPA`;

const TOOL_DECLARATIONS = [
  {
    name: "navigate_to_section",
    description: "Scroll the page to a specific section. Use when user says 'show me', 'go to', 'take me to'.",
    parameters: {
      type: "OBJECT",
      properties: { section: { type: "STRING", enum: ["home", "story", "projects", "skills", "insights", "connect"] } },
      required: ["section"]
    }
  },
  {
    name: "show_project",
    description: "Open a project's detail modal. Use when user says 'show me X project', 'open X'.",
    parameters: {
      type: "OBJECT",
      properties: { projectId: { type: "STRING", enum: ["horizoneurope", "neptun-api", "gmail-ai", "trading-bot", "filmu", "signalapp"] } },
      required: ["projectId"]
    }
  },
  {
    name: "get_contact_info",
    description: "Navigate to the contact section.",
    parameters: { type: "OBJECT", properties: {} }
  },
  {
    name: "download_resume",
    description: "Download Idrissa's CV/resume PDF.",
    parameters: { type: "OBJECT", properties: {} }
  },
  {
    name: "open_external_link",
    description: "Open GitHub, LinkedIn, Twitter/X, blog, or HorizonEurope in a new tab.",
    parameters: {
      type: "OBJECT",
      properties: { link: { type: "STRING", enum: ["github", "linkedin", "twitter", "blog", "horizoneurope"] } },
      required: ["link"]
    }
  },
  {
    name: "compose_email",
    description: "Open the visitor's email client to write to Idrissa.",
    parameters: {
      type: "OBJECT",
      properties: { subject: { type: "STRING", description: "Optional email subject line" } }
    }
  },
  {
    name: "highlight_skill",
    description: "Scroll to skills section and highlight a technology.",
    parameters: {
      type: "OBJECT",
      properties: { skill: { type: "STRING" } },
      required: ["skill"]
    }
  },
  {
    name: "show_stats",
    description: "Scroll to show Idrissa's achievements and metrics.",
    parameters: { type: "OBJECT", properties: {} }
  },
  {
    name: "toggle_theme",
    description: "Switch dark/light mode.",
    parameters: {
      type: "OBJECT",
      properties: { theme: { type: "STRING", enum: ["dark", "light"] } },
      required: ["theme"]
    }
  },
  {
    name: "get_blog_posts",
    description: "Fetch all blog posts with titles, content summaries, tags, and dates. Use this to answer questions about Idrissa's writing.",
    parameters: { type: "OBJECT", properties: {} }
  },
  {
    name: "send_message_to_idrissa",
    description: "Send a message to Idrissa on behalf of the visitor. Ask for name and email first if not provided.",
    parameters: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING" },
        email: { type: "STRING" },
        message: { type: "STRING" },
        subject: { type: "STRING" }
      },
      required: ["name", "email", "message"]
    }
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function executeToolServerSide(name: string, args: any): Promise<{ result: any; isClientAction: boolean }> {
  if (CLIENT_ACTIONS.has(name)) {
    return { result: { status: "dispatched", action: name, ...args }, isClientAction: true };
  }

  switch (name) {
    case "get_blog_posts": {
      try {
        const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000));
        const posts: BlogPost[] = await Promise.race([getAllPosts(), timeout]);
        return {
          result: {
            count: posts.length,
            posts: posts.map(p => ({
              title: p.title,
              slug: p.slug,
              date: p.date,
              description: p.description,
              tags: p.tags,
              readingTime: p.readingTime,
              url: `/blog/${p.slug}`,
              contentPreview: p.content.slice(0, 300).replace(/[#*\n]+/g, " ").trim(),
            }))
          },
          isClientAction: false
        };
      } catch {
        return { result: { error: "Could not fetch blog posts" }, isClientAction: false };
      }
    }
    case "send_message_to_idrissa": {
      return {
        result: { status: "message_queued", name: args.name, email: args.email },
        isClientAction: true
      };
    }
    default:
      return { result: { error: `Unknown tool: ${name}` }, isClientAction: false };
  }
}

async function callGemini(
  apiKey: string,
  messages: GeminiMessage[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools: any[],
): Promise<GeminiPart[]> {
  const payload = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: messages,
    tools: [{ functionDeclarations: tools }],
    tool_config: { function_calling_config: { mode: "AUTO" } },
    generationConfig: { temperature: 0.3, maxOutputTokens: 1024, topP: 0.95 },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Gemini API error:", res.status, err);
    throw new Error(`Gemini API error (${res.status})`);
  }

  const data = await res.json();
  const candidate = data.candidates?.[0];
  let parts: GeminiPart[] = candidate?.content?.parts || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasUsefulContent = parts.some((p: any) => p.text || p.functionCall);

  // Gemini 2.5 thinking mode can return parts with only thoughtSignature - retry
  if (!hasUsefulContent && messages.length > 0) {
    console.warn("Empty parts from Gemini, retrying without history");
    const lastUserMsg = messages.filter(m => m.role === "user").pop();
    const retryRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            { role: "user", parts: [{ text: PORTFOLIO_CONTEXT }] },
            { role: "model", parts: [{ text: "Ready." }] },
            { role: "user", parts: lastUserMsg?.parts || [{ text: "hello" }] },
          ],
          tools: [{ functionDeclarations: tools }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 512 },
        }),
      }
    );
    if (retryRes.ok) {
      const retryData = await retryRes.json();
      parts = retryData.candidates?.[0]?.content?.parts || [];
    }
  }

  return parts;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { userCommand, history } = body;

    if (!userCommand) {
      return NextResponse.json({ error: "Missing user command" }, { status: 400 });
    }

    const messages: GeminiMessage[] = [
      { role: "user", parts: [{ text: PORTFOLIO_CONTEXT }] },
      { role: "model", parts: [{ text: "I have Idrissa's full portfolio context loaded. How can I help?" }] },
      ...(Array.isArray(history) ? history.slice(-6).map((msg: { sender: string; text: string }) => ({
        role: (msg.sender === "User" ? "user" : "model") as "user" | "model",
        parts: [{ text: msg.text }],
      })) : []),
      { role: "user", parts: [{ text: userCommand }] },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let clientAction: { type: string; params: any } | undefined;
    let finalText = "";

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const parts = await callGemini(apiKey, messages, TOOL_DECLARATIONS);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const functionCalls = parts.filter((p: any) => p.functionCall);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const textParts = parts.filter((p: any) => p.text).map((p: any) => p.text);
      const text = textParts.join("\n").replace(/<think>[\s\S]*?<\/think>/g, "").trim();

      console.log(`Agent round ${round}:`, {
        partsCount: parts.length,
        functionCalls: functionCalls.map((fc: GeminiPart) => fc.functionCall?.name),
        hasText: !!text,
        textPreview: text?.slice(0, 100),
      });

      if (text) finalText = text;

      if (functionCalls.length === 0) break;

      messages.push({ role: "model", parts });

      // Execute each function call and collect results
      const functionResponseParts: GeminiPart[] = [];

      for (const fc of functionCalls) {
        const { name, args } = fc.functionCall!;
        const { result, isClientAction } = await executeToolServerSide(name, args || {});

        if (isClientAction && !clientAction) {
          clientAction = { type: name, params: args || {} };
        }

        functionResponseParts.push({
          functionResponse: { name, response: result }
        });
      }

      // Send tool results back to Gemini (user role with functionResponse parts per Gemini API spec)
      messages.push({ role: "user", parts: functionResponseParts });
    }

    if (!finalText) {
      if (clientAction) {
        const actionLabels: Record<string, string> = {
          navigate_to_section: `Taking you to the ${clientAction.params?.section || ""} section.`,
          show_project: "Opening that project for you!",
          get_contact_info: "Here's how you can reach Idrissa. Email: idrissa.maiga@iditechs.com",
          download_resume: "Starting the resume download now.",
          open_external_link: `Opening ${clientAction.params?.link || "the link"} in a new tab.`,
          compose_email: "Opening your email client to write to Idrissa.",
          highlight_skill: `Showing Idrissa's ${clientAction.params?.skill || ""} expertise.`,
          show_stats: "Here are Idrissa's key metrics and achievements.",
          toggle_theme: `Switched to ${clientAction.params?.theme || "the other"} mode.`,
          send_message_to_idrissa: "Your message has been sent to Idrissa. He'll get back to you soon!",
        };
        finalText = actionLabels[clientAction.type] || "Done!";
      } else {
        finalText = "I'm here to help! Ask me about Idrissa's projects, skills, experience, or how to get in touch.";
      }
    }

    return NextResponse.json({
      response: finalText,
      ...(clientAction && { action: clientAction }),
    });
  } catch (error) {
    console.error("AI endpoint error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
