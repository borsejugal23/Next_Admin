"use client";

import { getFirstAccessibleRoute } from "@/authorization/routeAccess";
import AuthForm from "@/components/auth/component/AuthForm";
import { CustomInputProps } from "@/components/auth/component/CustomAuthInput";
import { useSignIn } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "@/stores/panelUser/reducer";
const SignInPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { mutate: signIn, isPending } = useSignIn();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    signIn(formData, {
      onSuccess: (data) => {
        dispatch(
          setUserProfile({
            _id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            allowedRoles: data.user.allowedRoles,
          }),
        );
        toast.success("Signed in successfully", {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        });
        router.replace(getFirstAccessibleRoute(data.user.role) ?? "/product");
      },
      onError: (error) => toast.error(error.message),
    });
  };

  const isFormValid =
    formData.email.trim().length > 0 && formData.password.trim().length > 0;

  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      value: formData.email,
      autoComplete: "email",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, email: e.target.value });
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      value: formData.password,
      autoComplete: "current-password",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, password: e.target.value });
      },
    },
  ] as CustomInputProps[];
  return (
    <AuthForm
      fields={fields}
      formType="sign-in"
      handleSubmit={handleSubmit}
      isLoading={isPending}
      isSubmitDisabled={!isFormValid}
    />
  );
};

export default SignInPage;
