"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, Loader2, Sparkles } from "lucide-react";

interface Props {
  variant?: "inline" | "card" | "popup";
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
}

export default function NewsletterForm({
  variant = "card",
  title = "Ne manquez rien",
  subtitle = "Inscrivez-vous à ma newsletter mensuelle : inspirations, coulisses et conseils.",
  onSuccess,
}: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue");
      } else {
        setSuccess(true);
        onSuccess?.();
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--sage)]/20 flex items-center justify-center">
          <Check className="w-7 h-7 text-[var(--sage)]" />
        </div>
        <p className="font-bold text-[var(--text)] mb-1">Merci !</p>
        <p className="text-sm text-[var(--text-light)]">Vous êtes bien inscrit(e) à la newsletter.</p>
      </motion.div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Votre email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-light flex-1"
        />
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-rose !px-6 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>S&apos;inscrire <Mail className="w-4 h-4" /></>}
        </motion.button>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </form>
    );
  }

  return (
    <div className="card-light p-8 text-center bg-gradient-to-br from-[var(--gold-light)]/10 to-[var(--rose)]/5">
      <motion.div
        animate={{ rotate: [0, 8, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--gold)] to-[var(--rose)] flex items-center justify-center shadow-md"
      >
        <Sparkles className="w-7 h-7 text-white" />
      </motion.div>
      <h3 className="text-xl font-bold text-[var(--text)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-light)] mb-5">{subtitle}</p>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Votre prénom (optionnel)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-light"
        />
        <input
          type="email"
          placeholder="Votre email *"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-light"
        />
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-rose w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Inscription...</>
          ) : (
            <>Je m&apos;inscris <Mail className="w-4 h-4" /></>
          )}
        </motion.button>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        <p className="text-xs text-[var(--text-lighter)] mt-3">
          Pas de spam. Désinscription en 1 clic. Vos données restent privées.
        </p>
      </form>
    </div>
  );
}
