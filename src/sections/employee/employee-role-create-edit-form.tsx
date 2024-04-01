import React, { useCallback, useMemo } from 'react';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';

import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';

import FormProvider from 'src/components/hook-form/form-provider';

import { IRole } from 'src/types/employee';

type Props = {
  currentRole?: IRole;
  open: boolean;
  onClose: VoidFunction;
};

export default function EmployeeRoleCreateEditForm({ currentRole, open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewRoleSchema = Yup.object().shape({
    code: Yup.string(),
    label: Yup.string().required('Role label is needed'),
    permissions: Yup.array().of(Yup.string()),
  });

  const defaultValues = useMemo(
    () => ({
      code: currentRole?.code || '',
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
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  console.log('values ---');
  console.log(values);
  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onClose();
      enqueueSnackbar('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error && error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>
        <DialogContent>
          <Stack py={2} spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display={'grid'}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="code" label="Code" />
              <RHFTextField name="label" label="Label" />
            </Box>
            <RHFAutocomplete
              multiple
              name={'permissions'}
              label="Select Permissions"
              options={['Orders', 'Invoices', 'Products']}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
