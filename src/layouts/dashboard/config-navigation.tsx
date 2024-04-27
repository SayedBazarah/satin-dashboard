import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('nav.overview'),
        items: [
          {
            title: t('nav.reports'),
            path: 'paths.dashboard.root',
            icon: ICONS.dashboard,
            children: [
              {
                title: t('nav.overview'),
                path: paths.dashboard.root,
              },
              {
                title: t('nav.sales'),
                path: '/1',
              },
            ],
          },
          { title: t('nav.products'), path: paths.dashboard.products.root, icon: ICONS.product },

          {
            title: t('nav.categories'),
            path: paths.dashboard.tags,
            icon: ICONS.label,
          },
          // {
          //   title: t('nav.promotions'),
          //   path: paths.dashboard.promotions.root,
          //   icon: ICONS.label,
          // },
          // {
          //   title: t('nav.inventory'),
          //   path: paths.dashboard.inventory.root,
          //   icon: ICONS.banking,
          // },
          {
            title: t('nav.orders'),
            path: paths.dashboard.order.root,
            icon: ICONS.ecommerce,
          },
          // {
          //   title: t('nav.invoices'),
          //   path: paths.dashboard.invoices.root,
          //   icon: ICONS.invoice,
          // },
          // {
          //   title: t('nav.logistics'),
          //   path: paths.dashboard.legistics.root,
          //   icon: ICONS.external,
          // },
          {
            title: t('nav.employees'),
            path: paths.dashboard.employees.root,
            icon: ICONS.label,
            children: [
              {
                title: t('nav.employees_create'),
                path: paths.dashboard.employees.new,
              },
              {
                title: t('nav.employees_list'),
                path: paths.dashboard.employees.root,
              },

              {
                title: t('nav.employees_permissions'),
                path: paths.dashboard.employees.permission,
              },
            ],
          },
          // {
          //   title: t('nav.customers'),
          //   path: paths.dashboard.customers.root,
          //   icon: ICONS.label,
          // },
          // {
          //   title: t('nav.notification'),
          //   path: paths.dashboard.notification.root,
          //   icon: ICONS.chat,
          // },
          // {
          //   title: t('nav.blog'),
          //   path: paths.dashboard.blog.root,
          //   icon: ICONS.blog,
          // },
        ],
      },
    ],
    [t]
  );

  return data;
}
