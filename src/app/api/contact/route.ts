import { NextResponse } from "next/server";
import { validateContact, type ContactPayload } from "@/lib/contact-schema";
import { profile } from "@/data/profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/* Best-effort in-memory rate limit (per server instance).             */
/* For stronger guarantees use a shared store (e.g. Vercel KV/Upstash). */
/* ------------------------------------------------------------------ */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

export async function POST(req: Request) {
  // ---- Parse ----
  let body: Partial<ContactPayload>;
  try {
    const raw = await req.text();
    if (raw.length > 20_000) return NextResponse.json({ ok: false, error: "Message too large." }, { status: 413 });
    body = JSON.parse(raw) as Partial<ContactPayload>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // ---- Honeypot: silently accept bots without sending anything ----
  if (body.company && String(body.company).trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // ---- Validate (same rules as the client) ----
  const payload: ContactPayload = {
    name: String(body.name ?? "").trim(),
    email: String(body.email ?? "").trim(),
    projectType: String(body.projectType ?? "").trim(),
    message: String(body.message ?? "").trim(),
  };
  const errors = validateContact(payload);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Please fix the highlighted fields.", errors }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many messages — please try again later." }, { status: 429 });
  }

  // ---- Delivery configuration ----
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
  if (!apiKey || !to) {
    // Honest failure: never pretend a message was delivered.
    return NextResponse.json(
      { ok: false, error: "The contact form isn't connected to an email service yet, so your message was not sent." },
      { status: 503 },
    );
  }

  // ---- Send via Resend REST API ----
  const subject = `[Portfolio] ${payload.projectType} — ${payload.name}`;
  const text = `Name: ${payload.name}\nEmail: ${payload.email}\nProject type: ${payload.projectType}\n\n${payload.message}`;
  const html = `<h2>New message from ${escapeHtml(profile.name)}'s portfolio</h2>
<p><strong>Name:</strong> ${escapeHtml(payload.name)}<br/>
<strong>Email:</strong> ${escapeHtml(payload.email)}<br/>
<strong>Project type:</strong> ${escapeHtml(payload.projectType)}</p>
<p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: payload.email, subject, text, html }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[contact] Resend error", res.status, detail.slice(0, 500));
      return NextResponse.json(
        { ok: false, error: "The email service rejected the message. Please try again later." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return NextResponse.json({ ok: false, error: "Could not reach the email service. Please try again." }, { status: 502 });
  }
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 });
}
