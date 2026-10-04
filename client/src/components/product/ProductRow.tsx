"use client";

import type { Product } from "@/types/product";
import { Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function formatPrice(price?: number) {
  if (price == null) return "—";
  return `$${price.toFixed(2)}`;
}

function CategoryBadge({ category }: { category?: string }) {
  if (!category) return <span className="text-gray-400">—</span>;

  return (
    <span className="inline-block rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium capitalize text-violet-700">
      {category}
    </span>
  );
}

function StockBadge({ stock }: { stock?: number }) {
  if (stock == null) return <span className="text-gray-400">—</span>;

  const style =
    stock <= 10
      ? "bg-red-50 text-red-600"
      : stock <= 50
        ? "bg-amber-50 text-amber-700"
        : "bg-emerald-50 text-emerald-700";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {stock} in stock
    </span>
  );
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-gray-400">—</span>;

  const isInStock = status.toLowerCase().includes("in stock");

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        isInStock
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

type ProductRowProps = {
  product: Product;
  onImageClick: (product: Product, imageSrc: string) => void;
};

export default function ProductRow({ product, onImageClick }: ProductRowProps) {
  const router = useRouter();
  const imageSrc = product.images?.[0] ?? product.thumbnail ?? "";

  return (
    <tr
      onClick={() => router.push(`/product/${product._id}`)}
      className="cursor-pointer border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-100"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (imageSrc) onImageClick(product, imageSrc);
            }}
            disabled={!imageSrc}
            className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white disabled:cursor-default"
            aria-label={`View ${product.title ?? "product"} image`}
          >
            {imageSrc ? (
              <Image
                src={product.thumbnail ?? imageSrc}
                alt={product.title ?? "Product"}
                fill
                sizes="50px"
                className="object-cover transition-transform hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                N/A
              </div>
            )}
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {product.title ?? "Untitled"}
            </p>
            <p className="truncate text-xs text-gray-500">
              {product.brand ?? "Unknown brand"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <CategoryBadge category={product.category} />
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.discountPercentage != null &&
            product.discountPercentage > 0 && (
              <span className="text-xs font-medium text-rose-500">
                -{product.discountPercentage.toFixed(0)}% off
              </span>
            )}
        </div>
      </td>
      <td className="px-4 py-3">
        {product.rating != null ? (
          <div className="flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-700">
              {product.rating.toFixed(1)}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <StockBadge stock={product.stock} />
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={product.availabilityStatus} />
      </td>
    </tr>
  );
}
