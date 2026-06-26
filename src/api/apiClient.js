import { BASE_URL, ENDPOINTS } from '../constants/apiUrls';
import { authStorage } from '../utils/authStorage';
import { showLoading, hideLoading } from '../store/loadingSlice';

// Injected after store creation to avoid circular imports — see main.jsx
let _store = null;
export const initApiClient = (store) => { _store = store; };

const dispatch = (action) => { if (_store) _store.dispatch(action); };

let isRefreshing = false;
let pendingRefreshCbs = [];
let isLoggingOut = false;

const flushPending = (newToken) => {
  pendingRefreshCbs.forEach((cb) => cb(newToken));
  pendingRefreshCbs = [];
};

const forceLogout = () => {
  if (isLoggingOut) return;
  isLoggingOut = true;
  authStorage.clearAll();
  // Broadcast event so App.jsx can handle navigation + redux cleanup
  window.dispatchEvent(new CustomEvent('app:session-expired'));
  setTimeout(() => { isLoggingOut = false; }, 300);
};

const doRefreshToken = async () => {
  const accessToken = authStorage.getAccessToken();
  const refreshToken = authStorage.getRefreshToken();
  if (!accessToken || !refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: withUserInfo({ accessToken, refreshToken }),
    });
    if (!res.ok) return null;
    const result = await res.json();
    if (!result?.isSuccess || !result?.data?.token) return null;
    authStorage.saveTokens({
      token: result.data.token,
      refreshToken: result.data.refreshToken,
      usuarioId: result.data.usuarioId,
    });
    // Update persisted user profile with new token data
    const profile = authStorage.getUserProfile();
    if (profile) authStorage.saveUserProfile({ ...profile, token: result.data.token });
    return result.data.token;
  } catch {
    return null;
  }
};

const executeRequest = async (url, options, isRetry = false) => {
  const res = await fetch(url, options);

  if (res.status === 401 && !isRetry) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await doRefreshToken();
      isRefreshing = false;

      if (!newToken) {
        flushPending(null);
        forceLogout();
        throw Object.assign(new Error('Sesión expirada. Por favor inicia sesión nuevamente.'), { status: 401 });
      }
      flushPending(newToken);
    } else {
      // Queue this request until refresh completes
      await new Promise((resolve) => pendingRefreshCbs.push(resolve));
    }

    const retryOptions = {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${authStorage.getAccessToken()}` },
    };
    return executeRequest(url, retryOptions, true);
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  return res.json().catch(() => null);
};

const buildHeaders = () => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${authStorage.getAccessToken()}`,
});

const withUserInfo = (body) => {
  const requestUserInfo = authStorage.getRequestUserInfo();
  return JSON.stringify({ ...(body ?? {}), requestUserInfo });
};

const request = async (method, endpoint, body, addUserInfo) => {
  const url = `${BASE_URL}${endpoint}`;
  const isGet = method === 'GET';

  const options = {
    method,
    headers: buildHeaders(),
    ...(!isGet && { body: addUserInfo ? withUserInfo(body) : JSON.stringify(body ?? {}) }),
  };

  dispatch(showLoading());
  try {
    return await executeRequest(url, options);
  } finally {
    dispatch(hideLoading());
  }
};

// Public endpoints (no auth header, no requestUserInfo)
const postPublic = (endpoint, body) =>
  fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then((r) => r.json().catch(() => null));

export const apiClient = {
  get: (endpoint) => request('GET', endpoint, null, false),
  post: (endpoint, body) => request('POST', endpoint, body ?? {}, true),
  put: (endpoint, body) => request('PUT', endpoint, body ?? {}, true),
  delete: (endpoint, body) => request('DELETE', endpoint, body ?? {}, true),
  postPublic,
};
