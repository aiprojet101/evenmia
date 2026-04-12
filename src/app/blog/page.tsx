import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import { config } from "@/lib/config";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: `Blog — Conseils événementiel | ${config.brand}`,
  description: `Conseils et inspirations pour vos événements : mariages, baptêmes, anniversaires, séminaires. Le blog ${config.brand}.`,
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="bg-white border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[var(--text-light)] hover:text-[var(--text)] transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <span className="text-rose-gradient font-bold">{config.brand}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <p className="text-[var(--rose)] text-sm font-medium uppercase tracking-widest mb-3">Blog</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4">
            Conseils & <span className="text-rose-gradient">inspirations</span>
          </h1>
          <p className="text-[var(--text-light)] max-w-lg mx-auto">
            Idées, tendances et guides pratiques pour vos événements.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-[var(--text-lighter)]">Articles a venir...</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-light p-6 sm:p-8 block group hover:bg-white transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs bg-[var(--rose)]/10 text-[var(--rose-dark)] px-3 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {post.category}
                  </span>
                  <span className="text-xs text-[var(--text-lighter)] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                  <span className="text-xs text-[var(--text-lighter)]">{post.date}</span>
                </div>
                <h2 className="text-xl font-bold text-[var(--text)] group-hover:text-[var(--rose)] transition mb-2">
                  {post.title}
                </h2>
                <p className="text-[var(--text-light)] text-sm leading-relaxed">{post.description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-[var(--rose)] font-medium mt-4 group-hover:gap-2 transition-all">
                  Lire l&apos;article <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
