import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AppShell } from "./components/AppShell";
import { FileViewerPage } from "./pages/FileViewerPage";
import { HomePage } from "./pages/HomePage";
import { RoomPage } from "./pages/RoomPage";

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rooms/$roomId",
  component: function RoomRoute() {
    const { roomId } = roomRoute.useParams();
    return <RoomPage roomId={roomId} />;
  },
});

const folderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rooms/$roomId/folders/$folderId",
  component: function FolderRoute() {
    const { roomId, folderId } = folderRoute.useParams();
    return <RoomPage roomId={roomId} folderId={folderId} />;
  },
});

const fileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rooms/$roomId/files/$fileId",
  component: function FileRoute() {
    const { roomId, fileId } = fileRoute.useParams();
    return <FileViewerPage roomId={roomId} fileId={fileId} />;
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  roomRoute,
  folderRoute,
  fileRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
