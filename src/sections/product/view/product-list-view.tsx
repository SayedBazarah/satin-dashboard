'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  Card,
  Table,
  Tooltip,
  useTheme,
  TableBody,
  IconButton,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useGetProducts } from 'src/api/product';

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

import { IProductItem, IProductTableFilters, IProductTableFilterValue } from 'src/types/product';

import { ProductTableRow } from '../product-table-row';
import ProductTableToolbar from '../product-table-toolbar';
import ProductTableFiltersResult from '../product-table-filters-result';

// ----------------------------------------------------------------------

const defaultFilters: IProductTableFilters = {
  publish: [],
  stock: [],
  name: '',
};

// const HIDE_COLUMNS = {
//   category: false,
// };

// ----------------------------------------------------------------------

export default function ProductListView() {
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const theme = useTheme();

  const table = useTable();

  const confirm = useBoolean();

  const settings = useSettingsContext();

  const { products } = useGetProducts();

  const [tableData, setTableData] = useState<IProductItem[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  // const [columnVisibilityModel, setColumnVisibilityModel] =
  //   useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  // ----------------------------------------------------------------------

  const PUBLISH_OPTIONS = [
    { value: 'publish', label: t('product.published') },
    { value: 'draft', label: t('product.draft') },
  ];

  const PRODUCT_STOCK_OPTIONS = [
    { value: 'in stock', label: t('product.in_stock') },
    { value: 'low stock', label: t('product.low_stock') },
    { value: 'out of stock', label: t('product.out_of_stock') },
  ];

  const TABLE_HEAD = [
    { id: 'Product', label: t('product.product_name') },
    { id: 'created_at', label: t('product.created_at'), width: '130px' },
    { id: 'stock', label: t('product.stock'), width: '120px' },
    { id: 'price', label: t('product.price'), width: '80px' },
    { id: 'tags', label: t('product.tags') },
    { id: '', width: '20px' },
  ];
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (products.length) {
      setTableData(products);
    }
  }, [products]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters,
    comparator: getComparator(table.order, table.orderBy),
  });

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback((name: string, value: IProductTableFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios.delete(endpoints.product.delete(id));
      const deleteRow = tableData.filter((row) => row._id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);
    },
    [enqueueSnackbar, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    await axios.delete(endpoints.product.delete_rows, {
      data: {
        products: table.selected,
      },
    });
    table.setSelected([]);
    const deleteRows = tableData.filter((row) => !table.selected.includes(row._id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);
  }, [table, enqueueSnackbar, tableData]);

  // -------------------------------------------------------------

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // -------------------------------------------------------------

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading={t('list')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            {
              name: t('products'),
              href: paths.dashboard.products.root,
            },
            { name: t('list') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.products.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('new')}
            </Button>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card>
          <ProductTableToolbar
            t={t}
            filters={filters}
            onFilters={handleFilters}
            stockOptions={PRODUCT_STOCK_OPTIONS}
            publishOptions={PUBLISH_OPTIONS}
          />
          {canReset && (
            <ProductTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              numSelected={table.selected.length}
              dense={table.dense}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row._id)
                )
              }
              action={
                <Tooltip title={t('common.delete')}>
                  <IconButton color="error" onClick={confirm.onTrue}>
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
                  sx={{
                    backgroundColor: theme.palette.grey[200],
                    height: 80,
                    borderBottom: '2px solid white',
                  }}
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <ProductTableRow
                        t={t}
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => {
                          handleDeleteRow(row._id);
                        }}
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
        title={t('product.delete')}
        content={t('product.delete_multi_message', {
          length: table.selected.length,
        })}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            {t('product.delete')}
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
  comparator,
}: {
  inputData: IProductItem[];
  comparator: (a: any, b: any) => number;

  filters: IProductTableFilters;
}) {
  const { name, stock, publish } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  console.log('filters');
  console.log(filters);
  if (name.length) {
    inputData = inputData.filter(
      (poduct) => poduct.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.inventoryType));
  }

  if (publish.length) {
    inputData = inputData.filter((product) =>
      publish.includes((product.publish && 'published') || 'draft')
    );
  }

  return inputData;
}
