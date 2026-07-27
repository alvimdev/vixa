import { usersRepository } from './users.repository.js'
import { groupsRepository } from '@/modules/groups/groups.repository.js'
import { NotFoundError, ForbiddenError } from '@/shared/errors/app.errors.js'
import { imageUploadService } from '@/shared/uploads/imageUpload.service.js'

export const usersService = {
  async getMyProfile(userId: string) {
    const user = await usersRepository.findPrivateProfile(userId)
    if (!user) throw new NotFoundError('Usuário')
    return user
  },

  async getPublicProfile(targetUserId: string, requesterId: string) {
    if (targetUserId !== requesterId) {
      const shareGroup = await groupsRepository.usersShareGroup(requesterId, targetUserId)
      if (!shareGroup) throw new ForbiddenError('Você não compartilha nenhum grupo com esse usuário')
    }

    const user = await usersRepository.findPublicProfile(targetUserId)
    if (!user) throw new NotFoundError('Usuário')
    return user
  },

  updateName(userId: string, name: string) {
    return usersRepository.updateName(userId, name)
  },

  updateAvatar(userId: string, avatarUrl: string) {
    return usersRepository.updateAvatar(userId, avatarUrl)
  },

  updateBirthdate(userId: string, birthdate: Date) {
    return usersRepository.updateBirthdate(userId, birthdate)
  },

  async uploadAvatar(userId: string, file: File) {
    const avatarUrl = await imageUploadService.uploadAvatar(userId, file)
    return usersRepository.updateAvatar(userId, avatarUrl)
  },
}