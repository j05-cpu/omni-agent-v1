'use client';

import { Toaster as SonnerToaster, toast as SonnerToast } from 'sonner';

/**
 * Digital Godfather - Toast Notifications
 * 
 * Professional notification system using sonner.
 * Customized with Emerald & Obsidian theme.
 */

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  description?: string;
  duration?: number;
}

const toastThemes: Record<ToastType, { richColors: boolean }> = {
  success: { richColors: true },
  error: { richColors: true },
  info: { richColors: false },
  warning: { richColors: false },
};

// Custom toast functions with Digital Godfather branding
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    SonnerToast.success(message, {
      ...options,
      style: {
        background: '#032d1a',
        border: '1px solid #10b981',
        color: '#6ee7b7',
      },
      icon: '✓',
    });
  },
  
  error: (message: string, options?: ToastOptions) => {
    SonnerToast.error(message, {
      ...options,
      style: {
        background: '#1a0a0a',
        border: '1px solid #dc2626',
        color: '#fca5a5',
      },
      icon: '✗',
    });
  },
  
  info: (message: string, options?: ToastOptions) => {
    SonnerToast(message, {
      ...options,
      style: {
        background: '#12121a',
        border: '1px solid #333340',
        color: '#e2e8f0',
      },
    });
  },
  
  warning: (message: string, options?: ToastOptions) => {
    SonnerToast.warning(message, {
      ...options,
      style: {
        background: '#1a1400',
        border: '1px solid #fbbf24',
        color: '#fde047',
      },
    });
  },
  
  // Agent-specific toasts
  agentStarted: (agentName: string) => {
    SonnerToast.success(`${agentName} started`, {
      style: {
        background: '#032d1a',
        border: '1px solid #10b981',
        color: '#6ee7b7',
      },
    });
  },
  
  agentStopped: (agentName: string) => {
    toast.info(`${agentName} stopped`);
  },
  
  agentError: (agentName: string, error: string) => {
    toast.error(`${agentName}: ${error}`);
  },
};

// Toast provider component for the layout
export function ToastProvider() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      richColors
      style={{
        background: '#12121a',
        border: '1px solid #333340',
      }}
    />
  );
}

// Promise-based toast for async operations
export function toastPromise(
  promise: Promise<unknown>,
  loading: string,
  success: string,
  error: string
) {
  return SonnerToast.promise(promise, {
    loading,
    success,
    error,
  });
}

export default toast;