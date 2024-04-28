import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { ASSETS_API } from 'src/config-global';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IEmployeeItem } from 'src/types/employee';
import { ICategory } from 'src/types/product';
import { Box, Stack, Typography } from '@mui/material';
import Image from 'src/components/image/image';
import CategoryCreateEditForm from './category-create-edit-form';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: ICategory;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onQuickEditRow: (data: IEmployeeItem) => void;
};

export default function CategoryTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { title, coverImage, _id, slug } = row;
  const confirm = useBoolean();
  console.log(row);
  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              component={Image}
              width={45}
              height={45}
              src={coverImage}
              style={{ borderRadius: 8 }}
              crossOrigin="anonymous"
              alt=""
            />

            <ListItemText
              primary={<Typography fontWeight="bold">{title}</Typography>}
              secondary={slug}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
              }}
            />
          </Stack>
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{branch?.label}</TableCell> */}

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CategoryCreateEditForm
        currentCategory={row}
        onEditRow={onEditRow}
        onClose={quickEdit.onFalse}
        open={quickEdit.value}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-right"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
