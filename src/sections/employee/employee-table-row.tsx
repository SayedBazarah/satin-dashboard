import Image from 'next/image';
import { TFunction } from 'i18next';

import Badge from '@mui/material/Badge';
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

import EmployeeQuickEditForm from './employee-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  t: TFunction<'translation', undefined>;
  selected: boolean;
  onEditRow: VoidFunction;
  row: IEmployeeItem;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onQuickEditRow: (data: IEmployeeItem) => void;
};

export default function EmployeeTableRow({
  t,
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onQuickEditRow,
}: Props) {
  const { name, profileImage, isOnline, role, phone } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();
  const profile = `${ASSETS_API}/${profileImage}`;
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge variant={isOnline ? 'online' : 'offline'} sx={{ mr: 2 }}>
            <Image
              width={45}
              height={45}
              src={profile}
              style={{ borderRadius: 999 }}
              crossOrigin="anonymous"
              alt=""
            />
          </Badge>

          <ListItemText
            primary={name}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{branch?.label}</TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{role?.label}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phone}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title={t('common.edit')} placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <EmployeeQuickEditForm
        t={t}
        currentEmployee={row}
        onQuickEditRow={onQuickEditRow}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
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
          {t('common.delete')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('common.edit')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('common.delete')}
        content={t('common.delete-message')}
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
