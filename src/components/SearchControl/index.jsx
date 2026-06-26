import { useState, useEffect, useRef } from 'react';
import {
  Autocomplete, TextField, InputAdornment, IconButton,
  CircularProgress, Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * SearchControl — Google-style search input.
 *
 * Props:
 *   value / onChange        controlled text value
 *   onSearch(text)          fired on Enter or search-icon click
 *   options                 static suggestion list (string[] or object[])
 *   fetchOptions(text)      async fn returning suggestions (debounced 300 ms)
 *   getOptionLabel(option)  how to display an option (default: option.label)
 *   onSelect(option)        fired when the user picks a suggestion from the list
 *   placeholder, sx
 */
export const SearchControl = ({
  placeholder = 'Buscar...',
  value = '',
  onChange,
  onSearch,
  options: staticOptions = [],
  fetchOptions,
  getOptionLabel = (o) => (typeof o === 'string' ? o : String(o.label ?? '')),
  onSelect,
  sx,
}) => {
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!fetchOptions) return;
    clearTimeout(debounceRef.current);
    if (!value) { setDynamicOptions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setFetching(true);
      try {
        setDynamicOptions((await fetchOptions(value)) ?? []);
      } catch {
        setDynamicOptions([]);
      } finally {
        setFetching(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [value, fetchOptions]);

  const resolvedOptions = fetchOptions ? dynamicOptions : staticOptions;

  return (
    <Autocomplete
      freeSolo
      disableClearable
      forcePopupIcon={false}
      options={resolvedOptions}
      getOptionLabel={getOptionLabel}
      filterOptions={fetchOptions ? (x) => x : undefined}
      inputValue={value}
      onInputChange={(_, v, reason) => {
        if (reason !== 'reset') onChange?.(v);
      }}
      onChange={(_, option) => {
        if (!option) return;
        if (typeof option === 'string') {
          onSearch?.(option);
        } else {
          onSelect?.(option);
          onChange?.(getOptionLabel(option));
        }
      }}
      PaperComponent={(props) => (
        <Paper elevation={4} {...props} sx={{ mt: 0.5 }} />
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          size="small"
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch?.(value);
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
            },
            ...sx,
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  size="small"
                  tabIndex={-1}
                  onClick={() => onSearch?.(value)}
                  sx={{ p: 0.25, mr: 0.25, color: 'action.active' }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {fetching && <CircularProgress size={14} sx={{ mr: 0.5 }} />}
                {value ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      tabIndex={-1}
                      onClick={() => { onChange?.(''); setDynamicOptions([]); }}
                      sx={{ p: 0.25, color: 'action.active' }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null}
              </>
            ),
          }}
        />
      )}
    />
  );
};
