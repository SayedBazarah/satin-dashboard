import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { countries } from 'src/assets/data';
import { USER_STATUS_OPTIONS } from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IEmployeeItem } from 'src/types/employee';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentEmployee?: IEmployeeItem;
};

export const branches = [
  { code: 'AI', label: 'Cairo', phone: '500-268-4826' },
  { code: 'AL', label: 'Alex', phone: '500-268-4826' },
  { code: 'AM', label: 'Giza', phone: '500-268-4826' },
];

export const roles = [
  { code: 'AI', label: 'Cashier', permissions: [] },
  { code: 'AL', label: 'Store Assistant', permissions: [] },
  { code: 'AM', label: 'Inventory Control Specialists', permissions: [] },
];

export default function EmployeeQuickEditForm({ currentEmployee, open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewEmployeeSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phone: Yup.string().required('Phone number is required'),
    role: Yup.string().required('Role is required'),
    branch: Yup.string().required('Role is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentEmployee?.name || '',
      role: currentEmployee?.role?.label || '',
      email: currentEmployee?.email || '',
      phone: currentEmployee?.phone || '',
      branch: currentEmployee?.branch || '',
    }),
    [currentEmployee]
  );

  const methods = useForm({
    resolver: yupResolver(NewEmployeeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      onClose();
      enqueueSnackbar('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
            paddingTop={2}
          >
            <RHFTextField name="name" label="Full Name" />
            <RHFTextField name="email" label="Email Address" />
            <RHFTextField name="phone" label="Phone Number" />

            <RHFAutocomplete
              name="branch"
              label="Branch"
              placeholder="Choose a Branch"
              fullWidth
              options={branches.map((option) => option.label)}
            />

            <RHFAutocomplete
              name="role"
              type="role"
              label="Role"
              placeholder="Choose a branch"
              fullWidth
              options={roles.map((option) => option.label)}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
