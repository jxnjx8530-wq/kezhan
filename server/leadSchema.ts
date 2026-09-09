import { z } from "zod";

export const leadSchema = z.object({
  type: z.enum(["contact", "waitlist"]),
  source: z.string().max(100).optional(),
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email().max(200),
  inquiryType: z.string().trim().max(100).optional(),
  message: z.string().trim().max(2000).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadEntry = LeadInput & { receivedAt: string };

export function toSheetRow(entry: LeadEntry): string[] {
  return [
    entry.receivedAt,
    entry.type,
    entry.source ?? "",
    entry.name ?? "",
    entry.email,
    entry.inquiryType ?? "",
    entry.message ?? "",
  ];
}
