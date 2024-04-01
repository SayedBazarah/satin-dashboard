// --------------------------------------------

import axios, { endpoints } from 'src/utils/axios';

export const GetAllEmployees = async () => await axios.get(endpoints.employee.list);

// --------------------------------------------
