"use client";

import { ReactNode, useEffect, useState } from "react";

interface ClientOnlyProvidersProps {
  children: ReactNode;
}

export function ClientOnlyProviders({ children }: ClientOnlyProvidersProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
