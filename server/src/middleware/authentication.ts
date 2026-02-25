import { Request } from 'express'
import { verifyJwt } from '../lib/jwt'

export async function expressAuthentication(
  request: Request,
  securityName: string,
): Promise<{ sub: string; email: string }> {
  if (securityName !== 'jwt') {
    throw Object.assign(new Error('Unknown security scheme'), { status: 401 })
  }

  const token: string | undefined = request.cookies?.token
  if (!token) {
    throw Object.assign(new Error('Not authenticated'), { status: 401 })
  }

  try {
    return verifyJwt(token)
  } catch {
    throw Object.assign(new Error('Invalid or expired token'), { status: 401 })
  }
}
