import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import {
  IBillinig,
  IOrderPayment,
  IOrderCustomer,
  IOrderDelivery,
  IOrderShippingAddress,
} from 'src/types/order';

// ----------------------------------------------------------------------

type Props = {
  customer?: IOrderCustomer;
  billing?: IBillinig;
  delivery?: IOrderDelivery;
  payment?: IOrderPayment;
  shippingAddress?: IOrderShippingAddress;
};

export default function OrderDetailsInfo({
  customer,
  billing,
  delivery,
  payment,
  shippingAddress,
}: Props) {
  const renderCustomer = (
    <>
      <CardHeader
        title="Customer Info"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={customer?.name}
          src={customer?.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{customer?.name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{customer?.email}</Box>

          <Box>
            IP Address:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {customer?.ipAddress}
            </Box>
          </Box>

          <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 1 }}
          >
            Add to Blacklist
          </Button>
        </Stack>
      </Stack>
    </>
  );

  const renderBilling = (
    <>
      <CardHeader title="Customer Info" />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar alt={billing?.name} src={billing?.name} sx={{ width: 48, height: 48, mr: 2 }} />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{billing?.name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{billing?.email}</Box>

          <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
            {billing?.address}
          </Box>

          {/* <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 1 }}
          >
            Add to Blacklist
          </Button> */}
        </Stack>
      </Stack>
    </>
  );

  // const renderDelivery = (
  //   <>
  //     <CardHeader
  //       title="Delivery"
  //       action={
  //         <IconButton>
  //           <Iconify icon="solar:pen-bold" />
  //         </IconButton>
  //       }
  //     />
  //     <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
  //       <Stack direction="row" alignItems="center">
  //         <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
  //           Ship by
  //         </Box>
  //         {delivery.shipBy}
  //       </Stack>
  //       <Stack direction="row" alignItems="center">
  //         <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
  //           Speedy
  //         </Box>
  //         {delivery.speedy}
  //       </Stack>
  //       <Stack direction="row" alignItems="center">
  //         <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
  //           Tracking No.
  //         </Box>
  //         <Link underline="always" color="inherit">
  //           {delivery.trackingNumber}
  //         </Link>
  //       </Stack>
  //     </Stack>
  //   </>
  // );

  // const renderShipping = (
  //   <>
  //     <CardHeader
  //       title="Shipping"
  //       action={
  //         <IconButton>
  //           <Iconify icon="solar:pen-bold" />
  //         </IconButton>
  //       }
  //     />
  //     <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
  //       <Stack direction="row">
  //         <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
  //           Address
  //         </Box>
  //         {shippingAddress.fullAddress}
  //       </Stack>

  //       <Stack direction="row">
  //         <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
  //           Phone number
  //         </Box>
  //         {shippingAddress.phoneNumber}
  //       </Stack>
  //     </Stack>
  //   </>
  // );

  // const renderPayment = (
  //   <>
  //     <CardHeader
  //       title="Payment"
  //       action={
  //         <IconButton>
  //           <Iconify icon="solar:pen-bold" />
  //         </IconButton>
  //       }
  //     />
  //     <Stack direction="row" alignItems="center" sx={{ p: 3, typography: 'body2' }}>
  //       <Box component="span" sx={{ color: 'text.secondary', flexGrow: 1 }}>
  //         Phone number
  //       </Box>

  //       {payment.cardNumber}
  //       <Iconify icon="logos:mastercard" width={24} sx={{ ml: 0.5 }} />
  //     </Stack>
  //   </>
  // );

  return (
    <Card>
      {customer && renderCustomer}
      {billing && renderBilling}

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Card>
  );
}
