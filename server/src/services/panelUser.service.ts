import panelusersModel from "../models/panelUser.model";
export async function listPanelUsers() {
  try {
    const panelusers = await panelusersModel.find();
    return panelusers;
  } catch (error: any) {
    return { message: "Error fetching panel users", error: error };
  }
}

export async function updatePanelUserService(id: string, data: any) {
  try {
    console.log(id, data);
    const panelUser = await panelusersModel.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });
    return panelUser;
  } catch (error: any) {
    return { message: "Error updating panel user", error: error };
  }
}

export async function deletePanelUserService(id: string) {
  try {
    const panelUser = await panelusersModel.findByIdAndDelete(id);
    return panelUser;
  } catch (error: any) {
    return { message: "Error deleting panel user", error: error };
  }
}
