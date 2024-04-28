'use client';

import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import {
  Table,
  Button,
  Tooltip,
  Container,
  TableBody,
  IconButton,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
} from 'src/components/table';

import { ICategory, ICategoryTableFilter } from 'src/types/product';

import CategoryTableRow from '../category-table-row';
import CategoryCreateEditForm from '../category-create-edit-form';
import { useTranslate } from 'src/locales';

// -----------------------------------------------------

const defaultFilters: ICategoryTableFilter = {
  label: '',
};

// -----------------------------------------------------
export default function PermissionsListView() {
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultOrderBy: 'label' });

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState<ICategory[]>([]);

  const [filters] = useState(defaultFilters);

  const confirm = useBoolean();

  const quickCreate = useBoolean();

  // ------------------------------------------------

  const TABLE_HEAD = [
    { id: 'title', label: t('category.title') },
    { id: '', width: 88 },
  ];

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const handleDeleteRows = useCallback(async () => {
    await axios.delete(endpoints.roles.delete_rows, {
      data: {
        roles: table.selected,
      },
    });
    const deleteRows = tableData.filter((row) => !table.selected.includes(row._id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleDeleteRow = useCallback(
    async (_id: string) => {
      await axios.delete(endpoints.roles.delete(_id));
      const deleteRow = tableData.filter((row) => row._id !== _id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const updateData = useCallback(async () => {
    try {
      const { data } = await axios.get(endpoints.categories.all);
      if (data) setTableData(data.categories);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // ------------------------------------------------

  useEffect(() => {
    updateData();
  }, [updateData]);

  // ------------------------------------------------

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('category.root')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('category.root'), href: paths.dashboard.products.root },
            { name: t('category.list') },
          ]}
          action={
            <Tooltip title={t('category.new')}>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={quickCreate.onTrue}
              >
                {t('category.new')}
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
              <Tooltip title={t('common.delete-selected')}>
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
                    <CategoryTableRow
                      key={row._id}
                      t={t}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onEditRow={updateData}
                    />
                  ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Container>
      <CategoryCreateEditForm
        onEditRow={updateData}
        onClose={quickCreate.onFalse}
        open={quickCreate.value}
      />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('common.delete')}
        content={t('category.delete')}
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
  inputData: ICategory[];
  comparator: (a: any, b: any) => number;
  filters: ICategoryTableFilter;
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
      (employee) => employee.title.toLowerCase().indexOf(label.toLowerCase()) !== -1
    );
  }

  return inputData;
}
