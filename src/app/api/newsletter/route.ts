import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // Save to local JSON
    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });
    const filePath = path.join(dataDir, "newsletter.json");

    let existing: { email: string; name?: string; subscribedAt: string }[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      existing = JSON.parse(raw);
    } catch {
      // File doesn't exist yet
    }

    // Eviter doublons
    if (existing.some((s) => s.email === email)) {
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    existing.push({ email, name: name || undefined, subscribedAt: new Date().toISOString() });
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2));

    // Envoi email de bienvenue via Resend (si configure)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Anaïs d'Evenmia <contact@evenmia.fr>",
          to: email,
          subject: "Bienvenue dans la famille Evenmia !",
          html: buildWelcomeEmail(name || ""),
        }),
      }).catch(() => {});
    }

    // Notification Telegram (nouvelle inscription)
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChat = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChat) {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChat,
          text: `Nouvelle inscription newsletter Evenmia !\n\nEmail : ${email}${name ? `\nNom : ${name}` : ""}`,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

function buildWelcomeEmail(name: string): string {
  const greeting = name ? `Bonjour ${name},` : "Bonjour,";
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; background: #FBF7F2; margin: 0; padding: 40px 20px; color: #3D3229;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
    <h1 style="font-size: 28px; color: #9B5A3E; margin: 0 0 24px;">Bienvenue dans la famille Evenmia !</h1>
    <p style="font-size: 16px; line-height: 1.7; color: #3D3229;">${greeting}</p>
    <p style="font-size: 16px; line-height: 1.7; color: #3D3229;">
      Je suis tellement contente que vous ayez rejoint ma newsletter. Chaque mois, je vous partage :
    </p>
    <ul style="font-size: 15px; line-height: 1.9; color: #7A6E63;">
      <li>Mes nouvelles créations et réalisations</li>
      <li>Les tendances déco du moment</li>
      <li>Des conseils pour réussir votre événement</li>
      <li>Des idées DIY inédites</li>
    </ul>
    <p style="font-size: 16px; line-height: 1.7; color: #3D3229;">
      Si vous préparez déjà un événement (mariage, baptême, anniversaire...), n'hésitez pas à me contacter directement — je réponds toujours sous 24h.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://evenmia.fr" style="background: linear-gradient(135deg, #A3B18A, #7A9A68); color: white; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 14px;">Visiter evenmia.fr</a>
    </div>
    <p style="font-size: 14px; line-height: 1.6; color: #A69888; margin-top: 40px; text-align: center;">
      Avec toute ma gratitude,<br>
      <strong style="color: #9B5A3E;">Anaïs — Evenmia</strong>
    </p>
    <hr style="border: none; border-top: 1px solid #E8DDD2; margin: 32px 0;">
    <p style="font-size: 11px; color: #A69888; text-align: center;">
      Vous recevez cet email car vous vous êtes inscrit(e) à la newsletter d'Evenmia.<br>
      Pour vous désabonner, répondez simplement "STOP" à cet email.
    </p>
  </div>
</body>
</html>`;
}
