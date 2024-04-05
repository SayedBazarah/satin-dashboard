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
  const { enqueueSnackbar } = useSnackbar();

  const NewRoleSchema = Yup.object().shape({
    _id: Yup.string(),
    label: Yup.string().required('Role label is needed'),
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
      enqueueSnackbar('Update success!');
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
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="_id" label="Id" disabled />
              <RHFTextField name="label" label="Label" />
            </Box>
            <RHFAutocomplete
              multiple
              name="permissions"
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
