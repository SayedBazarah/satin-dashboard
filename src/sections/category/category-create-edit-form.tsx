import * as Yup from 'yup';
import React, { useCallback, useMemo } from 'react';
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
  Typography,
} from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFUploadCover } from 'src/components/hook-form';
import { ICategory } from 'src/types/product';

type Props = {
  currentCategory?: ICategory;
  open: boolean;
  onClose: VoidFunction;
  onEditRow: VoidFunction;
};

export default function CategoryCreateEditForm({
  currentCategory,
  open,
  onClose,
  onEditRow,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  console.log('currentCategory');
  console.log(currentCategory);
  const NewRoleSchema = Yup.object().shape({
    slug: Yup.string().required('product slug required'),
    title: Yup.string().required('category title is needed'),
    coverImage: Yup.mixed().required('category image is needed'),
  });

  const defaultValues = useMemo(
    () => ({
      slug: currentCategory?.slug || '',
      title: currentCategory?.title || '',
      coverImage: currentCategory?.coverImage || '',
    }),
    [currentCategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewRoleSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formdata = new FormData();

      if (currentCategory) formdata.append('_id', currentCategory._id);

      formdata.append('title', data.title);
      formdata.append('slug', data.slug);
      formdata.append('coverImage', data.coverImage as File);

      if (currentCategory) await axios.patch(endpoints.categories.update, formdata);
      else await axios.post(endpoints.categories.create, formdata);
      onEditRow();
      onClose();
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error && error);
    }
  });

  // ------------------------------------------------
  const handleDrop = useCallback(
    (acceptedFile: File[]) => {
      const newFile = Object.assign(acceptedFile[0], {
        preview: URL.createObjectURL(acceptedFile[0]),
      });
      setValue('coverImage', newFile, { shouldValidate: true });
    },
    [setValue, values.coverImage]
  );

  // ------------------------------------------------

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{(currentCategory && 'Quick Update') || 'New Category'}</DialogTitle>
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
              <RHFTextField name="title" label="Title" />
              <RHFTextField name="slug" label="Slug" />
            </Box>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUploadCover name="coverImage" maxFiles={1014} onDrop={handleDrop} />
            </Stack>
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
