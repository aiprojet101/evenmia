import Link from "next/link";
import { ArrowLeft, Clock, Tag, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { config } from "@/lib/config";
import { getPostBySlug, getAllPosts } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — ${config.brand}`,
    description: post.description,
  };
}

function renderMarkdown(content: string) {
  // Simple markdown to HTML
  const lines = content.split("\n");
  const html: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h2 class="text-2xl font-bold text-[var(--text)] mt-10 mb-4">${line.slice(3)}</h2>`);
    } else if (line.startsWith("### ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h3 class="text-lg font-bold text-[var(--text)] mt-8 mb-3">${line.slice(4)}</h3>`);
    } else if (line.startsWith("- ")) {
      if (!inList) { html.push('<ul class="space-y-2 my-4">'); inList = true; }
      const text = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text)]">$1</strong>');
      html.push(`<li class="flex items-start gap-2 text-[var(--text-light)]"><span class="text-[var(--rose)] mt-1">•</span><span>${text}</span></li>`);
    } else if (line.match(/^\d+\. /)) {
      if (inList) { html.push("</ul>"); inList = false; }
      const text = line.replace(/^\d+\. /, "").replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text)]">$1</strong>');
      html.push(`<p class="text-[var(--text-light)] leading-relaxed my-2 pl-4">${line.match(/^\d+/)?.[0]}. ${text}</p>`);
    } else if (line.trim() === "") {
      if (inList) { html.push("</ul>"); inList = false; }
    } else {
      if (inList) { html.push("</ul>"); inList = false; }
      const text = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text)]">$1</strong>');
      html.push(`<p class="text-[var(--text-light)] leading-relaxed my-4">${text}</p>`);
    }
  }
  if (inList) html.push("</ul>");
  return html.join("\n");
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="bg-white border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-[var(--text-light)] hover:text-[var(--text)] transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Blog
          </Link>
          <Link href="/" className="text-rose-gradient font-bold">{config.brand}</Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs bg-[var(--rose)]/10 text-[var(--rose-dark)] px-3 py-1 rounded-full flex items-center gap-1">
            <Tag className="w-3 h-3" /> {post.category}
          </span>
          <span className="text-xs text-[var(--text-lighter)] flex items-center gap-1">
            <Clock className="w-3 h-3" /> {post.readTime}
          </span>
          <span className="text-xs text-[var(--text-lighter)]">{post.date}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4 leading-tight">{post.title}</h1>
        <p className="text-lg text-[var(--text-light)] mb-10">{post.description}</p>

        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />

        {/* CTA */}
        <div className="mt-16 card-light p-8 text-center bg-white">
          <h3 className="text-xl font-bold text-[var(--text)] mb-2">Besoin d&apos;aide pour votre evenement ?</h3>
          <p className="text-[var(--text-light)] mb-6">Devis gratuit en 2 minutes. Reponse sous 24h.</p>
          <Link href="/devis" className="btn-rose inline-flex items-center gap-2">
            Demander un devis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}
