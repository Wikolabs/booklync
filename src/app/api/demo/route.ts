import { NextResponse } from "next/server";
import { chat, isConfigured } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT_FR = `Tu es BookLync, un agent IA qui detecte l'intention d'achat dans une conversation (email, chat, reponse LinkedIn) et propose un flow de prise de RDV intelligent (creneau + agenda + reminders).

Format de sortie exact en MARKDOWN :
**🎯 Detection intention**
- [1 ligne : niveau d'intention detecte (HOT/WARM/COLD), confidence %]

**🧠 Signaux conversationnels**
- [2-3 puces : phrases-cle exactes du message qui montrent l'intention, mots-declencheurs identifies]

**📅 Flow de booking propose**
- Slot recommande : [jour + heure realiste, fuseau horaire prospect]
- Duree : [15 / 30 / 45 min selon stade]
- Agenda envoye : [3 puces precises a afficher dans l'invitation pour reduire le no-show]
- Reminders auto : [J-1 email + H-2 SMS]

**📨 Reponse pre-redigee a envoyer**
- [Bloc de 3-5 lignes, ton naturel, qui propose le lien de booking — copy pret-a-envoyer]

**📊 Probabilite de show**
- [XX% — explique en 1 ligne]

Tu DOIS inventer un contexte realiste pour la demo (jamais "je n'ai pas access au calendrier"). Tu joues un AE qui gere son pipeline. Style decontracte mais pro. Maximum 350 mots.`;

const SYSTEM_PROMPT_EN = `You are BookLync, an AI agent that detects buying intent in a conversation (email, chat, LinkedIn reply) and proposes a smart meeting booking flow (slot + agenda + reminders).

Exact MARKDOWN output format:
**🎯 Intent detection**
- [1 line: detected intent level (HOT/WARM/COLD), confidence %]

**🧠 Conversational signals**
- [2-3 bullets: exact key phrases from the message showing intent, trigger words identified]

**📅 Proposed booking flow**
- Recommended slot: [day + realistic time, prospect timezone]
- Duration: [15 / 30 / 45 min depending on stage]
- Agenda sent: [3 precise bullets to show in invite to reduce no-show]
- Auto reminders: [D-1 email + H-2 SMS]

**📨 Pre-written reply to send**
- [Block of 3-5 lines, natural tone, proposing the booking link — ready-to-send copy]

**📊 Show probability**
- [XX% — explain in 1 line]

You MUST invent a realistic context for the demo (never "I have no calendar access"). You play an AE managing their pipeline. Casual but pro tone. Maximum 350 words.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const conversation: string = typeof body.conversation === "string" ? body.conversation.slice(0, 1500) : "";
    const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

    if (!conversation.trim()) {
      return NextResponse.json(
        { error: lang === "fr" ? "Collez la conversation a analyser." : "Paste the conversation to analyze." },
        { status: 400 }
      );
    }

    if (!isConfigured()) {
      return NextResponse.json(
        {
          error: "llm_not_configured",
          message: lang === "fr"
            ? "Demo en mode statique — la cle LLM sera configuree au prochain deploiement."
            : "Static demo mode — LLM key will be configured at next deploy.",
          mockBrief: buildMockBrief(conversation, lang),
        },
        { status: 200 }
      );
    }

    const userMsg = lang === "fr"
      ? `Conversation a analyser :\n${conversation}\nDetecte l'intention + propose le flow de booking.`
      : `Conversation to analyze:\n${conversation}\nDetect intent + propose booking flow.`;

    const { text, model } = await chat(
      [
        { role: "system", content: lang === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN },
        { role: "user", content: userMsg },
      ],
      900
    );

    return NextResponse.json({ brief: text, model, generatedAt: new Date().toISOString() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildMockBrief(conversation: string, lang: "fr" | "en"): string {
  if (lang === "en") {
    return `**🎯 Intent detection**\n- HOT intent — confidence 87%. Buying window: this week.\n\n**🧠 Conversational signals**\n- "We need a solution before end of Q1" — explicit timeline + urgency.\n- "Can you walk me through pricing?" — direct ask, late-funnel question.\n- "Already evaluated Outreach and Apollo" — comparison shopping = decision phase.\n\n**📅 Proposed booking flow**\n- Recommended slot: Thursday 14:30 CET (prospect Paris timezone, mid-afternoon avoids morning standup conflicts)\n- Duration: 30 min (discovery + pricing walkthrough)\n- Agenda sent: 1) Their stack today + main 3 pain points (5min). 2) Live walkthrough on their use case (15min). 3) Pricing + next steps (10min).\n- Auto reminders: D-1 email (with agenda) + H-2 SMS (with calendar link refresh)\n\n**📨 Pre-written reply to send**\n- Hey ${conversation.split(" ")[0] || "Sarah"}, makes sense to dig into pricing on a call rather than over email. I blocked Thursday 14:30 CET on my side (30min) — here's the link to confirm: cal.com/bl/30min. Agenda is in the invite, but flag if you want me to swap anything. — Marc\n\n**📊 Show probability**\n- 84% — based on signal density + slot recency, well above 62% AE average.`;
  }
  return `**🎯 Detection intention**\n- Intention HOT — confidence 87%. Fenetre d'achat : cette semaine.\n\n**🧠 Signaux conversationnels**\n- "On doit avoir une solution avant fin T1" — timeline explicite + urgence.\n- "Vous pouvez me detailler les tarifs ?" — demande directe, question fin de funnel.\n- "On a deja evalue Outreach et Apollo" — shopping comparatif = phase de decision.\n\n**📅 Flow de booking propose**\n- Slot recommande : Jeudi 14h30 CET (prospect a Paris, mi-aprem evite les standups matin)\n- Duree : 30 min (discovery + walkthrough tarifs)\n- Agenda envoye : 1) Leur stack actuel + top 3 pain points (5min). 2) Walkthrough live sur leur use case (15min). 3) Tarifs + next steps (10min).\n- Reminders auto : J-1 email (avec agenda) + H-2 SMS (avec refresh lien calendrier)\n\n**📨 Reponse pre-redigee a envoyer**\n- Hey ${conversation.split(" ")[0] || "Sarah"}, plus simple de creuser les tarifs en call qu'en mail. J'ai bloque jeudi 14h30 CET de mon cote (30min) — lien pour confirmer : cal.com/bl/30min. L'agenda est dans l'invit, flag si tu veux qu'on change un truc. — Marc\n\n**📊 Probabilite de show**\n- 84% — base sur densite signaux + recence du slot, bien au-dessus de la moyenne AE 62%.`;
}
