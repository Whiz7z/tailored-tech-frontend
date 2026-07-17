import { ContentsBrowser } from "../components/room/ContentsBrowser";
import type { ContentsSearch } from "../utils/search";

interface RoomPageProps {
  roomId: string;
  folderId?: string;
  search: ContentsSearch;
}

export function RoomPage({ roomId, folderId, search }: RoomPageProps) {
  return (
    <ContentsBrowser
      roomId={roomId}
      folderId={folderId ?? null}
      search={search}
    />
  );
}
