"use client";

import type { InfoBlockData, InfoField } from "@/types/userInfo";
import { Copy } from "lucide-react";

type InfoBlockProps = InfoBlockData;

const formatValue = (field: InfoField) => {
  if (field.value == null || field.value === "") return "—";

  if (field.type === "password") return "••••••••";

  return String(field.value);
};

const InfoBlock = ({
  title,
  icon: Icon,
  fields,
  mapCoordinates,
}: InfoBlockProps) => {
  const visibleFields = fields.filter(
    (field) => field.value != null && field.value !== "",
  );

  if (visibleFields.length === 0 && !mapCoordinates) return null;

  return (
    <section className="rounded-xl border border-gray-200 p-2 bg-white h-fit w-full">
      <div className="flex items-center gap-2 border-b border-gray-200 p-2">
        <Icon className="h-5 w-5 text-[#7950F2]" />
        <h3 className="text-base font-semibold text-gray-700">{title}</h3>
      </div>

      {mapCoordinates && (
        <iframe
          src="https://maps.google.com/maps?q=12.9270524,77.5806842&z=15&output=embed"
          width="100%"
          height="auto"
          loading="lazy"
          className="rounded-lg h-auto w-full pb-2"
        />
      )}

      <div className="p-2">
        {visibleFields.map((field) => (
          <div
            key={field.label}
            className="flex items-start justify-between gap-4 py-2 first:pt-0 last:pb-0"
          >
            <span className="shrink-0 text-sm text-gray-500">
              {field.label}
            </span>

            {field.type === "copy" ? (
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate rounded-md bg-[#F1EEFF] px-2 py-1 text-xs font-medium text-[#695BEB]">
                  {formatValue(field)}
                </span>
                <button
                  type="button"
                  aria-label={`Copy ${field.label}`}
                  className="shrink-0 rounded-md p-1 text-[#7950F2] hover:bg-[#F1EEFF]"
                  onClick={() =>
                    navigator.clipboard.writeText(String(field.value ?? ""))
                  }
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <span
                className="max-w-[60%] truncate text-right text-sm font-medium text-gray-900"
                title={formatValue(field)}
              >
                {formatValue(field)}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoBlock;
