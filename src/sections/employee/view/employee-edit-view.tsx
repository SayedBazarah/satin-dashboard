'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import EmployeeNewEditForm from '../employee-new-edit-form';
import { useEffect, useState } from 'react';
import axios, { endpoints } from 'src/utils/axios';
import { IEmployeeItem } from 'src/types/employee';
import { LoadingScreen } from 'src/components/loading-screen';

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
