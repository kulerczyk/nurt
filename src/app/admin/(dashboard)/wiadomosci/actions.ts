"use server";

import { revalidatePath } from "next/cache";
import { markInquiryStatus } from "@/lib/inquiries";
import type { InquiryStatus } from "@/generated/prisma/client";

export async function setInquiryStatus(id: string, status: InquiryStatus) {
  await markInquiryStatus(id, status);
  revalidatePath("/admin/wiadomosci");
}
