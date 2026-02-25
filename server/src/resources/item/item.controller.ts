import { Route, Post, Put, Delete, Body, Path, Controller, Security, Request } from 'tsoa'
import { Request as ExpressRequest } from 'express'
import { CreateItemDto, UpdateItemDto, OgScrapeDto, OgScrapeResult, ItemResponse } from './item.resource'

@Route('api/lists')
export class ItemListController extends Controller {
  /** Add an item to a list (triggers OG scrape) */
  @Post('{listId}/items')
  @Security('jwt')
  async create(
    @Path() listId: string,
    @Body() _body: CreateItemDto,
    @Request() _req: ExpressRequest,
  ): Promise<ItemResponse> {
    void listId
    throw new Error('Not implemented — see Phase 3')
  }
}

@Route('api/items')
export class ItemController extends Controller {
  /** Update an item */
  @Put('{id}')
  @Security('jwt')
  async update(
    @Path() id: string,
    @Body() _body: UpdateItemDto,
    @Request() _req: ExpressRequest,
  ): Promise<ItemResponse> {
    void id
    throw new Error('Not implemented — see Phase 3')
  }

  /** Delete an item */
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

@Route('api/og-scrape')
export class OgScrapeController extends Controller {
  /** Scrape Open Graph metadata from a URL */
  @Post()
  @Security('jwt')
  async scrape(
    @Body() _body: OgScrapeDto,
    @Request() _req: ExpressRequest,
  ): Promise<OgScrapeResult> {
    throw new Error('Not implemented — see Phase 3')
  }
}
