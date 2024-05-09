'use client';

import { useSnackbar } from 'notistack';
import { useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Container, IconButton, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import axios, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const notificationSubscribe = useBoolean(false);

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  // -------------------------------------------------------------------------

  const subscribe = useCallback(async () => {
    Notification.requestPermission(async (permission) => {
      if (permission === 'granted') {
        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker.register('/notification.js');
          const sw = await navigator.serviceWorker.ready;

          const push = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              'BPu1CvyN57lIgg4TeykNWhxvKiN6uZ6UYi41V3lZFEeY2blzqzciQ6skIcm3AI7rIGkNQzT2AmAyq_jlpRJGF-c',
          });
          if (push)
            await axios
              .patch(endpoints.employee.notification_subscribe(user?._id || ''), {
                subscribe: push,
              })
              .then(() => {
                enqueueSnackbar(t('notification.subscribe-success'), {
                  variant: 'success',
                });
                notificationSubscribe.onFalse();
              });
        }
      } else {
        enqueueSnackbar(t('notification.subscribe-failed'), {
          variant: 'error',
        });
        notificationSubscribe.onTrue();
      }
    });
  }, [t, notificationSubscribe, enqueueSnackbar, user?._id]);

  // -------------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      subscribe();
    })();
  }, [subscribe]);

  // -------------------------------------------------------------------------

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    );
  }

  const renderNotificationSubscribe = (
    <Box
      position="fixed"
      bottom={0}
      right={0}
      left={0}
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
      }}
    >
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box />
        <Typography
          sx={{
            color: 'inherit',
            p: 1,
          }}
        >
          {t('common.notification-subscribe')}
        </Typography>
        <IconButton
          color="inherit"
          sx={{
            my: '8px',
            width: '100px',
            borderRadius: '7px',
            border: 'white 1px solid',
            '&:hover': {
              backgroundColor: 'white',
              color: 'primary.main',
            },
          }}
          onClick={subscribe}
        >
          <Iconify icon="line-md:bell-alert-loop" pb="2px" />

          <Typography px={1}>{t('common.subscribe')}</Typography>
        </IconButton>
      </Container>
    </Box>
  );
  return (
    <>
      <Header onOpenNav={nav.onTrue} />
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {renderNavVertical}

        <Main>
          {children}
          {notificationSubscribe.value && renderNotificationSubscribe}
        </Main>
      </Box>
    </>
  );
}
