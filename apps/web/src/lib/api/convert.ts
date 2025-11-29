import { api } from './client';
import type { ConvertAPIRequest, ConvertAPIResponse } from '@x402-dashboard/shared';

export async function convertAPI(data: ConvertAPIRequest): Promise<ConvertAPIResponse> {
	return api.post<ConvertAPIResponse>('/api/convert', data);
}

