// --------------------------------------------

import axios, { endpoints } from 'src/utils/axios';

export const GetAllEmployees = async () => axios.get(endpoints.employee.list);

// --------------------------------------------
