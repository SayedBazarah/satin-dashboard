import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';
import axios, { endpoints } from 'src/utils/axios';

import { useGetRoles } from 'src/api/role';
import { ASSETS_API } from 'src/config-global';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { IEmployeeItem } from 'src/types/employee';

// ----------------------------------------------------------------------

type Props = {
  currentEmployee?: IEmployeeItem;
};

export default function UserNewEditForm({ currentEmployee }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { roles } = useGetRoles();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phone: Yup.string().required('Phone number is required'),
    state: Yup.string().required('State is required'),
    area: Yup.string().required('Area is required'),
    role: Yup.string().required('Role is required'),
    profileImage: Yup.mixed<any>().nonNullable().required(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentEmployee?.name || '',
      email: currentEmployee?.email || '',
      phone: currentEmployee?.phone || '',
      state: currentEmployee?.state || '',
      area: currentEmployee?.area || '',
      role: currentEmployee?.role.label || '',

      profileImage: `${ASSETS_API}/${currentEmployee?.profileImage}` || null,
    }),
    [currentEmployee]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('state', data.state);
      formData.append('area', data.area);
      formData.append('profileImage', data.profileImage);
      formData.append('_id', (currentEmployee && currentEmployee._id) || '');
      formData.append('role', roles[roles.findIndex((item) => item.label === data.role)]._id);

      if (currentEmployee) await axios.patch(endpoints.employee.update, formData);
      else await axios.post(endpoints.employee.create, formData);

      reset();
      enqueueSnackbar(currentEmployee ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.employees.root);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('profileImage', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box>
              <RHFUploadAvatar
                maxSize={3145728}
                onDrop={handleDrop}
                {...register('profileImage')}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentEmployee && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phone" label="Phone Number" />

              {/* <RHFAutocomplete
                name="branch"
                type="branch"
                label="Branch"
                placeholder="Choose a branch"
                fullWidth
                options={branches.map((option) => option.label)}
              /> */}

              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="area" label="Area" />
              <RHFAutocomplete
                name="role"
                type="role"
                label="Role"
                placeholder="Choose a branch"
                fullWidth
                options={roles.map((option) => option.label)}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentEmployee ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
