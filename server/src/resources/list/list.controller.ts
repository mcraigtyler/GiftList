import { Route, Get, Post, Put, Delete, Body, Path, Controller, Security, Request } from 'tsoa'
import { Request as ExpressRequest } from 'express'
import { CreateListDto, UpdateListDto, ListResponse, ListDetailResponse } from './list.resource'
import { ListService } from './list.service'

type AuthRequest = ExpressRequest & { user: { sub: string } }

@Route('api/lists')
export class ListController extends Controller {
  /** Get all my lists */
  @Get()
  @Security('jwt')
  async getAll(@Request() req: ExpressRequest): Promise<ListResponse[]> {
    const { sub } = (req as AuthRequest).user
    return ListService.getAll(sub)
  }

  /** Create a new list */
  @Post()
  @Security('jwt')
  async create(
    @Body() body: CreateListDto,
    @Request() req: ExpressRequest,
  ): Promise<ListResponse> {
    const { sub } = (req as AuthRequest).user
    this.setStatus(201)
    return ListService.create(body, sub)
  }

  /** Get a single list with its items */
  @Get('{id}')
  @Security('jwt')
  async getById(
    @Path() id: string,
    @Request() req: ExpressRequest,
  ): Promise<ListDetailResponse> {
    const { sub } = (req as AuthRequest).user
    return ListService.getById(id, sub)
  }

  /** Update list metadata */
  @Put('{id}')
  @Security('jwt')
  async update(
    @Path() id: string,
    @Body() body: UpdateListDto,
    @Request() req: ExpressRequest,
  ): Promise<ListResponse> {
    const { sub } = (req as AuthRequest).user
    return ListService.update(id, body, sub)
  }

  /** Delete a list */
  @Delete('{id}')
  @Security('jwt')
  async remove(
    @Path() id: string,
    @Request() req: ExpressRequest,
  ): Promise<void> {
    const { sub } = (req as AuthRequest).user
    this.setStatus(204)
    return ListService.remove(id, sub)
  }
}
