import { Route, Get, Post, Put, Delete, Body, Path, Controller, Security, Request } from 'tsoa'
import { Request as ExpressRequest } from 'express'
import { CreateListDto, UpdateListDto, ListResponse, ListDetailResponse } from './list.resource'

@Route('api/lists')
export class ListController extends Controller {
  /** Get all my lists */
  @Get()
  @Security('jwt')
  async getAll(@Request() _req: ExpressRequest): Promise<ListResponse[]> {
    throw new Error('Not implemented — see Phase 3')
  }

  /** Create a new list */
  @Post()
  @Security('jwt')
  async create(
    @Body() _body: CreateListDto,
    @Request() _req: ExpressRequest,
  ): Promise<ListResponse> {
    throw new Error('Not implemented — see Phase 3')
  }

  /** Get a single list with its items */
  @Get('{id}')
  @Security('jwt')
  async getById(
    @Path() id: string,
    @Request() _req: ExpressRequest,
  ): Promise<ListDetailResponse> {
    void id
    throw new Error('Not implemented — see Phase 3')
  }

  /** Update list metadata */
  @Put('{id}')
  @Security('jwt')
  async update(
    @Path() id: string,
    @Body() _body: UpdateListDto,
    @Request() _req: ExpressRequest,
  ): Promise<ListResponse> {
    void id
    throw new Error('Not implemented — see Phase 3')
  }

  /** Delete a list */
  @Delete('{id}')
  @Security('jwt')
  async remove(
    @Path() id: string,
    @Request() _req: ExpressRequest,
  ): Promise<void> {
    void id
    throw new Error('Not implemented — see Phase 3')
  }
}
