// =============================================================================
// Edit Product Page — Phoenix: :edit action + edit.html.heex
// =============================================================================

import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "../../_components/product-form";
import { updateProduct } from "../../_lib/actions";
import { getById } from "../../_lib/store";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getById(id);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-lg p-8">
      <div className="mb-6">
        <Link
          href="/products"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          &larr; Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Edit Product</h1>
      </div>

      <ProductForm
        action={updateProduct}
        product={product}
        submitLabel="Save Changes"
      />
    </main>
  );
}
