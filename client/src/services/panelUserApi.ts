import type { PanelUser } from "@/types/panelUser";

const panelUserApi = `${process.env.NEXT_PUBLIC_BASE_URL}/panel-users`;

export const getPanelUsers = async (): Promise<PanelUser[]> => {
  try {
    const response = await fetch(panelUserApi, { credentials: "include" });
    return response.json();
  } catch (error) {
    throw new Error("Unable to load panel users");
  }
};

export const updatePanelUser = async (
  id: string,
  data: any,
): Promise<PanelUser> => {
  try {
    const response = await fetch(`${panelUserApi}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    throw new Error("Unable to update panel user");
  }
};

export const deletePanelUser = async (id: string): Promise<PanelUser> => {
  try {
    const response = await fetch(`${panelUserApi}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Unable to delete panel user");
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || "Unable to delete panel user");
  }
};
