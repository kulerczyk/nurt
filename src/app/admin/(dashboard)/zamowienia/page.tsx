import OrdersManager from "@/components/admin/OrdersManager";
import { getAllOrdersForAdmin } from "@/lib/orders";
import { getAllVouchersForAdmin } from "@/lib/vouchers";
import type { Voucher } from "@/lib/vouchers";

export default async function AdminOrdersPage() {
  const [orders, vouchers] = await Promise.all([getAllOrdersForAdmin(), getAllVouchersForAdmin()]);

  const vouchersByOrder = vouchers.reduce<Record<string, Voucher[]>>((acc, v) => {
    (acc[v.orderId] ??= []).push(v);
    return acc;
  }, {});

  return (
    <div>
      <span className="section-label block mb-2">Panel</span>
      <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-8">Zamówienia</h1>

      <OrdersManager orders={orders} vouchersByOrder={vouchersByOrder} />
    </div>
  );
}
