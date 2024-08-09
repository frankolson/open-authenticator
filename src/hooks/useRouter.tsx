import React, { useState, useContext, createContext, useMemo, useEffect } from 'react';
import Route from 'src/components/Route';
import { LocationProvider } from './useLocation';

export type RouteObject = {
  path: string;
  element: React.ReactNode;
}

interface RouterState {
  currentPath: string;
  routes: RouteObject[];
  navigate: (path: string) => void;
  goBack: () => void;
}

interface RouterProviderProps {
  routes: RouteObject[];
}

export const NavigationContext = createContext<RouterState | undefined>(undefined);

export function RouterProvider({ routes }: RouterProviderProps) {
  const [history, setHistory] = useState<string[]>(['/']);

  useEffect(() => {
    console.log('History:', history);
  }, [history]);

  const currentPath = history[history.length - 1];

  function navigate(path: string) {
    setHistory([...history, path]);
  }

  // TODO: Kind of slow?
  function goBack() {
    setHistory(history.slice(0, -1));
  }

  return (
    <NavigationContext.Provider
      value={{
        currentPath,
        routes,
        navigate,
        goBack
      }}>
      <LocationProvider>
        <Route />
      </LocationProvider>
    </NavigationContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }

  return context;
}
