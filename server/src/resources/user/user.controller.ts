import { Route, Get, Query, Controller, Security, Request } from 'tsoa'
import { Request as ExpressRequest } from 'express'
import { UserResponse } from './user.resource'

@Route('api/users')
export class UserController extends Controller {
  /** Search users by email or display name */
  @Get('search')
  @Security('jwt')
  async search(
    @Query() q: string,
    @Request() _req: ExpressRequest,
  ): Promise<UserResponse[]> {
    void q
    throw new Error('Not implemented — see Phase 4')
  }
}
