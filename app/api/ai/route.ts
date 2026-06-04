import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, getPostBySlug, BlogPost } from "@/lib/blog";

const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_TOOL_ROUNDS = 3;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Part = { text?: string; functionCall?: { name: string; args: any }; functionResponse?: { name: string; response: any } };
type Msg = { role: "user" | "model"; parts: Part[] };

const CLIENT_ACTIONS = new Set([
  "navigate_to_section", "show_project", "get_contact_info",
  "download_resume", "open_external_link", "compose_email",
  "highlight_skill", "show_stats",
]);

const SYSTEM = `You are Idrissa's AI — the intelligent assistant on his portfolio at idrissamaiga.iditechs.com.

PERSONALITY:
- Talk like a real person. Short, direct, natural language.
- NEVER say "I understand", "I apologize", "Could you clarify", "What specifically are you referring to", "Are you looking for", or any robotic customer-service phrasing.
- NEVER ask what the user is "referring to". NEVER list bullet-point options asking them to pick. That is the worst possible response.
- NEVER say "I cannot offer personal opinions" or "I have been trained on". You are not a generic AI. You are Idrissa's assistant and you know his work cold.
- Be confident. If the user is vague, give them something useful instead of asking questions back.

HANDLING VAGUE / CASUAL MESSAGES:
This is critical. People will say things like "what is this", "yo", "sup", "what", "huh", "tell me more", "it", "this shit". When they do:
- DO NOT ask for clarification. DO NOT list options. DO NOT say "what are you referring to?"
- Instead, give a quick, engaging overview of Idrissa or whatever you were last talking about.
- If there's no conversation history, introduce Idrissa: who he is, what he builds, what's impressive about him. Keep it 2-3 sentences max.
- If there IS conversation history, continue naturally from the last topic.
- Examples:
  - "what is this" → "This is Idrissa Maiga's portfolio. He's a full-stack engineer who builds AI-powered platforms, trading bots, and has reverse-engineered 1,100+ API endpoints. What do you want to know?"
  - "yo" → "Hey! I'm Idrissa's AI. He's a full-stack dev based in Budapest — Java, TypeScript, Python, AI. Ask me anything."
  - "huh" / "what" (after talking about a project) → Continue explaining that project naturally.
  - "tell me more" → Expand on whatever was discussed last. Never ask "more about what?"

TOOLS:
You have DATA tools (fetch real info) and ACTION tools (control the page).

DATA TOOLS — call these, get results back, then answer using the data:
- get_blog_posts: Fetch all blog articles. Use for questions about writing/posts/articles.
- get_blog_post_content: Fetch full content of a specific post by slug.
- send_message_to_idrissa: Send a message. Need name + email + message. Ask naturally if missing.

ACTION TOOLS — use ONLY when user explicitly wants to SEE/GO/OPEN/DOWNLOAD:
- navigate_to_section (home/story/projects/skills/insights/connect)
- show_project (horizoneurope/neptun-api/gmail-ai/trading-bot/filmu/signalapp)
- highlight_skill, show_stats, get_contact_info, download_resume
- open_external_link (github/linkedin/twitter/blog/horizoneurope)
- compose_email

RULES:
- "What projects?" → Answer from context. Don't navigate.
- "Show me projects" → navigate_to_section(projects).
- "What has he written?" → Call get_blog_posts, answer with real data.
- Under 200 words. Use **bold** and bullets when helpful.
- NEVER return empty text. NEVER ask clarifying questions. Always give value.`;

const CONTEXT = `IDRISSA MAIGA — Full-Stack Engineer

PERSONAL: Based in Budapest, Hungary. Born in Bamako, Mali. Email: idrissa.maiga@iditechs.com
EDUCATION: BSc Computer Software Engineering, Obuda University (Sep 2023 - Feb 2027). GPA: 8.7/10
LANGUAGES: English (Fluent), French (Native), Bambara (Native), Hungarian (Beginner)

EXPERIENCE:
1. Software Developer Intern — 4D Consulting Kft., Budapest (Aug 2025 - Present)
   Building the INDUSAC Innovation Ecosystem Matchmaking Platform. Spring Boot, PostgreSQL, React.js.
2. Full Stack Engineer — EISMEA / European Innovation Council (Jan 2025 - Jul 2025)
   Built horizoneurope.io from scratch. AI-powered EU funding guidance. Smart context engine, high-speed scrapers bypassing captchas, <2ms API responses. 5,000+ monthly users.

PROJECTS (detailed):
• horizoneurope — AI-powered EU funding platform. NLP categorization of 500+ funding opportunities, captcha-bypassing scrapers, sub-2ms APIs, 5K+ users. Tech: Next.js, Python, FastAPI, PostgreSQL, AWS, Docker. Live: horizoneurope.io
• neptun-api — Most complete Python wrapper for Hungary's Neptun university system. 1,100+ endpoints reverse-engineered across 75+ controllers. Automated JWT auth, MCP server for Claude/Cursor, Playwright automation. 25+ functional areas. Tech: Python, Playwright, MCP Protocol. GitHub: IdrissaMaiga/neptun-api
• trading-bot — Automated BUY-only grid trading bot for XAUUSD on MetaTrader 5. Pure grid mechanics, no indicators. Real-time web dashboard, tick-based backtester with real MT5 data, 32 tests passing. Auto pause/resume after stop-loss. Tech: Python, MetaTrader 5, WebSockets. GitHub: IdrissaMaiga/trading-bot
• gmail-ai — AI-powered Gmail automation. Dual LLM (DeepSeek R1 + Mistral AI). OAuth 2.0, email categorization, priority detection, smart response generation, batch processing 1K+ emails. Tech: Next.js, TypeScript, Google OAuth, DeepSeek, Mistral. GitHub: IdrissaMaiga/gmail-ai-agent
• filmu — Full VOD streaming platform. HLS adaptive streaming, live TV, subscriptions, admin dashboard, referral program, M3U processing. Netflix-like experience. Tech: React, Node.js, Express, MongoDB, Prisma, HLS.js. GitHub: IdrissaMaiga/filmu-server
• signalapp — Real-time forex/binary trading signals app. Firebase Realtime DB, Google Sign-In, admin/sender panel, role-based access, push notifications, haptic feedback. Tech: React Native, Expo 52, TypeScript, Firebase. GitHub: IdrissaMaiga/signal-app

SKILLS: Java, JavaScript, TypeScript, Python, C#, SQL | Spring Boot, Node.js, Express, FastAPI, .NET Core | React, Next.js, Vue.js, React Native, Tailwind | PostgreSQL, MongoDB, MySQL, Redis, Firebase | AWS, Docker, Kubernetes, Git, GitHub Actions | OpenAI, DeepSeek, Mistral, Groq, LangChain, TensorFlow

CERTIFICATIONS: CCNA, Spring Boot & Microservices, MERN Stack, ASP.NET Core, Kennedy Lugar YES Program Scholar, INDUSAC Co-Creation

METRICS: 28+ projects, 530+ commits, 5,000+ users served, 1,100+ API endpoints mapped, 8.7 GPA`;

const TOOLS = [
  {
    name: "navigate_to_section",
    description: "Scroll the page to a section. Only use when user explicitly wants to GO somewhere.",
    parameters: {
      type: "OBJECT",
      properties: { section: { type: "STRING", enum: ["home", "story", "projects", "skills", "insights", "connect"] } },
      required: ["section"]
    }
  },
  {
    name: "show_project",
    description: "Open a project detail modal. Only use when user wants to SEE/OPEN a specific project.",
    parameters: {
      type: "OBJECT",
      properties: { projectId: { type: "STRING", enum: ["horizoneurope", "neptun-api", "gmail-ai", "trading-bot", "filmu", "signalapp"] } },
      required: ["projectId"]
    }
  },
  { name: "get_contact_info", description: "Navigate to contact section.", parameters: { type: "OBJECT", properties: {} } },
  { name: "download_resume", description: "Download Idrissa's CV PDF.", parameters: { type: "OBJECT", properties: {} } },
  {
    name: "open_external_link",
    description: "Open an external page in a new tab.",
    parameters: {
      type: "OBJECT",
      properties: { link: { type: "STRING", enum: ["github", "linkedin", "twitter", "blog", "horizoneurope"] } },
      required: ["link"]
    }
  },
  {
    name: "compose_email",
    description: "Open visitor's email client to write to Idrissa.",
    parameters: { type: "OBJECT", properties: { subject: { type: "STRING" } } }
  },
  {
    name: "highlight_skill",
    description: "Scroll to skills and highlight a specific technology.",
    parameters: { type: "OBJECT", properties: { skill: { type: "STRING" } }, required: ["skill"] }
  },
  { name: "show_stats", description: "Scroll to show metrics and achievements.", parameters: { type: "OBJECT", properties: {} } },
  {
    name: "get_blog_posts",
    description: "Fetch all blog posts with titles, dates, tags, content previews, and reading times. Call this for ANY question about Idrissa's writing, articles, blog, or published content.",
    parameters: { type: "OBJECT", properties: {} }
  },
  {
    name: "get_blog_post_content",
    description: "Fetch the full content of a specific blog post by slug. Use when user asks about a specific article in detail.",
    parameters: {
      type: "OBJECT",
      properties: { slug: { type: "STRING", description: "The post slug (e.g. network-security-fundamentals)" } },
      required: ["slug"]
    }
  },
  {
    name: "send_message_to_idrissa",
    description: "Send a message to Idrissa. Requires visitor's name, email, and message. If not provided, ask for them first — do NOT guess.",
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
async function executeTool(name: string, args: any): Promise<{ data: any; clientAction: boolean }> {
  if (CLIENT_ACTIONS.has(name)) {
    return { data: { status: "done", action: name, ...args }, clientAction: true };
  }

  switch (name) {
    case "get_blog_posts": {
      const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 5000));
      try {
        const posts: BlogPost[] = await Promise.race([getAllPosts(), timeout]);
        return {
          data: {
            count: posts.length,
            posts: posts.map(p => ({
              title: p.title, slug: p.slug, date: p.date,
              description: p.description, tags: p.tags,
              readingTime: p.readingTime, url: `/blog/${p.slug}`,
              preview: p.content.slice(0, 400).replace(/[#*\n]+/g, " ").trim(),
            }))
          },
          clientAction: false
        };
      } catch {
        return { data: { error: "Blog temporarily unavailable" }, clientAction: false };
      }
    }
    case "get_blog_post_content": {
      const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 5000));
      try {
        const post = await Promise.race([getPostBySlug(args.slug), timeout]);
        if (!post) return { data: { error: `Post "${args.slug}" not found` }, clientAction: false };
        return {
          data: {
            title: post.title, date: post.date, tags: post.tags,
            readingTime: post.readingTime,
            content: post.content.slice(0, 2000),
            url: `/blog/${post.slug}`,
          },
          clientAction: false
        };
      } catch {
        return { data: { error: "Could not fetch post" }, clientAction: false };
      }
    }
    case "send_message_to_idrissa":
      return { data: { status: "message_queued", recipient: "idrissa.maiga@iditechs.com" }, clientAction: true };
    default:
      return { data: { error: `Unknown tool: ${name}` }, clientAction: false };
  }
}

async function gemini(apiKey: string, messages: Msg[], tools: typeof TOOLS): Promise<Part[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents: messages,
        tools: [{ functionDeclarations: tools }],
        tool_config: { function_calling_config: { mode: "AUTO" } },
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024, topP: 0.95, thinkingConfig: { thinkingBudget: 0 } },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Gemini error:", res.status, err.slice(0, 200));
    throw new Error(`Gemini ${res.status}`);
  }

  const data = await res.json();
  let parts: Part[] = data.candidates?.[0]?.content?.parts || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!parts.some((p: any) => p.text || p.functionCall)) {
    const last = messages.filter(m => m.role === "user").pop();
    const retry = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: [
            { role: "user", parts: [{ text: CONTEXT }] },
            { role: "model", parts: [{ text: "Ready." }] },
            { role: "user", parts: last?.parts || [{ text: "hello" }] },
          ],
          tools: [{ functionDeclarations: tools }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 512, thinkingConfig: { thinkingBudget: 0 } },
        }),
      }
    );
    if (retry.ok) {
      parts = (await retry.json()).candidates?.[0]?.content?.parts || [];
    }
  }

  return parts;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "AI not configured" }, { status: 500 });

    const { userCommand, history } = await req.json();
    if (!userCommand) return NextResponse.json({ error: "No message" }, { status: 400 });

    const messages: Msg[] = [
      { role: "user", parts: [{ text: CONTEXT }] },
      { role: "model", parts: [{ text: "Loaded. I know everything about Idrissa — projects, skills, experience, blog, metrics. What do you want to know?" }] },
      ...(Array.isArray(history) ? history.slice(-8).map((m: { sender: string; text: string }) => ({
        role: (m.sender === "User" ? "user" : "model") as Msg["role"],
        parts: [{ text: m.text }],
      })) : []),
      { role: "user", parts: [{ text: userCommand }] },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let action: { type: string; params: any } | undefined;
    let text = "";

    for (let i = 0; i < MAX_TOOL_ROUNDS; i++) {
      const parts = await gemini(apiKey, messages, TOOLS);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const calls = parts.filter((p: any) => p.functionCall);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = parts.filter((p: any) => p.text).map((p: any) => p.text).join("\n").replace(/<think>[\s\S]*?<\/think>/g, "").trim();

      if (t) text = t;
      if (!calls.length) break;

      messages.push({ role: "model", parts });

      const responses: Part[] = [];
      for (const c of calls) {
        const { name, args } = c.functionCall!;
        const { data, clientAction } = await executeTool(name, args || {});
        if (clientAction && !action) action = { type: name, params: args || {} };
        responses.push({ functionResponse: { name, response: data } });
      }

      messages.push({ role: "user", parts: responses });
    }

    if (!text) {
      if (action) {
        const labels: Record<string, string> = {
          navigate_to_section: `Scrolling to **${action.params?.section}** now.`,
          show_project: "Opening that project for you.",
          get_contact_info: "Here's the contact section — reach Idrissa at **idrissa.maiga@iditechs.com**.",
          download_resume: "Downloading Idrissa's resume.",
          open_external_link: `Opening **${action.params?.link}** in a new tab.`,
          compose_email: "Opening your email client.",
          highlight_skill: `Highlighting **${action.params?.skill}** in the skills section.`,
          show_stats: "Showing Idrissa's key metrics.",
          send_message_to_idrissa: "Your message has been sent to Idrissa.",
        };
        text = labels[action.type] || "Done.";
      } else {
        text = "What would you like to know about Idrissa? I can tell you about his projects, skills, experience, blog posts, or help you get in touch.";
      }
    }

    return NextResponse.json({ response: text, ...(action && { action }) });
  } catch (err) {
    console.error("Agent error:", err);
    return NextResponse.json({ error: "Agent error", details: err instanceof Error ? err.message : "Unknown" }, { status: 500 });
  }
}
