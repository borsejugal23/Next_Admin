"use client";

import ProductImageModal from "@/components/product/ProductImageModal";
import ProductRow from "@/components/product/ProductRow";
import type { Product } from "@/types/product";
import { useState } from "react";

type ProductTableProps = {
  products: Product[];
};

const TABLE_COLUMNS = [
  "Product",
  "Category",
  "Price",
  "Rating",
  "Stock",
  "Status",
] as const;

export default function ProductTable({ products }: ProductTableProps) {
  const [preview, setPreview] = useState<{
    imageSrc: string;
    price?: number;
    title?: string;
  } | null>(null);

  const handleImageClick = (product: Product, imageSrc: string) => {
    setPreview({
      imageSrc,
      price: product.price,
      title: product.title,
    });
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                {TABLE_COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onImageClick={handleImageClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {preview && (
        <ProductImageModal
          imageSrc={preview.imageSrc}
          price={preview.price}
          title={preview.title}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}
