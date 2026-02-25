import { Route, Get, Post, Put, Delete, Body, Path, Controller, Security, Request } from 'tsoa'
import { Request as ExpressRequest } from 'express'
import { CreateInviteDto, InviteResponse } from './invite.resource'

@Route('api/lists')
export class ListInviteController extends Controller {
  /** Invite a user to a private list */
  @Post('{listId}/invites')
  @Security('jwt')
  async invite(
    @Path() listId: string,
    @Body() _body: CreateInviteDto,
    @Request() _req: ExpressRequest,
  ): Promise<InviteResponse> {
    void listId
    throw new Error('Not implemented — see Phase 4')
  }

  /** Revoke a list invite */
  @Delete('{listId}/invites/{inviteId}')
  @Security('jwt')
  async revoke(
    @Path() listId: string,
    @Path() inviteId: string,
    @Request() _req: ExpressRequest,
  ): Promise<void> {
    void listId
    void inviteId
    throw new Error('Not implemented — see Phase 4')
  }
}

@Route('api/invites')
export class InviteController extends Controller {
  /** Get my pending list invites */
  @Get()
  @Security('jwt')
  async getAll(@Request() _req: ExpressRequest): Promise<InviteResponse[]> {
    throw new Error('Not implemented — see Phase 4')
  }

  /** Accept a list invite */
  @Put('{id}/accept')
  @Security('jwt')
  async accept(
    @Path() id: string,
    @Request() _req: ExpressRequest,
  ): Promise<InviteResponse> {
    void id
    throw new Error('Not implemented — see Phase 4')
  }
}
