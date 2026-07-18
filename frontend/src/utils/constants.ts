export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const STORAGE_KEYS = {
  TOKEN: 'crusaders_token',
  REFRESH_TOKEN: 'crusaders_refresh_token',
  TOKEN_EXPIRES: 'crusaders_token_expires',
  CART: 'crusaders_cart',
};

export const DEFAULT_PAGE_LIMIT = 10;
