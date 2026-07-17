import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AppShell } from "./components/AppShell";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { RouteError } from "./components/RouteError";
import { FileViewerPage } from "./pages/FileViewerPage";
import { HomePage } from "./pages/HomePage";
import { RoomPage } from "./pages/RoomPage";
import { parsePageSearch } from "./utils/search";

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </AppShell>
  ),
  errorComponent: RouteError,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: parsePageSearch,
  component: HomePage,
});

const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rooms/$roomId",
  validateSearch: parsePageSearch,
  component: function RoomRoute() {
    const { roomId } = roomRoute.useParams();
    const { page } = roomRoute.useSearch();
    return <RoomPage roomId={roomId} page={page} />;
  },
});

const folderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rooms/$roomId/folders/$folderId",
  validateSearch: parsePageSearch,
  component: function FolderRoute() {
    const { roomId, folderId } = folderRoute.useParams();
    const { page } = folderRoute.useSearch();
    return <RoomPage roomId={roomId} folderId={folderId} page={page} />;
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

export const router = createRouter({
  routeTree,
  defaultErrorComponent: RouteError,
  defaultNotFoundComponent: () => (
    <RouteError
      error={new Error("Page not found")}
      reset={() => {
        window.location.assign("/");
      }}
    />
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
