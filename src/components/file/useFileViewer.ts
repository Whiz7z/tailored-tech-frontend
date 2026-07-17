import { useEffect, useState } from "react";
import { getErrorMessage } from "../../api/client";
import { fetchFileContentBlob } from "../../api/files";
import { useFile } from "../../hooks/useFiles";

export function useFileViewer(fileId: string) {
  const fileQuery = useFile(fileId);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadContent() {
      setLoadingContent(true);
      setContentError(null);
      setBlobUrl(null);
      try {
        const blob = await fetchFileContentBlob(fileId);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch (error) {
        if (!cancelled) {
          setContentError(getErrorMessage(error, "Failed to load PDF"));
        }
      } finally {
        if (!cancelled) {
          setLoadingContent(false);
        }
      }
    }

    void loadContent();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileId]);

  return {
    fileQuery,
    blobUrl,
    contentError,
    loadingContent,
  };
}
