import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import React, { useMemo, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFUploadCover } from 'src/components/hook-form';

import { ICategory } from 'src/types/product';

type Props = {
  currentCategory?: ICategory;
  open: boolean;
  onClose: VoidFunction;
  onEditRow: (category: FormData) => void;
};

export default function CategoryCreateEditForm({
  currentCategory,
  open,
  onClose,
  onEditRow,
}: Props) {
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const NewRoleSchema = Yup.object().shape({
    slug: Yup.string().required(t('category.form-error-slug')),
    title: Yup.string().required(t('category.form-error-title')),
    coverImage: Yup.mixed().required(t('category.form-error-image')),
  });

  const defaultValues = useMemo(
    () => ({
      slug: currentCategory?.slug || '',
      title: currentCategory?.title || '',
      coverImage: currentCategory?.coverImage || {},
    }),
    [currentCategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewRoleSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formdata = new FormData();

      formdata.append('title', data.title);
      formdata.append('slug', data.slug);
      formdata.append('coverImage', data.coverImage as File);

      onEditRow(formdata);

      enqueueSnackbar('Update success!');

      onClose();
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
    [setValue]
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
        <DialogTitle>{(currentCategory && t('common.edit')) || t('category.new')}</DialogTitle>
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
              <RHFTextField name="title" label={t('category.title')} />
              <RHFTextField name="slug" label={t('category.slug')} />
            </Box>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('category.image')} </Typography>
              <RHFUploadCover name="coverImage" maxFiles={1014} onDrop={handleDrop} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
            {(currentCategory && t('common.edit')) || t('category.new')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
