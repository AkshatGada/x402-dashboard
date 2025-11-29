const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
	data?: any;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
	const { data, ...init } = options;
	
	const config: RequestInit = {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...init.headers,
		},
	};
	
	if (data) {
		config.body = JSON.stringify(data);
	}
	
	const response = await fetch(`${API_BASE}${endpoint}`, config);
	
	if (!response.ok) {
		const error = await response.json().catch(() => ({ message: response.statusText }));
		throw new Error(error.message || 'Request failed');
	}
	
	return response.json();
}

export const api = {
	get: <T>(endpoint: string) => request<T>(endpoint),
	post: <T>(endpoint: string, data: any) => request<T>(endpoint, { method: 'POST', data }),
	patch: <T>(endpoint: string, data: any) => request<T>(endpoint, { method: 'PATCH', data }),
	delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

