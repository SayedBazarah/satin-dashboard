'use client';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { Box, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { ExpiredIcon } from 'src/assets/icons';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TokenExpiredView() {
  const theme = useTheme();

  const { t } = useTranslate();

  return (
    <Box sx={{ p: 4, boxShadow: theme.shadows[6], borderRadius: 2 }}>
      <ExpiredIcon sx={{ height: 96 }} />

      <Stack spacing={1} alignItems="center">
        <Typography variant="h3"> {t('auth.token_expired')}</Typography>
        <Link
          component={RouterLink}
          href={paths.auth.jwt.login}
          color="inherit"
          variant="subtitle2"
          sx={{
            alignItems: 'center',
            display: 'inline-flex',
            color: 'ButtonText',
          }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" width={16} />
          {t('auth.return_sign_in')}
        </Link>
      </Stack>
    </Box>
  );
}
