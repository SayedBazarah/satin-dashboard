import { EmployeeEditView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Employee Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function UserEditPage({ params }: Props) {
  const { id } = params;

  return <EmployeeEditView id={id} />;
}

// export async function generateStaticParams() {
//   const {
//     data: { users },
//   } = await axios.get(endpoints.employee.ids);
//   console.log(users);
//   return users.map((id: string) => ({
//     id: 'id',
//   }));
// }
