import { Eye, EyeOff } from "lucide-react";
import { useState, type ChangeEvent } from "react";

export type CustomInputProps = {
  name: string;
  type: string;
  label: string;
  value: string;
  autoComplete?: string;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const CustomAuthInput = ({
  name,
  type,
  label,
  value,
  autoComplete,
  required = false,
  onChange,
}: CustomInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={isPassword && isPasswordVisible ? "text" : type}
          value={value}
          autoComplete={autoComplete}
          required={required}
          onChange={onChange}
          className={`
            w-full
            rounded-lg
            border border-slate-300
            bg-white
            px-3 py-2.5 text-sm text-slate-900
            placeholder:text-slate-400
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
            ${isPassword ? "pr-10" : ""}
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            title={isPasswordVisible ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomAuthInput;
