import { api } from "@/lib/api";

export async function downloadAuthenticatedFile(
  path: string,
  filename: string
): Promise<void> {
  const { data } = await api.get<Blob>(path, { responseType: "blob" });
  const url = URL.createObjectURL(data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
