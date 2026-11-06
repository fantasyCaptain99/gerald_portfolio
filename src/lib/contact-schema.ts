import { projectTypes } from "@/data/site";

export interface ContactPayload {
  name: string;
  email: string;
  projectType: string;
  message: string;
  /** Honeypot — real users never fill this. */
  company?: string;
}

export type ContactErrors = Partial<Record<"name" | "email" | "projectType" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = { name: 100, email: 200, message: 5000, messageMin: 20 } as const;

/** Shared by the client form and the API route so both enforce identical rules. */
export function validateContact(input: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const projectType = (input.projectType ?? "").trim();
  const message = (input.message ?? "").trim();

  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = `Name must be under ${LIMITS.name} characters.`;

  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  else if (email.length > LIMITS.email) errors.email = "Email address is too long.";

  if (!(projectTypes as readonly string[]).includes(projectType)) errors.projectType = "Please choose a project type.";

  if (message.length < LIMITS.messageMin)
    errors.message = `Please share a little more detail (at least ${LIMITS.messageMin} characters).`;
  else if (message.length > LIMITS.message) errors.message = `Message must be under ${LIMITS.message} characters.`;

  return errors;
}
