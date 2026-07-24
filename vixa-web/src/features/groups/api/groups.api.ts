import { httpClient } from '@/shared/api/httpClient'
import type {
  CreateGroupInput,
  JoinGroupInput,
  Group,
  GroupListItem,
  GroupMemberItem,
} from '../schemas/groups.schema'

export const groupsApi = {
  create: (data: CreateGroupInput) => httpClient.post<Group>('/groups', data),

  join: (data: JoinGroupInput) => httpClient.post<Group>('/groups/join', data),

  list: (params: { limit: number; cursor?: string }) =>
    httpClient.get<GroupListItem[]>('/groups', {
      limit: String(params.limit),
      ...(params.cursor ? { cursor: params.cursor } : {}),
    }),

  getById: (id: string) => httpClient.get<Group>(`/groups/${id}`),

  listMembers: (id: string, params: { limit: number; cursor?: string }) =>
    httpClient.get<GroupMemberItem[]>(`/groups/${id}/members`, {
      limit: String(params.limit),
      ...(params.cursor ? { cursor: params.cursor } : {}),
    }),

  update: (id: string, data: { name?: string; description?: string; photoUrl?: string }) =>
    httpClient.patch<Group>(`/groups/${id}`, data),

  kickMember: (groupId: string, userId: string) =>
    httpClient.delete<void>(`/groups/${groupId}/members/${userId}`),

  leave: (id: string) => httpClient.post<void>(`/groups/${id}/leave`),

  regenerateInviteCode: (id: string) =>
    httpClient.post<{ inviteCode: string }>(`/groups/${id}/invite-code`),
}