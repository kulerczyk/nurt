import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/products";
import { updateProductAction } from "@/app/admin/(dashboard)/produkty/actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, id);

  return (
    <div>
      <span className="section-label block mb-2">Panel</span>
      <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-8">Edytuj: {product.name}</h1>

      <ProductForm mode="edit" initialData={product} action={boundAction} />
    </div>
  );
}
