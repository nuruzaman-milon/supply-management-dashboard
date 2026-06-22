// hooks/use-current-user.ts
import { useEffect, useState } from "react";

export function useCurrentUser() {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  return { user, isLoading };
}
