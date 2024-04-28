import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Box, Stack, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { ICategory } from 'src/types/product';

import CategoryCreateEditForm from './category-create-edit-form';
import { TFunction } from 'i18next';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: ICategory;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  t: TFunction<'translation', undefined>;
};

export default function CategoryTableRow({
  t,
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { title, coverImage, slug } = row;
  const confirm = useBoolean();

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
            onEditRow();
            popover.onClose();
          }}
        >
          <Box onClick={quickEdit.onTrue}>
            <Iconify icon="solar:pen-bold" />
            {t('common.edit')}
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('common.delete')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('common.delete')}
        content={t('category.delete')}
        cancelTitle={t('common.cancel')}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('common.delete')}
          </Button>
        }
      />
    </>
  );
}
