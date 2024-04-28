import * as Yup from 'yup';
import React, { useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IRole } from 'src/types/employee';

type Props = {
  currentRole?: IRole;
  open: boolean;
  onClose: VoidFunction;
  onEditRow: VoidFunction;
};

export default function EmployeeRoleCreateEditForm({
  currentRole,
  open,
  onClose,
  onEditRow,
}: Props) {
  const { t, i18n } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();

  const NewRoleSchema = Yup.object().shape({
    _id: Yup.string(),
    label: Yup.string().required(t('employee.role.yup-label')),
    permissions: Yup.array().of(Yup.string()),
  });

  const defaultValues = useMemo(
    () => ({
      _id: currentRole?._id || '',
      label: currentRole?.label || '',
      permissions: currentRole?.permissions || [],
    }),
    [currentRole]
  );

  const methods = useForm({
    resolver: yupResolver(NewRoleSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentRole)
        await axios.patch(endpoints.roles.update, {
          ...data,
          _id: currentRole._id,
        });
      else await axios.post(endpoints.roles.create, data);
      onEditRow();
      onClose();
      enqueueSnackbar(t('common.update-success'));
    } catch (error) {
      console.error(error && error);
    }
  });

  // ----------------------------------------------------
  const OPTIONS = [
    t('employee.role.dashboard'),
    t('employee.role.products'),
    t('employee.role.categories'),
    t('employee.role.orders'),
    t('employee.role.employees'),
  ];
  // ----------------------------------------------------

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {(!currentRole && t('employee.role.new')) || t('employee.role.update')}
        </DialogTitle>
        <DialogContent>
          <Stack py={2} spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="_id" label={t('employee.role.id')} disabled />
              <RHFTextField name="label" label={t('employee.role.title')} />
            </Box>
            <RHFAutocomplete
              multiple
              name="permissions"
              label={t('employee.role.permissions-select')}
              options={OPTIONS}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('common.delete')}
          </Button>
          <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
            {(!currentRole && t('employee.role.new')) || t('common.update')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
