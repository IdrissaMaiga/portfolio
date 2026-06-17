export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  location: string;
  birthPlace: string;
  languages: { name: string; level: string }[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  dates: string;
  location: string;
  description: string;
  current: boolean;
}

export interface Education {
  degree: string;
  school: string;
  dates: string;
  gpa: string;
  coursework: string;
  activities: string;
}

export interface Certification {
  name: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  techStack: string[];
  features: string[];
  challenges: string[];
  solution: string;
  image: string;
  additionalImages: string[];
  githubLink: string | null;
  liveLink: string | null;
}

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  color: string;
  darkColor: string;
  skills: Skill[];
}

export interface SocialLink {
  name: string;
  href: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'email';
}

export interface PortfolioData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education;
  certifications: Certification[];
  projects: Project[];
  skillCategories: SkillCategory[];
  socialLinks: SocialLink[];
  heroTitles: string[];
}
