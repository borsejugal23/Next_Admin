import CartModel from "../models/cart.model";

export async function listCarts() {
  return CartModel.find();
}

export async function getCartByUserId(userId: number) {
  return CartModel.findOne({ userId });
}
