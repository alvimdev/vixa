import { z } from 'zod'

export const createGroupSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(80),
  description: z.string().trim().max(300).optional(),
})

export const joinGroupSchema = z.object({
  inviteCode: z.string().trim().min(4, 'Código muito curto').max(20),
})

export type CreateGroupInput = z.infer<typeof createGroupSchema>
export type JoinGroupInput = z.infer<typeof joinGroupSchema>

export interface Group {
  id: string
  name: string
  description: string | null
  photoUrl: string | null
  inviteCode: string
}

export interface GroupListItem {
  id: string // id do GroupMember — usado como cursor
  role: 'ADMIN' | 'MEMBER'
  joinedAt: string
  group: Group
}

export interface GroupMemberItem {
  id: string
  role: 'ADMIN' | 'MEMBER'
  joinedAt: string
  user: {
    id: string
    name: string
    avatarUrl: string | null
    birthdate: string | null
  }
}