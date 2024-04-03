
import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];
const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      forget: `${ROOTS.AUTH}/jwt/forgot-password`,
      token_expired: `${ROOTS.AUTH}/jwt/token-expired`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    checkout: `/product/checkout`,
    products: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: (slug: string) => `${ROOTS.DASHBOARD}/product/${slug}`,
        edit: (slug: string) => `${ROOTS.DASHBOARD}/product/${slug}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    categories: `${ROOTS.DASHBOARD}/categories`,
    employees: {
      root: `${ROOTS.DASHBOARD}/employees`,
      new: `${ROOTS.DASHBOARD}/employees/create`,
      permission: `${ROOTS.DASHBOARD}/employees/permissions`,
      edit: (slug: string) => `${ROOTS.DASHBOARD}/employees/${slug}/edit`,
    },
    promotions: {
      root: `${ROOTS.DASHBOARD}/promotions`,
    },
    inventory: {
      root: `${ROOTS.DASHBOARD}/inventory`,
    },
    customers: {
      root: `${ROOTS.DASHBOARD}/customers`,
    },
    legistics: {
      root: `${ROOTS.DASHBOARD}/legistics`,
    },
    invoices: {
      root: `${ROOTS.DASHBOARD}/invoices`,
    },
    notification: {
      root: `${ROOTS.DASHBOARD}/notification`,
    },
    blog: {
      root: `${ROOTS.DASHBOARD}/blog`,
    },
  },
};
