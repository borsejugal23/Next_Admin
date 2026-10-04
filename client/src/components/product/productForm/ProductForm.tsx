import useProductEditViewForm from "@/hooks/useProductEditViewForm";
import type { Product } from "@/types/product";
import { Box, Boxes, DollarSign, Minus, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import type { UseFormReturn } from "react-hook-form";
import {
  HeaderComponent,
  InputComponent,
  LabeledInputComponent,
} from "./component/FormComponent";
import CustomerReview from "./component/CustomerReview";
import CustomSelect from "./component/CustomSelect";
import useCan from "@/authorization/useCan";

type ProductFormProps = {
  form: UseFormReturn<Product>;
  categories?: string[];
};

const ProductForm = ({ form, categories = [] }: ProductFormProps) => {
  const {
    category,
    categoryOptions,
    availabilityStatus,
    availabilityStatusOptions,
    tags,
    tagInput,
    thumbnail,
    gallery,
    fileInputRef,
    setTagInput,
    handleTagKeyDown,
    removeTag,
    handleUploadClick,
    handleUploadChange,
    removeImage,
    setPrimaryImage,
    handleDeleteReview,
  } = useProductEditViewForm({ form, categories });

  const canEdit = useCan("product:update");

  return (
    <form className="flex flex-col gap-4">
      <section className="border border-[#eae3de] rounded-xl">
        {/* Header Section */}
        <header>
          <HeaderComponent
            title="General"
            headline="Customer-facing product info."
            icon={<Box size={16} className="text-gray-700" />}
          />
        </header>
        {/* Content Section */}
        <div className="flex flex-col gap-2 p-4">
          {/* Title Section */}
          <LabeledInputComponent
            label="Title"
            name="title"
            register={form.register}
          />
          {/* Brand and Category Section */}
          <div className="w-full flex flex-row items-center gap-2">
            {/* Brand Section */}
            <div className="w-1/2">
              <LabeledInputComponent
                label="Brand"
                name="brand"
                register={form.register}
              />
            </div>
            {/* Category Section */}
            <div className="w-1/2">
              <label
                htmlFor="category"
                className="text-xs font-medium text-[#6e5f5d]"
              >
                Category
              </label>
              <div className="mt-0">
                <CustomSelect
                  id="category"
                  value={category}
                  options={categoryOptions}
                  onChange={(next) =>
                    form.setValue("category", next, {
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                />
              </div>
            </div>
          </div>
          {/* Description Section */}
          <div>
            <label
              htmlFor="description"
              className="text-xs font-medium text-[#6e5f5d]"
            >
              Description
            </label>
            <textarea
              id="description"
              {...form.register("description")}
              maxLength={500}
              className="mt-1.5 w-full border border-[#eae3de] rounded-xl py-3 px-2 text-sm text-[#1a0e0e] focus:outline-none focus:border-[1.5px] focus:border-[#fb794a]/60 transition"
              rows={4}
            />
            <p className="mt-2 text-right text-xs text-[#6e5f5d]">
              {(form.watch("description") ?? "").length} / 500 characters
            </p>
          </div>
          {/* Tags Section */}
          <div>
            <label
              htmlFor="tags"
              className="text-xs font-medium text-[#6e5f5d]"
            >
              Tags
            </label>
            <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-[#eae3de] px-2 transition focus-within:border-[1.5px] focus-within:border-[#fb794a]/60">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#f7f0eb] px-1.5 py-1 text-sm text-[#1a0e0e]"
                >
                  #{tag}
                  <button
                    type="button"
                    aria-label={`Remove ${tag}`}
                    onClick={() => removeTag(tag)}
                    className="rounded text-[#6e5f5d] hover:bg-[#eae3de] hover:text-[#1a0e0e]"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tag..."
                className="min-w-30 flex-1 border-0 bg-transparent text-sm text-[#1a0e0e] outline-none placeholder:text-[#6e5f5d]/70"
              />
            </div>
            <p className="mt-2 text-xs text-[#6e5f5d]">Comma separated.</p>
          </div>
        </div>
      </section>

      <section className="border border-[#eae3de] rounded-xl LabeledInputComponent">
        <header>
          <HeaderComponent
            title="Media"
            headline="Primary image and gallery."
            icon={<Upload size={16} className="text-gray-700" />}
          />
        </header>

        <div className="flex flex-wrap gap-3 p-4">
          {gallery.map((src) => {
            const isPrimary =
              src === thumbnail || (!thumbnail && src === gallery[0]);
            const isBlob = src.startsWith("blob:");

            return (
              <div
                key={src}
                className="group relative h-24 w-24 overflow-hidden rounded-xl bg-[#f7f0eb]"
              >
                {isBlob ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt="Product media"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={src}
                    alt="Product media"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}

                {isPrimary ? (
                  <span className="absolute left-1.5 top-1.5 rounded-md bg-[#5c4033] px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Primary
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(src)}
                    className="absolute left-1.5 top-1.5 hidden rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white group-hover:block"
                  >
                    Set primary
                  </button>
                )}

                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => removeImage(src)}
                  className="absolute right-1.5 top-1.5 hidden rounded-full bg-black/50 p-0.5 text-white group-hover:block"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleUploadClick}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#d5cbc4] text-[#6e5f5d] transition hover:border-black hover:text-[#1a0e0e]"
          >
            <Upload size={18} />
            <span className="text-xs font-medium">Upload</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUploadChange}
          />
        </div>
      </section>

      <section className="border border-[#eae3de] rounded-xl LabeledInputComponent pb-6">
        <header>
          <HeaderComponent
            title="Pricing"
            headline="Set the price for your product."
            icon={<DollarSign size={16} className="text-gray-700" />}
          />
        </header>
        <div className="w-full flex flex-row items-center gap-2 p-4 ">
          <div className="relative">
            <label
              htmlFor="price"
              className="text-xs font-medium text-[#6e5f5d]"
            >
              Base price (USD)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm font-medium text-[#1a0e0e]">
                ＄
              </span>
              <input
                id="price"
                type="number"
                {...form.register("price", { valueAsNumber: true })}
                className="w-full border border-[#eae3de] rounded-xl py-2 px-6 text-sm text-[#1a0e0e] focus:outline-none focus:border-[1.5px] focus:border-[#fb794a]/60 transition"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="discountPercentage"
              className="text-xs font-medium text-[#6e5f5d]"
            >
              Discount %
            </label>
            <InputComponent
              name="discountPercentage"
              register={form.register}
              type="number"
            />
          </div>
          <div>
            <label
              htmlFor="finalPrice"
              className="text-xs font-medium text-[#6e5f5d]"
            >
              Final price
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2 text-sm font-semibold text-[#1a0e0e]">
                ＄
              </span>
              <input
                id="finalPrice"
                type="text"
                readOnly
                value={(() => {
                  const price = form.watch("price") ?? 0;
                  const discount = form.watch("discountPercentage") ?? 0;
                  return (price * (1 - discount / 100)).toFixed(2);
                })()}
                className="w-full border border-[#eae3de] rounded-xl py-2 px-6 text-sm font-semibold text-[#1a0e0e] bg-[#f7f0eb] focus:outline-none"
              />
            </div>
            <p className="absolute p-2 text-xs text-[#6e5f5d]">
              Auto-calculated.
            </p>
          </div>
        </div>
      </section>

      <section className="border border-[#eae3de] rounded-xl LabeledInputComponent">
        <header>
          <HeaderComponent
            title="Inventory & fulfillment"
            headline="Stock levels and shipping policy."
            icon={<Boxes size={16} className="text-gray-700" />}
          />
        </header>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex flex-col items-center gap-">
            <div className="w-full flex flex-row items-center gap-2">
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="stock"
                  className="text-xs font-medium text-[#6e5f5d]"
                >
                  Stock on hand
                </label>
                <div className="flex flex-row items-center rounded-xl border border-[#eae3de]">
                  <button
                    type="button"
                    className="p-2 hover:bg-[#f7f0eb]"
                    disabled={!canEdit}
                    onClick={() =>
                      form.setValue(
                        "stock",
                        (form.getValues("stock") ?? 0) - 1,
                        {
                          shouldDirty: true,
                          shouldTouch: true,
                        },
                      )
                    }
                  >
                    <Minus
                      size={16}
                      className="text-gray-700 hover:text-[#1a0e0e] transition"
                    />
                  </button>
                  <input
                    id="stock"
                    type="number"
                    {...form.register("stock", { valueAsNumber: true })}
                    className="w-full border border-[#eae3de] p-2 text-sm text-center text-[#1a0e0e] focus:outline-none focus:border-[1.5px] focus:border-[#fb794a]/60 transition"
                  />
                  <button
                    type="button"
                    className="p-2 hover:bg-[#f7f0eb]"
                    disabled={!canEdit}
                    onClick={() =>
                      form.setValue(
                        "stock",
                        (form.getValues("stock") ?? 0) + 1,
                        {
                          shouldDirty: true,
                          shouldTouch: true,
                        },
                      )
                    }
                  >
                    <Plus
                      size={16}
                      className="text-gray-700 hover:text-[#1a0e0e] transition"
                    />
                  </button>
                </div>
              </div>
              <div className="w-full flex flex-col">
                <LabeledInputComponent
                  label="Minimum order qty"
                  name="minimumOrderQuantity"
                  type="number"
                  register={form.register}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row gap-2">
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="availabilityStatus"
                className="text-xs font-medium text-[#6e5f5d]"
              >
                Availability status
              </label>
              <CustomSelect
                id="availabilityStatus"
                value={availabilityStatus}
                options={availabilityStatusOptions}
                onChange={(next) =>
                  form.setValue("availabilityStatus", next, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
              {/* <select
                id="availabilityStatus"
                {...form.register("availabilityStatus")}
                className="w-full border border-[#eae3de] rounded-xl p-2 text-sm text-[#1a0e0e] focus:outline-none focus:border-[1.5px] focus:border-[#fb794a]/60 transition"
              >
                {availabilityStatusOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select> */}
            </div>
            <LabeledInputComponent
              label="Shipping information"
              name="shippingInformation"
              register={form.register}
            />
          </div>

          <div className="w-full flex flex-row gap-2">
            <LabeledInputComponent
              label="Warranty"
              name="warrantyInformation"
              register={form.register}
            />
            <LabeledInputComponent
              label="Return policy"
              name="returnPolicy"
              register={form.register}
            />
          </div>
          <div className="w-full flex flex-row gap-2">
            <LabeledInputComponent
              label="Weight"
              name="weight"
              type="number"
              register={form.register}
            />
            <div className="w-full flex flex-col gap-2">
              <fieldset>
                <legend className="text-xs font-medium text-[#6e5f5d]">
                  Dimensions (W × H × D cm)
                </legend>
                <div className="mt-2 w-full flex flex-row items-center gap-2">
                  <InputComponent
                    id="dimensions-width"
                    name="dimensions.width"
                    register={form.register}
                    type="number"
                  />
                  <InputComponent
                    id="dimensions-height"
                    name="dimensions.height"
                    register={form.register}
                    type="number"
                  />
                  <InputComponent
                    id="dimensions-depth"
                    name="dimensions.depth"
                    register={form.register}
                    type="number"
                  />
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </section>

      <section>
        <CustomerReview
          reviews={form.watch("reviews")}
          rating={form.watch("rating")}
          onDelete={handleDeleteReview}
        />
      </section>
    </form>
  );
};

export default ProductForm;
