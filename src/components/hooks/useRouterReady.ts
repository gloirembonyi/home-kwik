// hooks/useRouterReady.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export function useRouterReady() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.isReady]);

  return {
    router,
    isReady,
    pathname: isReady ? router.pathname : null
  };
}