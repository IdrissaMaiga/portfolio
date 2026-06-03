"use client";

import { useEffect } from "react";

const EXTERNAL_LINKS: Record<string, string> = {
  github: "https://github.com/IdrissaMaiga",
  linkedin: "https://www.linkedin.com/in/idrissa-maiga-16581b245/",
  twitter: "https://x.com/a_idrissamaiga",
  blog: "/blog",
  horizoneurope: "https://horizoneurope.io",
};

export default function ActionListener() {
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { type, params } = e.detail;

      switch (type) {
        case "navigate_to_section": {
          const el = document.getElementById(params.section);
          if (el) el.scrollIntoView({ behavior: "smooth" });
          break;
        }
        case "show_project": {
          window.dispatchEvent(
            new CustomEvent("open-project", {
              detail: { projectId: params.projectId },
            })
          );
          const projects = document.getElementById("projects");
          if (projects) projects.scrollIntoView({ behavior: "smooth" });
          break;
        }
        case "get_contact_info": {
          const connect = document.getElementById("connect");
          if (connect) connect.scrollIntoView({ behavior: "smooth" });
          break;
        }
        case "toggle_theme": {
          document.documentElement.classList.toggle("dark", params.theme === "dark");
          document.documentElement.classList.toggle("light", params.theme === "light");
          break;
        }
        case "download_resume": {
          const link = document.createElement("a");
          link.href = "/IdrissaMaigaCV.pdf";
          link.download = "IdrissaMaiga_Resume.pdf";
          link.click();
          break;
        }
        case "open_external_link": {
          const url = EXTERNAL_LINKS[params.link];
          if (url) {
            if (url.startsWith("/")) {
              window.location.href = url;
            } else {
              window.open(url, "_blank", "noopener,noreferrer");
            }
          }
          break;
        }
        case "compose_email": {
          const subject = params.subject ? `?subject=${encodeURIComponent(params.subject)}` : "";
          window.open(`mailto:idrissa.maiga@iditechs.com${subject}`, "_self");
          break;
        }
        case "highlight_skill": {
          const skills = document.getElementById("skills");
          if (skills) skills.scrollIntoView({ behavior: "smooth" });
          break;
        }
        case "show_stats": {
          const story = document.getElementById("story");
          if (story) {
            story.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
              const stats = story.querySelector("[class*='stats']") || story.querySelector("[class*='counter']");
              if (stats) stats.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 500);
          }
          break;
        }
        case "get_blog_posts": {
          const insights = document.getElementById("insights");
          if (insights) insights.scrollIntoView({ behavior: "smooth" });
          break;
        }
        case "send_message_to_idrissa": {
          fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: params.name || "Portfolio Visitor",
              email: params.email || "via-ai-agent@portfolio",
              subject: params.subject || "Message via AI Assistant",
              message: params.message,
            }),
          }).catch(() => {});
          break;
        }
      }
    };

    window.addEventListener("portfolio-action", handler as EventListener);
    return () => window.removeEventListener("portfolio-action", handler as EventListener);
  }, []);

  return null;
}
