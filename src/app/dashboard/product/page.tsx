// ----------------------------------------------------------------------

import { ProductListView } from 'src/sections/product/view';

export const metadata = {
  title: 'Dashboard: Products',
};

export default async function Page() {
  return <ProductListView />;
}
