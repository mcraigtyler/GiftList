import ogs from 'open-graph-scraper'
import { GiftItemRepository } from '../../repositories/GiftItem.repository'
import { GiftListRepository } from '../../repositories/GiftList.repository'
import type { GiftItem } from '../../entities/GiftItem.entity'
import { CreateItemDto, UpdateItemDto, OgScrapeResult, ItemResponse } from './item.resource'

function toItemResponse(item: GiftItem): ItemResponse {
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    description: item.description,
    price: item.price,
    imageUrl: item.imageUrl,
    priority: item.priority as 1 | 2 | 3,
    note: item.note,
    claim: item.claim
      ? { claimedByName: item.claim.claimedBy?.displayName ?? 'Someone' }
      : null,
    createdAt: item.createdAt.toISOString(),
  }
}

export const ItemService = {
  async create(listId: string, dto: CreateItemDto, userId: string): Promise<ItemResponse> {
    const list = await GiftListRepository.findOne({ where: { id: listId } })
    if (!list) throw Object.assign(new Error('List not found'), { status: 404 })
    if (list.ownerId !== userId) throw Object.assign(new Error('Forbidden'), { status: 403 })

    let title = dto.title ?? ''
    let description: string | null = dto.description ?? null
    let imageUrl: string | null = dto.imageUrl ?? null
    let price: string | null = dto.price ?? null

    if (!title) {
      try {
        const scraped = await ItemService.scrapeOg(dto.url)
        title = scraped.title ?? ''
        if (description === null) description = scraped.description
        if (imageUrl === null) imageUrl = scraped.imageUrl
        if (price === null) price = scraped.price
      } catch {
        // scrape failure is non-fatal
      }
    }

    if (!title) title = dto.url

    const item = GiftItemRepository.create({
      listId,
      url: dto.url,
      title,
      description,
      imageUrl,
      price,
      priority: dto.priority ?? 1,
      note: dto.note ?? null,
    })
    await GiftItemRepository.save(item)
    const saved = await GiftItemRepository.findById(item.id)
    return toItemResponse(saved!)
  },

  async update(id: string, dto: UpdateItemDto, userId: string): Promise<ItemResponse> {
    const item = await GiftItemRepository.findById(id)
    if (!item) throw Object.assign(new Error('Item not found'), { status: 404 })
    if (item.list.ownerId !== userId) throw Object.assign(new Error('Forbidden'), { status: 403 })

    if (dto.title !== undefined) item.title = dto.title
    if (dto.description !== undefined) item.description = dto.description ?? null
    if (dto.price !== undefined) item.price = dto.price ?? null
    if (dto.imageUrl !== undefined) item.imageUrl = dto.imageUrl ?? null
    if (dto.priority !== undefined) item.priority = dto.priority
    if (dto.note !== undefined) item.note = dto.note ?? null

    await GiftItemRepository.save(item)
    const saved = await GiftItemRepository.findById(item.id)
    return toItemResponse(saved!)
  },

  async remove(id: string, userId: string): Promise<void> {
    const item = await GiftItemRepository.findById(id)
    if (!item) throw Object.assign(new Error('Item not found'), { status: 404 })
    if (item.list.ownerId !== userId) throw Object.assign(new Error('Forbidden'), { status: 403 })
    await GiftItemRepository.remove(item)
  },

  async scrapeOg(url: string): Promise<OgScrapeResult> {
    try {
      const { result } = await ogs({ url })
      const images = result.ogImage
      let imageUrl: string | null = null
      if (Array.isArray(images) && images.length > 0) {
        imageUrl = images[0].url ?? null
      } else if (images && !Array.isArray(images)) {
        imageUrl = (images as { url?: string }).url ?? null
      }
      return {
        title: result.ogTitle ?? null,
        description: result.ogDescription ?? null,
        imageUrl,
        price: null,
      }
    } catch {
      return { title: null, description: null, imageUrl: null, price: null }
    }
  },
}
