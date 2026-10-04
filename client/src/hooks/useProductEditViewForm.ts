import type { UseFormReturn } from "react-hook-form";
import type { Product, ProductReview } from "@/types/product";
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

type ProductFormProps = {
  form: UseFormReturn<Product>;
  categories?: string[];
};
const useProductEditViewForm = ({
  form,
  categories = [],
}: ProductFormProps) => {
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = form.watch("images") ?? [];
  const thumbnail = form.watch("thumbnail") ?? "";
  const category = form.watch("category") ?? "";

  const tags = form.watch("tags") ?? [];
  const availabilityStatus = form.watch("availabilityStatus") ?? "";
  const gallery = (() => {
    const list = [...images];
    if (thumbnail && !list.includes(thumbnail)) {
      list.unshift(thumbnail);
    }
    return list;
  })();
  const setPrimaryImage = (src: string) => {
    form.setValue("thumbnail", src, { shouldDirty: true, shouldTouch: true });
  };

  const removeImage = (src: string) => {
    const nextImages = images.filter((image) => image !== src);
    form.setValue("images", nextImages, {
      shouldDirty: true,
      shouldTouch: true,
    });

    if (thumbnail === src) {
      form.setValue("thumbnail", nextImages[0] ?? "", {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const urls = files.map((file) => URL.createObjectURL(file));
    const nextImages = [...images, ...urls];

    form.setValue("images", nextImages, {
      shouldDirty: true,
      shouldTouch: true,
    });

    if (!thumbnail) {
      form.setValue("thumbnail", urls[0], {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    event.target.value = "";
  };
  const addTag = (raw: string) => {
    const next = raw.trim().replace(/^#/, "");
    if (!next) return;

    const exists = tags.some((tag) => tag.toLowerCase() === next.toLowerCase());
    if (exists) {
      setTagInput("");
      return;
    }

    form.setValue("tags", [...tags, next], {
      shouldDirty: true,
      shouldTouch: true,
    });
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(tagInput);
      return;
    }

    if (event.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const categoryOptions = Array.from(
    new Set([category, ...categories].filter(Boolean)),
  );

  const availabilityStatusOptions = Array.from(
    new Set(
      [availabilityStatus, "Low Stock", "Out of Stock", "In Stock"].filter(
        Boolean,
      ),
    ),
  );
  const handleDeleteReview = (reviewToDelete: ProductReview) => {
    const reviews = form.getValues("reviews") ?? [];
    form.setValue(
      "reviews",
      reviews.filter((review: ProductReview) =>
        review._id && reviewToDelete._id
          ? review._id !== reviewToDelete._id
          : review !== reviewToDelete,
      ),
      { shouldDirty: true, shouldTouch: true },
    );
  };
  return {
    category,
    categoryOptions,
    availabilityStatus,
    availabilityStatusOptions,
    tags,
    tagInput,
    thumbnail,
    fileInputRef,
    gallery,
    setTagInput,
    handleTagKeyDown,
    removeTag,
    handleDeleteReview,
    handleUploadClick,
    handleUploadChange,
    removeImage,
    setPrimaryImage,
  };
};
export default useProductEditViewForm;
