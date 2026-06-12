import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addNotification, fetchUnreadCount } from '@/store/slices/notificationSlice';
import type { Notification } from '@/types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001/';

let socket: Socket | null = null;

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!user) return;

    socket = io(SOCKET_URL, {
      withCredentials: true,
      query: { societyId: typeof user.society === 'string' ? user.society : user.society?._id },
    });

    socket.on('notification', (payload: Notification) => {
      dispatch(addNotification({ ...payload, isRead: false }));
    });

    dispatch(fetchUnreadCount());

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [user, dispatch]);
};

export const getSocket = () => socket;
