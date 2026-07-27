import { giftsRepository } from './gifts.repository.js'
import { groupsRepository } from '../groups/groups.repository.js'
import { NotFoundError, ForbiddenError } from '@/shared/errors/app.errors.js'

async function assertOwnership(giftId: string, userId: string) {
  const gift = await giftsRepository.findOwnerId(giftId)
  if (!gift) throw new NotFoundError('Presente')
  if (gift.ownerId !== userId) throw new ForbiddenError('Você não é dono desse presente')
}

// Garante que o usuário só marque visibilidade em grupos onde ele É membro —
// sem isso, alguém poderia "vazar" um presente pra um grupo que nem faz parte.
async function assertMemberOfAllGroups(userId: string, groupIds: string[]) {
  if (groupIds.length === 0) return
  const checks = await Promise.all(
    groupIds.map((groupId) => groupsRepository.findMembership(groupId, userId))
  )
  const invalidIndex = checks.findIndex((membership) => !membership)
  if (invalidIndex !== -1) {
    throw new ForbiddenError(`Você não é membro do grupo ${groupIds[invalidIndex]}`)
  }
}

export const giftsService = {
  async createGift(userId: string, data: {
    title: string; description?: string; url?: string; imageUrl?: string
    price?: number; priority: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'; groupIds: string[]
  }) {
    await assertMemberOfAllGroups(userId, data.groupIds)
    return giftsRepository.create({ ...data, ownerId: userId })
  },

  async getMyGifts(userId: string, limit: number, cursor?: string) {
    return giftsRepository.listByOwner(userId, limit, cursor)
  },

  async getGroupGifts(groupId: string, userId: string, limit: number, cursor?: string) {
    const membership = await groupsRepository.findMembership(groupId, userId)
    if (!membership) throw new ForbiddenError('Você não é membro desse grupo')
    return giftsRepository.listVisibleInGroup(groupId, limit, cursor)
  },

  async updateGift(giftId: string, userId: string, data: Record<string, unknown>) {
    await assertOwnership(giftId, userId)
    return giftsRepository.update(giftId, data)
  },

  async deleteGift(giftId: string, userId: string) {
    await assertOwnership(giftId, userId)
    await giftsRepository.delete(giftId)
  },

  async setVisibility(giftId: string, userId: string, groupIds: string[]) {
    await assertOwnership(giftId, userId)
    await assertMemberOfAllGroups(userId, groupIds)
    await giftsRepository.setVisibility(giftId, groupIds)
    return giftsRepository.findById(giftId)
  },
}