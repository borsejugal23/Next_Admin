"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

type ProductImageModalProps = {
  imageSrc: string;
  price?: number;
  title?: string;
  onClose: () => void;
};

function formatPrice(price?: number) {
  if (price == null) return "—";
  return `$${price.toFixed(2)}`;
}

export default function ProductImageModal({
  imageSrc,
  price,
  title,
  onClose,
}: ProductImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Product image"}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        onClick={onClose}
        aria-label="Close preview"
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover blur-2xl brightness-75"
          sizes="100vw"
          priority
          aria-hidden
        />
        <span className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col items-center">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
          <div className="absolute inset-x-0 top-0 z-10 flex items-start gap-2 bg-linear-to-b from-black/60 to-transparent px-3 pt-3 pb-8">
            {title && (
              <span className="line-clamp-2 min-w-0 flex-1 lg:text-xl leading-snug font-semibold text-black sm:text-base">
                {title}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/50 text-white"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          <Image
            src={imageSrc}
            alt={title ?? "Product"}
            fill
            className="object-contain p-4 pt-12"
            sizes="(max-width: 512px) 100vw, 512px"
            priority
          />
        </div>

        <p className="mt-4 rounded-full bg-white/95 px-6 py-2 text-xl font-semibold text-gray-900 shadow-lg backdrop-blur-sm">
          {formatPrice(price)}
        </p>
      </div>
    </div>
  );
}
