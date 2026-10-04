import type { Product } from "@/types/product";
import { Barcode, Check } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { HeaderComponent } from "./FormComponent";

type InfoRowProps = {
  label: string;
  value: ReactNode;
};

/** Label left / value right — reusable for any summary card */
export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-[#6e5f5d]">{label}</span>
      <div className="text-right font-medium text-[#1a0e0e]">{value}</div>
    </div>
  );
}

type StatusBadgeProps = {
  label?: string;
};

export function StatusBadge({ label = "Published" }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {label}
    </span>
  );
}

type InfoCardProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
};

export function InfoCard({ title, icon, children }: InfoCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#eae3de] bg-white">
      <HeaderComponent title={title} icon={icon} />
      <div className="flex flex-col gap-3 p-4">{children}</div>
    </section>
  );
}

type FormViewProps = {
  product: Product;
  visibilityLabel?: string;
};

const FormView = ({ product, visibilityLabel = "Published" }: FormViewProps) => {
  const discount = product.discountPercentage ?? 0;
  const barcode = product.meta?.barcode ?? "—";
  const qrCode = product.meta?.qrCode;

  return (
    <div className="flex flex-col gap-4">
      <InfoCard title="Status" icon={<Check size={16} className="text-gray-700" />}>
        <InfoRow label="Visibility" value={<StatusBadge label={visibilityLabel} />} />
        <InfoRow
          label="Inventory"
          value={`${product.stock ?? 0} units`}
        />
        <InfoRow
          label="Discount"
          value={discount ? `-${discount}%` : "0%"}
        />
        <InfoRow
          label="Min. order"
          value={product.minimumOrderQuantity ?? "—"}
        />
      </InfoCard>

      <InfoCard
        title="Identifiers"
        icon={<Barcode size={16} className="text-gray-700" />}
      >
        <InfoRow label="SKU" value={product.sku || "—"} />
        <InfoRow label="Barcode" value={barcode} />
        <InfoRow label="Product ID" value={`#${product.id}`} />

        {qrCode ? (
          <div className="mt-1 flex items-center gap-3 rounded-xl bg-[#f7f0eb] p-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white">
              <Image
                src={qrCode}
                alt="Product QR code"
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </div>
            <p className="text-xs leading-relaxed text-[#6e5f5d]">
              Scan to open the product page on a mobile device.
            </p>
          </div>
        ) : null}
      </InfoCard>
    </div>
  );
};

export default FormView;
