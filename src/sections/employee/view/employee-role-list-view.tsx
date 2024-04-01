'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';

import {
  TableHeadCustom,
  TableSelectedAction,
  getComparator,
  useTable,
} from 'src/components/table';
import { useSettingsContext } from 'src/components/settings';
import {
  Button,
  Container,
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { IRole, IRoleTableFilters } from 'src/types/employee';

import EmployeeRoleRow from '../employee-role-row';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Scrollbar from 'src/components/scrollbar';
import EmployeeRoleCreateEditForm from '../employee-role-create-edit-form';

// -----------------------------------------------------

const defaultFilters: IRoleTableFilters = {
  label: '',
};

// -----------------------------------------------------
export default function PermissionsListView() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultOrderBy: 'label' });

  const settings = useSettingsContext();

  const router = useRouter();

  const [tableData, setTableData] = useState<IRole[]>([
    {
      _id: 'hr',
      label: 'Human Resourses',
      employees: 5,
      permissions: ['Human Resourses', 'Sales'],
    },
    { _id: 'store', label: 'Store Assistance', employees: 2, permissions: ['profile'] },
  ]);

  const [filters, setFilters] = useState(defaultFilters);

  const confirm = useBoolean();

  const quickCreate = useBoolean();

  // ------------------------------------------------

  const TABLE_HEAD = [
    { id: 'title', label: 'Title' },
    { id: 'permissions', label: 'Permissions', width: '60px' },
    { id: 'members', label: 'Employees', width: '60px' },
    { id: '', width: 88 },
  ];

  // ------------------------------------------------

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row._id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleDeleteRow = useCallback(
    (_id: string) => {
      const deleteRow = tableData.filter((row) => row._id !== _id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleEditRow = useCallback(
    (code: string) => {
      router.push(paths.dashboard.employees.edit(code));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Roles"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Employee', href: paths.dashboard.employees.root },
            { name: 'Permissions' },
          ]}
          action={
            <Tooltip title="Create new role">
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={quickCreate.onTrue}
              >
                New Role
              </Button>
            </Tooltip>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <TableContainer>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(check) =>
              table.onSelectAllRows(
                check,
                dataFiltered.map((row) => row._id)
              )
            }
            action={
              <Tooltip title="Delete Selected">
                <IconButton
                  onClick={() => {
                    confirm.onTrue();
                  }}
                  color="primary"
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar>
            <Table>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(check) =>
                  table.onSelectAllRows(
                    check,
                    dataFiltered.map((row) => row._id)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <EmployeeRoleRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                    />
                  ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Container>
      <EmployeeRoleCreateEditForm onClose={quickCreate.onFalse} open={quickCreate.value} />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IRole[];
  comparator: (a: any, b: any) => number;
  filters: IRoleTableFilters;
}) {
  const { label } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (label) {
    inputData = inputData.filter(
      (employee) => employee.label.toLowerCase().indexOf(label.toLowerCase()) !== -1
    );
  }

  return inputData;
}
