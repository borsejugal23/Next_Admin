import { Request, Response } from "express";
import {
  listPanelUsers,
  updatePanelUserService,
  deletePanelUserService,
} from "../services/panelUser.service";

export async function getPanelUsers(_req: Request, res: Response) {
  try {
    const panelUsers = await listPanelUsers();
    res.status(200).json(panelUsers);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function updatePanelUser(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const { id } = req.params;
    const panelUser = await updatePanelUserService(id, req.body);
    res.status(200).json(panelUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function deletePanelUser(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const { id } = req.params;
    const panelUser = await deletePanelUserService(id);
    res.status(200).json(panelUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}
