import { AppDataSource } from '../lib/dataSource'
import { ListInvite, InviteStatus } from '../entities/ListInvite.entity'

export const ListInviteRepository = AppDataSource.getRepository(ListInvite).extend({
  findByList(listId: string) {
    return this.find({ where: { listId } })
  },

  findPendingForUser(inviteeId: string) {
    return this.find({
      where: { inviteeId, status: InviteStatus.PENDING },
      relations: { list: { owner: true } },
    })
  },

  findByIdAndList(id: string, listId: string) {
    return this.findOne({ where: { id, listId } })
  },

  findAcceptedForUser(inviteeId: string) {
    return this.find({ where: { inviteeId, status: InviteStatus.ACCEPTED } })
  },
})
