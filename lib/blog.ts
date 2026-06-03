import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  image: string;
  linkedinPosted: boolean;
  readingTime: number;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
  return files
    .map(file => getPostBySlug(file.replace('.mdx', '')))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const rt = readingTime(content);
  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    tags: data.tags || [],
    description: data.description || '',
    image: data.image || '',
    linkedinPosted: data.linkedinPosted || false,
    readingTime: Math.ceil(rt.minutes),
    content,
  };
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''));
}
