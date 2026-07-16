export const queryKeys = {
  datarooms: ["datarooms"] as const,
  dataroom: (id: string) => ["datarooms", id] as const,
  contents: (roomId: string, folderId: string | null) =>
    ["contents", roomId, folderId] as const,
  file: (id: string) => ["file", id] as const,
};
