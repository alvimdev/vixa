import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ForbiddenError } from '@/shared/errors/app.errors.js'

const mocks = vi.hoisted(() => ({ groupsRepository: { findMembership: vi.fn(), listMembers: vi.fn() } }))
vi.mock('./groups.repository.js', () => ({ groupsRepository: mocks.groupsRepository }))
const { groupsService } = await import('./groups.service.js')

describe('groupsService authorization', () => {
  beforeEach(() => vi.resetAllMocks())

  it('blocks a non-member from listing group members', async () => {
    mocks.groupsRepository.findMembership.mockResolvedValue(null)
    await expect(groupsService.listMembers('group-1', 'user-1', 20)).rejects.toBeInstanceOf(ForbiddenError)
    expect(mocks.groupsRepository.listMembers).not.toHaveBeenCalled()
  })

  it('allows a member to list members', async () => {
    mocks.groupsRepository.findMembership.mockResolvedValue({ role: 'MEMBER' })
    mocks.groupsRepository.listMembers.mockResolvedValue([{ id: 'membership-1' }])
    await expect(groupsService.listMembers('group-1', 'user-1', 20)).resolves.toEqual([{ id: 'membership-1' }])
  })
})
