"use client";

import { useState, useTransition } from "react";
import { setInquiryStatus } from "@/app/admin/(dashboard)/wiadomosci/actions";
import type { Inquiry } from "@/generated/prisma/client";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function StatusBadge({ status }: { status: Inquiry["status"] }) {
  const isNew = status === "NEW";
  return (
    <span
      className={[
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        isNew ? "bg-heather-400 text-white" : "bg-stone-100 text-stone-500",
      ].join(" ")}
    >
      {isNew ? "Nowe" : "Odpowiedziano"}
    </span>
  );
}

function TypeBadge({ type }: { type: Inquiry["type"] }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-heather-50 text-heather-700 border border-heather-100">
      {type === "CORPORATE" ? "Grupa / firma" : "Indywidualne"}
    </span>
  );
}

function InquiryRow({ inquiry }: { inquiry: Inquiry }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleStatus = () => {
    const next = inquiry.status === "NEW" ? "ANSWERED" : "NEW";
    startTransition(async () => {
      await setInquiryStatus(inquiry.id, next);
    });
  };

  return (
    <div className="border-b border-heather-50 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-heather-50/50 transition-colors duration-200"
      >
        <span className={`text-heather-400 transition-transform duration-300 ${open ? "rotate-90" : ""}`}>›</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-stone-800">{inquiry.name}</span>
            <TypeBadge type={inquiry.type} />
          </div>
          <p className="text-sm text-stone-400 truncate mt-0.5">
            {inquiry.workshopTitle ? `${inquiry.workshopTitle} · ` : ""}
            {inquiry.email}
          </p>
        </div>

        <span className="text-xs text-stone-400 hidden sm:inline whitespace-nowrap">
          {formatDate(inquiry.createdAt)}
        </span>

        <StatusBadge status={inquiry.status} />
      </button>

      {open && (
        <div className="px-6 pb-5 pl-16 -mt-1">
          <div className="rounded-2xl bg-heather-50/60 border border-heather-100 p-4 space-y-2 text-sm">
            <p className="text-stone-700 whitespace-pre-wrap">{inquiry.message}</p>

            <div className="flex flex-wrap gap-x-6 gap-y-1 text-stone-500 pt-2 border-t border-heather-100/80">
              <span>E-mail: <a href={`mailto:${inquiry.email}`} className="text-heather-700 hover:underline">{inquiry.email}</a></span>
              {inquiry.phone && <span>Telefon: {inquiry.phone}</span>}
              {inquiry.companyName && <span>Firma: {inquiry.companyName}</span>}
              {inquiry.groupSize && <span>Uczestnicy: {inquiry.groupSize}</span>}
              {inquiry.preferredDate && <span>Termin: {inquiry.preferredDate}</span>}
              {inquiry.budget && <span>Budżet: {inquiry.budget}</span>}
            </div>
          </div>

          <button
            type="button"
            onClick={toggleStatus}
            disabled={isPending}
            className="mt-3 text-xs font-medium text-heather-700 border border-heather-300 rounded-full px-4 py-1.5
                       hover:bg-heather-500 hover:text-white hover:border-heather-500
                       transition-all duration-300 disabled:opacity-50"
          >
            {isPending ? "Zapisywanie…" : inquiry.status === "NEW" ? "Oznacz jako odpowiedziano" : "Oznacz jako nowe"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function InquiriesTable({ inquiries }: { inquiries: Inquiry[] }) {
  if (inquiries.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-heather-100 p-12 text-center">
        <p className="text-stone-400 text-sm">Brak wiadomości - nowe zapytania z formularzy pojawią się tutaj.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-heather-100 overflow-hidden">
      {inquiries.map((inquiry) => (
        <InquiryRow key={inquiry.id} inquiry={inquiry} />
      ))}
    </div>
  );
}
