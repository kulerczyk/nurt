"use client";

import { useState, useTransition } from "react";
import {
  markOrderPaidManuallyAction,
  markOrderFulfilledAction,
  cancelOrderAction,
  cancelVoucherAction,
} from "@/app/admin/(dashboard)/zamowienia/actions";
import type { OrderWithItems } from "@/lib/orders";
import type { Voucher } from "@/lib/vouchers";

function formatPln(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")} zł`;
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(date);
}

const STATUS_LABEL: Record<OrderWithItems["status"], string> = {
  PENDING: "Oczekuje na płatność",
  PAID: "Opłacone",
  FAILED: "Płatność nieudana",
  CANCELLED: "Anulowane",
  FULFILLED: "Zrealizowane",
};

const STATUS_CLASS: Record<OrderWithItems["status"], string> = {
  PENDING: "bg-amber-50 text-amber-600",
  PAID: "bg-heather-100 text-heather-700",
  FAILED: "bg-red-50 text-red-500",
  CANCELLED: "bg-stone-100 text-stone-400",
  FULFILLED: "bg-emerald-50 text-emerald-600",
};

function VoucherRow({ voucher }: { voucher: Voucher }) {
  const [isPending, startTransition] = useTransition();
  const cancel = () => {
    if (!confirm(`Anulować voucher ${voucher.code}? Nie będzie już mógł zostać wykorzystany.`)) return;
    startTransition(async () => { await cancelVoucherAction(voucher.id); });
  };

  return (
    <div className="flex items-center gap-3 py-2 text-sm border-b border-heather-100/60 last:border-0">
      <span className="font-mono font-medium text-stone-700">{voucher.code}</span>
      <span className="text-stone-400">· {formatPln(voucher.valueCents)}</span>
      <span
        className={[
          "px-2 py-0.5 rounded-full text-xs font-medium",
          voucher.status === "ACTIVE" ? "bg-heather-50 text-heather-700" :
          voucher.status === "REDEEMED" ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-400",
        ].join(" ")}
      >
        {voucher.status === "ACTIVE" ? "Aktywny" : voucher.status === "REDEEMED" ? "Wykorzystany" : voucher.status === "EXPIRED" ? "Wygasł" : "Anulowany"}
      </span>
      {voucher.expiresAt && <span className="text-xs text-stone-400">do {formatDateTime(voucher.expiresAt)}</span>}
      {voucher.status === "ACTIVE" && (
        <button type="button" onClick={cancel} disabled={isPending} className="ml-auto text-xs font-medium text-red-500 hover:underline disabled:opacity-50">
          Anuluj
        </button>
      )}
    </div>
  );
}

function OrderRow({ order, vouchers }: { order: OrderWithItems; vouchers: Voucher[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const markPaid = () => {
    setError(null);
    startTransition(async () => {
      const result = await markOrderPaidManuallyAction(order.id);
      if (!result.success) setError(result.error);
    });
  };
  const markFulfilled = () => {
    startTransition(async () => { await markOrderFulfilledAction(order.id); });
  };
  const cancelOrder = () => {
    if (!confirm("Anulować to zamówienie? Aktywne vouchery z tego zamówienia też zostaną anulowane.")) return;
    startTransition(async () => { await cancelOrderAction(order.id); });
  };

  return (
    <div className="border-b border-heather-50 last:border-0">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-heather-50/50 transition-colors duration-200">
        <span className={`text-heather-400 transition-transform duration-300 ${open ? "rotate-90" : ""}`}>›</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-stone-800">{order.customerName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CLASS[order.status]}`}>
              {STATUS_LABEL[order.status]}
            </span>
          </div>
          <p className="text-sm text-stone-400 mt-0.5">{formatDateTime(order.createdAt)} · {order.customerEmail}</p>
        </div>

        <span className="text-sm font-medium text-stone-700 whitespace-nowrap">{formatPln(order.totalCents)}</span>
      </button>

      {open && (
        <div className="px-6 pb-5 pl-16 -mt-1 space-y-3">
          <div className="rounded-2xl bg-heather-50/60 border border-heather-100 p-4">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">Pozycje</span>
            <div className="mt-2 space-y-1 text-sm">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-stone-600">{item.quantity} × {item.nameSnapshot}</span>
                  <span className="text-stone-500">{formatPln(item.unitPriceCents * item.quantity)}</span>
                </div>
              ))}
              {order.shippingCents > 0 && (
                <div className="flex justify-between text-stone-500">
                  <span>Dostawa</span>
                  <span>{formatPln(order.shippingCents)}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-stone-500 mt-2">
              {order.deliveryMethod === "COURIER" ? `Kurier: ${order.shippingAddress ?? "—"}` : "Odbiór osobisty"}
            </p>
            {order.customerPhone && <p className="text-sm text-stone-500">Tel: {order.customerPhone}</p>}
            {order.notes && <p className="text-sm text-stone-500 italic mt-1">„{order.notes}”</p>}
          </div>

          {vouchers.length > 0 && (
            <div className="rounded-2xl bg-heather-50/60 border border-heather-100 p-4">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">Vouchery</span>
              <div className="mt-2">
                {vouchers.map((v) => <VoucherRow key={v.id} voucher={v} />)}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-2.5">{error}</p>}

          <div className="flex flex-wrap gap-3">
            {order.status === "PENDING" && (
              <button type="button" onClick={markPaid} disabled={isPending} className="text-xs font-medium text-heather-700 border border-heather-300 rounded-full px-4 py-1.5 hover:bg-heather-500 hover:text-white hover:border-heather-500 transition-all duration-300 disabled:opacity-50">
                Oznacz jako opłacone ręcznie
              </button>
            )}
            {order.status === "PAID" && (
              <button type="button" onClick={markFulfilled} disabled={isPending} className="text-xs font-medium text-heather-700 border border-heather-300 rounded-full px-4 py-1.5 hover:bg-heather-500 hover:text-white hover:border-heather-500 transition-all duration-300 disabled:opacity-50">
                Oznacz jako zrealizowane
              </button>
            )}
            {order.status !== "CANCELLED" && (
              <button type="button" onClick={cancelOrder} disabled={isPending} className="text-xs font-medium text-red-500 border border-red-200 rounded-full px-4 py-1.5 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 disabled:opacity-50">
                Anuluj zamówienie
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  orders: OrderWithItems[];
  vouchersByOrder: Record<string, Voucher[]>;
}

export default function OrdersManager({ orders, vouchersByOrder }: Props) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-heather-100 p-12 text-center">
        <p className="text-stone-400 text-sm">Brak zamówień.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-heather-100 overflow-hidden">
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} vouchers={vouchersByOrder[order.id] ?? []} />
      ))}
    </div>
  );
}
