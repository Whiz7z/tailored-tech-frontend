import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface ListFiltersProps<TFilter extends string> {
  search: string;
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  filterValue?: TFilter;
  filterLabel?: string;
  filterOptions?: FilterOption<TFilter>[];
  onFilterChange?: (value: TFilter) => void;
}

export function ListFilters<TFilter extends string>({
  search,
  searchPlaceholder = "Search by name…",
  onSearchChange,
  filterValue,
  filterLabel = "Filter",
  filterOptions,
  onFilterChange,
}: ListFiltersProps<TFilter>) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: filterOptions ? "minmax(0, 2fr) minmax(0, 1fr)" : "1fr",
        },
        gap: 1.5,
        mb: 2.5,
      }}
    >
      <TextField
        size="small"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      {filterOptions && filterValue !== undefined && onFilterChange && (
        <FormControl size="small">
          <InputLabel id="list-filter-label">{filterLabel}</InputLabel>
          <Select
            labelId="list-filter-label"
            label={filterLabel}
            value={filterValue}
            onChange={(event: SelectChangeEvent) =>
              onFilterChange(event.target.value as TFilter)
            }
          >
            {filterOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
