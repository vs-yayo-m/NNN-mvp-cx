// src/lib/notificationStore.ts
"use client";

// ============================================================================
// notificationStore — minimal placeholder store for header's Bell icon
// badge, mirroring the shape of cartStore/authStore. Swap the internals
// for a real fetch/subscription (e.g. polling an /api/notifications route
// or a websocket) once the backend endpoint exists.
// ============================================================================

import { useEffect, useState } from "react";

export interface Notification {
  id: string;
  title: string;
  read: boolean;
  createdAt: string;
}

// Replace with real fetching (SWR/React Query, websocket, etc.)
function getInitialNotifications(): Notification[] {
  return [];
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(
    getInitialNotifications()
  );

  useEffect(() => {
    // TODO: subscribe to real notification source here.
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return { notifications, unreadCount, markAllRead };
}
