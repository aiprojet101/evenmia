"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Ne pas re-afficher si déjà fermé ou déjà inscrit
    const dismissed = localStorage.getItem("newsletter-dismissed");
    const subscribed = localStorage.getItem("newsletter-subscribed");
    if (dismissed || subscribed) return;

    const timer = setTimeout(() => setShow(true), 30000); // 30s
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setShow(false);
    localStorage.setItem("newsletter-dismissed", "1");
  };

  const onSuccess = () => {
    localStorage.setItem("newsletter-subscribed", "1");
    setTimeout(() => setShow(false), 2500);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[var(--cream)] rounded-3xl shadow-2xl overflow-hidden"
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[var(--warm)] flex items-center justify-center text-[var(--text-light)] hover:text-[var(--text)] transition"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-2">
              <NewsletterForm
                title="Restez dans la magie"
                subtitle="Recevez mes coulisses, nouvelles créations et conseils chaque mois. Jamais de spam."
                onSuccess={onSuccess}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
