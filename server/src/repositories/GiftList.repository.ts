import { AppDataSource } from '../lib/dataSource'
import { GiftList, ListVisibility } from '../entities/GiftList.entity'

export const GiftListRepository = AppDataSource.getRepository(GiftList).extend({
  findByOwner(ownerId: string) {
    return this.find({
      where: { ownerId },
      relations: { items: true },
      order: { createdAt: 'DESC' },
    })
  },

  findWithItems(id: string) {
    return this.findOne({
      where: { id },
      relations: {
        owner: true,
        items: { claim: { claimedBy: true } },
      },
    })
  },

  findVisibleToUser(userId: string, friendIds: string[]) {
    const qb = this.createQueryBuilder('list')
      .leftJoinAndSelect('list.owner', 'owner')
      .where('list.ownerId = :userId', { userId })

    if (friendIds.length > 0) {
      qb.orWhere(
        'list.visibility = :friends AND list.ownerId IN (:...friendIds)',
        { friends: ListVisibility.FRIENDS, friendIds },
      )
    }

    return qb.orderBy('list.createdAt', 'DESC').getMany()
  },
})
