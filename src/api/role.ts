import useSWR from 'swr';
import { useEffect, useMemo, useState } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { IEmployeeItem, IRole } from 'src/types/employee';

// ----------------------------------------------------------------------

export function useGetRoles() {
  const [roles, setRoles] = useState<IRole[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        axios.get(URL).then((res) => {
          console.log('res');
          console.log(res.data);
          setRoles(res.data.roles);
        });
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const URL = endpoints.roles.all;

  const memoizedValue = useMemo(
    () => ({
      roles: roles || [],
      isLoading: isLoading,
    }),
    [roles, isLoading]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
