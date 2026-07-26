import { prisma } from "@/lib/db";
import type { DeliveryMethod, Order, OrderItem, OrderStatus, Product } from "@/generated/prisma/client";
import { createVoucherForOrderItem } from "@/lib/vouchers";
import { decrementStock } from "@/lib/products";
import { FLAT_SHIPPING_CENTS } from "@/lib/shop-constants";

export { FLAT_SHIPPING_CENTS };

export type OrderWithItems = Order & { items: (OrderItem & { product: Product }) [] };

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryMethod: DeliveryMethod;
  shippingAddress?: string;
  notes?: string;
  voucherRecipientName?: string;
  voucherMessage?: string;
  items: CartItemInput[];
}

export type CreateOrderResult =
  | { ok: true; order: OrderWithItems }
  | {
      ok: false;
      reason: "EMPTY_CART" | "PRODUCT_NOT_FOUND" | "PRODUCT_INACTIVE" | "OUT_OF_STOCK";
      productName?: string;
    };

// Nigdy nie ufamy cenom/ilościom przysłanym z przeglądarki — wszystko przeliczane
// od zera na podstawie aktualnego stanu produktów w bazie.
export async function createPendingOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (input.items.length === 0) return { ok: false, reason: "EMPTY_CART" };

  const productIds = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  let hasPhysicalItem = false;
  const lineItems: { product: Product; quantity: number }[] = [];

  for (const item of input.items) {
    const product = productMap.get(item.productId);
    if (!product) return { ok: false, reason: "PRODUCT_NOT_FOUND" };
    if (!product.active) return { ok: false, reason: "PRODUCT_INACTIVE", productName: product.name };
    if (product.type === "PHYSICAL") {
      hasPhysicalItem = true;
      if (product.stock !== null && product.stock < item.quantity) {
        return { ok: false, reason: "OUT_OF_STOCK", productName: product.name };
      }
    }
    lineItems.push({ product, quantity: item.quantity });
  }

  const subtotalCents = lineItems.reduce((sum, li) => sum + li.product.priceCents * li.quantity, 0);
  const shippingCents =
    input.deliveryMethod === "COURIER" && hasPhysicalItem ? FLAT_SHIPPING_CENTS : 0;

  const order = await prisma.order.create({
    data: {
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      deliveryMethod: input.deliveryMethod,
      shippingAddress: input.shippingAddress,
      shippingCents,
      totalCents: subtotalCents + shippingCents,
      notes: input.notes,
      voucherRecipientName: input.voucherRecipientName,
      voucherMessage: input.voucherMessage,
      items: {
        create: lineItems.map((li) => ({
          productId: li.product.id,
          nameSnapshot: li.product.name,
          unitPriceCents: li.product.priceCents,
          quantity: li.quantity,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return { ok: true, order };
}

export async function setOrderP24Session(orderId: string, p24SessionId: string): Promise<void> {
  await prisma.order.update({ where: { id: orderId }, data: { p24SessionId } });
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  return prisma.order.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
}

export async function getOrderByP24Session(p24SessionId: string): Promise<OrderWithItems | null> {
  return prisma.order.findUnique({
    where: { p24SessionId },
    include: { items: { include: { product: true } } },
  });
}

export interface MarkPaidResult {
  order: OrderWithItems;
  generatedVouchers: { code: string; productName: string }[];
  alreadyProcessed: boolean;
}

// Wywoływane wyłącznie po zweryfikowaniu płatności przez P24 (webhook -> verify).
// Idempotentne: jeśli zamówienie jest już PAID/FULFILLED, nic więcej nie robi
// (P24 potrafi wysłać to samo powiadomienie kilka razy).
export async function markOrderPaid(orderId: string, p24OrderId: string): Promise<MarkPaidResult> {
  const existing = await getOrderById(orderId);
  if (!existing) throw new Error(`Order ${orderId} not found`);

  if (existing.status === "PAID" || existing.status === "FULFILLED") {
    return { order: existing, generatedVouchers: [], alreadyProcessed: true };
  }

  const generatedVouchers: { code: string; productName: string }[] = [];

  for (const item of existing.items) {
    if (item.product.type === "VOUCHER") {
      for (let i = 0; i < item.quantity; i++) {
        const voucher = await createVoucherForOrderItem({
          orderId: existing.id,
          valueCents: item.unitPriceCents,
          validDays: item.product.voucherValidDays,
          recipientName: existing.voucherRecipientName,
          message: existing.voucherMessage,
        });
        generatedVouchers.push({ code: voucher.code, productName: item.nameSnapshot });
      }
    } else {
      // Best-effort: jeśli w międzyczasie zabrakło towaru (np. dwie równoczesne
      // płatności za ostatnią sztukę), zamówienie i tak zostaje PAID — pieniądze
      // już wpłynęły — a admin dostaje sygnał w notatce do ręcznej obsługi.
      await decrementStock(item.productId, item.quantity);
    }
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID", p24OrderId },
    include: { items: { include: { product: true } } },
  });

  return { order: updated, generatedVouchers, alreadyProcessed: false };
}

export async function setOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await prisma.order.update({ where: { id }, data: { status } });
}

export async function getAllOrdersForAdmin(): Promise<OrderWithItems[]> {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
}
