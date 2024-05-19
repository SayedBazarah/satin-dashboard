'use client';

import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

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

import { useTranslate } from 'src/locales';
import { useGetCategories } from 'src/api/category';

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

  const [filters] = useState(defaultFilters);

  const confirm = useBoolean();

  const quickCreate = useBoolean();

  const { categories, mutate } = useGetCategories();

  const TABLE_HEAD = [
    { id: 'title', label: t('category.title') },
    { id: '', width: 88 },
  ];

  const dataFiltered = applyFilter({
    inputData: categories,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const handleDeleteRows = useCallback(async () => {
    await axios.delete(endpoints.categories.deleteRows, {
      data: {
        categories: table.selected,
      },
    });

    mutate(undefined, { revalidate: true });

    enqueueSnackbar('Delete success!');
  }, [table.selected, mutate, enqueueSnackbar]);

  const handleDeleteRow = useCallback(
    async (_id: string) => {
      await axios.delete(endpoints.categories.delete(_id));
      mutate(undefined, { revalidate: true });

      enqueueSnackbar('Delete success!');
    },
    [enqueueSnackbar, mutate]
  );

  const handleUpdateCategory = useCallback(
    async (id: string, category?: FormData) => {
      try {
        await axios.patch(endpoints.categories.update(id), category);
        mutate(undefined, { revalidate: true });

        enqueueSnackbar('Updated success!');
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, mutate]
  );

  const handleCreateCategory = useCallback(
    async (category: FormData) => {
      try {
        await axios.post(endpoints.categories.create, category);
        mutate(undefined, { revalidate: true });

        enqueueSnackbar('Created success!');
      } catch (error) {
        console.error(error);
      }
    },
    [enqueueSnackbar, mutate]
  );

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
                      onEditRow={handleUpdateCategory}
                    />
                  ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Container>
      <CategoryCreateEditForm
        onEditRow={handleCreateCategory}
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
