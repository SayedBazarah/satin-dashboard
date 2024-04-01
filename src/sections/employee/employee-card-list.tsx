import Box from '@mui/material/Box';

import { IEmployeeCard } from 'src/types/employee';

import EmployeeCard from './employee-card';

// ----------------------------------------------------------------------

type Props = {
  employees: IEmployeeCard[];
};

export default function EmployeeCardList({ employees }: Props) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </Box>
  );
}
