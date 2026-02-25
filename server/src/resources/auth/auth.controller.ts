import { Route, Post, Get, Body, Controller, Security, Request } from 'tsoa'
import { Request as ExpressRequest } from 'express'
import { RegisterDto, LoginDto, AuthResponse } from './auth.resource'

@Route('api/auth')
export class AuthController extends Controller {
  /** Register a new user */
  @Post('register')
  async register(@Body() _body: RegisterDto): Promise<AuthResponse> {
    throw new Error('Not implemented — see Phase 2')
  }

  /** Login and receive an httpOnly JWT cookie */
  @Post('login')
  async login(@Body() _body: LoginDto): Promise<AuthResponse> {
    throw new Error('Not implemented — see Phase 2')
  }

  /** Logout — clears JWT cookie */
  @Post('logout')
  @Security('jwt')
  async logout(@Request() _req: ExpressRequest): Promise<void> {
    throw new Error('Not implemented — see Phase 2')
  }

  /** Return current authenticated user */
  @Get('me')
  @Security('jwt')
  async me(@Request() _req: ExpressRequest): Promise<AuthResponse> {
    throw new Error('Not implemented — see Phase 2')
  }
}
