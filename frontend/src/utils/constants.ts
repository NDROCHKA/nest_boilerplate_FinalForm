const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  return '/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

export const STORAGE_KEYS = {
  TOKEN: 'crusaders_token',
  REFRESH_TOKEN: 'crusaders_refresh_token',
  TOKEN_EXPIRES: 'crusaders_token_expires',
  CART: 'crusaders_cart',
};

export const DEFAULT_PAGE_LIMIT = 10;
export const ORDER_SHIPPING_FEE = 4;
