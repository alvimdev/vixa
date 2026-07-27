import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ForbiddenError, NotFoundError } from '@/shared/errors/app.errors.js'

const mocks = vi.hoisted(() => ({
  giftsRepository: { findOwnerId: vi.fn(), update: vi.fn(), create: vi.fn() },
  groupsRepository: { findMembership: vi.fn() },
}))

vi.mock('./gifts.repository.js', () => ({ giftsRepository: mocks.giftsRepository }))
vi.mock('../groups/groups.repository.js', () => ({ groupsRepository: mocks.groupsRepository }))

const { giftsService } = await import('./gifts.service.js')

describe('giftsService authorization', () => {
  beforeEach(() => vi.resetAllMocks())

  it('returns 404 when trying to update a missing gift', async () => {
    mocks.giftsRepository.findOwnerId.mockResolvedValue(null)
    await expect(giftsService.updateGift('missing', 'user-1', { title: 'Novo' })).rejects.toBeInstanceOf(NotFoundError)
    expect(mocks.giftsRepository.update).not.toHaveBeenCalled()
  })

  it('blocks updates by someone other than the owner', async () => {
    mocks.giftsRepository.findOwnerId.mockResolvedValue({ ownerId: 'owner-1' })
    await expect(giftsService.updateGift('gift-1', 'user-1', { title: 'Novo' })).rejects.toBeInstanceOf(ForbiddenError)
    expect(mocks.giftsRepository.update).not.toHaveBeenCalled()
  })

  it('allows an owner to update their gift', async () => {
    mocks.giftsRepository.findOwnerId.mockResolvedValue({ ownerId: 'user-1' })
    mocks.giftsRepository.update.mockResolvedValue({ id: 'gift-1', title: 'Novo' })
    await expect(giftsService.updateGift('gift-1', 'user-1', { title: 'Novo' })).resolves.toEqual({ id: 'gift-1', title: 'Novo' })
    expect(mocks.giftsRepository.update).toHaveBeenCalledWith('gift-1', { title: 'Novo' })
  })

  it('blocks creation when the user is missing any selected group', async () => {
    mocks.groupsRepository.findMembership.mockResolvedValueOnce({ groupId: 'group-1', userId: 'user-1' }).mockResolvedValueOnce(null)
    await expect(giftsService.createGift('user-1', { title: 'Presente', priority: 'NONE', groupIds: ['group-1', 'group-2'] })).rejects.toBeInstanceOf(ForbiddenError)
    expect(mocks.giftsRepository.create).not.toHaveBeenCalled()
  })

  it('does not query memberships when a gift has no group visibility', async () => {
    mocks.giftsRepository.create.mockResolvedValue({ id: 'gift-1' })
    await giftsService.createGift('user-1', { title: 'Presente', priority: 'NONE', groupIds: [] })
    expect(mocks.groupsRepository.findMembership).not.toHaveBeenCalled()
    expect(mocks.giftsRepository.create).toHaveBeenCalled()
  })
})
