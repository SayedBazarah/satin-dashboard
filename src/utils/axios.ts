import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/signin',
    register: '/api/auth/signup',
    forgot: '/api/auth/forgot-password',
    update: '/api/auth/update-password',
    check_token: '/api/auth/token-validator',
  },
  employee: {
    list: '/api/employee',
    update: '/api/employee',
    delete: (id: string) => `/api/employee/delete/${id}`,
    delete_rows: `/api/employee`,
    single: '/api/employee/single',
    details: '/api/employee/single',
    ids: '/api/employee/ids',
    create: '/api/employee/create',
  },
  roles: {
    all: '/api/role',
    create: '/api/role',
    update: '/api/role',
    delete: (id: string) => `/api/role/delete/${id}`,
    delete_rows: `/api/role/delete/rows`,
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
