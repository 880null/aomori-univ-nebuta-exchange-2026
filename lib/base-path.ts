export const basePath: string = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  if (
    basePath === "" ||
    path.startsWith(basePath) ||
    /^(?:https?:\/\/|data:)/.test(path) ||
    !path.startsWith("/")
  ) {
    return path;
  }

  return `${basePath}${path}`;
}
