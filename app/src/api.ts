// API proxy helper for forwarding requests to cub.rip/api/
export interface ApiRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

export interface ApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  status?: number;
}

export async function callCubApi(request: ApiRequest): Promise<ApiResponse> {
  try {
    const headers: Record<string, string> = {
      ...request.headers,
    };

    if (request.body && (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE')) {
      headers['Content-Type'] = 'application/json';
    }

    const resp = await fetch(`http://localhost:3000/api${request.endpoint}`, {
      method: request.method,
      headers: headers,
      body: request.body ? JSON.stringify(request.body) : undefined,
      credentials: 'include',
    });

    const result = await resp.json();
    return {
      success: resp.ok && String(resp.status).startsWith("2"),
      data: result.data || result, // Backend responses might have a 'data' field or be the data directly
      status: resp.status,
      error: !resp.ok ? result.error || result.message : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Predefined API calls matching the Postman collection
export const predefinedCalls = {
  'notifications-status': {
    endpoint: '/notifications/status',
    method: 'POST' as const,
  },
  'profiles-all': {
    endpoint: '/profiles/all',
    method: 'GET' as const,
  },
  'reactions-add': {
    endpoint: '/reactions/add/tv_125988/fire',
    method: 'GET' as const,
  },
  'reactions-get': {
    endpoint: '/reactions/get/tv_125988',
    method: 'GET' as const,
  },
  'users-find': {
    endpoint: '/users/find?email=example@email.com',
    method: 'GET' as const,
  },
  'users-get': {
    endpoint: '/users/get',
    method: 'GET' as const,
  },
  'users-give': {
    endpoint: '/users/give',
    method: 'POST' as const,
  },
  'bookmarks-all': {
    endpoint: '/bookmarks/all',
    method: 'GET' as const,
  },
  'bookmarks-add': {
    endpoint: '/bookmarks/add',
    method: 'POST' as const,
  },
  'bookmarks-remove': {
    endpoint: '/bookmarks/remove',
    method: 'DELETE' as const,
  },
  'notice-all': {
    endpoint: '/notice/all',
    method: 'GET' as const,
  },
  'notice-clear': {
    endpoint: '/notice/clear',
    method: 'POST' as const,
  },
  'profiles-change': {
    endpoint: '/profiles/change',
    method: 'POST' as const,
  },
  'profiles-create': {
    endpoint: '/profiles/create',
    method: 'POST' as const,
  },
  'profiles-remove': {
    endpoint: '/profiles/remove',
    method: 'POST' as const,
  },
  'notifications-all': {
    endpoint: '/notifications/all',
    method: 'GET' as const,
  },
  'notifications-add': {
    endpoint: '/notifications/add',
    method: 'POST' as const,
  },
  'device-add': {
    endpoint: '/device/add',
    method: 'POST' as const,
  },
  'card-subscribed': {
    endpoint: '/card/subscribed',
    method: 'POST' as const,
  },
  'notifications-remove': {
    endpoint: '/notifications/remove',
    method: 'POST' as const,
  },
  'card-season': {
    endpoint: '/card/season',
    method: 'POST' as const,
  },
  'card-translations': {
    endpoint: '/card/translations',
    method: 'POST' as const,
  },
  'card-unsubscribe': {
    endpoint: '/card/unsubscribe',
    method: 'POST' as const,
  },
};

