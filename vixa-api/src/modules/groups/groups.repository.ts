import { prisma } from '@/shared/db/prisma.js'
import type { GroupRole } from '@generated/prisma/client.js'

export const groupsRepository = {
  create(data: { name: string; description?: string; createdById: string; inviteCode: string }) {
    return prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        createdById: data.createdById,
        inviteCode: data.inviteCode,
        members: {
          create: {
            userId: data.createdById,
            role: 'ADMIN',
          },
        },
      },
    })
  },

  findById(id: string) {
    return prisma.group.findUnique({ where: { id } })
  },

  findByInviteCode(inviteCode: string) {
    return prisma.group.findUnique({ where: { inviteCode } })
  },

  async inviteCodeExists(inviteCode: string) {
    const count = await prisma.group.count({ where: { inviteCode } })
    return count > 0
  },

  updateInviteCode(groupId: string, inviteCode: string) {
    return prisma.group.update({ where: { id: groupId }, data: { inviteCode } })
  },

  update(id: string, data: { name?: string; description?: string; photoUrl?: string }) {
    return prisma.group.update({ where: { id }, data })
  },

  findMembership(groupId: string, userId: string) {
    return prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    })
  },

  addMember(groupId: string, userId: string, role: GroupRole = 'MEMBER') {
    return prisma.groupMember.create({ data: { groupId, userId, role } })
  },

  removeMember(groupId: string, userId: string) {
    return prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId } },
    })
  },

  // paginação por cursor: mais estável que offset em listas que crescem
  listMembers(groupId: string, limit: number, cursor?: string) {
    return prisma.groupMember.findMany({
      where: { groupId },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { joinedAt: 'asc' },
      select: {
        id: true,
        role: true,
        joinedAt: true,
        user: {
          select: { id: true, name: true, avatarUrl: true, birthdate: true },
        },
      },
    })
  },

  listUserGroups(userId: string, limit: number, cursor?: string) {
    return prisma.groupMember.findMany({
      where: { userId },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { joinedAt: 'desc' },
      select: {
        role: true,
        joinedAt: true,
        group: {
          select: { id: true, name: true, description: true, photoUrl: true, inviteCode: true },
        },
      },
    })
  },

  async usersShareGroup(userIdA: string, userIdB: string) {
    const count = await prisma.groupMember.count({
      where: {
        userId: userIdA,
        group: { members: { some: { userId: userIdB } } },
      },
    })
    return count > 0
  },
}