'use client';

import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IEmployeeItem } from 'src/types/employee';

import EmployeeNewEditForm from '../employee-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function EmployeeEditView({ id }: Props) {
  const settings = useSettingsContext();
  const [currentEmployee, setCurrentEmployee] = useState<IEmployeeItem>();
  console.log('id');
  console.log(id);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${endpoints.employee.details}/${id}`);
      setCurrentEmployee(data.user);
    })();
  }, []);
  if (!currentEmployee) return <LoadingScreen />;
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Employee',
            href: paths.dashboard.employees.root,
          },
          { name: currentEmployee?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <EmployeeNewEditForm currentEmployee={currentEmployee} />
    </Container>
  );
}
