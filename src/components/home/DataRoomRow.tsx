import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import { TableCell, TableRow } from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { DataRoom } from "../../api/types";
import { formatDate } from "../../utils/format";
import { DEFAULT_CONTENTS_SEARCH } from "../../utils/search";
import { ItemNameWithCounts } from "../common/ItemNameWithCounts";
import { RowActions } from "../common/RowActions";
import { homeRowLinkStyle } from "./types";
interface DataRoomRowProps {
  room: DataRoom;
  onRename: (room: DataRoom) => void;
  onDelete: (room: DataRoom) => void;
}

export function DataRoomRow({ room, onRename, onDelete }: DataRoomRowProps) {
  return (
    <TableRow hover>
      <TableCell>
        <Link
          to="/rooms/$roomId"
          params={{ roomId: room.id }}
          search={DEFAULT_CONTENTS_SEARCH}
          style={homeRowLinkStyle}
        >
          <ItemNameWithCounts
            icon={<MeetingRoomOutlinedIcon color="primary" fontSize="small" />}
            name={room.name}
            folderCount={room.folderCount}
            fileCount={room.fileCount}
          />
        </Link>
      </TableCell>
      <TableCell>{formatDate(room.updatedAt)}</TableCell>
      <TableCell align="right">
        <RowActions
          onRename={() => onRename(room)}
          onDelete={() => onDelete(room)}
        />
      </TableCell>
    </TableRow>
  );
}
