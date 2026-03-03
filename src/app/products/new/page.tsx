import Link from "next/link";
import { ProductForm } from "../_components/product-form";
import { createProduct } from "../_lib/actions";

export default function NewProductPage() {
  return (
    <main className="mx-auto max-w-lg p-8">
      <div className="mb-6">
        <Link
          href="/products"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          &larr; Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-bold">New Product</h1>
      </div>

      <ProductForm action={createProduct} submitLabel="Create Product" />
    </main>
  );
}
