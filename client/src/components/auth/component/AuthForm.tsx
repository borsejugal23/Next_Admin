import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import CustomAuthInput, { CustomInputProps } from "./CustomAuthInput";

const AuthForm = ({
  fields,
  formType,
  handleSubmit,
  isLoading = false,
  isSubmitDisabled = false,
  onSendVerificationOtp,
  isSendingOtp = false,
  otpSent = false,
}: {
  fields: CustomInputProps[];
  formType: "sign-up" | "sign-in";
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  isSubmitDisabled?: boolean;
  onSendVerificationOtp?: () => void;
  isSendingOtp?: boolean;
  otpSent?: boolean;
}) => {
  const router = useRouter();
  const formTypeCheck = formType === "sign-up" ? true : false;
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {formTypeCheck ? "Create an account" : "Sign in to your account"}
          </h1>

          {formTypeCheck && (
            <p className="mt-2 text-sm text-slate-500">
              Sign up to get started with your account
            </p>
          )}
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {fields.map((field) => {
            const isEmail = field.name === "email";

            return (
              <div key={field.name}>
                <CustomAuthInput
                  name={field.name}
                  type={field.type}
                  label={field.label}
                  value={field.value}
                  autoComplete={field.autoComplete}
                  required
                  onChange={field.onChange}
                />

                {isEmail && formTypeCheck && onSendVerificationOtp && (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={onSendVerificationOtp}
                      disabled={isSendingOtp || !field.value.trim()}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                      {isSendingOtp ? "Sending OTP..." : "Send verification OTP"}
                    </button>

                    {otpSent && (
                      <span className="text-xs font-medium text-emerald-600">
                        OTP sent
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Terms */}
          <div className="flex items-start gap-2 text-sm text-slate-500">
            <input
              type="checkbox"
              id="terms"
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />

            <label htmlFor="terms" className="cursor-pointer leading-5">
              I agree to the{" "}
              <span className="font-medium text-blue-600 hover:underline">
                Terms & Conditions
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitDisabled || isLoading}
            className="
              mt-2
              w-full
              rounded-lg
              bg-blue-600
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              duration-200
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:bg-slate-400
              disabled:hover:bg-slate-400
              disabled:active:scale-100
              active:scale-[0.99]
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
            "
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isLoading && <LoaderCircle className="animate-spin" size={16} />}
              {isLoading
                ? formTypeCheck
                  ? "Creating account..."
                  : "Signing in..."
                : formTypeCheck
                  ? "Create Account"
                  : "Sign in"}
            </span>
          </button>
        </form>

        {/* Login */}
        <p className="mt-7 text-center text-sm text-slate-500">
          {formTypeCheck
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            onClick={() => router.push(formTypeCheck ? "/sign-in" : "/sign-up")}
          >
            {formTypeCheck ? "Sign in" : "Create Account"}
          </button>
        </p>
      </div>
    </div>
  );
};
export default AuthForm;
