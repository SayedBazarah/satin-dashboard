import { ProductCreateView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Create a new product',
};
export default async function ProductCreatePage() {
  return <ProductCreateView />;
}
