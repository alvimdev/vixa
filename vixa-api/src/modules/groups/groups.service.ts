import { groupsRepository } from './groups.repository.js'
import { generateInviteCode } from '@/shared/utils/invite.utils.js'
import { NotFoundError, ForbiddenError, ConflictError } from '@/shared/errors/app.errors.js'

async function generateUniqueInviteCode(): Promise<string> {
  // Colisão é extremamente improvável (32^7 combinações), mas protegemos mesmo assim
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateInviteCode()
    const exists = await groupsRepository.inviteCodeExists(code)
    if (!exists) return code
  }
  throw new Error('Não foi possível gerar um código de convite único')
}

async function assertMember(groupId: string, userId: string) {
  const membership = await groupsRepository.findMembership(groupId, userId)
  if (!membership) throw new ForbiddenError('Você não é membro desse grupo')
  return membership
}

async function assertAdmin(groupId: string, userId: string) {
  const membership = await assertMember(groupId, userId)
  if (membership.role !== 'ADMIN') throw new ForbiddenError('Apenas o admin do grupo pode fazer isso')
  return membership
}

export const groupsService = {
  async createGroup(userId: string, data: { name: string; description?: string }) {
    const inviteCode = await generateUniqueInviteCode()
    return groupsRepository.create({ ...data, createdById: userId, inviteCode })
  },

  async joinGroup(userId: string, inviteCode: string) {
    const group = await groupsRepository.findByInviteCode(inviteCode.toUpperCase())
    if (!group) throw new NotFoundError('Grupo')

    const existing = await groupsRepository.findMembership(group.id, userId)
    if (existing) throw new ConflictError('Você já é membro desse grupo')

    await groupsRepository.addMember(group.id, userId)
    return group
  },

  async getGroup(groupId: string, userId: string) {
    await assertMember(groupId, userId) // só membro vê detalhes do grupo
    const group = await groupsRepository.findById(groupId)
    if (!group) throw new NotFoundError('Grupo')
    return group
  },

  async listMyGroups(userId: string, limit: number, cursor?: string) {
    return groupsRepository.listUserGroups(userId, limit, cursor)
  },

  async listMembers(groupId: string, userId: string, limit: number, cursor?: string) {
    await assertMember(groupId, userId)
    return groupsRepository.listMembers(groupId, limit, cursor)
  },

  async updateGroup(
    groupId: string,
    userId: string,
    data: { name?: string; description?: string; photoUrl?: string }
  ) {
    await assertAdmin(groupId, userId)
    return groupsRepository.update(groupId, data)
  },

  async kickMember(groupId: string, adminUserId: string, targetUserId: string) {
    await assertAdmin(groupId, adminUserId)
    if (adminUserId === targetUserId) {
      throw new ConflictError('Use a rota de "sair do grupo" para se remover')
    }
    await groupsRepository.removeMember(groupId, targetUserId)
  },

  async leaveGroup(groupId: string, userId: string) {
    await assertMember(groupId, userId)
    await groupsRepository.removeMember(groupId, userId)
  },

  async regenerateInviteCode(groupId: string, userId: string) {
    await assertAdmin(groupId, userId)
    const newCode = await generateUniqueInviteCode()
    return groupsRepository.updateInviteCode(groupId, newCode)
  },
}