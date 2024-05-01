import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { ICategory, IProductItem } from 'src/types/product';
import { IOrderItem } from 'src/types/order';

// ----------------------------------------------------------------------

export function useGetOrders() {
  const URL = endpoints.orders.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      orders: (data?.orders as IOrderItem[]) || [],
      ordersLoading: isLoading,
      ordersError: error,
      ordersValidating: isValidating,
      ordersEmpty: !isLoading && !data?.orders.length,
    }),
    [data?.orders, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetOrder(slug: string) {
  const URL = endpoints.orders.details(slug);

  const { data, isLoading, mutate, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      order: data?.order as IOrderItem,
      mutate,
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
    }),
    [data?.order, mutate, error, isLoading, isValidating]
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
