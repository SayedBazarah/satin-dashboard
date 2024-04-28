import * as Yup from 'yup';
import { useMemo } from 'react';
import { TFunction } from 'i18next';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { useGetRoles } from 'src/api/role';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IEmployeeItem, QuickUpdateEmployeeItem } from 'src/types/employee';

// ----------------------------------------------------------------------

type Props = {
  t: TFunction<'translation', undefined>;
  open: boolean;
  onClose: VoidFunction;
  currentEmployee?: IEmployeeItem;
  onQuickEditRow: (data: QuickUpdateEmployeeItem) => void;
};

export default function EmployeeQuickEditForm({
  t,
  onQuickEditRow,
  currentEmployee,
  open,
  onClose,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { roles } = useGetRoles();

  const NewEmployeeSchema = Yup.object().shape({
    name: Yup.string().required(t('employee.yup.name')),
    email: Yup.string()
      .required(t('employee.yup.email'))
      .email('Email must be a valid email address'),
    phone: Yup.string().required(t('employee.yup.phone')),
    role: Yup.string().required(t('employee.yup.role')),
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
      enqueueSnackbar(t('common.update-success'));
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
        <DialogTitle>{t('common.update')}</DialogTitle>

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
            <RHFTextField name="name" label={t('employee.name')} />
            <RHFTextField name="email" label={t('employee.email')} />
            <RHFTextField name="phone" label={t('employee.phone')} />

            <RHFAutocomplete
              name="role"
              type="role"
              label={t('employee.role-table-title')}
              placeholder="Choose a branch"
              fullWidth
              options={roles.map((option) => option.label)}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('common.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {t('common.update')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
