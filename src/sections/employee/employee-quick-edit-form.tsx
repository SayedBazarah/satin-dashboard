import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IEmployeeItem, QuickUpdateEmployeeItem } from 'src/types/employee';
import { useGetRoles } from 'src/api/role';
import axios, { endpoints } from 'src/utils/axios';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentEmployee?: IEmployeeItem;
  onQuickEditRow: (data: QuickUpdateEmployeeItem) => void;
};

export const branches = [];

export const roles = [];

export default function EmployeeQuickEditForm({
  onQuickEditRow,
  currentEmployee,
  open,
  onClose,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { roles } = useGetRoles();

  const NewEmployeeSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phone: Yup.string().required('Phone number is required'),
    role: Yup.string().required('Role is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentEmployee?.name || '',
      role: currentEmployee?.role?.label || '',
      email: currentEmployee?.email || '',
      phone: currentEmployee?.phone || '',
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
      const employee = {
        _id: currentEmployee?._id || '',
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      await axios.patch(endpoints.employee.update, {
        ...employee,
        role: roles[roles.findIndex((value) => value.label === data.role)]._id,
      });
      onQuickEditRow({
        ...employee,
        role: roles[roles.findIndex((value) => value.label === data.role)],
      });
      reset();
      onClose();
      enqueueSnackbar('Update success!');
      router.replace(paths.dashboard.employees.root);
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
            {/* 
            <RHFAutocomplete
              name="branch"
              label="Branch"
              placeholder="Choose a Branch"
              fullWidth
              options={branches.map((option) => option.label)}
            /> */}

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
