export const VIDEO_STATIC_PLACEHOLDER_ID = "_";

export function videoIdFromPath(pathname: string, paramId?: string): string {
  const fromPath = pathname.split("/").filter(Boolean).pop() ?? "";
  if (fromPath && fromPath !== VIDEO_STATIC_PLACEHOLDER_ID) {
    return fromPath;
  }
  if (paramId && paramId !== VIDEO_STATIC_PLACEHOLDER_ID) {
    return paramId;
  }
  return "";
}
