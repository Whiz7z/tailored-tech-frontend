import { ApiError, api } from "./client";
import type { FileItem } from "./types";
import { parseFileItem } from "./validate";

export async function getFile(id: string): Promise<FileItem> {
  const { data } = await api.get(`/files/${id}`);
  return parseFileItem(data);
}

export async function uploadFile(input: {
  dataRoomId: string;
  folderId?: string | null;
  file: File;
}): Promise<FileItem> {
  const form = new FormData();
  form.append("file", input.file);
  form.append("dataRoomId", input.dataRoomId);
  if (input.folderId) {
    form.append("folderId", input.folderId);
  }

  const { data } = await api.post("/files", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return parseFileItem(data);
}

export async function renameFile(id: string, name: string): Promise<FileItem> {
  const { data } = await api.patch(`/files/${id}`, { name });
  return parseFileItem(data);
}

export async function deleteFile(id: string): Promise<void> {
  await api.delete(`/files/${id}`);
}

export async function fetchFileContentBlob(id: string): Promise<Blob> {
  const response = await api.get(`/files/${id}/content`, {
    responseType: "blob",
  });

  const blob = response.data;
  if (!(blob instanceof Blob)) {
    throw new ApiError("INTERNAL_ERROR", "Invalid PDF content response from API.");
  }

  // Some gateways return JSON errors as application/json blobs
  const contentType = String(response.headers["content-type"] ?? blob.type ?? "");
  if (contentType.includes("application/json") || contentType.includes("text/html")) {
    const text = await blob.text();
    throw new ApiError(
      "INTERNAL_ERROR",
      text.slice(0, 200) || "Failed to load PDF content.",
    );
  }

  return blob;
}

export function getFileContentUrl(id: string): string {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";
  return `${base}/files/${id}/content`;
}
