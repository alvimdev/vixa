import { prisma } from '@/shared/db/prisma.js'

const publicUserSelect = {
  id: true,
  name: true,
  avatarUrl: true,
  birthdate: true,
}

const privateUserSelect = {
  ...publicUserSelect,
  email: true,
  createdAt: true,
}

export const usersRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },

  findPrivateProfile(id: string) {
    return prisma.user.findUnique({ where: { id }, select: privateUserSelect })
  },

  findPublicProfile(id: string) {
    return prisma.user.findUnique({ where: { id }, select: publicUserSelect })
  },

  create(data: { name: string; email: string; avatarUrl?: string | null }) {
    return prisma.user.create({ data })
  },

  updateName(id: string, name: string) {
    return prisma.user.update({ where: { id }, data: { name }, select: privateUserSelect })
  },

  updateAvatar(id: string, avatarUrl: string) {
    return prisma.user.update({ where: { id }, data: { avatarUrl }, select: privateUserSelect })
  },

  updateBirthdate(id: string, birthdate: Date) {
    return prisma.user.update({ where: { id }, data: { birthdate }, select: privateUserSelect })
  },
}