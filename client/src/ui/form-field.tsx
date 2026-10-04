import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Input, Select, TextArea } from "./input";

type FieldType = "text" | "number" | "textarea" | "select";

type FormFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  type?: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
};

export function FormField<T extends FieldValues>({
  form,
  name,
  label,
  type = "text",
  placeholder,
  options = [],
}: FormFieldProps<T>) {
  const error = form.formState.errors[name]?.message as string | undefined;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>

      {type === "textarea" ? (
        <TextArea
          placeholder={placeholder}
          rows={4}
          {...form.register(name)}
        />
      ) : null}

      {type === "select" ? (
        <Select {...form.register(name)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : null}

      {type === "text" ? (
        <Input type="text" placeholder={placeholder} {...form.register(name)} />
      ) : null}

      {type === "number" ? (
        <Input
          type="number"
          placeholder={placeholder}
          {...form.register(name, { valueAsNumber: true })}
        />
      ) : null}

      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
