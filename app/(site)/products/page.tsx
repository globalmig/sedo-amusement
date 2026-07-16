import ProductGalley from "@/components/board/ProductGalley";
import { getProducts } from "@/lib/products";

export default async function ProductListPage() {
  const products = await getProducts();

  return (
    <article>
      <div className="mx-auto max-w-300 px-[5%] py-12 pc:px-0 pc:py-16">
        <ProductGalley products={products} />
      </div>
    </article>
  );
}
