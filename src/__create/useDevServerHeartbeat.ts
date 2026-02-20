'use client';

import { useIdleTimer } from 'react-idle-timer';

export function useDevServerHeartbeat() {
  useIdleTimer({
    throttle: 60_000 * 3,
    timeout: 60_000,
    onAction: () => {
      // WORKAROUND: Keep dev server alive during user activity
      // The dev server runs behind a proxy that needs periodic requests
      // to prevent timeout when user has popped out the preview
      fetch('/', {
        method: 'GET',
      }).catch((error) => {
        // Expected: this is a heartbeat request, errors are ignored
      });
    },
  });
}
