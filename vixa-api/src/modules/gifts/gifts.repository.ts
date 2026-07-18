import { prisma } from '@/shared/db/prisma.js'
import type { GiftPriority } from '@generated/prisma/client.js'

const giftSelect = {
  id: true,
  title: true,
  description: true,
  url: true,
  imageUrl: true,
  price: true,
  priority: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
}

export const giftsRepository = {
  create(data: {
    ownerId: string
    title: string
    description?: string
    url?: string
    imageUrl?: string
    price?: number
    priority: GiftPriority
    groupIds: string[]
  }) {
    return prisma.gift.create({
      data: {
        ownerId: data.ownerId,
        title: data.title,
        description: data.description,
        url: data.url,
        imageUrl: data.imageUrl,
        price: data.price,
        priority: data.priority,
        visibleIn: {
          create: data.groupIds.map((groupId) => ({ groupId })),
        },
      },
      select: giftSelect,
    })
  },

  findById(id: string) {
    return prisma.gift.findUnique({ where: { id }, select: giftSelect })
  },

  findOwnerId(id: string) {
    return prisma.gift.findUnique({ where: { id }, select: { ownerId: true } })
  },

  update(id: string, data: Partial<{
    title: string; description: string; url: string; imageUrl: string
    price: number; priority: GiftPriority
  }>) {
    return prisma.gift.update({ where: { id }, data, select: giftSelect })
  },

  delete(id: string) {
    return prisma.gift.delete({ where: { id } })
  },

  // substitui a visibilidade inteira de forma atômica
  setVisibility(giftId: string, groupIds: string[]) {
    return prisma.$transaction([
      prisma.giftVisibility.deleteMany({ where: { giftId } }),
      prisma.giftVisibility.createMany({
        data: groupIds.map((groupId) => ({ giftId, groupId })),
        skipDuplicates: true,
      }),
    ])
  },

  listByOwner(ownerId: string, limit: number, cursor?: string) {
    return prisma.gift.findMany({
      where: { ownerId },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: 'desc' },
      select: giftSelect,
    })
  },

  // presentes visíveis dentro de um grupo específico, com dono incluso
  listVisibleInGroup(groupId: string, limit: number, cursor?: string) {
    return prisma.gift.findMany({
      where: { visibleIn: { some: { groupId } } },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: 'desc' },
      select: {
        ...giftSelect,
        owner: { select: { id: true, name: true, avatarUrl: true } },
      },
    })
  },
}