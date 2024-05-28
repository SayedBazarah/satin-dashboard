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
    changePassword: '/api/auth/change-password',
  },
  employee: {
    list: '/api/employee',
    update: '/api/employee',
    notification_subscribe: (id: string) => `/api/employee/subscribe-notification/${id}`,
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
  categories: {
    all: '/api/category/list',
    create: '/api/category',
    deleteRows: '/api/category',
    update: (id: string) => `/api/category/${id}`,
    delete: (id: string) => `/api/category/${id}`,
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
  orders: {
    list: '/api/order',
    update: (id: string) => `/api/order/${id}`,
    details: (id: string) => `/api/order/${id}`,
  },
  product: {
    test: '/api/test',
    create: '/api/product',
    update: (id: string) => `/api/product/${id}`,

    list: '/api/product/list',
    categories_tags: () => `/api/product/categories-tags`,
    details: (slug: string) => `/api/product/details/${slug}`,
    search: '/api/product/search',
    delete: (id: string) => `/api/product/${id}`,
    delete_rows: `/api/product/rows`,
  },
};
