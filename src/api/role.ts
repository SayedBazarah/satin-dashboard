import { useMemo, useState, useEffect } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { IRole } from 'src/types/employee';

// ----------------------------------------------------------------------

export function useGetRoles() {
  const [roles, setRoles] = useState<IRole[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        axios.get(endpoints.roles.all).then((res) => {
          setRoles(res.data.roles);
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const memoizedValue = useMemo(
    () => ({
      roles: roles || [],
      isLoading,
    }),
    [roles, isLoading]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
