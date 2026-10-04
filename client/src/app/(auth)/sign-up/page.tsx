"use client";

import AuthForm from "@/components/auth/component/AuthForm";
import { CustomInputProps } from "@/components/auth/component/CustomAuthInput";
import { useSendVerificationOtp, useSignUp } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

const SignUpPage = () => {
  const router = useRouter();
  const { mutate: signUp, isPending } = useSignUp();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendVerificationOtp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = () => {
    const email = formData.email.trim();
    if (!email) {
      toast.error("Enter your email first");
      return;
    }

    sendOtp(email, {
      onSuccess: () => {
        setOtpSent(true);
        toast.success("Verification OTP sent to your email");
      },
      onError: (error) => toast.error(error.message),
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    if (!otpSent) {
      toast.error("Please verify your email with OTP first");
      return;
    }

    signUp(formData, {
      onSuccess: () => {
        toast.success("Account created successfully");
        router.replace("/sign-in");
      },
      onError: (error) => toast.error(error.message),
    });
  };

  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.password.trim().length > 0 &&
    formData.otp.trim().length === 6;

  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      value: formData.name,
      autoComplete: "name",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, name: e.target.value });
      },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      value: formData.email,
      autoComplete: "email",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtpSent(false);
        setFormData({ ...formData, email: e.target.value, otp: "" });
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      value: formData.password,
      autoComplete: "new-password",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, password: e.target.value });
      },
    },
    {
      name: "otp",
      label: "Email verification OTP",
      type: "text",
      value: formData.otp,
      autoComplete: "one-time-code",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const otp = e.target.value.replace(/\D/g, "").slice(0, 6);
        setFormData({ ...formData, otp });
      },
    },
  ] as CustomInputProps[];

  return (
    <AuthForm
      fields={fields}
      formType="sign-up"
      handleSubmit={handleSubmit}
      isLoading={isPending}
      isSubmitDisabled={!isFormValid}
      onSendVerificationOtp={handleSendOtp}
      isSendingOtp={isSendingOtp}
      otpSent={otpSent}
    />
  );
};

export default SignUpPage;
