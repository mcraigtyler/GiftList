import { Route, Post, Get, Body, Controller, Security, Request } from 'tsoa'
import { Request as ExpressRequest } from 'express'
import { RegisterDto, LoginDto, AuthResponse } from './auth.resource'
import { AuthService } from './auth.service'

@Route('api/auth')
export class AuthController extends Controller {
  /** Register a new user */
  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Request() req: ExpressRequest,
  ): Promise<AuthResponse> {
    return AuthService.register(body, req.res!)
  }

  /** Login and receive an httpOnly JWT cookie */
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Request() req: ExpressRequest,
  ): Promise<AuthResponse> {
    return AuthService.login(body, req.res!)
  }

  /** Logout — clears JWT cookie */
  @Post('logout')
  @Security('jwt')
  async logout(@Request() req: ExpressRequest): Promise<void> {
    return AuthService.logout(req.res!)
  }

  /** Return current authenticated user */
  @Get('me')
  @Security('jwt')
  async me(@Request() req: ExpressRequest): Promise<AuthResponse> {
    const { sub } = (req as ExpressRequest & { user: { sub: string } }).user
    return AuthService.me(sub)
  }
}
