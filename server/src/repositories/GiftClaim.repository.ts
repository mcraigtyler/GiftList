import { AppDataSource } from '../lib/dataSource'
import { GiftClaim } from '../entities/GiftClaim.entity'

export const GiftClaimRepository = AppDataSource.getRepository(GiftClaim).extend({
  findByItem(itemId: string) {
    return this.findOne({ where: { itemId }, relations: { claimedBy: true } })
  },

  findByUser(userId: string) {
    return this.find({
      where: { userId },
      relations: { item: { list: { owner: true } } },
      order: { createdAt: 'DESC' },
    })
  },

  removeByItem(itemId: string) {
    return this.delete({ itemId })
  },
})
