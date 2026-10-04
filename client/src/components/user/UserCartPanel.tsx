"use client";

import type { Cart, Product } from "@/types/cart";
import { LoaderCircle, Percent, ShoppingBag } from "lucide-react";
import Image from "next/image";

type UserCartPanelProps = {
  cart?: Cart | null;
  isLoading?: boolean;
};

const TABLE_COLUMNS = [
  "Product",
  "Unit price",
  "Qty",
  "Discount",
  "Line total",
] as const;

function formatMoney(value?: number) {
  if (value == null || Number.isNaN(value)) return "—";
  return `$${value.toFixed(2)}`;
}

function DiscountBadge({ value }: { value?: number }) {
  if (value == null || value <= 0) {
    return <span className="text-xs text-gray-400">—</span>;
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
      <Percent size={12} />
      {value}%
    </span>
  );
}

function QtyBadge({ value }: { value?: number }) {
  return (
    <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
      {value ?? 0}
    </span>
  );
}

function CartProductTableRow({ product }: { product: Product }) {
  const lineTotal = product.discountedTotal ?? product.total;
  const hasDiscount =
    product.discountedTotal != null &&
    product.total != null &&
    product.discountedTotal !== product.total;

  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70">
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-[#f7f0eb]">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title ?? "Product"}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                N/A
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {product.title ?? "Untitled product"}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              ID #{product.id ?? "—"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-gray-800">
          {formatMoney(product.price)}
        </span>
      </td>

      <td className="px-4 py-3">
        <QtyBadge value={product.quantity} />
      </td>

      <td className="px-4 py-3">
        <DiscountBadge value={product.discountPercentage} />
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-sm font-semibold text-gray-900">
            {formatMoney(lineTotal)}
          </span>
          {hasDiscount ? (
            <span className="text-xs text-gray-400 line-through">
              {formatMoney(product.total)}
            </span>
          ) : null}
        </div>
      </td>
    </tr>
  );
}

function SummaryRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`text-sm font-semibold ${
          accent ? "text-[#695BEB]" : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function UserCartPanel({
  cart,
  isLoading = false,
}: UserCartPanelProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center p-6">
        <LoaderCircle className="animate-spin" size={36} color="#7777E7" />
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 p-6 text-sm text-gray-500">
        <ShoppingBag className="h-8 w-8 text-gray-300" />
        No cart found for this user.
      </div>
    );
  }

  const products = cart.products ?? [];
  const saved =
    cart.total != null && cart.discountedTotal != null
      ? Math.max(cart.total - cart.discountedTotal, 0)
      : 0;

  return (
    <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-start">
      <section className="min-w-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              User Products
            </h3>
            <p className="text-xs text-gray-500">
              Items currently in this user&apos;s cart
            </p>
          </div>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
            {products.length} items
          </span>
        </div>

        {products.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-gray-500">
            Cart is empty.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-left">
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
                {products.map((product, index) => (
                  <CartProductTableRow
                    key={`${product.id ?? "item"}-${index}`}
                    product={product}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-56 xl:w-60">
        <div className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm">
          <div className="mb-1.5 flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <ShoppingBag className="h-4 w-4 text-[#7950F2]" />
            <h3 className="text-sm font-semibold text-gray-800">
              Cart summary
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            <SummaryRow
              label="Products"
              value={cart.totalProducts ?? products.length}
            />
            <SummaryRow label="Quantity" value={cart.totalQuantity ?? 0} />
            <SummaryRow label="Subtotal" value={formatMoney(cart.total)} />
            <SummaryRow
              label="Discounted"
              value={formatMoney(cart.discountedTotal)}
              accent
            />
            {saved > 0 ? (
              <SummaryRow label="Saved" value={formatMoney(saved)} />
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}
