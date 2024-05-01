'use client';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useGetOrder } from 'src/api/orders';
import { ORDER_STATUS_OPTIONS } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';

import OrderDetailsInfo from '../order-details-info';
import OrderDetailsItems from '../order-details-item';
import OrderDetailsToolbar from '../order-details-toolbar';
import OrderDetailsHistory from '../order-details-history';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function OrderDetailsView({ id }: Props) {
  const { t, i18n } = useTranslate();

  const settings = useSettingsContext();

  const { order, mutate, orderLoading } = useGetOrder(id);

  const handleChangeStatus = useCallback(
    async (status: { value: string; label: string }) => {
      await axiosInstance.patch(endpoints.orders.update(id), {
        status,
      });
      mutate();
    },
    [id, mutate]
  );

  if (orderLoading) return <LoadingScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        t={t}
        lang={i18n.language}
        backLink={paths.dashboard.order.root}
        orderNumber={order.orderNumber}
        createdAt={new Date(order.createdAt)}
        status={order.status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={order.items}
              shipping={order.shipping}
              discount={order.discount}
              subTotal={order.subTotal}
              totalAmount={order.totalAmount}
              t={t}
            />

            <OrderDetailsHistory history={order.history} />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo billing={order.billing} />
        </Grid>
      </Grid>
    </Container>
  );
}
