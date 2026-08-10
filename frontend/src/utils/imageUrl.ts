import { API_BASE_URL } from './constants';

const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/v\d+\/?$/, '');

/**
 * Safely resolves an image URL for display.
 * Transforms relative `/uploads/photo.jpg` paths into fully accessible backend URLs.
 */
export const resolveImageUrl = (url?: string | null): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }

  // Already absolute or data URL
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Relative upload path
  if (trimmed.startsWith('/uploads/')) {
    return `${BACKEND_ORIGIN}${trimmed}`;
  }

  if (trimmed.startsWith('uploads/')) {
    return `${BACKEND_ORIGIN}/${trimmed}`;
  }

  return trimmed;
};
