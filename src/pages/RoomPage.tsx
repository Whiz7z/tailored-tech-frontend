import { ContentsBrowser } from "../components/ContentsBrowser";

interface RoomPageProps {
  roomId: string;
  folderId?: string;
  page: number;
}

export function RoomPage({ roomId, folderId, page }: RoomPageProps) {
  return (
    <ContentsBrowser roomId={roomId} folderId={folderId ?? null} page={page} />
  );
}
