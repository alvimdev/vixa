import { cloudinary } from './cloudinary.js'
import { AppError } from '../errors/app.errors.js'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const imageUploadService = {
  async uploadAvatar(userId: string, file: File): Promise<string> {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new AppError(400, 'Formato de imagem não suportado (use JPEG, PNG ou WEBP)')
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new AppError(400, 'Imagem muito grande (máximo 5MB)')
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'vixa/avatars',
          public_id: userId, // sempre o mesmo public_id -> sobrescreve o avatar antigo, sem acumular lixo
          overwrite: true,
          transformation: [{ width: 256, height: 256, crop: 'fill', gravity: 'face' }],
        },
        (error, result) => {
          if (error || !result) return reject(error)
          resolve(result.secure_url)
        }
      )
      stream.end(buffer)
    })
  },
}