import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

const GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are an AI assistant representing Idrissa Maiga's portfolio website. You have expertise in Java, JavaScript/TypeScript, Python, Spring Boot, React, Next.js, and AI projects. Be friendly and professional. Keep responses under 250 words. If asked about contacting Idrissa, direct them to idrissa.maiga@iditechs.com.

You have powerful tools to interact with the portfolio website. Use them proactively when relevant:

NAVIGATION:
- navigate_to_section: Scroll to any section (home, story, projects, skills, insights, connect)
- show_project: Open a project detail modal (horizoneurope, neptun-api, gmail-ai, trading-bot, filmu, signalapp)
- highlight_skill: Scroll to skills and highlight a specific technology
- show_stats: Show key achievements and metrics

ACTIONS:
- download_resume: Download Idrissa's CV/resume PDF
- compose_email: Open email client to write to Idrissa (can set subject line)
- toggle_theme: Switch between dark and light mode

EXTERNAL LINKS:
- open_external_link: Open GitHub, LinkedIn, Twitter/X, blog, or HorizonEurope.io in a new tab

BEHAVIOR:
- Be conversational and helpful. Answer questions naturally with useful information.
- Use tools ONLY when the user explicitly asks to SEE, OPEN, DOWNLOAD, NAVIGATE, or DO something.
- Examples of when to use tools: "show me projects" → navigate. "download resume" → download. "open GitHub" → open link. "I want to hire him, my email is X" → send_message.
- Examples of when NOT to use tools: "what projects has he built?" → just describe them. "tell me about his skills" → just answer. "what's his experience?" → just explain. "what's his latest post about?" → describe the blog post from your context.
- You have FULL knowledge of Idrissa's blog posts including their content. When asked about posts, articles, or writing, answer directly from context. Describe the content, topics, and key points. Do NOT just redirect to the blog.
- ALWAYS include a helpful text response. Never return empty text.
- Keep responses concise (under 200 words) but informative.
- When using a tool, briefly explain what you're doing in text too.`;

const PORTFOLIO_CONTEXT = `
You are an assistant representing Idrissa Maiga's portfolio. Here is accurate information about him:

- Name: Idrissa Maiga
- Role: Full-Stack Engineer specializing in Java, JavaScript/TypeScript, and Python
- Location: Budapest, Hungary (born in Bamako, Mali)
- Email: idrissa.maiga@iditechs.com
- Education: BSc Computer Software Engineering at Óbuda University, Budapest (Sep 2023 - Feb 2027), GPA: 8.7/10
- Languages: English (Fluent), French (Native), Bambara (Native), Hungarian (Beginner)

Experience:
- Software Developer Intern at 4D Consulting Kft., Budapest (Aug 2025 - Present)
  - Contributing to INDUSAC Innovation Ecosystem Matchmaking Platform
  - Working with Spring Boot, PostgreSQL, React.js
- Full Stack Engineer at EISMEA (European Innovation Council), Hungary (Jan 2025 - Jul 2025)
  - Built horizoneurope.io - AI-powered EU funding guidance platform
  - Smart context management engine, high-speed scrapers, real-time API responses under 2ms
  - Platform serves 5,000+ monthly users

Key Projects:
- neptun-api: Most complete Python wrapper for Hungary's Neptun university system (1,100+ endpoints, MCP server support)
- tradingBot: Automated grid trading bot for XAUUSD on MetaTrader 5 (111 commits, web dashboard, backtester)
- GmailAi-MistraiAI: AI-powered Gmail automation with dual LLM support (DeepSeek R1 + Mistral AI)
- FilmuApp-MERN-STACK: Full VOD streaming platform with HLS, live TV, subscriptions
- MedicalProjectHackathon: Medical learning materials generator with AI quiz generation
- SignalApp: React Native forex/binary trading signals app with Firebase
- Claude-Code-Security-Analysis: Security research on Claude Code, reported via HackerOne #3642470
- IdrissaMaigaProject: .NET MAUI AI shopping assistant with Gemini API, Docker/Kubernetes

Skills:
- Languages: Java, JavaScript, TypeScript, Python, C#, SQL
- Backend: Spring Boot, Node.js, Express, FastAPI, .NET Core
- Frontend: React, Next.js, Vue.js, React Native, Tailwind CSS
- Databases: PostgreSQL, MongoDB, MySQL, Redis, Firebase
- Cloud/DevOps: AWS, Docker, Kubernetes, Git, GitHub Actions
- AI/ML: OpenAI, DeepSeek, Mistral, Groq, LangChain, TensorFlow

Certifications: HÖOK SHMN Mentor Camp 2025, INDUSAC Co-Creation Certificate, Spring Boot & Microservices, MERN Stack, ASP.NET Core, CCNA, Kennedy Lugar YES Program Scholar

Interests: AI development, cloud technologies, algorithmic challenges (LeetCode), building scalable solutions
`;

async function getBlogContext(): Promise<string> {
  try {
    const posts = await getAllPosts();
    if (posts.length === 0) return "\nBlog: No posts published yet.";
    return "\nBlog Posts:\n" + posts.map(p =>
      `- "${p.title}" (${p.date}) - ${p.description} [Tags: ${p.tags.join(", ")}] [URL: /blog/${p.slug}]\n  Content summary: ${p.content.slice(0, 500).replace(/[#*\n]+/g, " ").trim()}...`
    ).join("\n");
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured properly" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { userCommand, history } = body;

    if (!userCommand) {
      return NextResponse.json(
        { error: "Missing user command" },
        { status: 400 }
      );
    }

    const tools = [{
      functionDeclarations: [
        {
          name: "navigate_to_section",
          description: "Scroll the page to a specific section to show it to the visitor",
          parameters: {
            type: "OBJECT",
            properties: {
              section: {
                type: "STRING",
                enum: ["home", "story", "projects", "skills", "insights", "connect"],
                description: "The section to navigate to"
              }
            },
            required: ["section"]
          }
        },
        {
          name: "show_project",
          description: "Open a specific project's detail view to show it to the visitor",
          parameters: {
            type: "OBJECT",
            properties: {
              projectId: {
                type: "STRING",
                enum: ["horizoneurope", "neptun-api", "gmail-ai", "trading-bot", "filmu", "signalapp"],
                description: "The project ID to show"
              }
            },
            required: ["projectId"]
          }
        },
        {
          name: "get_contact_info",
          description: "Scroll to the contact section and show Idrissa's contact information",
          parameters: {
            type: "OBJECT",
            properties: {},
          }
        },
        {
          name: "toggle_theme",
          description: "Switch between dark and light mode",
          parameters: {
            type: "OBJECT",
            properties: {
              theme: {
                type: "STRING",
                enum: ["dark", "light"],
                description: "The theme to switch to"
              }
            },
            required: ["theme"]
          }
        },
        {
          name: "download_resume",
          description: "Trigger download of Idrissa's CV/resume PDF",
          parameters: {
            type: "OBJECT",
            properties: {},
          }
        },
        {
          name: "open_external_link",
          description: "Open an external link like GitHub, LinkedIn, or the blog in a new tab",
          parameters: {
            type: "OBJECT",
            properties: {
              link: {
                type: "STRING",
                enum: ["github", "linkedin", "twitter", "blog", "horizoneurope"],
                description: "Which link to open"
              }
            },
            required: ["link"]
          }
        },
        {
          name: "compose_email",
          description: "Open the user's email client to compose an email to Idrissa",
          parameters: {
            type: "OBJECT",
            properties: {
              subject: {
                type: "STRING",
                description: "Optional email subject line"
              }
            },
          }
        },
        {
          name: "highlight_skill",
          description: "Scroll to the skills section and highlight a specific technology or skill category",
          parameters: {
            type: "OBJECT",
            properties: {
              skill: {
                type: "STRING",
                description: "The skill or category to highlight (e.g. Java, React, AI/ML)"
              }
            },
            required: ["skill"]
          }
        },
        {
          name: "show_stats",
          description: "Scroll to show Idrissa's key metrics and achievements (projects count, commits, users served, etc.)",
          parameters: {
            type: "OBJECT",
            properties: {},
          }
        },
        {
          name: "get_blog_posts",
          description: "Fetch the list of blog posts with their titles, descriptions, tags, and dates. Use this when someone asks about blog posts, articles, latest writing, or what Idrissa has published.",
          parameters: {
            type: "OBJECT",
            properties: {},
          }
        },
        {
          name: "send_message_to_idrissa",
          description: "Send a message directly to Idrissa on behalf of the visitor. Use this when someone says they're interested in working with him, wants to hire him, or wants to leave a message. Ask for their name and email first if not provided.",
          parameters: {
            type: "OBJECT",
            properties: {
              name: {
                type: "STRING",
                description: "The visitor's name"
              },
              email: {
                type: "STRING",
                description: "The visitor's email address"
              },
              message: {
                type: "STRING",
                description: "The message to send to Idrissa"
              },
              subject: {
                type: "STRING",
                description: "Email subject line"
              }
            },
            required: ["name", "email", "message"]
          }
        }
      ]
    }];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [{ text: PORTFOLIO_CONTEXT + await getBlogContext() }],
            },
            {
              role: "model",
              parts: [{ text: "Understood. I have Idrissa's full portfolio context. I will use tools proactively and maintain conversation context. How can I help?" }],
            },
            ...(Array.isArray(history) ? history.slice(-6).map((msg: { sender: string; text: string }) => ({
              role: msg.sender === "User" ? "user" : "model",
              parts: [{ text: msg.text }],
            })) : []),
            {
              role: "user",
              parts: [
                {
                  text: `${userCommand}\n\n[Use a tool ONLY when the user explicitly asks to see, open, download, or navigate to something. For general questions, just respond with text. Always include a text response alongside any tool call.]`,
                },
              ],
            },
          ],
          tools,
          tool_config: {
            function_calling_config: {
              mode: "AUTO",
            },
          },
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
            topP: 0.95,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return NextResponse.json(
        { error: "Failed to generate AI response" },
        { status: 500 }
      );
    }

    const data = await response.json();

    console.log("Gemini raw:", JSON.stringify({
      candidates: data.candidates?.length,
      finishReason: data.candidates?.[0]?.finishReason,
      partsCount: data.candidates?.[0]?.content?.parts?.length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      partTypes: data.candidates?.[0]?.content?.parts?.map((p: any) => Object.keys(p)),
      feedback: data.promptFeedback,
    }));

    if (!data.candidates || data.candidates.length === 0) {
      console.error("No candidates:", JSON.stringify(data));
      return NextResponse.json({ response: "I can help you learn about Idrissa's work. Try asking about his projects, skills, or how to contact him." });
    }

    const candidate = data.candidates[0];
    let parts = candidate?.content?.parts || [];

    // If Gemini returned empty parts (thinking mode quirk), retry without history
    if (parts.length === 0) {
      console.log("Empty parts — retrying simple request");
      const retryRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [
              { role: "user", parts: [{ text: userCommand }] },
            ],
            tools,
            generationConfig: { temperature: 0.5, maxOutputTokens: 512 },
          }),
        }
      );
      if (retryRes.ok) {
        const retryData = await retryRes.json();
        parts = retryData.candidates?.[0]?.content?.parts || [];
      }
    }

    // Find function calls and text across all parts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const functionCall = parts.find((p: any) => p.functionCall);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textParts = parts.filter((p: any) => p.text).map((p: any) => p.text);
    const textPart = { text: textParts.join("\n").trim() || undefined };

    if (functionCall) {
      const actionName = functionCall.functionCall.name;
      const actionParams = functionCall.functionCall.args || {};

      let fallbackText = textPart?.text || "";
      if (!fallbackText) {
        switch (actionName) {
          case "navigate_to_section":
            fallbackText = `Taking you to the ${actionParams.section || ""} section now.`;
            break;
          case "show_project":
            fallbackText = `Opening that project for you — take a look!`;
            break;
          case "get_contact_info":
            fallbackText = `Here's how you can reach Idrissa. You can email him at idrissa.maiga@iditechs.com or use the contact form.`;
            break;
          case "toggle_theme":
            fallbackText = `Switched to ${actionParams.theme || "the other"} mode.`;
            break;
          case "download_resume":
            fallbackText = `Starting the resume download for you now.`;
            break;
          case "open_external_link":
            const linkNames: Record<string, string> = { github: "GitHub", linkedin: "LinkedIn", twitter: "Twitter/X", blog: "the blog", horizoneurope: "HorizonEurope.io" };
            fallbackText = `Opening ${linkNames[actionParams.link] || actionParams.link} in a new tab.`;
            break;
          case "compose_email":
            fallbackText = `Opening your email client to write to Idrissa.`;
            break;
          case "highlight_skill":
            fallbackText = `Let me show you Idrissa's ${actionParams.skill} expertise.`;
            break;
          case "show_stats":
            fallbackText = `Here are Idrissa's key achievements and metrics.`;
            break;
          case "get_blog_posts": {
            const posts = await getAllPosts();
            if (posts.length > 0) {
              fallbackText = `Idrissa has ${posts.length} blog post${posts.length > 1 ? "s" : ""}:\n\n` +
                posts.map(p => `**${p.title}** (${p.date})\n${p.description}\nTags: ${p.tags.join(", ")}`).join("\n\n");
            } else {
              fallbackText = "Idrissa hasn't published any blog posts yet, but they're coming soon!";
            }
            break;
          }
          case "send_message_to_idrissa":
            fallbackText = `I've sent your message to Idrissa. He'll get back to you soon!`;
            break;
          default:
            fallbackText = `Done! Let me show you that.`;
        }
      }

      return NextResponse.json({
        response: fallbackText,
        action: { type: actionName, params: actionParams },
      });
    }

    let fullResponse = textPart?.text || "";
    fullResponse = fullResponse.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    if (!fullResponse) {
      fullResponse = "I'm here to help! You can ask me about Idrissa's projects, skills, experience, or how to get in touch with him.";
    }

    return NextResponse.json({ response: fullResponse });
  } catch (error) {
    console.error("Error in AI endpoint:", error);
    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
