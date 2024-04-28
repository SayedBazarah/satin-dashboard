import { TFunction } from 'i18next';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import {
  Button,
  Checkbox,
  MenuItem,
  TableRow,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

import { ASSETS_API } from 'src/config-global';

import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IProductItem } from 'src/types/product';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return <>{fCurrency(params.row.price)}</>;
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Label variant="soft" color={(params.row.publish === 'published' && 'info') || 'default'}>
      {params.row.publish}
    </Label>
  );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={fDate(params.row.createdAt)}
      secondary={fTime(params.row.createdAt)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  return (
    <Stack sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={(params.row.available * 100) / params.row.quantity}
        variant="determinate"
        color={
          (params.row.inventoryType === 'out of stock' && 'error') ||
          (params.row.inventoryType === 'low stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, height: 6, maxWidth: 80 }}
      />
      {!!params.row.available && params.row.available} {params.row.inventoryType}
    </Stack>
  );
}

export function RenderCellProduct({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.name}
        src={params.row.coverUrl}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={params.row.onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.name}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.category}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

type Props = {
  t: TFunction<'translate', undefined>;
  selected: boolean;
  row: IProductItem;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};
export const ProductTableRow = ({ t, row, selected, onSelectRow, onDeleteRow }: Props) => {
  const router = useRouter();

  const popover = usePopover();

  const confirm = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <Checkbox checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
            <Image
              src={`${ASSETS_API}/${row.images[0]}`}
              alt={row.name}
              sx={{ width: 64, height: 64, mr: 2, borderRadius: '12px' }}
            />
            <ListItemText
              primary={<Typography>{row.name}</Typography>}
              secondary={
                (row.publish && (
                  <Label variant="soft" color="primary">
                    Published
                  </Label>
                )) || (
                  <Label variant="soft" color="default">
                    Draft
                  </Label>
                )
              }
              sx={{ display: 'flex', flexDirection: 'column' }}
            />
          </Stack>
        </TableCell>
        <TableCell>
          <ListItemText primary={fDate(row.createdAt)} secondary={fTime(row.createdAt)} />
        </TableCell>
        <TableCell>
          <Stack sx={{ typography: 'caption', color: 'text.secondary' }}>
            <LinearProgress
              value={(row.available * 100) / row.quantity}
              variant="determinate"
              color={
                (row.inventoryType === 'out of stock' && 'error') ||
                (row.inventoryType === 'low stock' && 'warning') ||
                'success'
              }
              sx={{ mb: 1, height: 6, maxWidth: 80 }}
            />
            {!!row.available && row.available} {row.inventoryType}
          </Stack>
        </TableCell>
        <TableCell>
          <ListItemText
            primary={
              (row.priceSale && (
                <Typography sx={{ textDecoration: 'line-through', color: 'gray' }}>
                  ${row.price}
                </Typography>
              )) || <Typography>${row.price}</Typography>
            }
            secondary={row.priceSale !== 0 && <Typography>${row.priceSale}</Typography>}
          />
        </TableCell>
        <TableCell sx={{ maxWidth: '120px' }}>
          <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {row.tags &&
              row.tags.map((tag, index) => (
                <Label key={index} color="info">
                  {tag}
                </Label>
              ))}
          </Box>
        </TableCell>
        <TableCell>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="left-top">
        <MenuItem
          onClick={() => {
            router.push(paths.dashboard.products.edit(row.slug));
            popover.onClose();
          }}
          sx={{ color: 'error.default' }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('common.edit')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" /> {t('common.delete')}
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
};
