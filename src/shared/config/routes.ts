// Route constants - FSD v2.1 allows application-aware configs in Shared
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
