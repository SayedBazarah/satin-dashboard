import { useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IProductTableFilters, IProductTableFilterValue } from 'src/types/product';

// ----------------------------------------------------------------------

type Props = {
  filters: IProductTableFilters;
  onFilters: (name: string, value: IProductTableFilterValue) => void;
  //
  stockOptions: {
    value: string;
    label: string;
  }[];
  publishOptions: {
    value: string;
    label: string;
  }[];
};

export default function ProductTableToolbar({
  filters,
  onFilters,
  //
  stockOptions,
  publishOptions,
}: Props) {
  const popover = usePopover();

  const handleChangeStock = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    onFilters('stock', typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleChangePublish = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    onFilters('publish', typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onFilters('name', event.target.value),
    [onFilters]
  );

  return (
    <Stack
        direction={{
          xs: 'column',
          md: 'row',
        }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        spacing={2}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Stock</InputLabel>

          <Select
            multiple
            value={filters.stock}
            onChange={handleChangeStock}
            input={<OutlinedInput label="Stock" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            sx={{ textTransform: 'capitalize' }}
          >
            {stockOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.stock.includes(option.value)}
                />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Publish</InputLabel>

          <Select
            multiple
            value={filters.publish}
            onChange={handleChangePublish}
            input={<OutlinedInput label="Publish" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            sx={{ textTransform: 'capitalize' }}
          >
            {publishOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.publish.includes(option.value)}
                />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </CustomPopover>
      </Stack>
  );
}
