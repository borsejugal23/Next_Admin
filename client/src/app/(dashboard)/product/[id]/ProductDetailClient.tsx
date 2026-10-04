"use client";
import { useProduct, useUpdateProduct } from "@/hooks/useProduct";
import { formatDate } from "@/utils/date";
import { ArrowLeft, Barcode, Copy, EyeOff, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Product } from "@/types/product";
import ProductForm from "@/components/product/productForm/ProductForm";
import FormView from "@/components/product/productForm/component/FormView";
import useCan from "@/authorization/useCan";

const emptyFormValues: Product = {
  _id: "",
  id: 0,
  title: "",
  brand: "- No brand -",
  category: "",
  thumbnail: "",
  description: "",
  returnPolicy: "",
  availabilityStatus: "",
  warrantyInformation: "",
  price: 0,
  stock: 0,
  weight: 0,
  rating: 0,
  discountPercentage: 0,
  minimumOrderQuantity: 0,
  images: [],
  tags: [],
  reviews: [],
  dimensions: {
    width: 0,
    height: 0,
    depth: 0,
  },
  meta: {
    barcode: "",
    qrCode: "",
  },
};

const ProductDetailClient = () => {
  const { id: productId } = useParams();
  const { data, isLoading } = useProduct(productId as string);

  const product = data?.product;
  const categories = data?.categories ?? [];
  const { mutate: updateProduct, isPending } = useUpdateProduct(
    productId as string,
  );
  const canDelete = useCan("product:delete");
  const canEdit = useCan("product:update");

  const form = useForm<Product>({
    defaultValues: emptyFormValues,
    disabled: !canEdit,
  });

  const { isDirty } = form.formState;

  useEffect(() => {
    if (!product || isPending) return;

    form.reset({
      ...emptyFormValues,
      ...product,
    });
  }, [product, form, isPending]);

  const handleSave = form.handleSubmit((values) => {
    updateProduct(values);
  });

  const canSave = isDirty && !isPending;

  return (
    <div className="p-4 relative">
      <div className="pb-3 flex items-center justify-between">
        <Link
          href={`/product`}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
        <div className="flex items-center gap-2">
          {isDirty && product && (
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                form.reset({
                  ...emptyFormValues,
                  ...product,
                })
              }
              className="flex items-center gap-2 text-sm font-medium py-1 px-3 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-[#f7f0eb] border border-gray-200 disabled:opacity-50 disabled:cursor-default"
            >
              Discard
            </button>
          )}
          {canEdit && (
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className={`flex items-center gap-2 text-sm font-medium py-1 px-3 rounded-xl ${
                canSave
                  ? "text-white bg-stone-700 hover:bg-stone-800"
                  : "text-white bg-stone-400 cursor-default"
              }`}
            >
              <Save size={16} />
              {isPending ? "Saving..." : isDirty ? "Save changes" : "Saved"}
            </button>
          )}
        </div>
      </div>
      <div>
        {product && (
          <div className="flex items-center py-4 border-b border-t border-gray-200 justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 bg-[#f7f0eb]">
                <Image
                  src={product.images[0]}
                  alt={product?.title ?? "Product"}
                  width={70}
                  height={70}
                  sizes="70px"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold text-[#1a0e0e] tracking-tight">
                  {product?.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-2">
                    <Barcode size={16} />
                    {product?.sku}
                  </span>
                  <span>ID # {product?.id}</span>
                  <span>
                    Updated {formatDate(product?.meta?.updatedAt ?? "")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 text-xs font-medium text-gray-900 hover:bg-[#f7f0eb] py-2 px-3 rounded-xl border border-gray-200">
                <EyeOff size={16} />
                Unpublish
              </button>
              <button className="flex items-center gap-2 text-xs font-medium text-gray-900 hover:bg-[#f7f0eb] py-2 px-3 rounded-xl border border-gray-200">
                <Copy size={16} />
                Duplicate
              </button>
              {canDelete && (
                <button className="flex items-center gap-2 text-xs font-medium text-red-700 hover:bg-[#f7f0eb] py-2 px-3 rounded-xl border border-gray-200">
                  <Trash2 size={16} /> Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {!isLoading && product && (
        <div className="flex w-full flex-col gap-4 py-4 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 lg:w-[65%] lg:flex-none">
            <ProductForm form={form} categories={categories} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:max-w-sm">
            <FormView product={form.watch() as Product} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailClient;
