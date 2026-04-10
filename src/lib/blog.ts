import { promises as fs } from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function parseFrontmatter(raw: string): { meta: Record<string, string>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };
  const meta: Record<string, string> = {};
  match[1].split("\n").forEach(line => {
    const [key, ...rest] = line.split(": ");
    if (key && rest.length) meta[key.trim()] = rest.join(": ").trim();
  });
  return { meta, content: match[2].trim() };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const posts: BlogPost[] = [];

    for (const file of files.filter(f => f.endsWith(".md"))) {
      const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf-8");
      const { meta, content } = parseFrontmatter(raw);
      posts.push({
        slug: file.replace(".md", ""),
        title: meta.title || file.replace(".md", ""),
        description: meta.description || "",
        date: meta.date || "",
        category: meta.category || "Conseil",
        readTime: meta.readTime || "3 min",
        content,
      });
    }

    return posts.sort((a, b) => (b.date > a.date ? 1 : -1));
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.md`), "utf-8");
    const { meta, content } = parseFrontmatter(raw);
    return {
      slug,
      title: meta.title || slug,
      description: meta.description || "",
      date: meta.date || "",
      category: meta.category || "Conseil",
      readTime: meta.readTime || "3 min",
      content,
    };
  } catch {
    return null;
  }
}
