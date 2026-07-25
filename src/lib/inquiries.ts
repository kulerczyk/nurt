import { prisma } from "@/lib/db";
import type { Inquiry as InquiryRow, InquiryType, InquiryStatus } from "@/generated/prisma/client";

export type { InquiryType, InquiryStatus };
export type Inquiry = InquiryRow;

export interface CreateInquiryInput {
  type: InquiryType;
  name: string;
  email: string;
  phone?: string;
  message: string;
  workshopSlug?: string;
  workshopTitle?: string;
  companyName?: string;
  groupSize?: number;
  preferredDate?: string;
  budget?: string;
}

export async function createInquiry(input: CreateInquiryInput): Promise<Inquiry> {
  return prisma.inquiry.create({ data: input });
}

// Panel admina zawsze chce widzieć aktualny stan — bez cache() ani ISR.
export async function getAllInquiries(): Promise<Inquiry[]> {
  return prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
}

export async function markInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  await prisma.inquiry.update({ where: { id }, data: { status } });
}

export async function countNewInquiries(): Promise<number> {
  return prisma.inquiry.count({ where: { status: "NEW" } });
}
