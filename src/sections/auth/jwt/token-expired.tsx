'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Alert, Box, IconButton, InputAdornment, useTheme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import axios, { endpoints } from 'src/utils/axios';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { ExpiredIcon, PasswordIcon } from 'src/assets/icons';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useTranslate } from 'src/locales';
import { useEffect, useState } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export default function TokenExpiredView() {
  const router = useRouter();

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
