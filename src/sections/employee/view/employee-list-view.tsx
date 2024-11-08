'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import { useGetRoles } from 'src/api/role';
import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import {
  IEmployeeItem,
  IEmployeeTableFilters,
  QuickUpdateEmployeeItem,
  IEmployeeTableFilterValue,
} from 'src/types/employee';

import EmployeeTableRow from '../employee-table-row';
import EmployeeTableToolbar from '../employee-table-toolbar';
import EmployeeTableFiltersResult from '../employee-table-filters-result';

// ----------------------------------------------------------------------

const defaultFilters: IEmployeeTableFilters = {
  name: '',
  role: [],
  status: '',
};

// ----------------------------------------------------------------------

export default function UserListView() {
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const { roles } = useGetRoles();

  const [tableData, setTableData] = useState<IEmployeeItem[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // -----------------------------------------------------

  const TABLE_HEAD = [
    { id: 'name', label: t('employee.name') },
    { id: 'role', label: t('employee.role-table-title'), width: '120px' },
    { id: 'phone', label: t('employee.phone'), width: '120px' },
    { id: '', width: 88 },
  ];

  // -----------------------------------------------------

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(endpoints.employee.list);
      setTableData(data.users);
    })();
  }, []);
  // -----------------------------------------------------

  const handleFilters = useCallback(
    (name: string, value: IEmployeeTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleUpdateRow = useCallback(
    (data: QuickUpdateEmployeeItem) => {
      const index = tableData.findIndex((row) => row._id === data._id);
      const updatedRow = tableData;
      if (index !== -1) {
        updatedRow[index] = {
          ...updatedRow[index],
          ...data,
        };
        setTableData(updatedRow);
      }
      enqueueSnackbar('Updated success!');
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );
  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios.delete(endpoints.employee.delete(id));

      const deleteRow = tableData.filter((row) => row._id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    await axios.delete(endpoints.employee.delete_rows, {
      data: { employees: table.selected },
    });
    const deleteRows = tableData.filter((row) => !table.selected.includes(row._id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.employees.edit(id));
    },
    [router]
  );

  // const handleFilterStatus = useCallback(
  //   (event: React.SyntheticEvent, newValue: string) => {
  //     handleFilters('status', newValue);
  //   },
  //   [handleFilters]
  // );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('employee.list')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('employee.root'), href: paths.dashboard.employees.root },
            { name: t('employee.list') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.employees.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('employee.new-employee')}
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <EmployeeTableToolbar
            t={t}
            filters={filters}
            onFilters={handleFilters}
            //
            roleOptions={roles}
            statusOptions={[
              { _id: 1, label: t('common.online') },
              { _id: 2, label: t('common.offline') },
            ]}
          />

          {canReset && (
            <EmployeeTableFiltersResult
              t={t}
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row._id)
                )
              }
              action={
                <Tooltip title={t('common.delete')}>
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
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
                      <EmployeeTableRow
                        t={t}
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onQuickEditRow={handleUpdateRow}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('common.delete')}
        content={t('common.delete-message')}
        cancelTitle={t('common.cancel')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              console.log('ConfirmDialog');
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            {t('common.delete')}
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
  inputData: IEmployeeItem[];
  comparator: (a: any, b: any) => number;
  filters: IEmployeeTableFilters;
}) {
  const { name, role, status } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (employee) => employee.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status.length) {
    inputData = inputData.filter((employee) =>
      status.includes((employee.isOnline && 'Online') || 'Offline')
    );
  }
  if (role.length) {
    inputData = inputData.filter((employee) => role.includes(employee.role?.label));
  }

  return inputData;
}
