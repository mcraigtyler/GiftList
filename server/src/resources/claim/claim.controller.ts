import { Route, Get, Post, Delete, Path, Controller, Security, Request } from 'tsoa'
import { Request as ExpressRequest } from 'express'
import { ClaimResponse } from './claim.resource'

@Route('api/items')
export class ItemClaimController extends Controller {
  /** Claim a gift item */
  @Post('{id}/claim')
  @Security('jwt')
  async claim(
    @Path() id: string,
    @Request() _req: ExpressRequest,
  ): Promise<ClaimResponse> {
    void id
    throw new Error('Not implemented — see Phase 5')
  }

  /** Unclaim a gift item */
  @Delete('{id}/claim')
  @Security('jwt')
  async unclaim(
    @Path() id: string,
    @Request() _req: ExpressRequest,
  ): Promise<void> {
    void id
    throw new Error('Not implemented — see Phase 5')
  }
}

@Route('api/claims')
export class ClaimController extends Controller {
  /** Get all gifts I have claimed */
  @Get()
  @Security('jwt')
  async getMyClaims(@Request() _req: ExpressRequest): Promise<ClaimResponse[]> {
    throw new Error('Not implemented — see Phase 5')
  }
}
