export interface PageSearch {
  page: number;
}

export function parsePageSearch(search: Record<string, unknown>): PageSearch {
  const raw = search.page;
  const parsed =
    typeof raw === "number"
      ? raw
      : typeof raw === "string"
        ? Number.parseInt(raw, 10)
        : 1;

  return {
    page: Number.isFinite(parsed) && parsed > 0 ? parsed : 1,
  };
}
