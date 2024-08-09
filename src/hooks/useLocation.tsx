import React, { createContext, useContext } from "react";
import { RouteObject, useRouter } from "./useRouter";
import { matchPath } from "src/lib/navigation";

export type Params = { [key: string]: string };

interface LocationState {
  currentPath: string;
  route: RouteObject | null;
  params: Params;
}

interface LocationProviderProps {
  children: React.ReactNode;
}

export const LocationContext = createContext<LocationState | undefined>(undefined);

export function LocationProvider({ children }: LocationProviderProps) {
  const { currentPath, routes } = useRouter();
  
  const route = findRoute(currentPath, routes);
  
  function findRoute(path: string, routes: RouteObject[]): { route: RouteObject, params: Params } | null {
    for (const route of routes) {
      const params = matchPath(route.path, path);
      if (params) {
        console.log('Found route:', route.path, 'with params:', params);
        return { route, params };
      }
    }

    return null;
  }

  return (
    <LocationContext.Provider
      value={{
        currentPath,
        params: route ? route.params : {},
        route: route ? route.route : null
      }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }

  return context;
}