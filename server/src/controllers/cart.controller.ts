import { Request, Response } from "express";
import { getCartByUserId, listCarts } from "../services/cart.service";

export async function getCarts(_req: Request, res: Response) {
  try {
    const carts = await listCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
}

export async function getCart(req: Request<{ userId: string }>, res: Response) {
  try {
    const cart = await getCartByUserId(Number(req.params.userId));

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}
