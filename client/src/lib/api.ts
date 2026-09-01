export interface LeadPayload {
  type: "contact" | "waitlist";
  source?: string;
  name?: string;
  email: string;
  inquiryType?: string;
  message?: string;
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("lead_submit_failed");
  }
}
