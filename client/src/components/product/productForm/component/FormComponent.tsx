import type { Path, UseFormRegister } from "react-hook-form";
import type { Product } from "@/types/product";

type HeaderComponentProps = {
  title: string;
  headline?: string;
  icon: React.ReactNode;
  trailing?: React.ReactNode;
};

type LabeledInputComponentProps = {
  label: string;
  name: Path<Product>;
  register: UseFormRegister<Product>;
  type?: "text" | "number";
};

export const HeaderComponent = ({
  title,
  headline,
  icon,
  trailing,
}: HeaderComponentProps) => {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="w-7 h-7 flex items-center justify-center rounded-xl bg-[#f7f0eb]">
            {icon}
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-[#1a0e0e]">{title}</p>
            {headline ? (
              <p className="text-xs text-gray-500">{headline}</p>
            ) : null}
          </div>
        </div>
        {trailing}
      </div>
      <hr className="border-[#eae3de]" />
    </div>
  );
};

type InputComponentProps = {
  name: Path<Product>;
  register: UseFormRegister<Product>;
  type?: "text" | "number";
};

export const LabeledInputComponent = ({
  label,
  name,
  type = "text",
  register,
}: LabeledInputComponentProps) => {
  const fieldId = String(name).replace(/\./g, "-");

  return (
    <div className="w-full flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-xs font-medium text-[#6e5f5d]">
        {label}
      </label>
      <InputComponent
        id={fieldId}
        name={name}
        register={register}
        type={type}
      />
    </div>
  );
};

/** Bare input — use when label is shared (e.g. dimensions W × H × D) */
export const InputComponent = ({
  name,
  type = "number",
  register,
  id,
}: InputComponentProps & { id?: string }) => {
  const fieldId = id ?? String(name).replace(/\./g, "-");

  return (
    <input
      type={type}
      {...register(
        name,
        type === "number" ? { valueAsNumber: true } : undefined,
      )}
      id={fieldId}
      className="w-full border border-[#eae3de] rounded-xl p-2 text-sm text-[#1a0e0e] focus:outline-none focus:border-[1.5px] focus:border-[#fb794a]/60 transition"
    />
  );
};
