import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { BreadcrumbItem } from "../../api/types";
import { ensureArray } from "../../api/validate";
import {
  DEFAULT_CONTENTS_SEARCH,
  DEFAULT_HOME_SEARCH,
} from "../../utils/search";

interface FolderBreadcrumbsProps {
  roomId: string;
  items: BreadcrumbItem[] | null | undefined;
}

const linkSx = {
  color: "inherit",
  textDecoration: "none",
} as const;

export function FolderBreadcrumbs({ roomId, items }: FolderBreadcrumbsProps) {
  const crumbs = ensureArray(items);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link to="/" search={DEFAULT_HOME_SEARCH} style={linkSx}>
        Data Rooms
      </Link>
      {crumbs.map((item, index) => {
        const isLast = index === crumbs.length - 1;
        const key = `${item.type}-${item.id ?? "root"}-${index}`;

        if (isLast) {
          return (
            <Typography key={key} color="text.primary">
              {item.name}
            </Typography>
          );
        }

        if (item.type === "room") {
          return (
            <Link
              key={key}
              to="/rooms/$roomId"
              params={{ roomId }}
              search={DEFAULT_CONTENTS_SEARCH}
              style={linkSx}
            >
              {item.name}
            </Link>
          );
        }

        if (!item.id) {
          return (
            <Typography key={key} color="text.secondary">
              {item.name}
            </Typography>
          );
        }

        return (
          <Link
            key={key}
            to="/rooms/$roomId/folders/$folderId"
            params={{ roomId, folderId: item.id }}
            search={DEFAULT_CONTENTS_SEARCH}
            style={linkSx}
          >
            {item.name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
