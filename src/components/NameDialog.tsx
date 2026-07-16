import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

interface NameDialogProps {
  open: boolean;
  title: string;
  label?: string;
  confirmLabel?: string;
  initialValue?: string;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function NameDialog({
  open,
  title,
  label = "Name",
  confirmLabel = "Save",
  initialValue = "",
  loading = false,
  error = null,
  onClose,
  onSubmit,
}: NameDialogProps) {
  const [name, setName] = useState(initialValue);

  useEffect(() => {
    if (open) {
      setName(initialValue);
    }
  }, [open, initialValue]);

  const trimmed = name.trim();
  const canSubmit = trimmed.length > 0 && !loading;

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (canSubmit) {
            onSubmit(trimmed);
          }
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={label}
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={Boolean(error)}
            helperText={error}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={!canSubmit}>
            {confirmLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
