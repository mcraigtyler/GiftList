import { GiftListRepository } from '../../repositories/GiftList.repository'
import { FriendshipRepository } from '../../repositories/Friendship.repository'
import { ListInviteRepository } from '../../repositories/ListInvite.repository'
import { ListVisibility } from '../../entities/GiftList.entity'
import type { GiftList } from '../../entities/GiftList.entity'
import type { GiftItem } from '../../entities/GiftItem.entity'
import { CreateListDto, UpdateListDto, ListResponse, ListDetailResponse } from './list.resource'

function toItemResponse(item: GiftItem) {
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

function toListResponse(list: GiftList): ListResponse {
  return {
    id: list.id,
    name: list.name,
    description: list.description ?? null,
    visibility: list.visibility,
    itemCount: list.items?.length ?? 0,
    createdAt: list.createdAt.toISOString(),
  }
}

async function assertCanViewList(listId: string, userId: string): Promise<GiftList> {
  const list = await GiftListRepository.findWithItems(listId)
  if (!list) {
    throw Object.assign(new Error('List not found'), { status: 404 })
  }

  if (list.ownerId === userId) return list

  if (list.visibility === ListVisibility.FRIENDS) {
    const friendships = await FriendshipRepository.findAccepted(userId)
    const friendIds = friendships.map((f) =>
      f.requesterId === userId ? f.addresseeId : f.requesterId,
    )
    if (friendIds.includes(list.ownerId)) return list
  }

  const acceptedInvites = await ListInviteRepository.findAcceptedForUser(userId)
  if (acceptedInvites.some((i) => i.listId === listId)) return list

  throw Object.assign(new Error('Forbidden'), { status: 403 })
}

export const ListService = {
  async getAll(userId: string): Promise<ListResponse[]> {
    const lists = await GiftListRepository.findByOwner(userId)
    return lists.map(toListResponse)
  },

  async create(dto: CreateListDto, userId: string): Promise<ListResponse> {
    const list = GiftListRepository.create({
      name: dto.name.trim(),
      description: dto.description?.trim() || undefined,
      visibility: (dto.visibility as ListVisibility) ?? ListVisibility.PRIVATE,
      ownerId: userId,
    })
    list.items = []
    await GiftListRepository.save(list)
    return toListResponse(list)
  },

  async getById(id: string, userId: string): Promise<ListDetailResponse> {
    const list = await assertCanViewList(id, userId)
    return {
      ...toListResponse(list),
      owner: {
        id: list.owner.id,
        displayName: list.owner.displayName,
        avatarUrl: list.owner.avatarUrl ?? null,
      },
      items: (list.items ?? []).map(toItemResponse),
    }
  },

  async update(id: string, dto: UpdateListDto, userId: string): Promise<ListResponse> {
    const list = await GiftListRepository.findOne({
      where: { id },
      relations: { items: true },
    })
    if (!list) throw Object.assign(new Error('List not found'), { status: 404 })
    if (list.ownerId !== userId) throw Object.assign(new Error('Forbidden'), { status: 403 })

    if (dto.name !== undefined) list.name = dto.name.trim()
    if (dto.description !== undefined) list.description = dto.description?.trim() ?? null
    if (dto.visibility !== undefined) list.visibility = dto.visibility as ListVisibility
    await GiftListRepository.save(list)
    return toListResponse(list)
  },

  async remove(id: string, userId: string): Promise<void> {
    const list = await GiftListRepository.findOne({ where: { id } })
    if (!list) throw Object.assign(new Error('List not found'), { status: 404 })
    if (list.ownerId !== userId) throw Object.assign(new Error('Forbidden'), { status: 403 })
    await GiftListRepository.remove(list)
  },

  canViewList: assertCanViewList,
}
