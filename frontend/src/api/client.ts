import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';
import { ApiResponse, ApiError } from '../types/api.types';

// Simple callback registry to trigger logout from AuthContext
type UnauthorizedCallback = () => void;
let unauthorizedHandler: UnauthorizedCallback | null = null;

export const setUnauthorizedHandler = (handler: UnauthorizedCallback) => {
  unauthorizedHandler = handler;
};

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  refreshQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  refreshQueue = [];
};

const normalizeError = async (response: Response): Promise<ApiError> => {
  try {
    const errorData = await response.json();
    return {
      statusCode: errorData.statusCode || response.status,
      errorCode: errorData.errorCode || 'HTTP_ERROR',
      message: errorData.message || response.statusText || 'An unexpected error occurred.',
      details: errorData.details || undefined,
    };
  } catch (e) {
    return {
      statusCode: response.status,
      errorCode: 'HTTP_ERROR',
      message: response.statusText || 'An unexpected network error occurred.',
    };
  }
};

const refreshTokenRequest = async (): Promise<{ token: string; refreshToken: string; tokenExpires: number }> => {
  const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (!storedRefreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: storedRefreshToken }),
  });

  if (!response.ok) {
    throw await normalizeError(response);
  }

  const result: ApiResponse<{ token: string; refreshToken: string; tokenExpires: number }> = await response.json();
  return result.data;
};

export const client = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { params, headers: customHeaders, body, ...restOptions } = options;

  // Build headers
  const headers = new Headers(customHeaders);
  if (body && !(body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject token if exists
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Build URL with query params
  let url = `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;
  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        query.append(key, String(val));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const fetchOptions: RequestInit = {
    ...restOptions,
    headers,
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (response.status === 401 && endpoint !== 'auth/email/login' && endpoint !== 'auth/refresh') {
      // Handle JWT Token Expiration and Auto Refresh
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newTokens = await refreshTokenRequest();
          localStorage.setItem(STORAGE_KEYS.TOKEN, newTokens.token);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newTokens.refreshToken);
          localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES, String(newTokens.tokenExpires));
          
          isRefreshing = false;
          processQueue(null, newTokens.token);
        } catch (refreshErr) {
          isRefreshing = false;
          processQueue(refreshErr, null);
          // Token refresh failed completely - trigger logout
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES);
          if (unauthorizedHandler) {
            unauthorizedHandler();
          }
          throw refreshErr;
        }
      }

      // Queue other requests while token is refreshing
      return new Promise<T>((resolve, reject) => {
        refreshQueue.push({
          resolve: (newToken: string) => {
            headers.set('Authorization', `Bearer ${newToken}`);
            fetch(url, fetchOptions)
              .then((res) => {
                if (!res.ok) {
                  return normalizeError(res).then(reject);
                }
                return res.json().then((body: ApiResponse<T>) => resolve(body.data));
              })
              .catch(reject);
          },
          reject: (err) => {
            reject(err);
          },
        });
      });
    }

    if (!response.ok) {
      throw await normalizeError(response);
    }

    // 204 No Content has no body
    if (response.status === 204) {
      return null as unknown as T;
    }

    const bodyJson = await response.json();
    
    // Support NestJS relational/paginated envelopes containing status success
    if (bodyJson && typeof bodyJson === 'object' && 'data' in bodyJson && 'totalCount' in bodyJson) {
      return {
        data: bodyJson.data,
        totalCount: bodyJson.totalCount,
        hasNextPage: bodyJson.hasNextPage,
      } as unknown as T;
    }

    if (bodyJson && typeof bodyJson === 'object' && 'data' in bodyJson) {
      return bodyJson.data;
    }

    return bodyJson;
  } catch (error: any) {
    if (error.statusCode) {
      // Already normalized custom api error
      throw error;
    }
    // Convert native fetch errors (like Connection Refused) to normalized ApiError format
    throw {
      statusCode: 500,
      errorCode: 'NETWORK_ERROR',
      message: error.message || 'Unable to connect to the backend server.',
    } as ApiError;
  }
};

// Convenience methods
client.get = <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>, options?: RequestOptions) => 
  client<T>(endpoint, { method: 'GET', params, ...options });

client.post = <T>(endpoint: string, body?: any, options?: RequestOptions) => 
  client<T>(endpoint, { method: 'POST', body, ...options });

client.patch = <T>(endpoint: string, body?: any, options?: RequestOptions) => 
  client<T>(endpoint, { method: 'PATCH', body, ...options });

client.delete = <T>(endpoint: string, options?: RequestOptions) => 
  client<T>(endpoint, { method: 'DELETE', ...options });
