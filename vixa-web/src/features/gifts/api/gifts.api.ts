import { httpClient } from '@/shared/api/httpClient'
import type {
  CreateGiftInput,
  UpdateGiftInput,
  SetVisibilityInput,
  Gift,
  GiftWithOwner,
  GiftMine,
} from '../schemas/gifts.schema'

export const giftsApi = {
  create: (data: CreateGiftInput) => httpClient.post<Gift>('/gifts', data),

  listMine: (params: { limit: number; cursor?: string }) =>
    httpClient.get<GiftMine[]>('/gifts', {
      limit: String(params.limit),
      ...(params.cursor ? { cursor: params.cursor } : {}),
    }),

  listByGroup: (groupId: string, params: { limit: number; cursor?: string }) =>
    httpClient.get<GiftWithOwner[]>(`/groups/${groupId}/gifts`, {
      limit: String(params.limit),
      ...(params.cursor ? { cursor: params.cursor } : {}),
    }),

  update: (id: string, data: UpdateGiftInput) => httpClient.patch<Gift>(`/gifts/${id}`, data),

  delete: (id: string) => httpClient.delete<void>(`/gifts/${id}`),

  setVisibility: (id: string, data: SetVisibilityInput) =>
    httpClient.put<Gift>(`/gifts/${id}/visibility`, data),
}