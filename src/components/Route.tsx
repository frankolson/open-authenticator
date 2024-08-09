import React from 'react';
import { useLocation } from 'src/hooks/useLocation';
import NotFound from 'src/views/NotFound';

export default function Route() {
  const { route } = useLocation();

  return route
    ? route.element
    : <NotFound />;
}