import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { BreadcrumbItem } from "../api/types";

interface FolderBreadcrumbsProps {
  roomId: string;
  items: BreadcrumbItem[];
}

const linkSx = {
  color: "inherit",
  textDecoration: "none",
} as const;

export function FolderBreadcrumbs({ roomId, items }: FolderBreadcrumbsProps) {
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link to="/" style={linkSx}>
        Data Rooms
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast) {
          return (
            <Typography key={`${item.type}-${item.id ?? "root"}`} color="text.primary">
              {item.name}
            </Typography>
          );
        }

        if (item.type === "room") {
          return (
            <Link
              key="room"
              to="/rooms/$roomId"
              params={{ roomId }}
              style={linkSx}
            >
              {item.name}
            </Link>
          );
        }

        return (
          <Link
            key={item.id}
            to="/rooms/$roomId/folders/$folderId"
            params={{ roomId, folderId: item.id! }}
            style={linkSx}
          >
            {item.name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
