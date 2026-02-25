import { Route, Get, Post, Put, Delete, Body, Path, Controller, Security, Request } from 'tsoa'
import { Request as ExpressRequest } from 'express'
import { FriendRequestDto, FriendResponse, FriendsListsResponse } from './friend.resource'

@Route('api/friends')
export class FriendController extends Controller {
  /** List accepted friends */
  @Get()
  @Security('jwt')
  async getAll(@Request() _req: ExpressRequest): Promise<FriendResponse[]> {
    throw new Error('Not implemented — see Phase 4')
  }

  /** Incoming pending friend requests */
  @Get('requests')
  @Security('jwt')
  async getRequests(@Request() _req: ExpressRequest): Promise<FriendResponse[]> {
    throw new Error('Not implemented — see Phase 4')
  }

  /** Send a friend request */
  @Post('request')
  @Security('jwt')
  async sendRequest(
    @Body() _body: FriendRequestDto,
    @Request() _req: ExpressRequest,
  ): Promise<FriendResponse> {
    throw new Error('Not implemented — see Phase 4')
  }

  /** Accept a friend request */
  @Put('{id}/accept')
  @Security('jwt')
  async accept(
    @Path() id: string,
    @Request() _req: ExpressRequest,
  ): Promise<FriendResponse> {
    void id
    throw new Error('Not implemented — see Phase 4')
  }

  /** Remove friend or decline request */
  @Delete('{id}')
  @Security('jwt')
  async remove(
    @Path() id: string,
    @Request() _req: ExpressRequest,
  ): Promise<void> {
    void id
    throw new Error('Not implemented — see Phase 4')
  }

  /** All lists visible to me from friends */
  @Get('lists')
  @Security('jwt')
  async getFriendsLists(@Request() _req: ExpressRequest): Promise<FriendsListsResponse[]> {
    throw new Error('Not implemented — see Phase 4')
  }
}
