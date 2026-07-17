import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AppShell } from "./components/common/AppShell";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { RouteError } from "./components/common/RouteError";
import { FileViewerPage } from "./pages/FileViewerPage";
import { HomePage } from "./pages/HomePage";
import { RoomPage } from "./pages/RoomPage";
import {
  DEFAULT_CONTENTS_SEARCH,
  DEFAULT_HOME_SEARCH,
  parseContentsSearch,
  parseHomeSearch,
} from "./utils/search";

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
  validateSearch: parseHomeSearch,
  component: HomePage,
});

const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rooms/$roomId",
  validateSearch: parseContentsSearch,
  component: function RoomRoute() {
    const { roomId } = roomRoute.useParams();
    const search = roomRoute.useSearch();
    return <RoomPage roomId={roomId} search={search} />;
  },
});

const folderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rooms/$roomId/folders/$folderId",
  validateSearch: parseContentsSearch,
  component: function FolderRoute() {
    const { roomId, folderId } = folderRoute.useParams();
    const search = folderRoute.useSearch();
    return <RoomPage roomId={roomId} folderId={folderId} search={search} />;
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

export { DEFAULT_CONTENTS_SEARCH, DEFAULT_HOME_SEARCH };
