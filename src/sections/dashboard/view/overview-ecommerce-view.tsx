'use client';

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { MotivationIllustration } from 'src/assets/illustrations';
import {
  _ecommerceNewProducts,
  _ecommerceBestSaleItems,
  _ecommerceSalesOverview,
  _ecommerceLatestProducts,
} from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import EcommerceWelcome from '../ecommerce-welcome';
import EcommerceNewProducts from '../ecommerce-new-products';
import EcommerceYearlySales from '../ecommerce-yearly-sales';
import EcommerceBestSaleItem from '../ecommerce-best-salesman';
import EcommerceSaleByGender from '../ecommerce-sale-by-gender';
import EcommerceSalesOverview from '../ecommerce-sales-overview';
import EcommerceWidgetSummary from '../ecommerce-widget-summary';
import EcommerceLatestProducts from '../ecommerce-latest-products';
import EcommerceCurrentBalance from '../ecommerce-current-balance';
import { useTranslation } from 'react-i18next';
import { Locale, useLocales, useTranslate } from 'src/locales';
import Link from 'next/link';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const getMonths = (locale: Locale) => {
  if (locale === 'en')
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return [
    'يناير',
    'فبراير',
    'مارس',
    'ابريل',
    'مايو',
    'يونيه',
    'يوليو',
    'اغسطس',
    'سبتمبر',
    'اكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];
};
export default function OverviewEcommerceView() {
  const { user } = useMockedUser();
  const { currentLang } = useLocales();
  const { t } = useTranslate();
  const theme = useTheme();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <EcommerceWelcome
            title={`${t('congrats')} \n ${user?.displayName}`}
            description={t('slug', { sales_count: 20, sales_precentage: 80 })}
            img={<MotivationIllustration />}
            action={
              <Link href={paths.dashboard.products.new}>
                <Button variant="contained" color="primary">
                  {t('new')}
                </Button>
              </Link>
            }
          />
        </Grid>

        {/* <Grid xs={12} md={4}>
          <EcommerceNewProducts list={_ecommerceNewProducts} />
        </Grid> */}

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title={t('solid')}
            subtitle={t('than-last-week')}
            percent={2.6}
            total={765}
            chart={{
              series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title={t('balance')}
            subtitle={t('than-last-week')}
            percent={-0.1}
            total={18765}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title={t('income')}
            subtitle={t('than-last-week')}
            percent={0.6}
            total={4876}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceSaleByGender
            title={t('sales-by-gender')}
            total={2324}
            chart={{
              series: [
                { label: t('mens'), value: 44 },
                { label: t('womens'), value: 75 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <EcommerceYearlySales
            title={t('yearly-sales')}
            subheader={`"(+43%) ${t('than-last-week')}`}
            chart={{
              categories: getMonths(currentLang.value as Locale),
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: t('income'),
                      data: [10.3, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: t('orders'),
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: t('income'),
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: t('orders'),
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
        {/* 
        <Grid xs={12} md={6} lg={8}>
          <EcommerceSalesOverview title="Sales Overview" data={_ecommerceSalesOverview} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceCurrentBalance
            title="Current Balance"
            currentBalance={187650}
            sentAmount={25500}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={8}>
          <EcommerceBestSaleItem
            title={t('best-saleing-item')}
            tableData={_ecommerceBestSaleItems}
            tableLabels={[
              { id: 'name', label: currentLang.value == 'en' ? 'Item' : 'العنصر' },
              { id: 'category', label: currentLang.value == 'en' ? 'Category' : 'الفئة' },
              {
                id: 'totalAmount',
                label: currentLang.value == 'en' ? 'Total Sales' : 'السعر',
                align: 'right',
              },
              { id: 'rank', label: currentLang.value == 'en' ? 'Rank' : 'الترتيب', align: 'right' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceLatestProducts title={t('latest-products')} list={_ecommerceLatestProducts} />
        </Grid>
      </Grid>
    </Container>
  );
}
