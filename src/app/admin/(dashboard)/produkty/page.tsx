import Link from "next/link";
import ProductsTable from "@/components/admin/ProductsTable";
import { getAllProductsForAdmin } from "@/lib/products";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="section-label block mb-2">Panel</span>
          <h1 className="font-serif text-3xl font-semibold text-stone-900">Produkty</h1>
        </div>
        <Link href="/admin/produkty/nowy" className="blob-btn text-sm">
          + Dodaj produkt
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
