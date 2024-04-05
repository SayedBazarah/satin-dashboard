import React from 'react';

import {
  Button,
  Tooltip,
  Checkbox,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  ListItemText,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { IRole } from 'src/types/employee';

import EmployeeRoleEditForm from './employee-role-create-edit-form';

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: IRole;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function EmployeeRoleRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
}: Props) {
  const confirm = useBoolean();

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow selected={selected} hover>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell>
          <ListItemText primary={row.label} />
        </TableCell>
        <TableCell>
          <Typography textAlign="center">{row.permissions.length}</Typography>
        </TableCell>
        <TableCell>
          <Typography textAlign="center">{row.employees}</Typography>
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
          <IconButton
            onClick={() => {
              confirm.onTrue();
            }}
            color="primary"
          >
            <Iconify sx={{ color: 'error.main' }} icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      <EmployeeRoleEditForm
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        currentRole={row}
        onEditRow={onEditRow}
      />
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
