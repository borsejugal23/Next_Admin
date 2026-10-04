import type { Cart } from "@/types/cart";
const cartApi = `${process.env.NEXT_PUBLIC_BASE_URL}/carts`;

export const getUserCart = async (userId: number): Promise<Cart | null> => {
  const response = await fetch(`${cartApi}/${userId}`, {
    credentials: "include",
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data ?? null;
};
