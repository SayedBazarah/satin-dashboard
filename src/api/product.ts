import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { ICategory, IProductItem } from 'src/types/product';

// ----------------------------------------------------------------------

export function useGetProducts() {
  const URL = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: (data?.products as IProductItem[]) || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.products, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(slug: string) {
  const URL = endpoints.product.details(slug);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product as IProductItem,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query: string) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IProductItem[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCategoriesTags() {
  const { data, isLoading, error, isValidating } = useSWR(
    endpoints.product.categories_tags,
    fetcher
  );
  // محروس عويس
  // امال
  const memoizedValue = useMemo(
    () => ({
      productsTags: data?.tags as string[],
      categories: data?.categories as ICategory[],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
    }),
    [data?.tags, data?.categories, error, isLoading, isValidating]
  );

  return memoizedValue;
}
