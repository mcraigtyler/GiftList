import jwt from 'jsonwebtoken'

export interface JwtPayload {
  sub: string
  email: string
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me'
const EXPIRES_IN = '7d'

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN })
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}
