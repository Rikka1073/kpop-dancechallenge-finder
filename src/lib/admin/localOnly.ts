export const LOCAL_ADMIN_ONLY_MESSAGE = "管理画面はローカルの npm run dev でのみ使えます";

export function isLocalAdminEnabled() {
  return process.env.NODE_ENV !== "production";
}
