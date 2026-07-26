import type { Metadata } from "next";
import ShopCatalog from "@/components/sections/ShopCatalog";
import { getActiveProducts } from "@/lib/products";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sklep",
  description: "Vouchery podarunkowe na warsztaty oraz produkty z pracowni NURT.",
};

export default async function ShopPage() {
  const allProducts = await getActiveProducts();
  const vouchers = allProducts.filter((p) => p.type === "VOUCHER");
  const products = allProducts.filter((p) => p.type === "PHYSICAL");

  return <ShopCatalog vouchers={vouchers} products={products} />;
}
