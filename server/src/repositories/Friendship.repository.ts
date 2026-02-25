import { AppDataSource } from '../lib/dataSource'
import { Friendship, FriendshipStatus } from '../entities/Friendship.entity'

export const FriendshipRepository = AppDataSource.getRepository(Friendship).extend({
  findAccepted(userId: string) {
    return this.createQueryBuilder('f')
      .leftJoinAndSelect('f.requester', 'requester')
      .leftJoinAndSelect('f.addressee', 'addressee')
      .where('(f.requesterId = :userId OR f.addresseeId = :userId) AND f.status = :status', {
        userId,
        status: FriendshipStatus.ACCEPTED,
      })
      .getMany()
  },

  findPendingForUser(userId: string) {
    return this.find({
      where: { addresseeId: userId, status: FriendshipStatus.PENDING },
      relations: { requester: true },
    })
  },

  findBetween(userAId: string, userBId: string) {
    return this.createQueryBuilder('f')
      .where(
        '(f.requesterId = :a AND f.addresseeId = :b) OR (f.requesterId = :b AND f.addresseeId = :a)',
        { a: userAId, b: userBId },
      )
      .getOne()
  },
})
