import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const devis = {
      id: `EVM-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };

    // Save to local JSON (will be replaced by DB later)
    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });

    const filePath = path.join(dataDir, "devis.json");
    let existing: unknown[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      existing = JSON.parse(raw);
    } catch {
      // File doesn't exist yet
    }

    existing.push(devis);
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2));

    // Send Telegram notification if configured
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChat = process.env.TELEGRAM_CHAT_ID;
    if (telegramToken && telegramChat) {
      const message = `Nouvelle demande de devis Evenmia !

Evenement : ${body.eventType}
Formule : ${body.formula}
Invites : ${body.guests}
Date : ${body.date || "A definir"}
Lieu : ${body.lieu || "A definir"}
Budget : ${body.budget || "Non precise"}

Contact : ${body.name}
Tel : ${body.phone}
Email : ${body.email || "-"}

${body.notes ? `Notes : ${body.notes}` : ""}`;

      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: telegramChat, text: message }),
      });
    }

    return NextResponse.json({ success: true, id: devis.id });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
