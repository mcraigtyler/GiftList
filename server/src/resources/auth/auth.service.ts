import { Response } from 'express'
import { User } from '../../entities/User.entity'
import { UserRepository } from '../../repositories/User.repository'
import { hashPassword, verifyPassword } from '../../lib/password'
import { signJwt } from '../../lib/jwt'
import { RegisterDto, LoginDto, AuthResponse } from './auth.resource'

export const AuthService = {
  async register(dto: RegisterDto, res: Response): Promise<AuthResponse> {
    const email = dto.email.toLowerCase().trim()
    const displayName = dto.displayName.trim()

    const existing = await UserRepository.findByEmail(email)
    if (existing) {
      throw Object.assign(new Error('Email already in use'), { status: 409 })
    }

    const user = UserRepository.create({
      email,
      passwordHash: await hashPassword(dto.password),
      displayName,
    })
    await UserRepository.save(user)

    setTokenCookie(res, signJwt({ sub: user.id, email: user.email }))
    return toAuthResponse(user)
  },

  async login(dto: LoginDto, res: Response): Promise<AuthResponse> {
    const email = dto.email.toLowerCase().trim()

    const user = await UserRepository.findByEmail(email)
    if (!user) {
      throw Object.assign(new Error('Invalid email or password'), { status: 401 })
    }

    const valid = await verifyPassword(dto.password, user.passwordHash)
    if (!valid) {
      throw Object.assign(new Error('Invalid email or password'), { status: 401 })
    }

    setTokenCookie(res, signJwt({ sub: user.id, email: user.email }))
    return toAuthResponse(user)
  },

  async logout(res: Response): Promise<void> {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' })
  },

  async me(userId: string): Promise<AuthResponse> {
    const user = await UserRepository.findById(userId)
    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 404 })
    }
    return toAuthResponse(user)
  },
}

function setTokenCookie(res: Response, token: string): void {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

function toAuthResponse(user: User): AuthResponse {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl ?? null,
  }
}
