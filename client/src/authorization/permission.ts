const rolePermission = {
  admin: [
    "financial:view",
    "useranalysis:view",

    "user:view",
    "user:create",
    "user:update",
    "user:delete",

    "paneluser:view",
    "paneluser:create",
    "paneluser:update",
    "paneluser:delete",

    "product:view",
    "product:create",
    "product:update",
    "product:delete",

    "review:view",
    "review:create",
    "review:update",
    "review:delete",
  ],
  moderator: [
    "user:view",
    "user:create",
    "user:update",

    "paneluser:view",
    "paneluser:create",
    "paneluser:update",

    "product:view",
    "product:create",
    "product:update",

    "review:view",
    "review:create",
    "review:update",
  ],
  panel_user: ["product:view"],
};

export default rolePermission;
