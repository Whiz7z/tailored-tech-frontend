import { ContentsBrowser } from "../components/ContentsBrowser";

interface RoomPageProps {
  roomId: string;
  folderId?: string;
}

export function RoomPage({ roomId, folderId }: RoomPageProps) {
  return <ContentsBrowser roomId={roomId} folderId={folderId ?? null} />;
}
