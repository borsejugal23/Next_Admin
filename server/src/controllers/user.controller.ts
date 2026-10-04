import { Request, Response } from "express";
import {
  DEFAULT_USER_LIMIT,
  getUserById,
  listUsers,
  getUserReviewByEmail,
  parseCsvQueryParam,
} from "../services/user.service";

export async function getUsers(req: Request, res: Response) {
  console.log("req.query", req.query);
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || DEFAULT_USER_LIMIT);
  const search = String(req.query.search ?? "");
  const roles = parseCsvQueryParam(req.query.role as string);
  const genders = parseCsvQueryParam(req.query.gender as string);

  try {
    const result = await listUsers({ search, page, limit, roles, genders });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function getUser(req: Request<{ id: string }>, res: Response) {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function getUserReview(req: Request, res: Response) {
  try {
    const userReview = await getUserReviewByEmail(req.query.email as string);
    res.status(200).json(userReview);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}
