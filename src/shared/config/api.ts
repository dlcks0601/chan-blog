// API configuration - FSD v2.1 allows application-aware configs in Shared
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 5000,
  ENDPOINTS: {
    USERS: '/users',
    POSTS: '/posts',
  },
} as const;
