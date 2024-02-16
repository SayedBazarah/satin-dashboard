// ----------------------------------------------------------------------

import { ProductListView } from 'src/sections/product/view';

export const metadata = {
  title: 'Products',
};

export default async function Page() {
  return <ProductListView />;
}
