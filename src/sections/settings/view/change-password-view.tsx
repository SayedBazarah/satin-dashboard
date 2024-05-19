'use client';

import * as Yup from 'yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Alert,
  Stack,
  Container,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

export default function ChangePasswordView() {
  const { t } = useTranslate();

  const showPassword = useBoolean();

  const [errMes, setErrMeg] = useState('');

  const { changePassword } = useAuthContext();

  const changePasswordSchema = Yup.object().shape({
    password: Yup.string().required(),
    newPassword: Yup.string().required(),
    confirm: Yup.string().required(),
  });

  const defaultValues = {
    password: '',
    newPassword: '',
    confirm: '',
  };

  const methods = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async ({ confirm, newPassword, password }) => {
    try {
      if (newPassword !== confirm) setErrMeg(t('settings.confirm-password-error'));
      else changePassword({ confirm, newPassword, password });
    } catch (error) {
      console.error(error);
      reset();
      setErrMeg(typeof error === 'string' ? error : error.errors[0].message);
    }
  });

  const renderForm = (
    <>
      <Stack spacing={1} my={2}>
        <RHFTextField
          name="password"
          label={t('settings.old-password')}
          type={showPassword.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="newPassword"
          label={t('settings.new-password')}
          type={showPassword.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="confirm"
          label={t('settings.confirm-password')}
          type={showPassword.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <LoadingButton
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('settings.change-password')}
      </LoadingButton>
    </>
  );
  return (
    <Container>
      <Typography variant="h5">{t('settings.change-password')}</Typography>
      <Box sx={{ maxWidth: '400px', my: 2 }}>
        {!!errMes && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errMes}
          </Alert>
        )}
        <FormProvider methods={methods} onSubmit={onSubmit}>
          {renderForm}
        </FormProvider>
      </Box>
    </Container>
  );
}
