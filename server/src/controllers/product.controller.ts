import { Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../types/product";
import {
  DEFAULT_PRODUCT_LIMIT,
  getProductById,
  listProducts,
  updateProduct,
} from "../services/product.service";
import { parseCsvQueryParam } from "../services/user.service";

export async function getProducts(req: Request, res: Response) {
  const search = req.query.search as string;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || DEFAULT_PRODUCT_LIMIT);
  const categoryFilters = parseCsvQueryParam(req.query.category);
  const stockFilters = parseCsvQueryParam(req.query.stock);
  const sort =
    typeof req.query.sort === "string" ? req.query.sort : undefined;

  try {
    const result = await listProducts({
      search,
      page,
      limit,
      categoryFilters,
      stockFilters,
      sort,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function getProduct(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  try {
    const result = await getProductById(id);

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function patchProduct(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const update: Partial<Product> = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  try {
    const product = await updateProduct(id, update);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
