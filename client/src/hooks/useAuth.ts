import {
  createPanelUser,
  sendVerificationOtp,
  signInPanelUser,
  signOutPanelUser,
} from "@/services/authApi";
import type { SignInBody, SignUpBody } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export const useSignUp = () => {
  return useMutation({
    mutationFn: (user: SignUpBody) => createPanelUser(user),
  });
};

export const useSendVerificationOtp = () => {
  return useMutation({
    mutationFn: (email: string) => sendVerificationOtp(email),
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: (user: SignInBody) => signInPanelUser(user),
  });
};
