import { Route, Post, Put, Delete, Body, Path, Controller, Security, Request } from 'tsoa'
import { Request as ExpressRequest } from 'express'
import { CreateItemDto, UpdateItemDto, OgScrapeDto, OgScrapeResult, ItemResponse } from './item.resource'
import { ItemService } from './item.service'

type AuthRequest = ExpressRequest & { user: { sub: string } }

@Route('api/lists')
export class ItemListController extends Controller {
  /** Add an item to a list (triggers OG scrape if title omitted) */
  @Post('{listId}/items')
  @Security('jwt')
  async create(
    @Path() listId: string,
    @Body() body: CreateItemDto,
    @Request() req: ExpressRequest,
  ): Promise<ItemResponse> {
    const { sub } = (req as AuthRequest).user
    this.setStatus(201)
    return ItemService.create(listId, body, sub)
  }
}

@Route('api/items')
export class ItemController extends Controller {
  /** Update an item */
  @Put('{id}')
  @Security('jwt')
  async update(
    @Path() id: string,
    @Body() body: UpdateItemDto,
    @Request() req: ExpressRequest,
  ): Promise<ItemResponse> {
    const { sub } = (req as AuthRequest).user
    return ItemService.update(id, body, sub)
  }

  /** Delete an item */
  @Delete('{id}')
  @Security('jwt')
  async remove(
    @Path() id: string,
    @Request() req: ExpressRequest,
  ): Promise<void> {
    const { sub } = (req as AuthRequest).user
    this.setStatus(204)
    return ItemService.remove(id, sub)
  }
}

@Route('api/og-scrape')
export class OgScrapeController extends Controller {
  /** Scrape Open Graph metadata from a URL */
  @Post()
  @Security('jwt')
  async scrape(
    @Body() body: OgScrapeDto,
    @Request() _req: ExpressRequest,
  ): Promise<OgScrapeResult> {
    return ItemService.scrapeOg(body.url)
  }
}
