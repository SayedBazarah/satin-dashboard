import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { ICategory } from 'src/types/product';

// ----------------------------------------------------------------------

export function useGetCategories() {
  const URL = endpoints.categories.all;

  const { data, isLoading, mutate, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      mutate,
      categories: (data?.categories as ICategory[]) || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.categories.length,
    }),
    [mutate, data?.categories, error, isLoading, isValidating]
  );

  return memoizedValue;
}
