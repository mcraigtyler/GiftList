import { AppDataSource } from '../lib/dataSource'
import { GiftItem } from '../entities/GiftItem.entity'

export const GiftItemRepository = AppDataSource.getRepository(GiftItem).extend({
  findByList(listId: string) {
    return this.find({
      where: { listId },
      relations: { claim: { claimedBy: true } },
      order: { createdAt: 'ASC' },
    })
  },

  findById(id: string) {
    return this.findOne({
      where: { id },
      relations: { claim: { claimedBy: true }, list: true },
    })
  },
})
