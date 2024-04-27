'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Alert, useTheme, IconButton, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { PasswordIcon } from 'src/assets/icons';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ResetPasswordView() {
  const { newPassword } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const searchParams = useSearchParams();

  const theme = useTheme();

  const { t } = useTranslate();

  const token = searchParams.get('token') || '';
  // -------------------------------------------

  useEffect(() => {
    (async () => {
      try {
        await axios.get(endpoints.auth.check_token, {
          headers: {
            token,
          },
        });
      } catch (error) {
        console.error('error');
        console.error(error);
        router.push(paths.auth.jwt.token_expired);
      }
    })();
  }, [router, token]);

  // -------------------------------------------
  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string().required(t('auth.password_required')),
    confirm: Yup.string()
      .required()
      .oneOf([Yup.ref('password')], t('auth.password_confirm_required')),
  });

  const defaultValues = {
    password: '',
    confirm: '',
  };

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await newPassword?.(token, data.password, data.confirm);
      router.push(paths.auth.jwt.login);
    } catch (error) {
      console.error(error.errors[0].message);
      setErrorMsg(typeof error === 'string' ? error : error.errors[0].message);
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="password"
        label={t('auth.password')}
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <RHFTextField
        name="confirm"
        label={t('auth.new_password')}
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('auth.confirm')}
      </LoadingButton>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3"> {t('auth.change')}</Typography>
      </Stack>
    </>
  );

  return (
    <Box sx={{ p: 4, boxShadow: theme.shadows[6], borderRadius: 2 }}>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ m: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </Box>
  );
}
