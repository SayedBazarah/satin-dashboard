'use client';

import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const res = await axios.get(endpoints.auth.me);

        const { user } = res.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const data = {
      email,
      password,
    };
    const res = await axios.post(endpoints.auth.login, data);

    const { accessToken, user } = res.data;

    setSession(accessToken);
    localStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: Types.LOGIN,
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const data = {
        email,
        password,
        firstName,
        lastName,
      };

      const res = await axios.post(endpoints.auth.register, data);

      const { accessToken, user } = res.data;

      localStorage.setItem(STORAGE_KEY, accessToken);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
    },
    []
  );

  // REGISTER
  const changePassword = useCallback(
    async (data: { password: string; newPassword: string; confirm: string }) => {
      await axios.patch(endpoints.auth.changePassword, data);

      localStorage.setItem(STORAGE_KEY, '');
      setSession(null);
      dispatch({
        type: Types.LOGOUT,
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email: string) => {
    await axios.post(endpoints.auth.forgot, { email });
  }, []);

  //
  useEffect(() => {
    initialize();
  }, [initialize, login]);

  // NEW PASSWORD
  const newPassword = useCallback(async (token: string, confirm: string, password: string) => {
    await axios.post(
      endpoints.auth.update,
      {
        password,
        confirm,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
      forgotPassword,
      newPassword,
      changePassword,
    }),
    [login, logout, register, forgotPassword, newPassword, changePassword, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
