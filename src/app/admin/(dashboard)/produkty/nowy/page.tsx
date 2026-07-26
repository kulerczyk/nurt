import ProductForm from "@/components/admin/ProductForm";
import { createProductAction } from "@/app/admin/(dashboard)/produkty/actions";

export default function NewProductPage() {
  return (
    <div>
      <span className="section-label block mb-2">Panel</span>
      <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-8">Nowy produkt</h1>

      <ProductForm mode="create" action={createProductAction} />
    </div>
  );
}
