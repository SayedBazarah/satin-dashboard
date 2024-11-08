'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';


// ----------------------------------------------------------------------

export default function EmployeeCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Employee Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Employee', href: paths.dashboard.employees.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.employees.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Employee
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* <EmployeeCardList employees={_userCards} /> */}
    </Container>
  );
}
